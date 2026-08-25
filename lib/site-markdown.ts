import {
  EMAIL,
  LINKEDIN_URL,
  currentRole,
  education,
  internships,
  profile,
  projects,
} from "@/lib/site-data";

/**
 * Renders the whole site as a single markdown document, the agent-facing view.
 * Built from the same data the human-facing page renders, so the two cannot drift.
 */
export function siteMarkdown(): string {
  const lines: string[] = [];

  lines.push(`# ${profile.name}`);
  lines.push("");
  lines.push(`> ${profile.tagline}`);
  lines.push("");

  lines.push("## Professional Experience");
  lines.push("");
  lines.push(`### ${currentRole.company} (current)`);
  lines.push("");
  lines.push(`- **Dates:** ${currentRole.date}`);
  lines.push(
    `- **Working on:** [${currentRole.link.label}](${currentRole.link.url})`
  );
  lines.push("");
  lines.push("### Internships");
  lines.push("");
  lines.push("| Company | When |");
  lines.push("| --- | --- |");
  for (const internship of internships) {
    lines.push(`| ${internship.company} | ${internship.date} |`);
  }
  lines.push("");

  lines.push("## Education");
  lines.push("");
  for (const entry of education) {
    lines.push(`- **${entry.school}**: ${entry.degree} · ${entry.years}`);
  }
  lines.push("");

  lines.push("## Projects");
  lines.push("");
  for (const project of projects) {
    lines.push(`- **${project.name}**: ${project.description}`);
  }
  lines.push("");

  lines.push("## Contact");
  lines.push("");
  lines.push(`- Email: [${EMAIL}](mailto:${EMAIL})`);
  lines.push(`- LinkedIn: [${LINKEDIN_URL}](${LINKEDIN_URL})`);
  lines.push("");

  return lines.join("\n");
}
