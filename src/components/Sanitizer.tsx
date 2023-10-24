import { useEffect, useState } from "react";
import { DownloadHar } from "./DownloadHar";
import { Button } from "../_ui/Button";
import { sanitize, getHarInfo, PossibleScrubItems } from "../lib/har_sanitize";
import { ScrubChooser } from "./ScrubChooser";

type SanitizerProps = {
  input: string;
  name: string;
};

export type ScrubItems = {
  words: Set<string>;
  mimeTypes: Set<string>;
};

export const Sanitizer: React.FC<SanitizerProps> = ({ input = "", name = "" }) => {
  const [sanitizedHar, setSanitizedHar] = useState<string>("");
  const [possibleScrubItems, setPossibleScrubItems] = useState<PossibleScrubItems>();
  const [scrubItems, setScrubItems] = useState<ScrubItems>({ words: new Set(), mimeTypes: new Set() });

  const sanitizeHar = () => {
    setSanitizedHar(sanitize(input, [...scrubItems.words], [...scrubItems.mimeTypes]));
  };

  useEffect(() => {
    setPossibleScrubItems(getHarInfo(input));
  }, [input]);

  return (
    <div className="flex gap-4">
      <div>{input ? <Button onClick={sanitizeHar}>Sanitize</Button> : <p>no har</p>}</div>
      {sanitizedHar && <DownloadHar har={sanitizedHar} name={name} />}
      {possibleScrubItems && (
        <ScrubChooser items={possibleScrubItems} scrubItems={scrubItems} setScrubItems={setScrubItems}></ScrubChooser>
      )}
    </div>
  );
};
