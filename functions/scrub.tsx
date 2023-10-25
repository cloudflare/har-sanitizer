import { sanitize } from "../src/lib/har_sanitize";
import { Env } from "./_env";
import { jsonError } from "./_resp";

type ScrubRequest = {
	har: string;
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
		const scrubbed = sanitize(JSON.stringify(body.har, null, 2));
		return new Response(JSON.stringify(JSON.parse(scrubbed), null, 2));
	} catch (e) {
		return jsonError(`failed to scrub har file: ${e}`, 500);
	}
};
