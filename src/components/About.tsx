import { A } from "../_ui/A";
import { P } from "../_ui/P";

export function About() {
	return (
		<div className="grid grid-cols-1 gap-8 xl:gap-16 lg:grid-cols-2">
			<div className="space-y-1">
				<h2 className="font-bold">How it works</h2>
				<P className="text-sm max-w-prose">
					At Cloudflare, we're committed to building a better Internet. We want
					to make it possible to troubleshoot with HAR files without the threat
					of a stolen session. The HAR File Sanitizer will remove sensitive data
					using “clientside” logic. Meaning that no one—including Cloudflare—
					will ever see the content from your HAR files. This makes it safe to
					send to another support, engineering, or external team. For some
					tools, like Cloudflare Access, logic is included to sanitize session
					tokens without fully removing them. For other tools, the session token
					may be fully stripped out. If you are a provider who would like
					special support for your token, please{" "}
					<A href="https://github.com/cloudflare/har-sanitizer/issues/new">
						file an issue
					</A>{" "}
					or open a pull request on{" "}
					<A href="https://github.com/cloudflare/har-sanitizer">
						our repository
					</A>
					.
				</P>
			</div>
			<div className="space-y-1">
				<h2 className="font-bold">More about HTTP Archive (HAR) files</h2>
				<P className="text-sm max-w-prose">
					HAR files are JSON-formatted archive files used to log web browser
					interactions. Developers and IT professionals often use the
					performance data in HAR files to troubleshoot issues. Since HAR files
					record all web browser requests, they may contain sensitive data. This
					includes usernames, passwords, credit card numbers, and session
					cookies. These details can be exploited if fallen into the wrong
					hands. Sanitizing HAR files removes sensitive content. This allows you
					to share them for debugging or analysis without risking exposure.{" "}
					<A href="https://developers.cloudflare.com/support/troubleshooting/general-troubleshooting/gathering-information-for-troubleshooting-sites/">
						Learn more about using HAR files for troubleshooting.
					</A>
				</P>
			</div>
		</div>
	);
}
