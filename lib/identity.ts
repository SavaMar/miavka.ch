// Single source of truth for how the site describes Mari. Used by JSON-LD,
// metadata and llms.txt so search engines and AI see one consistent entity.

export const PERSON_NAME = "Mari Miavka";

export const PERSON_JOB_TITLE =
  "Marketer, software developer and AI and automation strategist";

export const PERSON_SUMMARY =
  "Mari Miavka is a marketer, software developer and AI and automation strategist. She builds the digital infrastructure for Swiss businesses: websites, sales funnels, automations and the marketing system that connects them. She is not an artist or a creative studio.";

export const PERSON_KNOWS_ABOUT = [
  "Digital marketing systems",
  "Website and landing page conversion",
  "Sales funnels and lead flow",
  "AI and marketing automation",
  "Software development",
  "Local search visibility and Google Business Profile",
  "Brand positioning and customer language",
] as const;

export const PERSON_SAME_AS = [
  "https://www.linkedin.com/in/mari-miavka/",
  "https://instagram.com/marimiavka",
  "https://www.threads.net/@marimiavka",
] as const;
