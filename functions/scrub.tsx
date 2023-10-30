import { sanitize } from "../src/lib/har_sanitize";
import { Env } from "./_env";
import { jsonError } from "./_resp";

type ScrubRequest = {
	har: string;
	words?: string[];
	mime_types?: string[];
	all_headers?: boolean;
	all_cookies?: boolean;
	all_mimetypes?: boolean;
	all_queryargs?: boolean;
	all_postparams?: boolean;
};

export const onRequest: PagesFunction<Env> = async (ctx) => {
	const req = ctx.request as Request;
	if (req.method != "POST") {
		return jsonError("please post the HAR file to this endpoint");
	}

	let body: ScrubRequest | null;
	try {
		body = await req.json();
	} catch (e) {
		console.log(e);
		return jsonError("failed to parse json body");
	}

	if (!body) {
		return jsonError("missing post body");
	}

	if (!body.har) {
		return jsonError("body should be json and have a har field");
	}

	try {
		const harInput = JSON.stringify(body.har, null, 2);
		const scrubbed = sanitize(harInput, {
			scrubWords: body.words,
			scrubMimetypes: body.mime_types,
			allCookies: body.all_cookies,
			allHeaders: body.all_headers,
			allMimeTypes: body.all_mimetypes,
			allQueryArgs: body.all_queryargs,
			allPostParams: body.all_postparams,
		});

		return new Response(JSON.stringify(JSON.parse(scrubbed), null, 2));
	} catch (e) {
		return jsonError(`failed to scrub har file: ${e}`, 500);
	}
};
