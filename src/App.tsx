/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Sanitizer } from "./components/Sanitizer";
import { HARUpload, UploadHar } from "./components/UploadHar";

function App() {
	const [upload, setUpload] = useState<HARUpload>();

	return (
		<div className="flex flex-col justify-center place-items-start min-h-[100dvh] mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
			<div className="w-full space-y-6">
				<h1 className="text-3xl font-bold">HAR File Sanitizer</h1>
				<p className="text-sm">
					Protect your session data by sanitizing your HAR files before sharing.
					Built with Cloudflare Workers.
				</p>
				<UploadHar setUpload={setUpload} />
				{!!upload && (
					<Sanitizer input={upload.raw} name={upload.name}></Sanitizer>
				)}
				<div className="text-sm">
					<h3 className="font-bold">Recommendation</h3>
					<p>
						At Cloudflare, we're committed to building a better Internet. We
						want to make it possible to troubleshoot with HAR files without the
						threat of a stolen session. The HAR File Sanitzer will remove
						sensitive data using “clientside” logic. Meaning that no
						one—including Cloudflare— will ever see the content from your HAR
						files. This makes it safe to send to another support, engineering,
						or external team. For some tools, like Cloudflare Access, logic is
						included to sanitize session tokens without fully removing them. For
						other tools, the session token may be fully stripped out. If you are
						a provider who would like special support for your token, please
						file an issue or open a PR here: xyz
					</p>
				</div>
				<div className="text-sm">
					<h3 className="font-bold">More about HTTP Archive (HAR) files</h3>
					<p>
						HAR files are JSON-formatted archive files used to log web browser
						interactions . Developers and IT professionals often use the
						performance data in HAR files to troubleshoot issues. Since HAR
						files record all web browser requests, they may contain sensitive
						data. This includes usernames, passwords, credit card numbers, and
						session cookies. These details can be exploited if fallen into the
						wrong hands. Sanitizing HAR files removes sensitive content. This
						allows you to share them for debugging or analysis without risking
						exposure.{" "}
						<a href="https://developers.cloudflare.com/support/troubleshooting/general-troubleshooting/gathering-information-for-troubleshooting-sites/">
							Learn more about using HAR files for troubleshooting.
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}

export default App;
