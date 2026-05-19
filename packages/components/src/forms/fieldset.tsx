import * as Headless from "@headlessui/react";
import clsx from "clsx";
import type React from "react";

/**
 * Top-level wrapper for a related group of form controls. Provides ARIA
 * grouping via HeadlessUI's `Fieldset`. Inter-slot spacing is handled
 * automatically via `data-slot` selectors on its children.
 *
 * @example
 * <Fieldset>
 *   <Legend>Shipping</Legend>
 *   <Text>Where do we send it?</Text>
 *   <FieldGroup>
 *     <Field>
 *       <Label>Street</Label>
 *       <Input name="street" />
 *     </Field>
 *   </FieldGroup>
 * </Fieldset>
 */
export function Fieldset({
  className,
  ...props
}: { className?: string } & Omit<Headless.FieldsetProps, "as" | "className">) {
  return (
    <Headless.Fieldset
      data-component="fieldset"
      {...props}
      className={clsx(
        className,
        "*:data-[slot=text]:mt-1 [&>*+[data-slot=control]]:mt-6",
      )}
    />
  );
}

/**
 * Title of a {@link Fieldset}. Wraps `<legend>`. Wires `aria-labelledby` for
 * the fieldset automatically via HeadlessUI context.
 *
 * @example <Legend>Shipping</Legend>
 */
export function Legend({
  className,
  ...props
}: { className?: string } & Omit<Headless.LegendProps, "as" | "className">) {
  return (
    <Headless.Legend
      data-component="legend"
      data-slot="legend"
      {...props}
      className={clsx(
        className,
        "text-base/6 font-semibold text-foreground data-disabled:opacity-50 sm:text-sm/6",
      )}
    />
  );
}

/**
 * Vertical container for {@link Field} elements within a {@link Fieldset}.
 * Inserts 2rem spacing between fields.
 *
 * @example
 * <FieldGroup>
 *   <Field>...</Field>
 *   <Field>...</Field>
 * </FieldGroup>
 */
export function FieldGroup({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-component="field-group"
      data-slot="control"
      {...props}
      className={clsx(className, "space-y-8")}
    />
  );
}

/**
 * One labelled control. The Fieldset family's atomic unit. Compose with
 * {@link Label}, {@link Input} (or other input primitive), {@link Description},
 * and {@link ErrorMessage}. ARIA wiring (`aria-labelledby`,
 * `aria-describedby`, `aria-invalid`, `aria-errormessage`) is automatic.
 *
 * @example
 * <Field>
 *   <Label>Email</Label>
 *   <Input name="email" type="email" />
 *   <Description>We'll send a magic link.</Description>
 * </Field>
 */
export function Field({
  className,
  ...props
}: { className?: string } & Omit<Headless.FieldProps, "as" | "className">) {
  return (
    <Headless.Field
      data-component="field"
      {...props}
      className={clsx(
        className,
        "[&>[data-slot=label]+[data-slot=control]]:mt-3",
        "[&>[data-slot=label]+[data-slot=description]]:mt-1",
        "[&>[data-slot=description]+[data-slot=control]]:mt-3",
        "[&>[data-slot=control]+[data-slot=description]]:mt-3",
        "[&>[data-slot=control]+[data-slot=error]]:mt-3",
        "*:data-[slot=label]:font-medium",
      )}
    />
  );
}

/**
 * Label for a {@link Field}. Wraps `<label>`; the `for` attribute is wired
 * automatically via HeadlessUI's Field context.
 *
 * @example <Label>Email</Label>
 */
export function Label({
  className,
  ...props
}: { className?: string } & Omit<Headless.LabelProps, "as" | "className">) {
  return (
    <Headless.Label
      data-component="label"
      data-slot="label"
      {...props}
      className={clsx(
        className,
        "text-base/6 text-foreground select-none data-disabled:opacity-50 sm:text-sm/6",
      )}
    />
  );
}

/**
 * Helper text under a {@link Label}. Becomes the field's
 * `aria-describedby` target.
 *
 * @example <Description>We'll send a magic link.</Description>
 */
export function Description({
  className,
  ...props
}: { className?: string } & Omit<
  Headless.DescriptionProps,
  "as" | "className"
>) {
  return (
    <Headless.Description
      data-component="description"
      data-slot="description"
      {...props}
      className={clsx(
        className,
        "text-base/6 text-muted-foreground data-disabled:opacity-50 sm:text-sm/6",
      )}
    />
  );
}

/**
 * Validation error text under a {@link Field}'s control. Becomes the field's
 * `aria-errormessage`. Visually red in both light and dark.
 *
 * @example <ErrorMessage>Email is required.</ErrorMessage>
 */
export function ErrorMessage({
  className,
  ...props
}: { className?: string } & Omit<
  Headless.DescriptionProps,
  "as" | "className"
>) {
  return (
    <Headless.Description
      data-component="error-message"
      data-slot="error"
      {...props}
      className={clsx(
        className,
        "text-base/6 text-red-600 data-disabled:opacity-50 sm:text-sm/6 dark:text-red-500",
      )}
    />
  );
}
