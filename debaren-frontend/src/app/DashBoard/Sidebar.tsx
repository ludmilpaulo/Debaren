"use client";
import React from "react";
import {
  FiDatabase, FiMap, FiWifi, FiUsers, FiBook, FiInfo, FiMessageSquare, FiGlobe, FiHome
} from "react-icons/fi";

// The fixed interface
export interface SidebarProps {
  setActiveComponent: (component: string) => void;
  activeComponent: string;
}

const menuItems = [
  { id: "venues", label: "Content", icon: <FiMap /> },
  
];

const adminMenu = [
  { id: "bookings", label: "Bookings", icon: <FiDatabase /> },
  { id: "careers", label: "Careers", icon: <FiUsers /> },
  { id: "events", label: "Events", icon: <FiBook /> },
];

const Sidebar: React.FC<SidebarProps> = ({ setActiveComponent, activeComponent }) => {
  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col min-h-screen shadow-lg">
      <div className="text-2xl font-bold p-6 text-center bg-gray-800 border-b border-gray-700">
        Admin Panel
      </div>
      <div className="px-4 pt-6 pb-1 text-xs uppercase text-gray-400 tracking-wide">
        Manage Content
      </div>
      <nav className="flex-1 px-4 py-2 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveComponent(item.id)}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-md transition-all font-medium ${
              activeComponent === item.id
                ? "bg-gray-700 text-white shadow-inner"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="px-4 pt-8 pb-1 text-xs uppercase text-gray-400 tracking-wide">
        App Modules
      </div>
      <nav className="flex-1 px-4 py-2 space-y-1">
        {adminMenu.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveComponent(item.id)}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-md transition-all font-medium ${
              activeComponent === item.id
                ? "bg-gray-700 text-white shadow-inner"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
