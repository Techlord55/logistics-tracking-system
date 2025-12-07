// ============================================
// STEP 1: Database Setup (Run in Supabase SQL Editor)
// ============================================

/*
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_name TEXT NOT NULL,
  sender_email TEXT,
  message TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert messages (clients can send)
CREATE POLICY "Anyone can insert messages"
  ON messages FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read messages
CREATE POLICY "Anyone can read messages"
  ON messages FOR SELECT
  USING (true);

-- Only allow updates for marking as read (admin can mark as read)
CREATE POLICY "Anyone can update read status"
  ON messages FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Enable real-time
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
*/

// ============================================
// STEP 2: Create ChatWidget Component
// src/components/ChatWidget.jsx
// ============================================

"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ChatWidget({ isAdmin = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);

  // Load messages
  useEffect(() => {
    loadMessages();

    // Load saved name/email from localStorage for clients
    if (!isAdmin) {
      const savedName = localStorage.getItem('chat_sender_name');
      const savedEmail = localStorage.getItem('chat_sender_email');
      if (savedName) setSenderName(savedName);
      if (savedEmail) setSenderEmail(savedEmail);
    }

    // Subscribe to real-time updates
    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setMessages((prev) => [...prev, payload.new]);
            
            // Increment unread count if chat is closed and it's not from admin (or vice versa)
            if (!isOpen && ((isAdmin && !payload.new.is_admin) || (!isAdmin && payload.new.is_admin))) {
              setUnreadCount((prev) => prev + 1);
            }
          } else if (payload.eventType === "UPDATE") {
            setMessages((prev) =>
              prev.map((msg) => (msg.id === payload.new.id ? payload.new : msg))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isOpen, isAdmin]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Calculate unread messages
  useEffect(() => {
    if (isAdmin) {
      const unread = messages.filter((m) => !m.is_admin && !m.read).length;
      setUnreadCount(unread);
    }
  }, [messages, isAdmin]);

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: true });

    if (!error && data) {
      setMessages(data);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    // For non-admin (clients), require name on first message
    if (!isAdmin && !senderName.trim() && messages.filter(m => !m.is_admin).length === 0) {
      alert("Please enter your name");
      return;
    }

    const messageData = {
      message: newMessage.trim(),
      sender_name: isAdmin ? "Support Team" : senderName.trim(),
      sender_email: isAdmin ? null : senderEmail.trim() || null,
      is_admin: isAdmin,
      read: false,
    };

    const { error } = await supabase.from("messages").insert([messageData]);

    if (!error) {
      setNewMessage("");
      // Save the name locally for subsequent messages from clients
      if (!isAdmin && senderName.trim()) {
        localStorage.setItem('chat_sender_name', senderName.trim());
        if (senderEmail.trim()) {
          localStorage.setItem('chat_sender_email', senderEmail.trim());
        }
      }
    } else {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    }
  };

  const markAsRead = async (messageId) => {
    await supabase
      .from("messages")
      .update({ read: true })
      .eq("id", messageId);
  };

  const handleOpen = () => {
    setIsOpen(true);
    setUnreadCount(0);

    // Mark unread messages as read when admin opens
    if (isAdmin) {
      const unreadMessages = messages.filter((m) => !m.is_admin && !m.read);
      unreadMessages.forEach((msg) => markAsRead(msg.id));
    }
  };

  return (
    <>
      {/* Chat button */}
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-orange-500 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 z-50"
      >
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[32rem] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-orange-500 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">
                {isAdmin ? "Customer Messages" : "Chat with Support"}
              </h3>
              <p className="text-xs opacity-90">We're here to help!</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-2 transition"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 mt-8">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMyMessage = isAdmin ? msg.is_admin : !msg.is_admin;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-3 py-2 shadow-sm ${
                        isMyMessage
                          ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-br-none"
                          : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                      }`}
                    >
                      {!isMyMessage && (
                        <p className="text-xs font-semibold mb-1 text-purple-600">
                          {msg.sender_name}
                        </p>
                      )}
                      <p className="text-sm leading-relaxed break-words">{msg.message}</p>
                      <p
                        className={`text-xs mt-1 text-right ${
                          isMyMessage ? "text-purple-200" : "text-gray-400"
                        }`}
                      >
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input form */}
          <form
            onSubmit={sendMessage}
            className="p-4 border-t border-gray-200 bg-white rounded-b-2xl"
          >
            {/* Only show name/email inputs for clients on their first message */}
            {!isAdmin && messages.filter(m => !m.is_admin).length === 0 && !senderName && (
              <div className="space-y-2 mb-3">
                <input
                  type="text"
                  placeholder="Your Name *"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email (optional)"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-orange-500 text-white px-5 py-2 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

// ============================================
// STEP 3: Add to your layout file
// src/app/layout.js
// ============================================

/*
import ChatWidget from "@/components/ChatWidget";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ChatWidget />  {/* Add this for all public pages *//*}
      </body>
    </html>
  );
}
*/

// ============================================
// STEP 4: Add to Admin Dashboard
// src/app/admin/dashboard/page.jsx
// ============================================

/*
import ChatWidget from "@/components/ChatWidget";

export default function AdminDashboard() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 p-8">
        {/* Your existing admin dashboard code *//*}
        
        {/* Add admin chat widget *//*}
        <ChatWidget isAdmin={true} />
      </div>
    </AuthGuard>
  );
}
*/