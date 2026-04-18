/**
 * @deprecated The Alert family has been consolidated into the Dialog family
 * with `variant="alert"`. These exports are thin aliases kept for one release
 * of backward compatibility. Migrate to:
 *
 *   <Alert>            →  <Dialog variant="alert">
 *   <AlertTitle>       →  <DialogTitle>
 *   <AlertDescription> →  <DialogDescription>
 *   <AlertBody>        →  <DialogBody>
 *   <AlertActions>     →  <DialogActions>
 *
 * See `packages/ui/src/feedback/dialog.tsx` and DES-27 for rationale.
 */

import type * as Headless from "@headlessui/react";
import * as React from "react";

import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
  type DialogVariant,
  type DialogSize,
} from "./dialog";

/**
 * @deprecated Use `<Dialog variant="alert">` instead.
 */
export function Alert(
  props: {
    size?: DialogSize;
    className?: string;
    children: React.ReactNode;
  } & Omit<Headless.DialogProps, "as" | "className">,
) {
  const alertVariant: DialogVariant = "alert";
  return <Dialog variant={alertVariant} {...props} />;
}

/** @deprecated Use `DialogTitle` from `@poeticui/components/feedback`. */
export const AlertTitle = DialogTitle;

/** @deprecated Use `DialogDescription` from `@poeticui/components/feedback`. */
export const AlertDescription = DialogDescription;

/** @deprecated Use `DialogBody` from `@poeticui/components/feedback`. */
export const AlertBody = DialogBody;

/** @deprecated Use `DialogActions` from `@poeticui/components/feedback`. */
export const AlertActions = DialogActions;
