/* eslint-disable @typescript-eslint/no-explicit-any */
import { P } from "./_ui/P";
import { About } from "./components/About";
import { CloudflareLogo } from "./components/CloudflareLogo";
import { Sanitizer } from "./components/Sanitizer";

function App() {
	return (
		<div className="flex flex-col justify-center place-items-start min-h-[100dvh] mx-auto max-w-[100rem] p-4 sm:p-8 md:p-16 lg:p-24">
			<div className="w-full space-y-16">
				<div className="grid gap-x-8 gap-y-8 items-start md:grid-cols-[1fr_14rem]">
					<div className="md:order-last ml-auto w-[min(100%,14rem)]">
						<a href="https://www.cloudflare.com/">
							<CloudflareLogo />
						</a>
					</div>
					<div>
						<h1 className="text-3xl font-bold">HAR File Sanitizer</h1>
						<P className="text-sm text-neutral-700">
							Protect your session data by sanitizing your HAR files before
							sharing. Built with Cloudflare Workers.
						</P>
					</div>
				</div>
				<Sanitizer />
				<About />
			</div>
		</div>
	);
}

export default App;
