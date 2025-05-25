import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReduxProvider from "@/app/provider";
import "./globals.css";

// Google Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// SEO & Social Metadata
export const metadata: Metadata = {
  title: {
    default: "Debaren | Discover Venues Across South Africa",
    template: "%s | Debaren",
  },
  description:
    "Discover and book venues, pop-up spaces, schools, and WiFi hotspots across South Africa. Debaren helps you find the best spaces to meet, work, study, or connect — anytime, anywhere.",
  keywords: [
    "Debaren", "Venues South Africa", "Venue Booking", "Event spaces", "Pop-up venues",
    "WiFi spots", "Coworking", "School venues", "South Africa events", "Conference spaces",
    "Meeting rooms", "Study venues", "Unique venues", "Cape Town venues", "Johannesburg venues"
  ],
  metadataBase: new URL("https://debaren.com"), // Use live domain for production
  alternates: {
    canonical: "https://debaren.com",
  },
  openGraph: {
    title: "Debaren | Discover Venues Across South Africa",
    description:
      "Find and book venues, schools, pop-up spots, and WiFi spaces across South Africa with Debaren — your guide to unique and vibrant locations.",
    url: "https://debaren.com",
    siteName: "Debaren",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Debaren - Venue Discovery",
      },
    ],
    locale: "en_ZA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@debaren", // Update if you have a Twitter handle
    creator: "@debaren",
    title: "Debaren | Discover Venues Across South Africa",
    description:
      "Find and book venues, pop-up spaces, schools, and more across South Africa with Debaren.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png", // 180x180 recommended
  },
  themeColor: "#2563eb", // Your brand blue, adjust if needed
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
  other: {
    // Social profiles for Google Knowledge Graph (adjust URLs)
    "profile:facebook": "https://facebook.com/debaren",
    "profile:instagram": "https://instagram.com/debaren",
    "profile:twitter": "https://twitter.com/debaren",
    "profile:linkedin": "https://linkedin.com/company/debaren",
  },
};

// Optional: Rich Structured Data (JSON-LD)
export const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Debaren",
  "url": "https://debaren.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://debaren.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  },
  "sameAs": [
    "https://facebook.com/debaren",
    "https://instagram.com/debaren",
    "https://twitter.com/debaren",
    "https://linkedin.com/company/debaren"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-ZA" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* JSON-LD Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {/* Add additional meta tags for SEO & social here if needed */}
      </head>
      <body className="bg-slate-50 text-slate-800 font-sans">
        <ReduxProvider>
          <Navbar />
          <main className="min-h-screen px-4 md:px-12 py-8">{children}</main>
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
