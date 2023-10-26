# HAR Sanitizer

https://har-sanitizer.pages.dev/

## Development

To create a hot reload server running at localhost:3001

```
npm run dev
```

Example Request for API.

```
jq '{"har": .}' < /Users/jroyal/Downloads/test_har_sanitizer.har  | curl -X POST -H "Content-Type: application/json" --data @- localhost:3001/scrub > scrubbed.har
```
