import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cx(...inputs: Parameters<typeof clsx>) {
  return twMerge(clsx(inputs));
}
