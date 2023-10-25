/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
	) => {
		const newScrubItems = { ...scrubItems };
		const newTypeItems = { ...newScrubItems[type] };
		newTypeItems[item] = newVal;
		newScrubItems[type] = newTypeItems;
		setScrubItems(newScrubItems);
	};

	return (
		<div className="space-y-8">
			{Object.entries(scrubItems).map(
				// @ts-ignore
				([key, items]: [ScrubType, Record<string, boolean>], typeIndex) => {
					if (Object.keys(items).length === 0) return null;
					return (
						<>
							{typeIndex > 0 && (
								<hr className="border-neutral-200 dark:border-neutral-700" />
							)}
							<div className="space-y-2">
								<h2 className="font-medium">{typeMap[key]}</h2>
								<ul
									className="space-y-1 columns-1 md:columns-2 lg:columns-3 xl:columns-4"
									key={key}
								>
									{Object.entries(items).map(
										([item, val]: [string, boolean]) => {
											return (
												<li className="inline-block w-full" key={item}>
													<label className="inline-grid gap-2 grid-cols-[auto_minmax(0,1fr)] hover:dark:bg-neutral-800 hover:bg-neutral-100 px-2 rounded-md">
														<input
															type="checkbox"
															className="w-4 h-4 mt-[.38em] shrink-0"
															name={item}
															checked={val}
															onChange={() =>
																handleCheckboxChange(key, item, !val)
															}
														/>
														<span className="break-all break-word">{item}</span>
													</label>
												</li>
											);
										},
									)}
								</ul>
							</div>
						</>
					);
				},
			)}
		</div>
	);
};
