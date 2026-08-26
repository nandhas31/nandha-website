import {
  EMAIL,
  LINKEDIN_URL,
  currentRole,
  education,
  internships,
  profile,
  highlights,
} from "@/lib/site-data";

/** Joins blocks with a blank line between them, the way markdown wants. */
function blocks(...parts: string[]): string {
  return parts.join("\n\n");
}

function experienceBlock(): string {
  const workingOn = currentRole.link
    ? `\n- **Working on:** [${currentRole.link.label}](${currentRole.link.url})`
    : "";

  return blocks(
    "## Professional Experience",
    `### ${currentRole.company} (current)`,
    `- **Dates:** ${currentRole.date}${workingOn}`,
    "### Internships",
    [
      "| Company | When |",
      "| --- | --- |",
      ...internships.map((role) => `| ${role.company} | ${role.date} |`),
    ].join("\n")
  );
}

/**
 * Renders the whole site as a single markdown document, the agent-facing view.
 * Built from the same data the human-facing page renders, so the two cannot drift.
 */
export function siteMarkdown(): string {
  return (
    blocks(
      `# ${profile.name}`,
      `> ${profile.tagline}`,
      experienceBlock(),
      blocks(
        "## Education",
        education
          .map((entry) => `- **${entry.school}**: ${entry.degree} · ${entry.years}`)
          .join("\n")
      ),
      blocks(
        "## Highlights",
        highlights
          .map((highlight) => {
            const name = highlight.href
              ? `[${highlight.name}](${highlight.href})`
              : highlight.name;
            const stage = highlight.stage ? ` _(${highlight.stage})_` : "";
            return `- **${name}**${stage}: ${highlight.description}`;
          })
          .join("\n")
      ),
      blocks(
        "## Contact",
        [
          `- Email: [${EMAIL}](mailto:${EMAIL})`,
          `- LinkedIn: [${LINKEDIN_URL}](${LINKEDIN_URL})`,
        ].join("\n")
      )
    ) + "\n"
  );
}
