"use client";
import React, { useEffect, useState } from "react";
import { getContactMessages, ContactMessage } from "@/services/contentService";

export default function ContactMessagesCrud() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchMessages();
  }, []);
  async function fetchMessages() {
    setLoading(true);
    try { setMessages(await getContactMessages()); } catch { setError("Failed to load."); } finally { setLoading(false); }
  }
  return (
    <div className="bg-white p-8 rounded-xl shadow max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Contact Messages</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Name</th>
              <th className="py-2">Email</th>
              <th className="py-2">Message</th>
              <th className="py-2">Received</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((m) => (
              <tr key={m.id} className="border-b last:border-0">
                <td className="py-2 pr-2 font-medium">{m.name}</td>
                <td className="py-2 pr-2">{m.email}</td>
                <td className="py-2 pr-2">{m.message}</td>
                <td className="py-2 pr-2">{new Date(m.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {messages.length === 0 && <div className="text-gray-500">No messages.</div>}
      </div>
    </div>
  );
}
