"use client";

import * as Headless from "@headlessui/react";
import type React from "react";

export function DrawerShell({
  open,
  onClose,
  title,
  children,
}: React.PropsWithChildren<{
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
}>) {
  return (
    <Headless.Dialog open={open} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-overlay backdrop-blur-sm"
        aria-hidden="true"
      />
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <Headless.DialogPanel className="pointer-events-auto w-screen max-w-md">
              <div className="flex h-full flex-col overflow-y-auto bg-card shadow-xl">
                {title ? (
                  // DialogTitle names the dialog for screen readers.
                  <Headless.DialogTitle
                    as="div"
                    className="border-b border-border px-6 py-4"
                  >
                    {title}
                  </Headless.DialogTitle>
                ) : null}
                {children}
              </div>
            </Headless.DialogPanel>
          </div>
        </div>
      </div>
    </Headless.Dialog>
  );
}
