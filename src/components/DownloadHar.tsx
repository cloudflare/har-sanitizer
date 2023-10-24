import React from "react";
import { Button } from "../_ui/Button";

function handleDownloadClick(harOutput: string, name: string) {
  const blob = new Blob([harOutput], { type: "application/json" });

  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);

  // Create an anchor element to trigger the download
  const a = document.createElement("a");
  a.href = url;
  // Set file name
  a.download = name;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();

  // Clean up by removing the anchor and revoking the URL
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

type DownloadHarProps = {
  har: string;
  name: string;
};
export const DownloadHar: React.FC<DownloadHarProps> = ({
  har = "",
  name = "",
}) => {
  const newName = `redacted_${name}`;
  let isValidJSON = true;
  let errMsg = "";
  try {
    JSON.parse(har);
    isValidJSON = true;
  } catch (e: unknown) {
    isValidJSON = false;
    errMsg = (e as Error).toString();
  }
  return (
    <div>
      {!isValidJSON && (
        <p>there is something wrong with the sanitize har file {errMsg}</p>
      )}
      <Button onClick={() => handleDownloadClick(har, newName)}>
        Download Sanitized HAR
      </Button>
    </div>
  );
};
