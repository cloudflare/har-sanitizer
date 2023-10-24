import { forwardRef, ElementRef, ComponentProps } from "react";
import { cn } from "../lib/cn";

export const Button = forwardRef<
  ElementRef<"button">,
  ComponentProps<"button">
>(({ className, ...rest }, ref) => (
  <button
    className={cn(
      "rounded-lg px-5 py-2 font-medium cursor-pointer text-stone-50 bg-stone-600 hover:bg-stone-800 ",
      "dark:bg-stone-400 dark:hover:bg-stone-200 dark:text-stone-900 transition-colors focus-visible:outline-4",
      className
    )}
    {...rest}
    ref={ref}
  />
));
