"use client";

import {
  FaLinkedin,
  FaInstagram,
  FaFacebook,
  FaPinterest,
  FaTiktok,
} from "react-icons/fa";
import { useGetFooterSocialLinksQuery } from "@/services/debarenApi";
import type { SocialPlatform, FooterSocialLink } from "@/types/debaren";

const platformDetails: Record<
  SocialPlatform,
  { icon: React.ComponentType<{ size?: number }>; color: string }
> = {
  linkedin: { icon: FaLinkedin, color: "#0A66C2" },
  instagram: { icon: FaInstagram, color: "#E1306C" },
  facebook: { icon: FaFacebook, color: "#1877F3" },
  pinterest: { icon: FaPinterest, color: "#E60023" },
  tiktok: { icon: FaTiktok, color: "#010101" },
};

export default function Footer() {
  const { data: socials, isLoading } = useGetFooterSocialLinksQuery();

  return (
    <footer className="relative bg-gradient-to-t from-yellow-100 via-white to-white border-t shadow-inner mt-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-6 py-8 gap-6 md:gap-0">
        {/* Branding */}
        <div className="flex items-center gap-2 mb-2 md:mb-0">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-400/90 shadow-inner">
            <span className="text-lg font-bold text-white tracking-tighter">D</span>
          </span>
          <span className="font-bold text-lg text-yellow-700">debaren</span>
        </div>
        {/* Social icons */}
        <div className="flex gap-5">
          {!isLoading &&
            socials?.map(({ platform, url }: FooterSocialLink) => {
              const details = platformDetails[platform];
              if (!details) return null;
              const Icon = details.icon;
              return (
                <a
                  key={platform}
                  href={url}
                  aria-label={platform}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                  style={{ color: details.color }}
                >
                  <span className="inline-block transition-transform duration-200 group-hover:scale-125 drop-shadow-lg">
                    <Icon size={26} />
                  </span>
                </a>
              );
            })}
        </div>
        {/* Copyright */}
        <p className="text-xs text-slate-500 mt-4 md:mt-0 text-center">
          &copy; {new Date().getFullYear()} Debaren. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
