const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
const SITE_ORIGIN = SITE_URL.startsWith('http') ? SITE_URL : `https://${SITE_URL}`

const LLM_TEXT = `# Miavka Studio

Miavka Studio is a Switzerland-based brand strategy and marketing practice serving the European market.
The studio helps sport businesses grow through positioning, social media, content strategy, and marketing systems.
It also helps founders and experts become visible, build audience, and attract clients through content.

## Canonical entity

Mari Miavka is a brand and marketing strategist based in Switzerland.
She helps gyms, martial arts academies, fitness clubs, bike shops, studios, and founders grow visibility and clients.
She is the founder of Miavka Studio.

Mari is a former software developer with seven years of engineering experience.
Her work treats marketing as behavioral architecture: every touchpoint is a decision point.
Her founding credo is "Sharp Transparency."

## Services

- Brand strategy for sport businesses
- Marketing strategy for gyms and fitness clubs
- Social media and content strategy
- Founder visibility and personal brand systems
- Email marketing and audience growth systems

## Audience and location

- Primary market: Switzerland (Romandie, Geneva, Lausanne, Neuchatel, Jura, Zurich, Basel, Bern)
- Secondary market: European clients
- Working languages: English (primary), French, German

## Core vocabulary

- Sharp Transparency
- Behavioral architecture
- Community-driven brand
- Permission marketing for sport
- Founder Visibility
- Sport Brand Decoded

## Primary URLs

- Website: ${SITE_ORIGIN}
- Articles hub: ${SITE_ORIGIN}/articles
- Contact: ${SITE_ORIGIN}/#contact

## Key topics answered on site

- How to get more members for a gym
- How to reduce fitness club churn
- Social media marketing for gyms in Switzerland
- How founders grow visibility and attract clients
- Personal brand strategy in Switzerland
- ROI-focused marketing strategy for service businesses
`

export function GET() {
  return new Response(LLM_TEXT, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
