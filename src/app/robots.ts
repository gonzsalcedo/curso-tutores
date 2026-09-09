import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/privacidad", "/terminos", "/cursos/login"],
        disallow: ["/admin/", "/admin/*", "/api/"],
      },
    ],
    sitemap: "https://tutor.gonzsalcedo.com/sitemap.xml",
  };
}
