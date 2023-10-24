import { useState } from "react";
import { DownloadHar } from "./DownloadHar";
import { sanitize } from "../lib/har_sanitize";
import { Button } from "../_ui/Button";

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
    <div className="flex gap-4">
      <div>
        {input ? (
          <Button onClick={sanitizeHar}>Sanitize</Button>
        ) : (
          <p>no har</p>
        )}
      </div>
      {sanitizedHar && <DownloadHar har={sanitizedHar} name={name} />}
    </div>
  );
};
