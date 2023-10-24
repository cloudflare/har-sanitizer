/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { HAR } from "./components/HAR";
import { HARUpload, UploadHar } from "./components/UploadHar";

function App() {
  const [upload, setUpload] = useState<HARUpload>();

  return (
    <>
      <h1 className="text-5xl font-bold">Sanitize your HAR file</h1>
      <UploadHar setUpload={setUpload} />
      {!!upload && <HAR input={upload.raw} name={upload.name}></HAR>}
    </>
  );
}

export default App;
