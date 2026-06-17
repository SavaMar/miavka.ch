import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import './globals.css'

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
const SITE_ORIGIN = SITE_URL.startsWith('http') ? SITE_URL : `https://${SITE_URL}`
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
})

const GLOBAL_ENTITY_SCHEMA = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Miavka Studio',
    url: SITE_ORIGIN,
    logo: `${SITE_ORIGIN}/images/logo.png`,
    founder: {
      '@type': 'Person',
      name: 'Mari Miavka',
    },
    areaServed: ['Switzerland', 'Europe'],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Mari Miavka',
    jobTitle: 'Brand and marketing strategist',
    worksFor: {
      '@type': 'Organization',
      name: 'Miavka Studio',
      url: SITE_ORIGIN,
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CH',
    },
    knowsLanguage: ['en', 'fr', 'de'],
    knowsAbout: [
      'Brand strategy for sport businesses',
      'Personal brand strategy for founders',
      'Content systems',
      'Behavioral architecture in marketing',
      'Community-driven brand strategy',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Community-driven brand strategy',
    provider: {
      '@type': 'Organization',
      name: 'Miavka Studio',
      url: SITE_ORIGIN,
    },
    areaServed: 'Switzerland',
    serviceType:
      'Brand strategy, social media strategy, content systems, and marketing architecture for gyms, fitness clubs, martial arts academies, bike shops, studios, and coworking spaces.',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Personal brand architecture',
    provider: {
      '@type': 'Organization',
      name: 'Miavka Studio',
      url: SITE_ORIGIN,
    },
    areaServed: 'Switzerland',
    serviceType:
      'Personal brand strategy and content systems for founders, coaches, artists, and experts.',
  },
]

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL.startsWith('http') ? SITE_URL : `https://${SITE_URL}`),
  title: 'Miavka Studio',
  description: 'Brand-building studio for founder-led businesses across Europe.',
  icons: {
    apple: [{ url: '/images/logo.png', sizes: '180x180' }],
    icon: [
      { url: '/images/logo.png', type: 'image/png', sizes: '32x32' },
      { url: '/images/logo.png', type: 'image/png', sizes: '16x16' },
    ],
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4SZZWD39HC"
          strategy="afterInteractive"
        />
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-4SZZWD39HC');`}
        </Script>
      </head>
      <body suppressHydrationWarning className={spaceGrotesk.variable}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(GLOBAL_ENTITY_SCHEMA) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
