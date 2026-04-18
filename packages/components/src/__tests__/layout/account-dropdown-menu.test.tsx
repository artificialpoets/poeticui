import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import { AccountDropdownMenu } from "../../layout/account-dropdown-menu";
import { Dropdown, DropdownButton } from "../../misc/dropdown";

/** Harness: DropdownMenu must live inside a `<Dropdown>` to open. */
function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <Dropdown>
      <DropdownButton>Open</DropdownButton>
      {children}
    </Dropdown>
  );
}

describe("AccountDropdownMenu", () => {
  test("renders default labels after opening the dropdown", () => {
    render(
      <Wrap>
        <AccountDropdownMenu anchor="bottom end" onSignOut={() => {}} />
      </Wrap>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByText("Account Settings")).toBeInTheDocument();
    expect(screen.getByText("Sign out")).toBeInTheDocument();
  });

  test("fires onSignOut when Sign-out item is clicked", () => {
    const onSignOut = jest.fn();
    render(
      <Wrap>
        <AccountDropdownMenu anchor="bottom end" onSignOut={onSignOut} />
      </Wrap>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    fireEvent.click(screen.getByText("Sign out"));
    expect(onSignOut).toHaveBeenCalledTimes(1);
  });

  test("respects custom labels + accountHref", () => {
    render(
      <Wrap>
        <AccountDropdownMenu
          anchor="top start"
          onSignOut={() => {}}
          accountHref="/profile"
          accountLabel="Profile"
          signOutLabel="Log out"
        />
      </Wrap>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    const profileLink = screen.getByText("Profile").closest("a");
    expect(profileLink).toHaveAttribute("href", "/profile");
    expect(screen.getByText("Log out")).toBeInTheDocument();
  });
});
