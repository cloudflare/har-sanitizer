import { useState } from "react";
import { DownloadHar } from "./DownloadHar";
import { Button } from "../_ui/Button";
import { sanitize, getHarInfo } from "../lib/har_sanitize";

type SanitizerProps = {
  input: string;
  name: string;
};

export const Sanitizer: React.FC<SanitizerProps> = ({ input = "", name = "" }) => {
  const [sanitizedHar, setSanitizedHar] = useState<string>("");
  const [harData, setHarData] = useState<PossibleScrubItems>();

  const sanitizeHar = () => {
    setSanitizedHar(sanitize(input));
  };

  const getHarData = () => {
    setHarData(getHarInfo(input));
  };

  return (
    <div className="flex gap-4">
      <div>{input ? <Button onClick={sanitizeHar}>Sanitize</Button> : <p>no har</p>}</div>
      {sanitizedHar && <DownloadHar har={sanitizedHar} name={name} />}
    </div>
  );
};
