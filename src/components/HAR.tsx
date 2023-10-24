import { useState } from "react";
import { DownloadHar } from "./DownloadHar";
import { Button } from "../_ui/Button";
import { sanitize, getHarInfo } from "../lib/har_sanitize";

type HARProps = {
  input: string;
  name: string;
};

export const HAR: React.FC<HARProps> = ({ input = "", name = "" }) => {
  const [sanitizedHar, setSanitizedHar] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [harData, setHarData] = useState<any>({});

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
