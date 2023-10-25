export function jsonError(msg: string, status?: number) {
	return new Response(JSON.stringify({ err: msg }), {
		status: status || 400,
		headers: { "content-type": "application/json" },
	});
}
