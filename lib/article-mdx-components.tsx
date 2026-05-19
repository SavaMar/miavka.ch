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

export function createArticleMdxComponents(sections: ArticleSection[]) {
  const titleToId = new Map(sections.map((s) => [s.title.trim(), s.id]));

  const bodyClass =
    "text-sm font-body font-light leading-relaxed text-brand-black";

  return {
    h2: (props: ComponentPropsWithoutRef<"h2">) => {
      const { children, className, ...rest } = props;
      const text = toPlainText(children).trim();
      const id = titleToId.get(text);
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
    p: ({ className, ...rest }: ComponentPropsWithoutRef<"p">) => (
      <p className={`${bodyClass} mt-4 first:mt-0 ${className ?? ""}`} {...rest} />
    ),
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
