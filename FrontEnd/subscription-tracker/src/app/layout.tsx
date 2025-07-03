import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_APP_URL}`),
  title: "Subscription Tracker",
  description: "Efficiently manage and track all your subscriptions in one place. Monitor recurring payments, get renewal reminders, and optimize your subscription spending with our comprehensive subscription management tool.",
  keywords: "subscription tracker, subscription management, recurring payments, subscription monitoring, payment tracking, subscription organizer, subscription reminder",
  robots: "index, follow",
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: "Subscription Tracker",
    description: "Efficiently manage and track all your subscriptions in one place. Monitor recurring payments, get renewal reminders, and optimize your subscription spending.",
    type: "website",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Subscription Tracker Preview',
      },
    ],
    siteName: 'Subscription Tracker',
    locale: 'en_US',
    url: `${process.env.NEXT_PUBLIC_APP_URL}`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Subscription Tracker',
    description: 'Efficiently manage and track all your subscriptions in one place.',
    creator: '@mdshahriar.me',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Subscription Tracker - Manage and track all your subscriptions efficiently'
    }],
    site: '@mdshahriar.me'
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Subscription Tracker',
  },
  other: {
    'application-ld+json': JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Subscription Tracker",
      "url": process.env.NEXT_PUBLIC_APP_URL,
      "description": "Efficiently manage and track all your subscriptions in one place. Monitor recurring payments, get renewal reminders, and optimize your subscription spending.",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web",
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
      "featureList": [
        "Track multiple subscriptions",
        "Monitor payment schedules",
        "Get renewal reminders",
        "Manage subscription expenses"
      ],
      "author": {
        "@type": "Person",
        "name": "Md. Shahriar Mahmud",
        "url": "https://mdshahriar.me/",
        "email": "contact@mdshahriar.me",
        "jobTitle": "Full Stack Developer",
        "alumniOf": {
          "@type": "CollegeOrUniversity",
          "name": "American International University Bangladesh (AIUB)"
        },
        "sameAs": [
          "https://github.com/Shahriar-Mahmud-Toha"
        ]
      }
    })
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#A896F9'
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
