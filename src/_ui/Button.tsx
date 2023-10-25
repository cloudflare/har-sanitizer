import { ComponentProps, ElementRef, forwardRef } from "react";
import { cn } from "../lib/cn";

export const Button = forwardRef<
	ElementRef<"button">,
	ComponentProps<"button">
>(({ className, ...rest }, ref) => (
	<button
		className={cn(
			"rounded-lg px-5 py-2 font-medium cursor-pointer text-neutral-50 bg-neutral-600 hover:bg-neutral-800 ",
			"dark:bg-neutral-400 dark:hover:bg-neutral-200 dark:text-neutral-900 transition-colors focus-visible:outline-4",
			className,
		)}
		{...rest}
		ref={ref}
	/>
));
