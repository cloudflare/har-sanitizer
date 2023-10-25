import { ComponentProps, ElementRef, forwardRef } from "react";
import { cn } from "../lib/cn";

export const ErrorMessage = forwardRef<ElementRef<"p">, ComponentProps<"p">>(
	({ className, ...rest }, ref) => (
		<p
			className={cn("text-red-700 dark:text-red-500", className)}
			{...rest}
			ref={ref}
		/>
	),
);
