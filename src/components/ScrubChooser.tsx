/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { PossibleScrubItems, defaultScrubItems } from "../lib/har_sanitize";
import { ScrubItems } from "./Sanitizer";

type ScrubChooserProps = {
	items: PossibleScrubItems;
	scrubItems: ScrubItems;
	setScrubItems: (value: ScrubItems) => void;
};

type CheckboxState = {
	cookies: boolean[];
	headers: boolean[];
	queryArgs: boolean[];
	mimeTypes: boolean[];
};

type CheckboxType = "cookies" | "headers" | "queryArgs" | "mimeTypes";

export const ScrubChooser: React.FC<ScrubChooserProps> = ({
	items,
	scrubItems,
	setScrubItems,
}) => {
	const [checkboxes, setCheckboxes] = useState<CheckboxState>({
		cookies: new Array(items.cookies.length).fill(false),
		headers: new Array(items.headers.length).fill(false),
		queryArgs: new Array(items.queryArgs.length).fill(false),
		mimeTypes: new Array(items.mimeTypes.length).fill(false),
	});

	const handleCheckboxChange = (type: CheckboxType, index: number) => {
		const newCheckboxes = { ...checkboxes };

		// Create a shallow copy of the cookies array
		const newValues: boolean[] = [...newCheckboxes[type]];

		// Toggle the value at the specified index
		newValues[index] = !newValues[index];
		const itemVal = items[type][index];

		// add the item to the scrub item array
		if (type == "mimeTypes") {
			const newScrubItems = new Set(scrubItems.mimeTypes);
			newValues[index]
				? newScrubItems.add(itemVal)
				: newScrubItems.delete(itemVal);
			setScrubItems({ mimeTypes: newScrubItems, words: scrubItems.words });
		} else {
			const newScrubItems = new Set(scrubItems.words);
			newValues[index]
				? newScrubItems.add(itemVal)
				: newScrubItems.delete(itemVal);
			setScrubItems({ mimeTypes: scrubItems.mimeTypes, words: newScrubItems });
		}

		newCheckboxes[type] = newValues;
		setCheckboxes(newCheckboxes);
	};

	useEffect(() => {
		const newCheckboxes = { ...checkboxes };
		const newScrubWords = new Set<string>();
		const newScrubMimeTypes = new Set<string>();
		for (const item of defaultScrubItems) {
			Object.entries(items).forEach(([key, val]) => {
				const index = val.indexOf(item);
				if (index >= 0) {
					//   update the value and add to scrub items
					//   @ts-ignore
					checkboxes[key][index] = true;
					key == "mimeTypes"
						? newScrubMimeTypes.add(item)
						: newScrubWords.add(item);
				}
			});
		}
		setScrubItems({ words: newScrubWords, mimeTypes: newScrubMimeTypes });
		setCheckboxes(newCheckboxes);
		// todo: figure out why typescript doesn't like this
	}, [items]);

	return (
		<div className="space-y-4">
			{/* @ts-ignore */}
			{Object.entries(items).map(([key, val]: [CheckboxType, string[]]) => {
				if (val.length === 0) return null;
				return (
					<div className="space-y-2">
						<h2>{key}</h2>
						<ul
							className="space-y-1 columns-1 md:columns-2 lg:columns-3 xl:columns-4"
							key={key}
						>
							{val.map((item, index) => {
								return (
									<li className="inline-block w-full" key={item}>
										<label className="inline-flex items-start gap-2 group">
											<input
												type="checkbox"
												className="w-4 h-4 mt-1 group-hover:outline outline-offset-2 outline-2 shrink-0"
												name={item}
												checked={checkboxes[key][index]}
												onChange={() => handleCheckboxChange(key, index)}
											/>
											<span>{item}</span>
										</label>
									</li>
								);
							})}
						</ul>
					</div>
				);
			})}
		</div>
	);
};
