"use client";

import { Check, ChevronsUpDown } from "lucide-react";

import { Avatar } from "../data-display/avatar";
import { cx } from "../lib";
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownMenu,
} from "../misc/dropdown";

export interface SiteOption {
  id: string;
  name: string;
  subtitle?: React.ReactNode;
  initials?: string;
  src?: string | null;
}

export interface SiteSwitcherProps {
  /** All selectable site options. Order is preserved. */
  sites: SiteOption[];
  /** ID of the currently selected option. */
  current: string;
  /** Fires when the user picks a different option. */
  onChange: (id: string) => void;
  /**
   * Optional aggregate row pinned at the top — typically `{ id: "all", name: "All sites", subtitle: "3 sites" }`.
   * Renders above a divider so the individual sites stay visually grouped below it.
   */
  aggregate?: SiteOption;
  /** Hides the trigger's avatar (label-only trigger). */
  hideAvatar?: boolean;
  className?: string;
}

/**
 * SiteSwitcher — dropdown for switching among N owned sites/tenants/workspaces.
 *
 * Composes `Dropdown` + `Avatar` to give a consistent trigger/menu pair for any
 * multi-site SaaS surface. Each option carries an optional `subtitle` (domain,
 * site count, etc.) and an optional avatar source/initials.
 *
 * ```tsx
 * <SiteSwitcher
 *   aggregate={{ id: "all", name: "All sites", subtitle: "3 sites" }}
 *   sites={[
 *     { id: "midnight", name: "Midnight Pantry", subtitle: "midnightpantry.co", initials: "MP" },
 *     { id: "tollgate", name: "Tollgate", subtitle: "tollgate.co", initials: "TG" },
 *   ]}
 *   current="all"
 *   onChange={setCurrent}
 * />
 * ```
 */
export function SiteSwitcher({
  sites,
  current,
  onChange,
  aggregate,
  hideAvatar = false,
  className,
}: SiteSwitcherProps) {
  const all = aggregate ? [aggregate, ...sites] : sites;
  const active = all.find((s) => s.id === current) ?? all[0];

  return (
    <Dropdown>
      <DropdownButton
        as="button"
        className={cx(
          "group inline-flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2 text-left text-sm transition hover:bg-muted",
          "focus:outline-none focus:ring-2 focus:ring-ring",
          className,
        )}
        data-slot="site-switcher-trigger"
      >
        {!hideAvatar ? (
          <Avatar
            initials={active.initials ?? active.name.slice(0, 2).toUpperCase()}
            src={active.src}
            className="size-7 shrink-0"
          />
        ) : null}
        <div className="flex min-w-0 flex-1 flex-col leading-tight">
          <span className="truncate font-medium text-foreground">
            {active.name}
          </span>
          {active.subtitle ? (
            <span className="truncate text-xs text-muted-foreground">
              {active.subtitle}
            </span>
          ) : null}
        </div>
        <ChevronsUpDown
          className="size-4 shrink-0 text-muted-foreground transition group-hover:text-foreground"
          aria-hidden
        />
      </DropdownButton>

      <DropdownMenu className="min-w-(--button-width)" anchor="bottom start">
        {aggregate ? (
          <>
            <SiteRow
              option={aggregate}
              active={current === aggregate.id}
              onPick={onChange}
            />
            <DropdownDivider />
          </>
        ) : null}
        {sites.map((s) => (
          <SiteRow
            key={s.id}
            option={s}
            active={current === s.id}
            onPick={onChange}
          />
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}

function SiteRow({
  option,
  active,
  onPick,
}: {
  option: SiteOption;
  active: boolean;
  onPick: (id: string) => void;
}) {
  return (
    <DropdownItem
      onClick={() => onPick(option.id)}
      data-slot="site-switcher-item"
    >
      <Avatar
        initials={option.initials ?? option.name.slice(0, 2).toUpperCase()}
        src={option.src}
        className="size-6 shrink-0"
      />
      <div className="flex min-w-0 flex-1 flex-col leading-tight">
        <span className="truncate text-sm font-medium text-foreground">
          {option.name}
        </span>
        {option.subtitle ? (
          <span className="truncate text-xs text-muted-foreground">
            {option.subtitle}
          </span>
        ) : null}
      </div>
      {active ? <Check className="size-4 text-foreground" aria-hidden /> : null}
    </DropdownItem>
  );
}
