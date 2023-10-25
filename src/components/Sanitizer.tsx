import { useEffect, useState } from "react";
import { Button } from "../_ui/Button";
import { defaultScrubItems, getHarInfo, sanitize } from "../lib/har_sanitize";
import { DownloadHar } from "./DownloadHar";
import { ScrubChooser } from "./ScrubChooser";

type SanitizerProps = {
	input: string;
	name: string;
};

export type ScrubItems = {
	words: Set<string>;
	mimeTypes: Set<string>;
};

const defaulScrubState: ScrubState = {
	cookies: {},
	headers: {},
	queryArgs: {},
	mimeTypes: {},
};

export type ScrubState = Record<ScrubType, Record<string, boolean>>;
export type ScrubType = "cookies" | "headers" | "queryArgs" | "mimeTypes";

function getScrubableItems(input: string): ScrubState {
	const rawItems = getHarInfo(input);
	const output = { ...defaulScrubState };
	Object.entries(rawItems).map(([key, items]: [string, string[]]) => {
		output[key as ScrubType] = items.reduce(
			(acc, curr) => {
				acc[curr] = defaultScrubItems.includes(curr);
				return acc;
			},
			{} as Record<string, boolean>,
		);
	});
	return output;
}

export const Sanitizer: React.FC<SanitizerProps> = ({
	input = "",
	name = "",
}) => {
	const [sanitizedHar, setSanitizedHar] = useState<string>("");
	const [scrubItems, setScrubItems] = useState<ScrubState>(defaulScrubState);

	const sanitizeHar = () => {
		const words = new Set<string>();
		Object.entries(scrubItems.cookies).map(([key, val]) => {
			if (val) words.add(key);
		});
		Object.entries(scrubItems.headers).map(([key, val]) => {
			if (val) words.add(key);
		});
		Object.entries(scrubItems.queryArgs).map(([key, val]) => {
			if (val) words.add(key);
		});

		const mimeTypes = new Set<string>();
		Object.entries(scrubItems.mimeTypes).map(([key, val]) => {
			if (val) mimeTypes.add(key);
		});
		setSanitizedHar(sanitize(input, [...words], [...mimeTypes]));
	};

	useEffect(() => {
		setScrubItems(getScrubableItems(input));
	}, [input]);

	return (
		<>
			{scrubItems && (
				<ScrubChooser
					scrubItems={scrubItems}
					setScrubItems={setScrubItems}
				></ScrubChooser>
			)}
			<div>
				<Button onClick={sanitizeHar}>Sanitize</Button>
			</div>
			{sanitizedHar && <DownloadHar har={sanitizedHar} name={name} />}
		</>
	);
};
