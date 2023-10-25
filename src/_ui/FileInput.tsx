import * as Portal from "@radix-ui/react-portal";

import {
	ComponentProps,
	ElementRef,
	forwardRef,
	useEffect,
	useRef,
	useState,
} from "react";
import { cn } from "../lib/cn";

export const FileInput = forwardRef<
	ElementRef<"input">,
	Omit<ComponentProps<"input">, "type" | "onChange"> & {
		onFileChange: (file: File) => void;
	}
>(({ className, onFileChange, ...rest }, externalRef) => {
	const [isDragging, setIsDragging] = useState(false);
	const internalRef = useRef<ElementRef<"input">>(null);

	useEffect(() => {
		if (!externalRef) return;
		if (typeof externalRef === "function") {
			externalRef(internalRef.current);
		} else {
			externalRef.current = internalRef.current;
		}
	});

	useEffect(() => {
		const dragoverHandler = (e: DragEvent) => {
			e.preventDefault();
			setIsDragging(true);
		};

		const dragEndHandler = () => {
			setIsDragging(false);
		};

		document.addEventListener("dragover", dragoverHandler);
		document.addEventListener("dragend", dragEndHandler);
		document.addEventListener("dragleave", dragEndHandler);

		return () => {
			document.removeEventListener("dragover", dragoverHandler);
			document.removeEventListener("dragend", dragEndHandler);
			document.removeEventListener("dragleave", dragEndHandler);
		};
	}, []);

	return (
		<>
			<input
				placeholder="Select File"
				onChange={(e) => {
					const file = e.target.files?.[0];
					if (file && onFileChange) {
						onFileChange(file);
					}
				}}
				className={cn(
					"rounded-2xl p-4 cursor-pointer transition-colors",
					"bg-neutral-200 hover:bg-neutral-300",
					"dark:bg-neutral-700 dark:hover:bg-neutral-600",
					isDragging && "bg-neutral-300",
					"file:rounded-lg file:px-5 file:py-2 file:font-medium file:cursor-pointer file:text-neutral-50 file:bg-neutral-600 file:hover:bg-neutral-800 file:mr-4 ",
					"file:dark:bg-neutral-400 file:dark:hover:bg-neutral-200 file:dark:text-neutral-900 file:transition-colors file:focus-visible:outline-4 file:border-none",
					className,
				)}
				type="file"
				{...rest}
				ref={internalRef}
			/>
			{isDragging && (
				<Portal.Root
					onDrop={(e) => {
						e.preventDefault();
						e.stopPropagation();
						setIsDragging(false);
						if (e.dataTransfer?.files && internalRef.current) {
							internalRef.current.files = e.dataTransfer.files;
							onFileChange && onFileChange(e.dataTransfer.files[0]);
						}
					}}
					className="fixed inset-0 outline-2 outline-dashed outline-orange-400 -outline-offset-8"
				></Portal.Root>
			)}
		</>
	);
});
