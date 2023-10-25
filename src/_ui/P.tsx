import { ComponentProps, ElementRef, forwardRef } from "react";
import { cn } from "../lib/cn";

export const P = forwardRef<ElementRef<"p">, ComponentProps<"p">>(
	({ className, ...rest }, ref) => (
		<p
			className={cn("text-neutral-700 dark:text-neutral-300", className)}
			{...rest}
			ref={ref}
		/>
	),
);
