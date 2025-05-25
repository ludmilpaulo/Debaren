"use client";

import Link from "next/link";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import {
  HiHome,
  HiBuildingOffice2,
  HiBolt,
  HiWifi,
  HiAcademicCap,
  HiInformationCircle,
  HiEnvelope,
} from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Home", href: "/", icon: HiHome },
  { label: "Venues", href: "/venues", icon: HiBuildingOffice2 },
  { label: "Popup Venues", href: "/popup-venues", icon: HiBolt },
  { label: "WiFi Spots", href: "/wifi-spots", icon: HiWifi },
  { label: "School", href: "/school", icon: HiAcademicCap },
  { label: "About", href: "/about", icon: HiInformationCircle },
  { label: "Contact", href: "/contact", icon: HiEnvelope },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-yellow-200 shadow-xl transition">
      <nav className="flex items-center justify-between px-4 md:px-10 py-3 max-w-7xl mx-auto">
        {/* Logo and Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 select-none focus:outline-none"
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-500 shadow-inner border border-yellow-100">
            <span className="text-2xl font-black text-white tracking-tighter">D</span>
          </span>
          <span className="font-extrabold text-2xl text-yellow-700 tracking-tight hover:scale-105 transition-transform duration-200">
            debaren
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-7 text-base font-medium">
          {navItems.map(({ label, href, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex flex-col items-center gap-1 px-3 py-1 text-slate-700 hover:text-yellow-700 transition group focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
              >
                <Icon size={24} className="mb-0.5 group-hover:scale-110 transition-transform duration-150" />
                <span className="text-xs mt-0.5 relative">
                  {label}
                  <span className="block h-0.5 w-0 group-hover:w-full bg-yellow-400 transition-all duration-300 absolute left-0 bottom-[-3px] rounded-full"></span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded text-yellow-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 hover:bg-yellow-100 transition"
          onClick={() => setMenuOpen(true)}
          aria-label="Open Menu"
        >
          <HiMenu size={32} />
        </button>
      </nav>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 36 }}
            className="fixed inset-y-0 left-0 w-72 max-w-full bg-white shadow-2xl z-50 border-r border-yellow-200 flex flex-col"
          >
            <div className="flex items-center justify-between px-7 py-5 border-b border-yellow-100">
              <span className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-400 via-yellow-300 to-yellow-500 shadow-inner">
                  <span className="text-xl font-bold text-white">D</span>
                </span>
                <span className="font-bold text-lg text-yellow-700">debaren</span>
              </span>
              <button
                className="text-yellow-700 hover:bg-yellow-100 p-2 rounded transition focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
                onClick={() => setMenuOpen(false)}
                aria-label="Close Menu"
              >
                <HiX size={28} />
              </button>
            </div>
            <nav className="flex-1 px-4 pt-7">
              <ul className="flex flex-col gap-7">
                {navItems.map(({ label, href, icon: Icon }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="flex flex-col items-center gap-1 px-3 py-3 rounded-lg text-base font-medium text-slate-700 hover:text-yellow-700 hover:bg-yellow-50 focus:bg-yellow-100 focus:text-yellow-800 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
                      onClick={() => setMenuOpen(false)}
                    >
                      <Icon size={26} className="mb-0.5" />
                      <span className="text-xs">{label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex-shrink-0 px-7 py-6 text-xs text-slate-400 border-t border-yellow-100">
              &copy; {new Date().getFullYear()} Debaren
            </div>
          </motion.aside>
        )}

        {/* Overlay */}
        {menuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </header>
  );
}
