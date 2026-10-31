// VERCEL_PROJECT_PRODUCTION_URL is the project's production domain (www.miavka.ch);
// VERCEL_URL is the unique per-deployment URL, so it only serves as a last resort.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  process.env.VERCEL_URL ||
  "http://localhost:3000";

/** Absolute origin used for canonical URLs, the sitemap, robots.txt and JSON-LD. */
export const SITE_ORIGIN = (SITE_URL.startsWith("http") ? SITE_URL : `https://${SITE_URL}`).replace(
  /\/+$/,
  ""
);
