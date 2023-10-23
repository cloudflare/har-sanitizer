import { ChangeEvent, useState } from "react";
import "./App.css";
import { HAR } from "./components/HAR";

function App() {
  const [harName, setHarName] = useState<string>("");
  const [har, setHar] = useState<string>("");
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
            JSON.parse(fileContents as string);
            setHar(fileContents as string);
            setHarName(selectedFile.name);
            setHarError("");
            return;
          }
          throw new Error("failed to upload file");
        } catch (e) {
          console.log(e);
          setHarError(`invalid har file: ${e?.toString()}`);
        }
      };

      reader.readAsText(selectedFile); // You can use 'readAsArrayBuffer' for binary files
    }
  };
  return (
    <>
      <h1>Sanitize your HAR file</h1>
      <div className="card">
        <input type="file" onChange={handleFileChange} accept=".har" />
        {harError && <p>{harError}</p>}
      </div>
      {!!har && <HAR input={har} name={harName}></HAR>}
    </>
  );
}

export default App;
