import type { MetadataRoute } from 'next'
import {
  DEFAULT_LANG,
  articleDetailPath,
  getAvailableLanguages,
  getSlugDirectories,
} from '@/lib/articles'

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
const SITE_ORIGIN = SITE_URL.startsWith('http') ? SITE_URL : `https://${SITE_URL}`

function absolute(path: string): string {
  return new URL(path, SITE_ORIGIN).toString()
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: absolute('/'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: absolute('/articles'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: absolute('/books'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ]

  const articleEntries: MetadataRoute.Sitemap = []
  const slugs = await getSlugDirectories()

  for (const slug of slugs) {
    const available = await getAvailableLanguages(slug)
    const langSet = new Set(available.length ? available : [DEFAULT_LANG])
    const languageAlternates = Object.fromEntries(
      [...langSet].map((lang) => [lang, absolute(articleDetailPath(slug, lang))])
    ) as Record<string, string>

    for (const lang of langSet) {
      articleEntries.push({
        url: absolute(articleDetailPath(slug, lang)),
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: {
          languages: languageAlternates,
        },
      })
    }
  }

  return [...staticEntries, ...articleEntries]
}
