// app/sitemap.ts
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: "https://www.elementaryschoolnewsletters.com",
      lastModified: new Date(),
    },
    {
      url: "https://www.elementaryschoolnewsletters.com/builder",
      lastModified: new Date(),
    },
  ];
}
