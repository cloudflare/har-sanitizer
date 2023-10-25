import { useEffect, useState } from "react";
import { Button } from "../_ui/Button";
import { PossibleScrubItems, getHarInfo, sanitize } from "../lib/har_sanitize";
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

export const Sanitizer: React.FC<SanitizerProps> = ({
	input = "",
	name = "",
}) => {
	const [sanitizedHar, setSanitizedHar] = useState<string>("");
	const [possibleScrubItems, setPossibleScrubItems] =
		useState<PossibleScrubItems>();
	const [scrubItems, setScrubItems] = useState<ScrubItems>({
		words: new Set(),
		mimeTypes: new Set(),
	});

	const sanitizeHar = () => {
		setSanitizedHar(
			sanitize(input, [...scrubItems.words], [...scrubItems.mimeTypes]),
		);
	};

	useEffect(() => {
		setPossibleScrubItems(getHarInfo(input));
	}, [input]);

	return (
		<>
			{possibleScrubItems && (
				<ScrubChooser
					items={possibleScrubItems}
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
