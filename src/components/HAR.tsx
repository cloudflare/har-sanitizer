import { useState } from "react";
import { DownloadHar } from "./DownloadHar";
import { sanitize } from "../lib/har_sanitize";

type HARProps = {
  input: string;
  name: string;
};

export const HAR: React.FC<HARProps> = ({ input = "", name = "" }) => {
  const [sanitizedHar, setSanitizedHar] = useState<string>("");

  const sanitizeHar = () => {
    setSanitizedHar(sanitize(input));
  };

  return (
    <>
      <div>{input ? <button onClick={sanitizeHar}>Sanitize</button> : <p>no har</p>}</div>
      {sanitizedHar && <DownloadHar har={sanitizedHar} name={name} />}
    </>
  );
};
