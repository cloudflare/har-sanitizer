/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Sanitizer } from "./components/Sanitizer";
import { HARUpload, UploadHar } from "./components/UploadHar";

function App() {
	const [upload, setUpload] = useState<HARUpload>();

	return (
		<>
			<h1 className="text-5xl font-bold">Sanitize your HAR file</h1>
			<UploadHar setUpload={setUpload} />
			{!!upload && (
				<Sanitizer input={upload.raw} name={upload.name}></Sanitizer>
			)}
		</>
	);
}

export default App;
