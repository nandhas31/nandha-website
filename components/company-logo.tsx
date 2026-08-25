import type { ReactNode } from "react";

import { AmazonIcon } from "@/components/icons/amazon";
import { HubspotIcon } from "@/components/icons/hubspot";
import { SalesforceIcon } from "@/components/icons/salesforce";
import { UkgLogo } from "@/components/icons/ukg";
import type { Company, Role } from "@/lib/site-data";
import { cn } from "@/lib/utils";

/**
 * Every company we have a mark for. Typing the key as `Company` means adding a
 * company to `site-data` without a logo is a compile error, not a blank card.
 */
const LOGOS: Record<Company, (props: { className?: string }) => ReactNode> = {
  Salesforce: SalesforceIcon,
  HubSpot: HubspotIcon,
  Amazon: AmazonIcon,
  UKG: UkgLogo,
};

/**
 * A company mark, wrapped in a tinted circle when the brand has a color.
 * Logos that carry their own colors (UKG) are rendered bare.
 */
export function CompanyLogo({
  role,
  size = "sm",
}: {
  role: Role;
  size?: "sm" | "lg";
}) {
  const Logo = LOGOS[role.company];
  const chip = size === "lg" ? "size-14" : "size-10";
  const icon = size === "lg" ? "size-7" : "size-5";

  if (!role.color) {
    return <Logo className={size === "lg" ? "h-8 w-auto" : "h-6 w-auto"} />;
  }

  return (
    <div
      className={cn("flex shrink-0 items-center justify-center rounded-full", chip)}
      style={{ backgroundColor: `${role.color}1A`, color: role.color }}
    >
      <Logo className={icon} />
    </div>
  );
}
