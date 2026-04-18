"use client";

import { Avatar } from "../data-display/avatar";
import { Dropdown, DropdownButton } from "../misc/dropdown";
import { NavbarItem } from "../navigation/navbar";

/**
 * NavbarAvatarDropdown — user avatar button on the right of the navbar.
 *
 * Opens a Dropdown anchored beneath the avatar. Pass the menu content as
 * `children` — typically `<AccountDropdownMenu anchor="bottom end" />`.
 *
 * ```tsx
 * <Navbar>
 *   <NavbarSpacer />
 *   <NavbarSection>
 *     <NavbarAvatarDropdown avatar={{ src: user.avatar, alt: user.name }}>
 *       <AccountDropdownMenu anchor="bottom end" onSignOut={handleSignOut} />
 *     </NavbarAvatarDropdown>
 *   </NavbarSection>
 * </Navbar>
 * ```
 */
export function NavbarAvatarDropdown({
  avatar,
  children,
}: {
  avatar: { src?: string; alt?: string; initials?: string };
  /** Dropdown menu body — usually `<AccountDropdownMenu>`. */
  children: React.ReactNode;
}) {
  return (
    <Dropdown>
      <DropdownButton as={NavbarItem}>
        <Avatar
          src={avatar.src}
          initials={avatar.initials}
          alt={avatar.alt}
          noRadius
        />
      </DropdownButton>
      {children}
    </Dropdown>
  );
}
