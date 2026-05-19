'use client'

import { useState } from 'react'

const FAQS = [
  {
    q: "How long does a brand project take?",
    a:
      "Discovery call is free, 30 minutes. A full brand audit takes one week. Strategy and system build typically runs 6–10 weeks depending on scope. I don't rush it — a brand is infrastructure, and infrastructure built wrong costs more to fix than to do right.",
  },
  {
    q: "What's included in the brand audit?",
    a:
      "A written diagnosis of your positioning, voice, visual presence, customer journey, and marketing system. Three priority changes — actionable, specific — whether or not we work together. Most founders find the audit alone changes how they think about their business.",
  },
  {
    q: "How is this different from hiring a marketing agency or freelancer?",
    a:
      "An agency executes. A freelancer delivers. I diagnose first — then we decide what the business actually needs. Most founders don't need more content. They need a system that makes their content, ads, website, and customer journey pull in the same direction. That's the work. The execution comes after, and it's informed, not improvised.",
  },
  {
    q: "What if I already have a logo, website, and Instagram?",
    a:
      "Good. Most of my clients do. The audit will tell us whether what you have is working, broken, or pulling in opposite directions. Sometimes the answer is rebuild. Sometimes it's rearrange. You won't know until someone outside your business looks at it with structure.",
  },
  {
    q: "Can I just get a logo?",
    a:
      "No. A logo without a system behind it is decoration. If what you need is decoration, there are better people for that. If what you need is a brand — the thing that makes people choose you, return, and tell others — that's the work I do.",
  },
  {
    q: "Do you work in French, German, or other languages?",
    a:
      "My working language is English — a deliberate filter for the kind of founder I work with. The strategy and system I build for you translate cleanly into French, German, or whatever language your market speaks. AI in 2026 carries meaning, tone, and intent without losing them. The real question isn't which language you publish in — it's whether you're talking to people or talking past them. Get that right, and every language works.",
  },
  {
    q: "What happens after launch?",
    a:
      "I stay close for three months. Not as a retainer or ongoing deliverables — as a diagnostic partner. Making sure the system works in practice, not just on paper. After that, you own everything. The goal is that you don't need me.",
  },
  {
    q: "How much does it cost?",
    a:
      "Discovery call is free. Brand audit is a fixed fee. Strategy and system builds are scoped after the audit — I don't price a problem I haven't seen. If budget is a real question, bring it to the call.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-brand-black/20">
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-6"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="text-brand-black text-sm font-body font-bold uppercase tracking-wide">
          {q}
        </span>
        <span className="text-brand-red text-lg font-body font-black shrink-0 leading-none">
          {open ? '−' : '+'}
        </span>
      </button>
      {open && (
        <p
          className="text-ui-gray-700 text-sm font-body leading-relaxed pb-6"
          style={{ fontWeight: 300 }}
        >
          {a}
        </p>
      )}
    </div>
  )
}

export default function FAQ() {
  return (
    <section className="bg-brand-cream py-20 md:py-28 px-6 md:px-10 lg:px-16">

      <div className="max-w-3xl mx-auto">
        <h2
          className="text-brand-black uppercase text-[clamp(2rem,6vw,5rem)] leading-none mb-16 md:mb-20"
          style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
        >
          Frequently Asked.
        </h2>

        <div className="border-t border-brand-black/20">
          {FAQS.map((item) => (
            <FAQItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </div>

    </section>
  )
}
