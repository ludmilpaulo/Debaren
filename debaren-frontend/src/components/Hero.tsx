"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useGetHeroQuery } from "@/services/debarenApi"; // <-- We'll build this API

export default function Hero() {
  // Optional: If you have the hero text in your backend (see below)
  const { data, isLoading } = useGetHeroQuery();

  return (
    <section className="relative isolate overflow-hidden rounded-xl shadow-2xl bg-gradient-to-br from-cyan-100 via-yellow-50 to-white px-4 py-24 md:py-32 text-center mb-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.7, type: "spring" }}
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-yellow-500 via-cyan-700 to-slate-800 drop-shadow-md mb-4">
          {isLoading
            ? "Loading..."
            : data?.title || "Discover Beautiful Venues Across South Africa"}
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="text-lg md:text-xl text-slate-700 max-w-2xl mx-auto mb-8"
        >
          {isLoading
            ? "Loading..."
            : data?.subtitle ||
              "From schools to popup spaces and connected WiFi zones — debaren helps you find the perfect place."}
        </motion.p>
        <Link
          href="/venues"
          className="inline-block px-8 py-3 text-base font-bold text-white bg-yellow-500 rounded-full shadow-lg hover:bg-yellow-600 hover:scale-105 transition transform duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
        >
          Explore Venues
        </Link>
      </motion.div>
      {/* Decorative background swirl */}
      <motion.div
        className="absolute top-1/2 left-1/2 -z-10 w-[80vw] h-[80vw] max-w-3xl max-h-3xl rounded-full bg-yellow-100 opacity-30 blur-3xl"
        initial={{ scale: 0.7, opacity: 0.1 }}
        animate={{ scale: 1, opacity: 0.5 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        aria-hidden
      />
    </section>
  );
}
