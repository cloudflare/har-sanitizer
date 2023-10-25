import { ComponentProps, ElementRef, forwardRef } from "react";
import { cn } from "../lib/cn";

export const A = forwardRef<ElementRef<"a">, ComponentProps<"a">>(
	({ className, ...rest }, ref) => (
		<a
			className={cn(
				"text-blue-700 hover:text-blue-900",
				"dark:text-blue-400 dark:hover:text-blue-200",
				"underline transition-colors",
				className,
			)}
			{...rest}
			ref={ref}
		/>
	),
);
