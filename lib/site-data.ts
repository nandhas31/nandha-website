export const EMAIL = "nandhasundar@gmail.com";
export const LINKEDIN_URL = "https://www.linkedin.com/in/nandha-sundaravadivel/";
export const AGENTFORCE_URL = "https://www.salesforce.com/agentforce/coworker/";

/** Stable URL where the markdown rendering of this page lives. */
export const MARKDOWN_PATH = "/llms.txt";

/** Brand colors, keyed by the company they belong to. */
export const BRAND_COLOR = {
  salesforce: "#00A1E0",
  hubspot: "#FF7A59",
  amazon: "#CC7A00",
} as const;

export const profile = {
  name: "Nandha Sundaravadivel",
  tagline: "Software Engineer | Focused on building and scaling agentic systems",
};

/**
 * The sections of the page, in document order. Both the page and the section
 * nav read this, so a rename or reorder only has to happen here.
 */
export const SECTIONS = [
  { id: "home", label: "Intro" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "highlights", label: "Highlights" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

/** Companies that have a logo in `components/icons`. */
export type Company = "Salesforce" | "HubSpot" | "Amazon" | "UKG";

export interface Role {
  company: Company;
  date: string;
  /** Brand color for the icon chip; omitted when the logo carries its own color. */
  color?: string;
  link?: { label: string; url: string };
}

export const currentRole: Role = {
  company: "Salesforce",
  date: "January 2025 to Present",
  color: BRAND_COLOR.salesforce,
  link: { label: "Agentforce Coworker", url: AGENTFORCE_URL },
};

export const internships: Role[] = [
  { company: "Salesforce", date: "Summer 2023 & Summer 2024", color: BRAND_COLOR.salesforce },
  { company: "HubSpot", date: "Fall 2022", color: BRAND_COLOR.hubspot },
  { company: "Amazon", date: "Summer 2022", color: BRAND_COLOR.amazon },
  { company: "UKG", date: "Fall 2021" },
];

export interface Education {
  id: string;
  school: string;
  degree: string;
  years: string;
}

export const education: Education[] = [
  {
    id: "gt-bs",
    school: "Georgia Institute of Technology",
    degree: "B.S. in Computer Science",
    years: "2020 to 2023",
  },
  {
    id: "gt-ms",
    school: "Georgia Institute of Technology",
    degree: "M.S. in Computer Science",
    years: "2024",
  },
];

/** Ship stage, worn as a badge on the highlight. */
export type Stage = "alpha" | "beta" | "stealth";

export interface Highlight {
  id: string;
  name: string;
  description: string;
  stage?: Stage;
  /** Where the highlight lives, when it has somewhere to go. */
  href?: string;
}

export const highlights: Highlight[] = [
  {
    id: "aimonkey",
    name: "aiMonkey",
    description:
      "A typing test built on the words you actually type. The moat is your own keystrokes.",
    stage: "alpha",
    href: "/type",
  },
  {
    id: "placeholder-1",
    name: "Coming soon",
    description: "Still in stealth. Pre-seed, pre-product, pre-idea.",
    stage: "stealth",
  },
  {
    id: "placeholder-2",
    name: "Coming soon",
    description: "Closed beta of a closed beta. Ask me about the waitlist.",
    stage: "beta",
  },
];

/** The stage the typing app ships under, shown on its own page too. */
export const aiMonkey = highlights[0];
