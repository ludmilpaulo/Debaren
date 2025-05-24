import {
  FaLinkedin,
  FaInstagram,
  FaFacebook,
  FaPinterest,
  FaTiktok,
} from "react-icons/fa";

const socials = [
  {
    label: "LinkedIn",
    href: "#",
    icon: FaLinkedin,
    color: "hover:text-blue-700",
  },
  {
    label: "Instagram",
    href: "#",
    icon: FaInstagram,
    color: "hover:text-pink-600",
  },
  {
    label: "Facebook",
    href: "#",
    icon: FaFacebook,
    color: "hover:text-blue-600",
  },
  {
    label: "Pinterest",
    href: "#",
    icon: FaPinterest,
    color: "hover:text-red-500",
  },
  {
    label: "TikTok",
    href: "#",
    icon: FaTiktok,
    color: "hover:text-black",
  },
];

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-t from-yellow-50 via-white to-white border-t shadow-inner mt-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-6 py-8 gap-6 md:gap-0">
        <div className="flex items-center gap-2 mb-2 md:mb-0">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-400/80 shadow-inner">
            <span className="text-lg font-bold text-white tracking-tighter">D</span>
          </span>
          <span className="font-bold text-lg text-yellow-700">debaren</span>
        </div>
        <div className="flex gap-5">
          {socials.map(({ label, href, icon: Icon, color }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-slate-500 hover:scale-125 transition-transform duration-200 ${color}`}
            >
              <Icon size={22} />
            </a>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-4 md:mt-0">
          &copy; {new Date().getFullYear()} Debaren. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
