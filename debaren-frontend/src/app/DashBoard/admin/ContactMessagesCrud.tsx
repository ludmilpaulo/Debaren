"use client";
import React, { useEffect, useState } from "react";
import { Transition } from "@headlessui/react";
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
    setError("");
    try {
      setMessages(await getContactMessages());
    } catch {
      setError("Failed to load.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Contact Messages</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}

      <div className="relative min-h-[120px]"> {/* reserve space for loader */}
        {/* Loading Spinner Overlay */}
        <Transition
          show={loading}
          enter="transition-opacity duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10 rounded-xl">
            <div className="w-12 h-12 border-4 border-blue-200 border-dashed rounded-full animate-spin border-t-blue-500"></div>
          </div>
        </Transition>

        {/* Table */}
        <div className={loading ? "opacity-40 pointer-events-none" : ""}>
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
            {!loading && messages.length === 0 && (
              <div className="text-gray-500 mt-4">No messages.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
