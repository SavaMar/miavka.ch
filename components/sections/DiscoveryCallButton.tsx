import LiquidButton from "@/components/LiquidButton";
import type { LiquidButtonProps } from "@/components/LiquidButton";

export type DiscoveryCallButtonProps = Omit<LiquidButtonProps, "children"> & {
  /** `light`: cream/light sections (`text-brand-black`). `dark`: black sections (`text-brand-cream`). */
  variant?: "light" | "dark";
  /** `large` matches BrandStatement padding; `default` matches BookDiscovery / How I Work. */
  size?: "default" | "large";
  children?: React.ReactNode;
};

const DISPLAY_STYLE = { fontFamily: "'TG Girthy', Impact, sans-serif" } as const;

export default function DiscoveryCallButton({
  variant = "dark",
  size = "default",
  className = "",
  children = "Book Discovery Call",
  labelHoverClassName,
  style,
  href = "/#contact",
  ...rest
}: DiscoveryCallButtonProps) {
  const sizeClass =
    size === "large" ? "px-10 py-4 text-sm" : "px-8 py-3";
  const variantClass =
    variant === "light" ? "text-brand-black" : "text-brand-cream";

  const hoverProps =
    variant === "dark"
      ? ({
          labelHoverClassName:
            labelHoverClassName ?? "group-hover:text-brand-black",
        } satisfies Pick<LiquidButtonProps, "labelHoverClassName">)
      : labelHoverClassName !== undefined
        ? ({ labelHoverClassName } satisfies Pick<
            LiquidButtonProps,
            "labelHoverClassName"
          >)
        : {};

  return (
    <LiquidButton
      href={href}
      className={`border-2 border-brand-red font-body font-bold uppercase ${variantClass} ${sizeClass} ${className}`}
      style={{ ...DISPLAY_STYLE, ...style }}
      {...hoverProps}
      {...rest}
    >
      {children}
    </LiquidButton>
  );
}
