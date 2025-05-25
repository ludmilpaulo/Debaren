"use client";
import React from "react";
import { Tab } from "@headlessui/react";
import {
  FiMap,
  FiGlobe,
  FiWifi,
  FiBook,
  FiInfo,
  FiUsers,
  FiHome,
  FiMessageSquare,
} from "react-icons/fi";
import VenuesCrud from "./VenuesCrud";
import PopupVenuesCrud from "./PopupVenuesCrud";
import WifiSpotsCrud from "./WifiSpotsCrud";
import SchoolProgramsCrud from "./SchoolProgramsCrud";
import AboutCrud from "./AboutCrud";
import SocialLinksCrud from "./SocialLinksCrud";
import HeroSectionCrud from "./HeroSectionCrud";
import ContactMessagesCrud from "./ContactMessagesCrud";

// Add each CRUD component for the section you want to manage

export interface ContentManagerProps {
  initialTab?: string;
}

// Define all tabs (order matters!)
const tabs = [
  { id: "venues", name: "Venues", icon: <FiMap />, component: <VenuesCrud /> },
  { id: "popupVenues", name: "Popup Venues", icon: <FiGlobe />, component: <PopupVenuesCrud /> },
  { id: "wifiSpots", name: "WiFi Spots", icon: <FiWifi />, component: <WifiSpotsCrud /> },
  { id: "schoolPrograms", name: "School Programs", icon: <FiBook />, component: <SchoolProgramsCrud /> },
  { id: "about", name: "About Info", icon: <FiInfo />, component: <AboutCrud /> },
  { id: "socialLinks", name: "Footer Socials", icon: <FiUsers />, component: <SocialLinksCrud /> },
  { id: "heroSection", name: "Hero Section", icon: <FiHome />, component: <HeroSectionCrud /> },
  { id: "contactMessages", name: "Contact Messages", icon: <FiMessageSquare />, component: <ContactMessagesCrud /> },
];

const ContentManager: React.FC<ContentManagerProps> = ({ initialTab }) => {
  // Find the tab index from the tab id
  const initialIndex = tabs.findIndex((tab) => tab.id === initialTab);
  const [selectedIndex, setSelectedIndex] = React.useState(initialIndex >= 0 ? initialIndex : 0);

  React.useEffect(() => {
    if (initialTab) {
      const idx = tabs.findIndex((tab) => tab.id === initialTab);
      if (idx >= 0) setSelectedIndex(idx);
    }
  }, [initialTab]);

  return (
    <div>
      <div className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
        <FiMap className="text-yellow-500" /> Content Manager
      </div>
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex gap-2 border-b mb-4 overflow-x-auto">
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              className={({ selected }) =>
                `flex items-center gap-2 px-5 py-2 rounded-t-lg focus:outline-none transition ${
                  selected
                    ? "bg-white border-t-2 border-yellow-400 text-yellow-700 shadow"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`
              }
            >
              {tab.icon}
              <span className="whitespace-nowrap">{tab.name}</span>
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          {tabs.map((tab) => (
            <Tab.Panel key={tab.id} className="pt-2">
              {tab.component}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default ContentManager;
