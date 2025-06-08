"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Transition } from "@headlessui/react";
import Sidebar from "./Sidebar";

// Dynamically import main admin sections
const ContentManager = dynamic(() => import("./admin/ContentManager"), { ssr: false });
const Bookings = dynamic(() => import("./Bookings"), { ssr: false });
const Careers = dynamic(() => import("./Careers"), { ssr: false });
const Events = dynamic(() => import("./Events"), { ssr: false });

const AdminDashboard: React.FC = () => {
  // Default to "venues" or "contentManager" tab
  const [activeComponent, setActiveComponent] = useState("contentManager");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timeout);
  }, [activeComponent]);

  const renderComponent = () => {
    switch (activeComponent) {
      case "contentManager":
     
        // All these tabs are managed via ContentManager (with its own tabs)
        return <ContentManager initialTab={activeComponent} />;
      case "bookings":
        return <Bookings />;
      case "careers":
        return <Careers />;
      case "events":
        return <Events />;
      default:
        return null; // Do not try to render < />!
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar
        setActiveComponent={setActiveComponent}
        activeComponent={activeComponent}
      />
      <main className="flex-1 p-6 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-200">
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-lg transition-all">
          {renderComponent()}
        </div>
      </main>
      {/* Loader Overlay */}
      <Transition
        show={loading}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="w-16 h-16 border-t-4 border-b-4 border-white rounded-full animate-spin" />
        </div>
      </Transition>
    </div>
  );
};

export default AdminDashboard;
