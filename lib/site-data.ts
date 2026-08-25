export const EMAIL = "nandhasundar@gmail.com";
export const LINKEDIN_URL = "https://www.linkedin.com/in/nandha-sundaravadivel/";
export const AGENTFORCE_URL = "https://www.salesforce.com/agentforce/coworker/";

/** Stable URL where the markdown rendering of this page lives. */
export const MARKDOWN_PATH = "/llms.txt";

export const profile = {
  name: "Nandha Sundaravadivel",
  tagline:
    "A short placeholder tagline goes here: what you do, or what you care about.",
};

export const currentRole = {
  company: "Salesforce",
  date: "January 2025 to Present",
  summary: "Currently building Agentforce Coworker.",
  link: { label: "Agentforce Coworker", url: AGENTFORCE_URL },
};

export interface Internship {
  company: string;
  date: string;
  /** Brand color used for the icon chip; omitted when the logo carries its own color. */
  color?: string;
}

export const internships: Internship[] = [
  { company: "Salesforce", date: "Summer 2023 & Summer 2024", color: "#00A1E0" },
  { company: "HubSpot", date: "Fall 2022", color: "#FF7A59" },
  { company: "Amazon", date: "Summer 2022", color: "#CC7A00" },
  { company: "UKG", date: "Fall 2021" },
];

export interface Education {
  school: string;
  degree: string;
  years: string;
}

export const education: Education[] = [
  {
    school: "Georgia Institute of Technology",
    degree: "B.S. in Computer Science",
    years: "2020 to 2023",
  },
  {
    school: "Georgia Institute of Technology",
    degree: "M.S. in Computer Science",
    years: "2024",
  },
];

export interface Project {
  name: string;
  description: string;
}

export const projects: Project[] = [
  {
    name: "Coming soon",
    description: "Wait for it.",
  },
  {
    name: "Coming soon",
    description: "Seriously, wait for it.",
  },
  {
    name: "Coming soon",
    description: "Still waiting? Same.",
  },
];
