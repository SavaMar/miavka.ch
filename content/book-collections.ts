import {
  Atom,
  Brain,
  Coins,
  Megaphone,
  MessagesSquare,
  Network,
  Palette,
  Rocket,
  Target,
  type LucideIcon,
} from "lucide-react";
import books from "@/data/books.json";
import type { BookItem } from "@/components/books/BooksLibrary";

export const GOODREADS_URL = "https://www.goodreads.com/user/show/185172704-mari-miavka";

export type BookCollection = {
  slug: string;
  title: string;
  /** Who the collection is for. */
  forWho: string;
  /** Why these books, in one or two sentences. */
  why: string;
  /** Book ids from data/books.json, in reading order. A book can sit in several collections. */
  bookIds: number[];
  icon: LucideIcon;
  /** Accent colour; cream (#F4F4F0) icons sit on it, so keep it dark enough for contrast. */
  color: string;
};

export const BOOK_COLLECTIONS: BookCollection[] = [
  {
    slug: "marketing-and-positioning",
    title: "Marketing & Positioning",
    forWho:
      "Owners and marketers who pay for marketing and want to understand why people choose one business over another.",
    why: "The ideas behind how I look at a business: be clear, be different, and turn attention into enquiries. Start with Positioning, then read the rest in any order.",
    bookIds: [67, 75, 61, 56, 22, 69, 52, 51, 41, 42, 63, 9],
    icon: Megaphone,
    color: "#D0320E",
  },
  {
    slug: "building-a-business",
    title: "Building a Business",
    forWho:
      "Founders, freelancers and anyone about to start something of their own, or already running it.",
    why: "How to find a real problem, build an offer people want, and run the company without it running you. Read these before you build, not after.",
    bookIds: [26, 24, 40, 65, 11, 32, 31, 60, 72, 71, 29, 38, 77, 21, 62, 44],
    icon: Rocket,
    color: "#1F4E79",
  },
  {
    slug: "systems-and-clear-thinking",
    title: "Systems & Clear Thinking",
    forWho:
      "Anyone who makes decisions with incomplete information: owners, managers, builders.",
    why: "How things actually behave: feedback loops, bottlenecks, biases and mental models. I think in systems, and this is where it comes from.",
    bookIds: [74, 78, 48, 64, 70, 36, 43, 58, 35, 28],
    icon: Network,
    color: "#2F6B4F",
  },
  {
    slug: "science-and-curiosity",
    title: "Science & Curiosity",
    forWho: "Anyone who likes to ask why things work the way they do.",
    why: "Curiosity is where clear thinking starts. A physicist's stories, the maths behind change, and the science of patterns hidden in chaos.",
    bookIds: [37, 50, 49],
    icon: Atom,
    color: "#5B3F8C",
  },
  {
    slug: "focus-habits-and-productivity",
    title: "Focus, Habits & Productivity",
    forWho: "Anyone with too many priorities and not enough hours.",
    why: "Fewer things, done well, every week. How to plan, protect deep work and build habits that hold when motivation doesn't.",
    bookIds: [17, 25, 2, 3, 13, 14, 47, 20, 73, 18, 39, 28],
    icon: Target,
    color: "#C25A0A",
  },
  {
    slug: "mind-and-self-worth",
    title: "Mind, Emotions & Self-Worth",
    forWho: "Anyone who knows what to do but keeps getting in their own way.",
    why: "Most of these I marked life changing. They're about the inner side of the work: emotions, self-worth, old patterns, and how to stop fighting yourself.",
    bookIds: [34, 19, 55, 53, 68, 33, 16, 15, 46, 54, 4, 35, 44],
    icon: Brain,
    color: "#8C2F4B",
  },
  {
    slug: "communication-and-persuasion",
    title: "Communication & Persuasion",
    forWho: "Anyone who sells, leads a team, or simply needs to be understood.",
    why: "How to tell a story, ask good questions, persuade without pressure, and negotiate without splitting the difference.",
    bookIds: [57, 59, 52, 12, 69, 40, 66, 62, 56],
    icon: MessagesSquare,
    color: "#17707F",
  },
  {
    slug: "money-and-wealth",
    title: "Money & Wealth",
    forWho: "Anyone who earns well and still feels unsure about money.",
    why: "Money is mostly behaviour. How to think about earning, spending, owning and freedom.",
    bookIds: [6, 30, 7, 11, 45, 76, 43, 71],
    icon: Coins,
    color: "#8A6A12",
  },
  {
    slug: "creativity-and-making",
    title: "Creativity & Making Things",
    forWho: "Creators, designers, writers and anyone who wants to make and share work regularly.",
    why: "How to start, keep going when it's hard, and show your work without waiting for permission.",
    bookIds: [1, 8, 9, 10, 23, 21],
    icon: Palette,
    color: "#C2366B",
  },
];

const BOOKS_BY_ID = new Map((books as BookItem[]).map((book) => [book.id, book]));

export function getCollection(slug: string): BookCollection | undefined {
  return BOOK_COLLECTIONS.find((collection) => collection.slug === slug);
}

export function getCollectionBooks(collection: BookCollection): BookItem[] {
  return collection.bookIds
    .map((id) => BOOKS_BY_ID.get(id))
    .filter((book): book is BookItem => Boolean(book));
}
