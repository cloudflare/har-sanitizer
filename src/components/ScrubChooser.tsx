/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ElementRef, useRef } from "react";
import { ScrubState, ScrubType } from "./Sanitizer";

type ScrubChooserProps = {
	scrubItems: ScrubState;
	setScrubItems: (value: ScrubState) => void;
};

const typeMap: Record<ScrubType, string> = {
	cookies: "Cookies",
	mimeTypes: "Mime Types",
	headers: "Headers",
	queryArgs: "Query String Parameters",
};

export const ScrubChooser: React.FC<ScrubChooserProps> = ({
	scrubItems,
	setScrubItems,
}) => {
	const handleCheckboxChange = (
		type: ScrubType,
		item: string,
		newVal: boolean,
		selectAllInput: HTMLInputElement,
	) => {
		const newScrubItems = { ...scrubItems };
		const newTypeItems = { ...newScrubItems[type] };
		newTypeItems[item] = newVal;
		newScrubItems[type] = newTypeItems;
		const values = Object.values(newTypeItems);
		selectAllInput.indeterminate =
			!values.every((v) => v === true) && values.some((v) => v === true);
		setScrubItems(newScrubItems);
	};

	const handleAllCheckboxChange = (type: ScrubType, newVal: boolean) => {
		const newScrubItems = { ...scrubItems };
		const newTypeItems = { ...newScrubItems[type] };
		Object.keys(newTypeItems).map((item) => (newTypeItems[item] = newVal));
		newScrubItems[type] = newTypeItems;
		setScrubItems(newScrubItems);
	};

	const ref = useRef<ElementRef<"div">>(null);

	return (
		<div className="space-y-8" ref={ref}>
			{Object.entries(scrubItems).map(
				// @ts-ignore
				([key, items]: [ScrubType, Record<string, boolean>], typeIndex) => {
					const itemKeys = Object.keys(items);
					if (itemKeys.length === 0) return null;
					const selectAllInputId = `select-all-${key}`;
					return (
						<>
							{typeIndex > 0 && (
								<hr className="border-neutral-200 dark:border-neutral-700" />
							)}
							<fieldset className="space-y-2">
								<VisuallyHidden>
									<legend>{typeMap[key]}</legend>
								</VisuallyHidden>
								<div className="flex gap-2">
									<label className="inline-grid gap-2 grid-cols-[auto_minmax(0,1fr)] hover:dark:bg-neutral-800 hover:bg-neutral-100 px-2 rounded-md">
										<input
											type="checkbox"
											className="w-4 h-4 mt-[.38em] group-hover:outline outline-offset-2 outline-2 shrink-0"
											name={`all-${key}`}
											checked={itemKeys.every((k) => items[k])}
											id={selectAllInputId}
											onChange={(e) => {
												handleAllCheckboxChange(key, e.target.checked);
											}}
										/>
										<span className="font-semibold">All {typeMap[key]}</span>
									</label>
								</div>

								<div
									className="space-y-1 columns-1 lg:columns-2 xl:columns-3"
									key={key}
								>
									{Object.entries(items).map(
										([item, val]: [string, boolean]) => {
											return (
												<div className="inline-block w-full" key={item}>
													<label className="inline-grid gap-2 grid-cols-[auto_minmax(0,1fr)] hover:dark:bg-neutral-800 hover:bg-neutral-100 px-2 rounded-md">
														<input
															type="checkbox"
															className="w-4 h-4 mt-[.20em] shrink-0"
															name={item}
															checked={val}
															onChange={() => {
																const selectAllInput =
																	ref.current?.querySelector(
																		`#${selectAllInputId}`,
																	);
																if (
																	selectAllInput instanceof HTMLInputElement
																) {
																	handleCheckboxChange(
																		key,
																		item,
																		!val,
																		selectAllInput,
																	);
																}
															}}
														/>
														<code className="font-mono text-sm leading-relaxed break-all break-word">
															{item}
														</code>
													</label>
												</div>
											);
										},
									)}
								</div>
							</fieldset>
						</>
					);
				},
			)}
		</div>
	);
};
