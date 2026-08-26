import type { MetadataRoute } from "next";
import { site } from "../lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: "Hồng Khang",
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f2f2f2",
    theme_color: "#5d5248",
    lang: "vi",
    icons: [
      { src: "/icons/app-icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/app-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
