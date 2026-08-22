import Link from "next/link";

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://instagram.com/marimiavka",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <path
          d="M21 8.6a3 3 0 0 0-2.1-2.1C17.2 6 12 6 12 6s-5.2 0-6.9.5A3 3 0 0 0 3 8.6 31 31 0 0 0 3 12a31 31 0 0 0 .1 3.4 3 3 0 0 0 2.1 2.1C6.8 18 12 18 12 18s5.2 0 6.9-.5a3 3 0 0 0 2.1-2.1c.1-1.1.1-2.3.1-3.4s0-2.3-.1-3.4Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path d="m10 9.2 5 2.8-5 2.8V9.2Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/mari-miavka/",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <rect x="7" y="10" width="2.4" height="7" fill="currentColor" />
        <circle cx="8.2" cy="7.5" r="1.4" fill="currentColor" />
        <path d="M12 10h2.3v1.1h.1c.4-.8 1.4-1.4 2.8-1.4 2.5 0 3.1 1.6 3.1 3.9V17h-2.4v-3c0-1.4 0-2.5-1.5-2.5-1.5 0-1.7 1.1-1.7 2.4V17H12v-7Z" fill="currentColor" />
      </svg>
    ),
  },
] as const;

const LINK_COLUMNS = [
  {
    title: "More",
    links: [
      { label: "[ ABOUT ]", href: "/about" },
      { label: "[ CONTACT ]", href: "/contact" },
    ],
  },
  {
    title: "Free Content",
    links: [
      { label: "[ ARTICLES ]", href: "/articles" },
      { label: "[ BOOK COLLECTIONS ]", href: "/book-collections" },
      { label: "[ NEWSLETTER ]", href: "/newsletter" },
    ],
  },
  {
    title: "Products",
    links: [{ label: "[ BRAND AUDIT ]", href: "/contact" }],
  },
] as const;

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

export default function PersonalFooter() {
  return (
    <footer className="border-t border-[#F4F4F0]/12 bg-[#161515]">
      <div className="mx-auto w-full max-w-[1680px] px-4 py-10 md:px-8 md:py-12 lg:px-12">
        <div className="grid gap-10 md:grid-cols-[minmax(140px,220px)_1fr] md:items-start lg:gap-16">
          <div className="flex gap-3">
            {SOCIAL_LINKS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#F4F4F0]/8 text-[#F4F4F0] transition-colors hover:bg-[#D0320E] hover:text-[#161515]"
              >
                {item.icon}
              </a>
            ))}
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {LINK_COLUMNS.map((column) => (
              <div key={column.title}>
                <p
                  className="text-[2rem] leading-[0.92] text-[#F4F4F0]"
                  style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
                >
                  {column.title}
                </p>
                <div className="mt-3 space-y-2.5">
                  {column.links.map((link) =>
                    isExternalHref(link.href) ? (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-[0.92rem] text-[#F4F4F0]/72 underline underline-offset-2 transition-colors hover:text-[#D0320E]"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="block text-[0.92rem] text-[#F4F4F0]/72 underline underline-offset-2 transition-colors hover:text-[#D0320E]"
                      >
                        {link.label}
                      </Link>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-9 border-t-4 border-[#D0320E] pt-7">
          <p
            className="uppercase text-[#F4F4F0]"
            style={{
              fontFamily: "'TG Girthy', Impact, sans-serif",
              fontSize: "clamp(2.2rem, 8vw, 7rem)",
              lineHeight: 0.9,
            }}
          >
            Mari Miavka
          </p>
        </div>
      </div>
      <div className="border-t border-[#F4F4F0]/25">
        <div className="mx-auto w-full max-w-[1680px] px-4 py-4 md:px-8 lg:px-12">
          <p className="text-[10px] uppercase text-[#F4F4F0]/45">
            © 2026 Mariia Yemko Miavka · Miavka Studio · All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
