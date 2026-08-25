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
  tagline: "Software Engineer | What the hell is going on",
};

/**
 * The sections of the page, in document order. Both the page and the section
 * nav read this, so a rename or reorder only has to happen here.
 */
export const SECTIONS = [
  { id: "home", label: "Intro" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "projects", label: "Projects" },
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

export interface Project {
  id: string;
  name: string;
  description: string;
}

export const projects: Project[] = [
  { id: "placeholder-1", name: "Coming soon", description: "Wait for it." },
  { id: "placeholder-2", name: "Coming soon", description: "Seriously, wait for it." },
  { id: "placeholder-3", name: "Coming soon", description: "Still waiting? Same." },
];
