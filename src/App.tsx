/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Sanitizer } from "./components/Sanitizer";
import { HARUpload, UploadHar } from "./components/UploadHar";

function App() {
	const [upload, setUpload] = useState<HARUpload>();

	return (
		<div className="flex flex-col justify-center place-items-start min-h-[100dvh] mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
			<div className="w-full space-y-6">
				<h1 className="text-3xl font-bold">Sanitize your HAR file</h1>
				<p className="text-sm">
					Protect your session data by sanitizing your HAR files before sharing.
					Built with Cloudflare Workers.
				</p>
				<UploadHar setUpload={setUpload} />
				{!!upload && (
					<Sanitizer input={upload.raw} name={upload.name}></Sanitizer>
				)}
			</div>
		</div>
	);
}

export default App;
