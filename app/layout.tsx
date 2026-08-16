import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "leaflet/dist/leaflet.css";
import "./globals.css";

const geist = Geist({
  subsets: ["latin", "vietnamese"],
  variable: "--font-geist",
  preload: false,
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.startsWith("http")
  ? process.env.NEXT_PUBLIC_SITE_URL
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: { icon: "/images/logo-hong-khang.png" },
  title: "Nhà trọ Hồng Khang tại Phước Hậu, Vĩnh Long",
  description:
    "Xem hình ảnh thực tế, vị trí và thông tin liên hệ Nhà trọ Hồng Khang tại 75/19E, Phường Phước Hậu, Tỉnh Vĩnh Long.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Nhà trọ Hồng Khang",
    description: "Xem hình ảnh thực tế và liên hệ trực tiếp để hẹn lịch xem phòng.",
    url: "/",
    siteName: "Nhà trọ Hồng Khang",
    locale: "vi_VN",
    type: "website",
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
      </body>
    </html>
  );
}
