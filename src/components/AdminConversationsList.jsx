
// // ============================================
// // STEP 3: Create Admin Conversations List Component
// // src/components/AdminConversationsList.jsx
// // ============================================
// "use client";

// import { useState, useEffect } from "react";
// import { supabase } from "@/lib/supabaseClient";
// import ChatWidget from "./ChatWidget";

// export default function AdminConversationsList() {
//   const [conversations, setConversations] = useState([]);
//   const [selectedUserId, setSelectedUserId] = useState(null);
//   const [unreadCounts, setUnreadCounts] = useState({});

//   useEffect(() => {
//     loadConversations();

//     // Subscribe to new messages
//     const channel = supabase
//       .channel("all_messages")
//       .on(
//         "postgres_changes",
//         { event: "INSERT", schema: "public", table: "messages" },
//         () => {
//           loadConversations();
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, []);

//   const loadConversations = async () => {
//     // Get all unique user conversations with their latest message
//     const { data, error } = await supabase
//       .from("messages")
//       .select("*")
//       .order("created_at", { ascending: false });

//     if (!error && data) {
//       // Group messages by user_id
//       const userConversations = {};
//       data.forEach((msg) => {
//         if (!userConversations[msg.user_id]) {
//           userConversations[msg.user_id] = {
//             user_id: msg.user_id,
//             sender_name: msg.sender_name,
//             sender_email: msg.sender_email,
//             last_message: msg.message,
//             last_message_time: msg.created_at,
//             unread: 0,
//           };
//         }
        
//         // Count unread messages from users (not admin)
//         if (!msg.is_admin && !msg.read) {
//           userConversations[msg.user_id].unread++;
//         }
//       });

//       const conversationsList = Object.values(userConversations);
//       conversationsList.sort((a, b) => 
//         new Date(b.last_message_time) - new Date(a.last_message_time)
//       );

//       setConversations(conversationsList);

//       // Update unread counts
//       const counts = {};
//       conversationsList.forEach(conv => {
//         counts[conv.user_id] = conv.unread;
//       });
//       setUnreadCounts(counts);
//     }
//   };

//   return (
//     <div className="flex gap-4 h-screen p-4">
//       {/* Conversations List */}
//       <div className="w-80 bg-white rounded-lg shadow-lg overflow-hidden">
//         <div className="bg-gradient-to-r from-purple-600 to-orange-500 text-white p-4">
//           <h2 className="text-xl font-bold">Conversations</h2>
//           <p className="text-sm opacity-90">Manage customer chats</p>
//         </div>
        
//         <div className="overflow-y-auto h-[calc(100vh-120px)]">
//           {conversations.length === 0 ? (
//             <div className="p-4 text-center text-gray-400">
//               No conversations yet
//             </div>
//           ) : (
//             conversations.map((conv) => (
//               <button
//                 key={conv.user_id}
//                 onClick={() => setSelectedUserId(conv.user_id)}
//                 className={`w-full p-4 border-b border-gray-200 hover:bg-gray-50 transition text-left ${
//                   selectedUserId === conv.user_id ? "bg-purple-50" : ""
//                 }`}
//               >
//                 <div className="flex justify-between items-start mb-1">
//                   <span className="font-semibold text-gray-800">
//                     {conv.sender_name}
//                   </span>
//                   {conv.unread > 0 && (
//                     <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
//                       {conv.unread}
//                     </span>
//                   )}
//                 </div>
//                 {conv.sender_email && (
//                   <p className="text-xs text-gray-500 mb-1">{conv.sender_email}</p>
//                 )}
//                 <p className="text-sm text-gray-600 truncate">{conv.last_message}</p>
//                 <p className="text-xs text-gray-400 mt-1">
//                   {new Date(conv.last_message_time).toLocaleString()}
//                 </p>
//               </button>
//             ))
//           )}
//         </div>
//       </div>

//       {/* Chat Widget for selected conversation */}
//       {selectedUserId && (
//         <ChatWidget isAdmin={true} selectedUserId={selectedUserId} />
//       )}
//     </div>
//   );
// }

// // ============================================
// // STEP 4: Usage in your app
// // ============================================

// /*
// // For public pages (src/app/layout.js):
// import ChatWidget from "@/components/ChatWidget";

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body>
//         {children}
//         <ChatWidget />  // Client-side widget
//       </body>
//     </html>
//   );
// }

// // For Admin Dashboard (src/app/admin/dashboard/page.jsx):
// import AdminConversationsList from "@/components/AdminConversationsList";

// export default function AdminDashboard() {
//   return (
//     <AuthGuard>
//       <AdminConversationsList />
//     </AuthGuard>
//   );
// }
// */