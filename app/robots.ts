import type { MetadataRoute } from "next";
import { site } from "../lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/api/",
        "/dang-nhap",
        "/dang-ky",
        "/quen-mat-khau",
        "/dat-lai-mat-khau",
      ],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
