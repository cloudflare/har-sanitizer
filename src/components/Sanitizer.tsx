import { useEffect, useState } from "react";
import invariant from "tiny-invariant";
import { Button } from "../_ui/Button";
import { P } from "../_ui/P";
import { downloadFile } from "../lib/downloadFile";
import { defaultScrubItems, getHarInfo, sanitize } from "../lib/har_sanitize";
import { ErrorMessage } from "./ErrorMessage";
import { ScrubChooser } from "./ScrubChooser";
import { HARUpload, UploadHar } from "./UploadHar";

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

export const Sanitizer = () => {
	const [upload, setUpload] = useState<HARUpload>();
	const [scrubItems, setScrubItems] = useState<ScrubState>(defaulScrubState);
	const [sanitizedHarError, setSanitizedHarError] = useState<string>();

	const sanitizeHar = (input: string) => {
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
		return sanitize(input, [...words], [...mimeTypes]);
	};

	useEffect(() => {
		if (upload?.raw) setScrubItems(getScrubableItems(upload?.raw));
	}, [upload?.raw]);

	return (
		<div className="space-y-8">
			<UploadHar setUpload={setUpload} />
			{scrubItems && upload && (
				<>
					<div className="flex flex-wrap-reverse items-baseline justify-between gap-8">
						<P>
							Select which elements you would like sanitized from the HAR file:
						</P>
						<Button
							onClick={() => {
								const newName = `redacted_${upload.name}`;
								const sanitizedHar = sanitizeHar(upload.raw);
								try {
									JSON.parse(sanitizedHar);
									downloadFile(sanitizedHar, newName);
								} catch (e: unknown) {
									invariant(e instanceof Error);
									setSanitizedHarError(e.toString());
								}
							}}
						>
							Download Sanitized HAR
						</Button>
						{sanitizedHarError && (
							<ErrorMessage>{sanitizedHarError}</ErrorMessage>
						)}
					</div>
					<ScrubChooser
						scrubItems={scrubItems}
						setScrubItems={setScrubItems}
					></ScrubChooser>
				</>
			)}
		</div>
	);
};
