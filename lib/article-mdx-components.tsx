import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { isValidElement } from "react";
import { Inter } from "next/font/google";
import type { ArticleSection } from "./articles";
import EmailCapture from "@/components/articles/EmailCapture";

const interBold = Inter({
  subsets: ["latin"],
  weight: ["700"],
});

function toPlainText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(toPlainText).join("");
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode };
    if (props.children != null) return toPlainText(props.children);
  }
  return "";
}

function normalizeHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const BLOCK_TAGS = new Set([
  "p",
  "div",
  "section",
  "article",
  "aside",
  "blockquote",
  "ul",
  "ol",
  "li",
  "table",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
]);

function containsNestedBlock(node: ReactNode): boolean {
  if (node == null || typeof node === "boolean") return false;
  if (typeof node === "string" || typeof node === "number") return false;
  if (Array.isArray(node)) return node.some(containsNestedBlock);
  if (!isValidElement(node)) return false;

  if (typeof node.type === "string" && BLOCK_TAGS.has(node.type)) {
    return true;
  }

  const props = node.props as { children?: ReactNode };
  return containsNestedBlock(props.children);
}

export function createArticleMdxComponents(sections: ArticleSection[]) {
  const titleToId = new Map(
    sections.map((s) => [normalizeHeading(s.title), s.id])
  );

  const bodyClass = "text-[18px] leading-[1.75] text-brand-black";

  return {
    a: ({ className, style, ...rest }: ComponentPropsWithoutRef<"a">) => {
      const classes = className ?? "";
      const isCta =
        classes.includes("article-cta-button") ||
        (rest as Record<string, unknown>)["data-cta"] === "true";

      if (isCta) {
        return (
          <a
            className={`inline-flex rounded-[10px] border border-brand-red bg-brand-red px-3.5 py-1.5 text-[11px] font-bold uppercase -tracking-tighter text-white transition-colors hover:bg-brand-red/85 hover:text-brand-cream ${classes}`}
            style={{
              fontFamily:
                "var(--font-space-grotesk), 'Helvetica Neue', Arial, sans-serif",
              fontWeight: 700,
              ...style,
            }}
            {...rest}
          />
        );
      }

      return (
        <a
          className={`underline decoration-brand-red/60 underline-offset-2 transition-colors hover:text-brand-red ${classes}`}
          {...rest}
        />
      );
    },
    h2: (props: ComponentPropsWithoutRef<"h2">) => {
      const { children, className, ...rest } = props;
      const text = toPlainText(children).trim();
      const id = titleToId.get(normalizeHeading(text));
      return (
        <h2
          id={id}
          className={`mb-[0.7em] mt-10 scroll-mt-[108px] text-[26px] font-bold leading-tight text-brand-black first:mt-0 md:scroll-mt-[116px] ${interBold.className} ${className ?? ""}`}
          style={{
            fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
          }}
          {...rest}
        >
          {children}
        </h2>
      );
    },
    h3: ({ className, ...rest }: ComponentPropsWithoutRef<"h3">) => (
      <h3
        className={`mb-[0.65em] mt-8 text-[20px] font-bold leading-snug text-brand-black ${interBold.className} ${className ?? ""}`}
        style={{
          fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        }}
        {...rest}
      />
    ),
    p: ({ className, children, ...rest }: ComponentPropsWithoutRef<"p">) => {
      const mergedClass = `${bodyClass} mb-[1.5em] ${className ?? ""}`;

      // MDX sometimes injects block-level elements inside paragraph nodes.
      // Render a div wrapper to avoid invalid <p><p/></p> hydration mismatches.
      if (containsNestedBlock(children)) {
        return (
          <div className={mergedClass} {...rest}>
            {children}
          </div>
        );
      }

      return (
        <p className={mergedClass} {...rest}>
          {children}
        </p>
      );
    },
    img: ({ className, alt, ...rest }: ComponentPropsWithoutRef<"img">) => (
      <img
        className={`my-8 block w-full rounded object-contain ${className ?? ""}`}
        alt={alt ?? ""}
        {...rest}
      />
    ),
    hr: ({ className, ...rest }: ComponentPropsWithoutRef<"hr">) => (
      <hr
        className={`my-8 border-0 border-t border-brand-black/25 ${className ?? ""}`}
        {...rest}
      />
    ),
    EmailCapture,
    ul: ({ className, ...rest }: ComponentPropsWithoutRef<"ul">) => (
      <ul
        className={`${bodyClass} mt-4 list-disc space-y-2 pl-5 first:mt-0 ${className ?? ""}`}
        {...rest}
      />
    ),
    li: ({ className, ...rest }: ComponentPropsWithoutRef<"li">) => (
      <li className={className} {...rest} />
    ),
    strong: ({ className, ...rest }: ComponentPropsWithoutRef<"strong">) => (
      <strong className={`font-bold ${className ?? ""}`} {...rest} />
    ),
  };
}
