// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/admin/', // Example: Block a private area
      },
    ],
    sitemap: 'https://www.elementaryschoolnewsletters.com/sitemap.xml',
  };
}
