import type { ComponentPropsWithoutRef } from "react";

export type LiquidButtonProps = Omit<ComponentPropsWithoutRef<"a">, "children"> & {
  children: React.ReactNode;
  /** Fill color behind the label (default red) */
  fillClassName?: string;
  /** Label color on hover — use e.g. group-hover:text-brand-black */
  labelHoverClassName?: string;
};

export default function LiquidButton({
  className = "",
  fillClassName = "bg-brand-red",
  labelHoverClassName = "group-hover:text-brand-cream",
  children,
  ...rest
}: LiquidButtonProps) {
  return (
    <a
      className={`group relative inline-block overflow-hidden transition-colors duration-700 ease-[cubic-bezier(0.45,0,0.55,1)] ${className}`}
      {...rest}
    >
      <span
        className={`pointer-events-none absolute left-1/2 top-1/2 z-0 block aspect-square w-[260%] max-w-none origin-center -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full transition-[transform] duration-700 ease-[cubic-bezier(0.45,0,0.55,1)] will-change-transform group-hover:scale-100 ${fillClassName}`}
        aria-hidden
      />
      <span
        className={`relative z-10 block transition-colors duration-500 ease-[cubic-bezier(0.45,0,0.55,1)] ${labelHoverClassName}`}
      >
        {children}
      </span>
    </a>
  );
}
