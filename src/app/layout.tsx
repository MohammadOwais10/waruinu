import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://waruinu.com"),
  title: {
    default: "Dagitari Waruinu | Plan Your Baby's Gender with Confidence",
    template: "%s | Dagitari Waruinu",
  },
  description:
    "A science-led, non-invasive method for planning your baby's gender before conception. With Dagitari Waruinu, families plan ahead with clarity and care.",
  keywords: [
    "baby gender planning",
    "gender planning",
    "preconception",
    "family planning",
    "Dagitari Waruinu",
    "sexologist",
  ],
  openGraph: {
    title: "Dagitari Waruinu | Plan Your Baby's Gender with Confidence",
    description:
      "A science-led, non-invasive method for planning your baby's gender before conception.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dagitari Waruinu | Plan Your Baby's Gender with Confidence",
    description:
      "A science-led, non-invasive method for planning your baby's gender before conception.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-linen text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-boy focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
