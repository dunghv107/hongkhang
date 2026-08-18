import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { site } from "../lib/site";
import "leaflet/dist/leaflet.css";
import "./globals.css";

const geist = Geist({
  subsets: ["latin", "vietnamese"],
  variable: "--font-geist",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  applicationName: site.name,
  icons: { icon: "/images/logo-hong-khang.png" },
  title: "Nhà trọ Vĩnh Long tại Phước Hậu | Nhà trọ Hồng Khang",
  description: site.description,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    title: "Nhà trọ Vĩnh Long tại Phước Hậu | Nhà trọ Hồng Khang",
    description: site.description,
    url: "/",
    siteName: site.name,
    locale: "vi_VN",
    type: "website",
    images: [{ url: "/images/san-chung-hong-khang.jpg", alt: "Sân chung tại Nhà trọ Hồng Khang ở Phước Hậu, Vĩnh Long" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nhà trọ Vĩnh Long tại Phước Hậu | Nhà trọ Hồng Khang",
    description: site.description,
    images: ["/images/san-chung-hong-khang.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={geist.variable} suppressHydrationWarning>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
