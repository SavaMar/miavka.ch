import type { MetadataRoute } from 'next'

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
const SITE_ORIGIN = SITE_URL.startsWith('http') ? SITE_URL : `https://${SITE_URL}`

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: ['GPTBot', 'Claude-Web', 'PerplexityBot', 'Googlebot', 'Bingbot'],
        allow: '/',
      },
    ],
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
    host: SITE_ORIGIN,
  }
}
