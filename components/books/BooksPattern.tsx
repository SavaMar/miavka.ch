export const BOOKS_BG_COLOR = "#262326";
const BOOKS_PATTERN_COLOR = "#5A2C33";
const BOOKS_PATTERN_OPACITY = 0.58;

/** The patterned layer behind book lists. The parent needs `relative`, the BOOKS_BG_COLOR background and `overflow-hidden`. */
export default function BooksPattern() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0"
      style={{
        backgroundColor: BOOKS_PATTERN_COLOR,
        opacity: BOOKS_PATTERN_OPACITY,
        WebkitMaskImage: "url('/bg_1.svg')",
        WebkitMaskRepeat: "repeat",
        WebkitMaskSize: "520px auto",
        WebkitMaskPosition: "top left",
        maskImage: "url('/bg_1.svg')",
        maskRepeat: "repeat",
        maskSize: "520px auto",
        maskPosition: "top left",
      }}
      aria-hidden
    />
  );
}
