import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { isValidElement } from "react";
import type { ArticleSection } from "./articles";

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

type EmailCaptureProps = {
  offer: string;
  title: string;
  description?: ReactNode;
  buttonLabel?: string;
  children?: ReactNode;
};

function EmailCapture({
  offer,
  title,
  description,
  buttonLabel = "GET THE CHECKLIST",
  children,
}: EmailCaptureProps) {
  const fromProp = toPlainText(description).trim();
  const fromChildren = toPlainText(children).trim();
  const descriptionText = fromProp.length > 0 ? fromProp : fromChildren;

  return (
    <section
      data-offer={offer}
      className="my-8 border border-brand-black bg-brand-cream p-5 md:p-6"
    >
      <h3
        className="whitespace-pre-line text-lg font-black leading-tight text-brand-black md:text-xl"
        style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
      >
        {title}
      </h3>
      <div
        className="mt-3 text-sm leading-relaxed text-brand-black md:text-base"
        style={{
          fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
          fontWeight: 400,
        }}
      >
        {descriptionText
          .split("\n")
          .filter((line) => line.trim().length > 0)
          .map((line, idx) => (
            <span key={`${offer}-line-${idx}`} className="block">
              {line}
            </span>
          ))}
      </div>
      <form className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          placeholder="your email"
          aria-label={`${offer} email`}
          className="h-11 w-full border border-brand-black bg-transparent px-3 text-sm text-brand-black placeholder:text-brand-black/55 focus:outline-none focus:ring-2 focus:ring-brand-red/50"
        />
        <button
          type="submit"
          className="h-11 border border-brand-red bg-brand-black px-4 text-xs font-bold uppercase tracking-wide text-brand-cream transition-colors hover:bg-brand-red hover:text-brand-black"
          style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
        >
          {buttonLabel}
        </button>
      </form>
    </section>
  );
}

export function createArticleMdxComponents(sections: ArticleSection[]) {
  const titleToId = new Map(
    sections.map((s) => [normalizeHeading(s.title), s.id])
  );

  const bodyClass = "text-md font-body leading-relaxed text-brand-black";

  return {
    h2: (props: ComponentPropsWithoutRef<"h2">) => {
      const { children, className, ...rest } = props;
      const text = toPlainText(children).trim();
      const id = titleToId.get(normalizeHeading(text));
      return (
        <h2
          id={id}
          className={`mt-10 scroll-mt-[108px] text-xl font-black text-brand-black first:mt-0 md:scroll-mt-[116px] md:text-2xl ${className ?? ""}`}
          style={{
            fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
          }}
          {...rest}
        >
          {children}
        </h2>
      );
    },
    h3: ({ className, ...rest }: ComponentPropsWithoutRef<"h3">) => (
      <h3
        className={`mt-8 text-lg font-black leading-snug text-brand-black md:text-xl ${className ?? ""}`}
        style={{
          fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
        }}
        {...rest}
      />
    ),
    p: ({ className, ...rest }: ComponentPropsWithoutRef<"p">) => (
      <p
        className={`${bodyClass} mt-4 first:mt-0 ${className ?? ""}`}
        {...rest}
      />
    ),
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
