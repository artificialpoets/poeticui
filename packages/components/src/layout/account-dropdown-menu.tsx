"use client";

import { CircleUser, LogOut } from "lucide-react";

import {
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from "../misc/dropdown";

/**
 * AccountDropdownMenu — canonical "Account Settings / Sign out" menu.
 *
 * Identical body shared by every dashboard shell in the monorepo. Place
 * inside a `<Dropdown>` anchored to either a navbar avatar (`anchor="bottom
 * end"`) or a sidebar user chip (`anchor="top start"`).
 *
 * Auth is injected via `onSignOut` so this component stays auth-agnostic —
 * the consumer owns the redirect + store-clearing logic.
 *
 * ```tsx
 * <Dropdown>
 *   <DropdownButton as={NavbarItem}><Avatar src={user.avatar} /></DropdownButton>
 *   <AccountDropdownMenu anchor="bottom end" onSignOut={handleSignOut} />
 * </Dropdown>
 * ```
 */
export function AccountDropdownMenu({
  anchor,
  onSignOut,
  accountHref = "/account/settings",
  accountLabel = "Account Settings",
  signOutLabel = "Sign out",
  className = "min-w-64",
}: {
  anchor: "top start" | "bottom end";
  onSignOut: () => void;
  /** Link target for the Account Settings item. Default: "/account/settings". */
  accountHref?: string;
  /** Label for the Account Settings item. Default: "Account Settings". */
  accountLabel?: string;
  /** Label for the Sign Out item. Default: "Sign out". */
  signOutLabel?: string;
  className?: string;
}) {
  return (
    <DropdownMenu className={className} anchor={anchor}>
      <DropdownItem href={accountHref}>
        <CircleUser data-slot="icon" />
        <DropdownLabel>{accountLabel}</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem onClick={onSignOut}>
        <LogOut data-slot="icon" />
        <DropdownLabel>{signOutLabel}</DropdownLabel>
      </DropdownItem>
    </DropdownMenu>
  );
}
