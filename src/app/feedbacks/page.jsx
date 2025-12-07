"use client";
import { useState } from "react";

export default function FeedbackPage() {
  const [form, setForm] = useState({ name: "", email: "", feedback: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSubmitted(false);

    try {
      const res = await fetch("/api/feedbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success) throw new Error(data.error || "Failed to send");

      setSubmitted(true);
      setForm({ name: "", email: "", feedback: "" });
    } catch (err) {
      setError(err.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-5">
      <h1 className="text-3xl font-bold mb-6 text-purple-700">
        Send Us Feedback 💬
      </h1>

      {submitted && (
        <p className="mb-4 text-green-600 font-medium">
          Feedback sent successfully!
        </p>
      )}

      {error && (
        <p className="mb-4 text-red-600 font-medium">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          required
          placeholder="Your Name"
          className="w-full border rounded-lg p-3"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          required
          type="email"
          placeholder="Email Address"
          className="w-full border rounded-lg p-3"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <textarea
          required
          placeholder="Your Feedback"
          className="w-full border rounded-lg p-3 h-32"
          value={form.feedback}
          onChange={(e) => setForm({ ...form, feedback: e.target.value })}
        />

        <button
          disabled={loading}
          className="w-full px-8 py-3 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-700 transition shadow-lg"
        >
          {loading ? "Sending..." : "Send Feedback"}
        </button>
      </form>
    </div>
  );
}
