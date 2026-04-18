"use client";

import { ChevronUp } from "lucide-react";

import { Avatar } from "../data-display/avatar";
import { cx } from "../lib";
import { Dropdown, DropdownButton } from "../misc/dropdown";
import { SidebarItem } from "../navigation/sidebar";

/**
 * SidebarUserChip — avatar + name + subtitle + chevron, as a Dropdown trigger.
 *
 * Typically placed inside `<SidebarFooter>`. The `children` slot receives the
 * dropdown menu body (e.g. `<AccountDropdownMenu anchor="top start" />`).
 *
 * ```tsx
 * <SidebarFooter>
 *   <SidebarUserChip
 *     avatar={{ src: user.avatar, alt: user.name }}
 *     name={user.name}
 *     subtitle="PoeHost"
 *   >
 *     <AccountDropdownMenu anchor="top start" onSignOut={handleSignOut} />
 *   </SidebarUserChip>
 * </SidebarFooter>
 * ```
 */
export function SidebarUserChip({
  avatar,
  name,
  subtitle,
  className,
  children,
}: {
  avatar: { src?: string; alt?: string; initials?: string };
  /** Primary line — typically the user's display name. */
  name: React.ReactNode;
  /** Secondary line — typically the brand name or role label. */
  subtitle?: React.ReactNode;
  className?: string;
  /** Dropdown menu body — usually `<AccountDropdownMenu>`. */
  children: React.ReactNode;
}) {
  return (
    <Dropdown>
      <DropdownButton
        as={SidebarItem}
        className={cx(
          "gap-2 rounded-md px-1.5 py-1 sm:gap-2 sm:px-2 sm:py-1.5",
          className,
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          <Avatar
            src={avatar.src}
            initials={avatar.initials}
            className="size-10"
            noRadius
            alt={avatar.alt}
          />
          <span className="min-w-0">
            <span className="block truncate text-sm/5 font-medium text-foreground">
              {name}
            </span>
            {subtitle && (
              <span className="block truncate text-xs/5 font-normal text-muted-foreground">
                {subtitle}
              </span>
            )}
          </span>
        </span>
        <ChevronUp data-slot="icon" />
      </DropdownButton>
      {children}
    </Dropdown>
  );
}
