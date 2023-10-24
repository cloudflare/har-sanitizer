/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, useState } from "react";

export type HARUpload = {
  raw: string;
  parsed: any;
  name: string;
};

type UploadHarProps = {
  setUpload: (value: HARUpload) => void;
};

export const UploadHar: React.FC<UploadHarProps> = ({ setUpload }) => {
  const [harError, setHarError] = useState<string>("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e || !e.target.files) {
      return;
    }
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const fileContents = e?.target?.result;
          if (fileContents && (typeof fileContents === "string" || fileContents instanceof String)) {
            setUpload({
              raw: fileContents as string,
              name: selectedFile.name,
              parsed: JSON.parse(fileContents as string),
            });
            setHarError("");
            return;
          }
          throw new Error("failed to upload file");
        } catch (e) {
          console.log(e);
          setHarError(`invalid har file: ${e?.toString()}`);
        }
      };

      reader.readAsText(selectedFile);
    }
  };

  return (
    <div className="p-8">
      <input type="file" onChange={handleFileChange} accept=".har" />
      {harError && <p>{harError}</p>}
    </div>
  );
};
