"use client";

import { SidebarLayout } from "./sidebar-layout";
import { Navbar, NavbarSection, NavbarSpacer } from "../navigation/navbar";
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
} from "../navigation/sidebar";

/**
 * AppShell — opinionated convenience wrapper around `SidebarLayout`.
 *
 * Wires up the common dashboard shape (brand header → nav sections → user
 * footer → avatar navbar) from slot-shaped props. Every part is overridable,
 * but the defaults collapse four route-group layouts that used to each ship
 * ~130–500 LOC down to <80 LOC of pure configuration.
 *
 * ```tsx
 * <AppShell
 *   sidebarHeader={<SidebarBrandBadge label="PH" name="PoeHost" />}
 *   sidebarSections={<IntranetNav pathname={pathname} />}
 *   sidebarFooter={
 *     <SidebarUserChip avatar={{ src }} name={user.name} subtitle="PoeHost">
 *       <AccountDropdownMenu anchor="top start" onSignOut={handleSignOut} />
 *     </SidebarUserChip>
 *   }
 *   navbarRight={
 *     <NavbarAvatarDropdown avatar={{ src }}>
 *       <AccountDropdownMenu anchor="bottom end" onSignOut={handleSignOut} />
 *     </NavbarAvatarDropdown>
 *   }
 * >
 *   {children}
 * </AppShell>
 * ```
 *
 * For full control of the navbar (e.g. search bar + avatar), pass `navbar`
 * instead of `navbarRight`. For additional sticky content above the navbar
 * (e.g. a tab bar), pass `topContent` — see `SidebarLayout`.
 */
export function AppShell({
  sidebarHeader,
  sidebarSections,
  sidebarFooter,
  sidebarHeaderClassName = "p-2 sm:p-2.5",
  sidebarFooterClassName = "max-lg:hidden p-2 sm:p-2.5",
  navbar,
  navbarRight,
  topContent,
  children,
}: {
  /** Content for the sidebar's header slot (brand badge or org switcher). */
  sidebarHeader: React.ReactNode;
  /** Navigation sections rendered inside `<SidebarBody>`. */
  sidebarSections: React.ReactNode;
  /** Footer content (typically `<SidebarUserChip>`). */
  sidebarFooter: React.ReactNode;
  /** Override the `SidebarHeader` className. */
  sidebarHeaderClassName?: string;
  /** Override the `SidebarFooter` className. */
  sidebarFooterClassName?: string;
  /** Full navbar override. When provided, `navbarRight` is ignored. */
  navbar?: React.ReactNode;
  /** Right-aligned navbar content (typically `<NavbarAvatarDropdown>`). */
  navbarRight?: React.ReactNode;
  /** Sticky content rendered above the navbar (e.g. a tab bar). */
  topContent?: React.ReactNode;
  children: React.ReactNode;
}) {
  const resolvedNavbar = navbar ?? (
    <Navbar>
      <NavbarSpacer />
      {navbarRight && <NavbarSection>{navbarRight}</NavbarSection>}
    </Navbar>
  );

  return (
    <SidebarLayout
      topContent={topContent}
      navbar={resolvedNavbar}
      sidebar={
        <Sidebar>
          <SidebarHeader className={sidebarHeaderClassName}>
            {sidebarHeader}
          </SidebarHeader>
          <SidebarBody>{sidebarSections}</SidebarBody>
          <SidebarFooter className={sidebarFooterClassName}>
            {sidebarFooter}
          </SidebarFooter>
        </Sidebar>
      }
    >
      {children}
    </SidebarLayout>
  );
}
