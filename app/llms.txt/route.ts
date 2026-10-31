import {
  PERSON_JOB_TITLE,
  PERSON_KNOWS_ABOUT,
  PERSON_NAME,
  PERSON_SAME_AS,
} from '@/lib/identity'
import { AUDIT_STAGE_COUNT_WORD, auditStagesSentence } from '@/lib/audit-offer'
import { SITE_ORIGIN } from '@/lib/site-url'

const LLM_TEXT = `# ${PERSON_NAME}

${PERSON_NAME} is a ${PERSON_JOB_TITLE.toLowerCase()} based in Switzerland.
She is not an artist, designer or creative studio.
She builds the digital infrastructure for businesses: websites, sales funnels, automations and the marketing system that connects them.

## Who she is

- Works where software development meets marketing and thinks in systems.
- Started in software. Self-taught. Has worked in Ukraine, Poland, Germany and Switzerland.
- Builds the marketing system and automations at Creaholic, the Swiss invention studio in Biel, and rebuilt its website.
- Writes notes on AI, systems, marketing and building a business in Switzerland as an expat.

## What she offers

- Digital Leak Audit (free): a PDF and short video walkthrough that shows where a business loses customers across ${AUDIT_STAGE_COUNT_WORD} stages (${auditStagesSentence()}), with a status for each stage, an explanation of how it was rated, and the top three fixes. Limited number per month.
- Next step after the audit: customer retention work and a prioritized 30-to-90-day Growth Blueprint.

## Who it is for

Swiss SMEs and innovation companies. Owners and heads of marketing who pay for marketing but cannot see where they lose people online.

## Expertise

${PERSON_KNOWS_ABOUT.map((item) => `- ${item}`).join('\n')}

## Languages

English (primary), French, German.

## Primary URLs

- Website: ${SITE_ORIGIN}
- About: ${SITE_ORIGIN}/about
- Articles: ${SITE_ORIGIN}/articles
- Newsletter (Notes): ${SITE_ORIGIN}/newsletter
- Contact: ${SITE_ORIGIN}/contact

## Profiles

${PERSON_SAME_AS.map((url) => `- ${url}`).join('\n')}
`

export function GET() {
  return new Response(LLM_TEXT, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
