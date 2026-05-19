import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Books | Miavka Studio",
  description: "Books from Miavka Studio.",
};

export default function BooksPage() {
  return (
    <>
      <Nav />
      <main className="min-h-[50vh] bg-brand-black px-6 pb-20 pt-[72px] md:px-10 md:pb-28 md:pt-[80px] lg:px-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1
            className="mb-6 uppercase leading-none text-brand-cream text-[clamp(2rem,5vw,3rem)]"
            style={{ fontFamily: "'TG Girthy', Impact, sans-serif" }}
          >
            Books.
          </h1>
          <p
            className="mb-10 font-body text-sm leading-relaxed text-brand-cream/65 md:text-base"
            style={{
              fontFamily: "'Gotham Pro', 'Helvetica Neue', Arial, sans-serif",
              fontWeight: 300,
            }}
          >
            This section is coming soon. Until then you can browse{" "}
            <Link href="/articles" className="text-brand-red underline-offset-4 hover:underline">
              articles
            </Link>
            .
          </p>
          <Link
            href="/"
            className="font-body text-xs font-black uppercase tracking-wider text-brand-cream/70 hover:text-brand-cream"
          >
            ← Back home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
