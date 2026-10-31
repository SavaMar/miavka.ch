import type { BookCollection } from "@/content/book-collections";

const SIZES = {
  sm: { box: "h-7 w-7", icon: "h-4 w-4" },
  md: { box: "h-11 w-11", icon: "h-6 w-6" },
  lg: { box: "h-14 w-14 md:h-16 md:w-16", icon: "h-7 w-7 md:h-8 md:w-8" },
} as const;

export default function CollectionIcon({
  collection,
  size = "md",
}: {
  collection: Pick<BookCollection, "icon" | "color">;
  size?: keyof typeof SIZES;
}) {
  const Icon = collection.icon;
  const { box, icon } = SIZES[size];
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-[5px] text-[#F4F4F0] ${box}`}
      style={{ backgroundColor: collection.color }}
      aria-hidden
    >
      <Icon className={icon} strokeWidth={1.75} />
    </span>
  );
}
