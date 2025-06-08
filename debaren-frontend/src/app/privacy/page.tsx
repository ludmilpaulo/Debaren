"use client";
import {
  FaLock,
  FaRegUser,
  FaMapMarkerAlt,
  FaShareAlt,
  FaShieldAlt,
  FaHistory,
  FaGlobeAfrica,
  FaUserShield,
  FaUserClock,
  FaEnvelopeOpenText,
} from "react-icons/fa";

// Hero SVG (you can replace with your own illustration or SVG if desired)
const HeroGraphic = () => (
  <div className="absolute inset-0 pointer-events-none">
    <svg
      width="100%"
      height="180"
      viewBox="0 0 1440 320"
      className="w-full h-48"
      fill="none"
    >
      <defs>
        <linearGradient id="heroGradient" x1="0" x2="0" y1="0" y2="1">
          <stop stopColor="#2563eb" stopOpacity="0.22" />
          <stop offset="1" stopColor="#38bdf8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        fill="url(#heroGradient)"
        d="M0,96L60,117.3C120,139,240,181,360,192C480,203,600,181,720,181.3C840,181,960,203,1080,218.7C1200,235,1320,245,1380,250.7L1440,256L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
      />
    </svg>
  </div>
);

export default function PrivacyPage() {
  return (
    <section className="relative max-w-3xl mx-auto py-12 px-4 md:px-0">
      {/* Decorative Hero SVG */}
      <div className="absolute left-0 right-0 top-0 z-0">
        <HeroGraphic />
      </div>

      {/* Glassmorphism Hero */}
      <div className="relative z-10 rounded-3xl bg-white/90 backdrop-blur shadow-xl border border-blue-100 p-8 mb-10">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <FaLock className="text-4xl text-blue-600 drop-shadow" />
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900">
              Privacy Policy
            </h1>
            <p className="text-lg text-blue-900/80 mt-2 max-w-2xl font-medium">
              We’re committed to protecting your personal information and privacy rights.
            </p>
          </div>
        </div>
        <p className="mt-5 text-base md:text-lg text-slate-600">
          This Privacy Policy describes how Debaren (“we”, “us”, or “our”) collects, uses, shares, and protects your information when you use our platform to discover and book venues across South Africa.
        </p>
      </div>

      {/* Effective Date */}
      <div className="mb-6 text-sm text-slate-500 text-center">
        <span className="inline-block bg-white border border-blue-100 rounded-xl px-4 py-1 shadow-sm">
          Effective: 9 June 2025
        </span>
      </div>

      <div className="space-y-8 relative z-10">
        {/* 1. Information We Collect */}
        <GlassCard
          icon={<FaRegUser className="text-blue-600" />}
          title="1. Information We Collect"
        >
          <ul className="list-disc pl-6 space-y-1 text-base text-slate-700">
            <li><b>Account Data:</b> Name, email address, phone number, profile info you provide.</li>
            <li><b>Bookings:</b> Details of venues, events, or services you book or interact with.</li>
            <li><b>Location:</b> Approximate location for venue recommendations (with consent).</li>
            <li><b>Device & Usage:</b> Device type, browser info, IP address, analytics (via cookies/log files).</li>
            <li><b>Communications:</b> Messages, feedback, and support requests you send to us.</li>
          </ul>
        </GlassCard>

        {/* 2. How We Use Your Information */}
        <GlassCard
          icon={<FaMapMarkerAlt className="text-blue-600" />}
          title="2. How We Use Your Information"
        >
          <ul className="list-disc pl-6 space-y-1 text-base text-slate-700">
            <li>To personalize your experience and suggest relevant venues.</li>
            <li>To manage your bookings and send updates or confirmations.</li>
            <li>To improve our services, website functionality, and security.</li>
            <li>To comply with legal obligations and prevent misuse or fraud.</li>
          </ul>
        </GlassCard>

        {/* 3. Legal Basis for Processing (GDPR/POPIA) */}
        <GlassCard
          icon={<FaShieldAlt className="text-blue-600" />}
          title="3. Legal Basis for Processing"
        >
          <p className="text-base text-slate-700">
            We process your information lawfully, fairly, and transparently. This includes processing based on your consent, the necessity of fulfilling contracts (such as bookings), compliance with legal obligations, and our legitimate business interests.
          </p>
        </GlassCard>

        {/* 4. Sharing Your Information */}
        <GlassCard
          icon={<FaShareAlt className="text-blue-600" />}
          title="4. How We Share Information"
        >
          <ul className="list-disc pl-6 space-y-1 text-base text-slate-700">
            <li>We <b>do not sell</b> your data.</li>
            <li>We may share information with:
              <ul className="pl-6 list-[circle] text-sm">
                <li>Trusted partners (venue hosts, payment providers) to complete your bookings.</li>
                <li>Authorities when required by law, court order, or to protect our rights.</li>
              </ul>
            </li>
            <li>All partners must comply with strict confidentiality and data protection agreements.</li>
          </ul>
        </GlassCard>

        {/* 5. International Users */}
        <GlassCard
          icon={<FaGlobeAfrica className="text-blue-600" />}
          title="5. International Users"
        >
          <p className="text-base text-slate-700">
            If you access Debaren from outside South Africa, your data may be transferred, processed, or stored in South Africa or other countries with appropriate safeguards as required by law (POPIA, GDPR).
          </p>
        </GlassCard>

        {/* 6. Children’s Privacy */}
        <GlassCard
          icon={<FaUserShield className="text-blue-600" />}
          title="6. Children’s Privacy"
        >
          <p className="text-base text-slate-700">
            Debaren is not intended for children under 16. We do not knowingly collect data from minors. If you believe a child has provided us information, please contact us so we can promptly remove it.
          </p>
        </GlassCard>

        {/* 7. Your Rights & Choices */}
        <GlassCard
          icon={<FaShieldAlt className="text-blue-600" />}
          title="7. Your Rights & Choices"
        >
          <ul className="list-disc pl-6 space-y-1 text-base text-slate-700">
            <li>Request access to your data or correct inaccuracies.</li>
            <li>Request deletion (where permitted by law).</li>
            <li>Withdraw your consent at any time.</li>
            <li>Adjust cookie and communication preferences.</li>
            <li>For requests, contact <a className="text-blue-700 underline" href="mailto:privacy@debaren.com">privacy@debaren.com</a>.</li>
          </ul>
        </GlassCard>

        {/* 8. Data Retention */}
        <GlassCard
          icon={<FaUserClock className="text-blue-600" />}
          title="8. Data Retention"
        >
          <p className="text-base text-slate-700">
            We keep your data only as long as necessary to provide services, fulfill legal requirements, and resolve disputes. You can request deletion at any time.
          </p>
        </GlassCard>

        {/* 9. Cookies & Tracking */}
        <GlassCard
          icon={<FaHistory className="text-blue-600" />}
          title="9. Cookies & Tracking"
        >
          <ul className="list-disc pl-6 space-y-1 text-base text-slate-700">
            <li>We use cookies and analytics for a better, more secure user experience.</li>
            <li>You can control cookies via your browser settings.</li>
          </ul>
        </GlassCard>

        {/* 10. Security */}
        <GlassCard
          icon={<FaLock className="text-blue-600" />}
          title="10. Security"
        >
          <ul className="list-disc pl-6 space-y-1 text-base text-slate-700">
            <li>Encryption, secure servers, regular security audits.</li>
            <li>Access restricted to trained, authorized personnel only.</li>
            <li>Compliance with POPIA, GDPR, and best industry practices.</li>
          </ul>
        </GlassCard>

        {/* 11. Policy Updates */}
        <GlassCard
          icon={<FaHistory className="text-blue-600" />}
          title="11. Policy Updates"
        >
          <ul className="list-disc pl-6 space-y-1 text-base text-slate-700">
            <li>We may update this policy to reflect changes in our practices or legal requirements.</li>
            <li>Major changes will be communicated via email or a prominent notice on our site.</li>
          </ul>
        </GlassCard>

        {/* 12. Contact Us */}
        <div className="bg-gradient-to-br from-sky-100/80 to-blue-50/60 border border-blue-100 rounded-2xl shadow-inner p-6 flex gap-4 items-center">
          <FaEnvelopeOpenText className="text-blue-600 text-2xl" />
          <div>
            <h2 className="font-semibold text-xl mb-1">12. Contact Us</h2>
            <p className="text-base text-slate-700">
              Questions or concerns? Email our Privacy Team at{" "}
              <a
                href="mailto:privacy@debaren.com"
                className="text-blue-700 underline font-medium"
              >
                privacy@debaren.com
              </a>
              . We’re happy to help.
            </p>
          </div>
        </div>
      </div>

      {/* Decorative SVG footer */}
      <div className="w-full mt-12 opacity-60">
        <svg viewBox="0 0 1440 80" fill="none" className="w-full h-12">
          <defs>
            <linearGradient id="footerGradient" x1="0" x2="0" y1="0" y2="1">
              <stop stopColor="#38bdf8" stopOpacity="0.15" />
              <stop offset="1" stopColor="#2563eb" stopOpacity="0.08" />
            </linearGradient>
          </defs>
          <path
            fill="url(#footerGradient)"
            d="M0,80L60,69.3C120,59,240,37,360,29.3C480,21,600,27,720,29.3C840,32,960,32,1080,34.7C1200,37,1320,53,1380,60L1440,67V0H0Z"
          />
        </svg>
      </div>
    </section>
  );
}

// -- Reusable Glassmorphism Card Component --
function GlassCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white/90 border border-blue-100 shadow-md backdrop-blur rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <h2 className="font-semibold text-xl">{title}</h2>
      </div>
      <div>{children}</div>
    </div>
  );
}
