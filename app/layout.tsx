import type { Metadata } from 'next'
import { JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import './globals.css'
import { AUDIT_STAGE_COUNT_WORD, auditStagesSentence } from '@/lib/audit-offer'
import {
  PERSON_JOB_TITLE,
  PERSON_KNOWS_ABOUT,
  PERSON_NAME,
  PERSON_SAME_AS,
  PERSON_SUMMARY,
} from '@/lib/identity'
import { SITE_ORIGIN } from '@/lib/site-url'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
})
const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains-mono',
})

const GLOBAL_ENTITY_SCHEMA = [
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_ORIGIN}/#person`,
    name: PERSON_NAME,
    url: SITE_ORIGIN,
    jobTitle: PERSON_JOB_TITLE,
    description: PERSON_SUMMARY,
    worksFor: {
      '@type': 'Organization',
      name: 'Creaholic',
      url: 'https://www.creaholic.com',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CH',
    },
    knowsLanguage: ['en', 'fr', 'de'],
    knowsAbout: PERSON_KNOWS_ABOUT,
    sameAs: PERSON_SAME_AS,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Digital Leak Audit',
    description:
      `A PDF and short video walkthrough that shows where a business loses customers across ${AUDIT_STAGE_COUNT_WORD} stages: ${auditStagesSentence()}.`,
    provider: { '@id': `${SITE_ORIGIN}/#person` },
    areaServed: 'Switzerland',
    serviceType:
      'Digital presence, website conversion and sales funnel audit for Swiss SMEs and innovation companies.',
  },
]

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: `${PERSON_NAME} — Marketing systems, software and AI automation`,
  description: PERSON_SUMMARY,
  authors: [{ name: PERSON_NAME, url: SITE_ORIGIN }],
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
      <body
        suppressHydrationWarning
        className={`${spaceGrotesk.variable} ${jetBrainsMono.variable}`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(GLOBAL_ENTITY_SCHEMA).replace(/</g, '\\u003c') }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
