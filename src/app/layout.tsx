import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "AcroWorld - Global Acro Yoga Community Hub",
  description:
    "Discover acro yoga events, connect with teachers, and join a global community of practitioners. Find workshops, festivals, and classes worldwide.",
  keywords:
    "acro yoga, acroyoga, yoga, acrobatics, workshops, festivals, community, teachers, events",
  authors: [{ name: "AcroWorld Team" }],
  creator: "AcroWorld",
  publisher: "AcroWorld",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://acroworld.com"),
  openGraph: {
    title: "AcroWorld - Global Acro Yoga Community Hub",
    description:
      "Discover acro yoga events, connect with teachers, and join a global community of practitioners.",
    url: "https://acroworld.com",
    siteName: "AcroWorld",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AcroWorld Community Hub",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AcroWorld - Global Acro Yoga Community Hub",
    description:
      "Discover acro yoga events, connect with teachers, and join a global community of practitioners.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  icons: {
    icon: "/logo_play_store_512.png",
    shortcut: "/logo_play_store_512.png",
    apple: "/logo_play_store_512.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
