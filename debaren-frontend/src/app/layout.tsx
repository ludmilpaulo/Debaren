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

// SEO Metadata
export const metadata: Metadata = {
  title: {
    default: "Debaren | Discover Venues Across South Africa",
    template: "%s | Debaren",
  },
  description:
    "Explore venues, popup spots, schools, and WiFi zones across South Africa with Debaren — your go-to platform for discovering unique and vibrant spaces.",
  keywords: [
    "Debaren",
    "Venues South Africa",
    "Event spaces",
    "Popup venues",
    "WiFi spots",
    "Co-working",
    "School venues",
  ],
  metadataBase: new URL("https://debaren.com"),
  openGraph: {
    title: "Debaren | Discover Venues Across South Africa",
    description:
      "Explore venues, schools, popup spots, and WiFi zones across South Africa with Debaren — your guide to unique spaces.",
    url: "https://debaren.com",
    siteName: "Debaren",
    images: [
      {
        url: "/og-image.jpg", // Place this in /public
        width: 1200,
        height: 630,
        alt: "Debaren - Venue Discovery",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Debaren | Discover Venues Across South Africa",
    description:
      "Explore venues, schools, and pop-up spaces across South Africa with Debaren.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico", // Place a 32x32 favicon here
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
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
