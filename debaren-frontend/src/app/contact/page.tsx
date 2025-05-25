"use client";

import { useState } from "react";
import {
  HiOutlineEnvelope,
  HiOutlineUser,
  HiOutlinePencil,
  HiOutlinePhone,
  HiOutlineMap,
} from "react-icons/hi2";
import { FaWhatsapp } from "react-icons/fa";
import dynamic from "next/dynamic";
import { baseAPI } from "@/utils/variables";

// Dynamically import the map for SSR safety
const Map = dynamic(() => import("@/components/MapEmbed"), { ssr: false });

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSent(false);
    try {
      const res = await fetch(`${baseAPI}/api/contact/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        throw new Error("Submission failed.");
      }
      setSent(true);
      setForm({ name: "", email: "", message: "" });
    } catch {
      setError("Could not send your message. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-12 bg-gradient-to-br from-yellow-50 via-white to-cyan-50">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-yellow-100">
        <h1 className="text-4xl font-extrabold text-center mb-4 bg-gradient-to-tr from-yellow-500 via-cyan-700 to-slate-800 text-transparent bg-clip-text drop-shadow-md">
          Contact Us
        </h1>
        <p className="text-slate-700 mb-8 text-center text-lg">
          We’d love to hear from you. For urgent inquiries, WhatsApp or call us!
        </p>

        <form className="grid gap-5" onSubmit={handleSubmit}>
          <div className="relative">
            <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500 text-xl" />
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-yellow-100 pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-cyan-200 outline-none transition"
            />
          </div>
          <div className="relative">
            <HiOutlineEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 text-xl" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-yellow-100 pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none transition"
            />
          </div>
          <div className="relative">
            <HiOutlinePencil className="absolute left-3 top-5 text-yellow-500 text-xl" />
            <textarea
              name="message"
              placeholder="Your Message"
              rows={5}
              value={form.message}
              onChange={handleChange}
              required
              className="w-full border border-yellow-100 pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-yellow-200 outline-none transition resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading || sent}
            className="w-full bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white font-bold py-3 rounded-xl shadow-md transition focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2"
          >
            {loading ? "Sending..." : sent ? "Message Sent!" : "Send Message"}
          </button>
        </form>

        {/* Feedback messages */}
        {sent && (
          <div className="mt-6 text-center text-green-600 font-semibold animate-bounce">
            Thank you! We’ll get back to you soon.
          </div>
        )}
        {error && (
          <div className="mt-6 text-center text-red-500 font-semibold">
            {error}
          </div>
        )}

        {/* Contact links */}
        <div className="mt-10 flex flex-col md:flex-row gap-5 justify-center items-center">
          <a
            href="https://wa.me/27700000000"
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white font-bold rounded-xl shadow hover:bg-green-600 transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp className="text-2xl" style={{ color: "#25D366" }} /> WhatsApp
          </a>
          <a
            href="tel:+27000000000"
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white font-bold rounded-xl shadow hover:bg-yellow-600 transition"
          >
            <HiOutlinePhone className="text-2xl" style={{ color: "#FFD600" }} /> Call Us
          </a>
        </div>

        {/* Map */}
        <div className="mt-10">
          <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
            <HiOutlineMap className="text-cyan-600" /> Our Location
          </h2>
          <div className="w-full h-64 rounded-xl overflow-hidden border border-yellow-100 shadow">
            <Map />
          </div>
        </div>
      </div>
    </div>
  );
}
