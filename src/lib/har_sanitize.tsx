// const mimeTypes = ["application/javascript", "text/javascript", "text/html", "text/css", "text/xml"];
const scrubedMimeTypes = ["application/javascript", "text/javascript"];

const defaultWordList = [
  "state",
  "shdf",
  "usg",
  "password",
  "email",
  "code",
  "code_verifier",
  "client_secret",
  "client_id",
  "code_challenge",
  "token",
  "access_token",
  "authenticity_token",
  "id_token",
  "appID",
  "challenge",
  "facetID",
  "assertion",
  "fcParams",
  "serverData",
  "Authorization",
  "auth",
  "x-client-data",
  "SAMLRequest",
  "SAMLResponse",
  "vses2",
];

// The default list of regexes that aren't word dependent
// Uses double list so it matches format of word regex
const defaultRegex = [
  [
    // Redact signature on JWTs
    {
      regex: new RegExp(`\\b(ey[A-Za-z0-9-_=]+)\\.(ey[A-Za-z0-9-_=]+)\\.[A-Za-z0-9-_.+/=]+\\b`, "g"),
      replacement: `$1.$2.redacted`,
    },
  ],
];

function buildRegex(word: string) {
  return [
    {
      // [full word]=[capture]
      // {
      //   "name": "[word]",
      //   "value": "[capture]"
      // }
      regex: new RegExp(`([\\s";,&?]+${word}=)([\\w+-_/=#|.%&:!*()\`~'"]+?)(&|\\\\",|",|"\\s|"}}|;){1}`, "g"),
      replacement: `$1[${word} redacted]$3`,
    },
    // Set up this way in case "value" isn't directly after "name"
    // {
    //    "name": "[word]",
    //    "something": "not wanted",
    //    "value": "[capture]"
    // }
    {
      regex: new RegExp(
        `("name": "${word}",[\\s\\w+:"-\\%!*()\`~'.#]*?"value": ")([\\w+-_:&\\+=#~/$()\\.\\,\\*\\!|%"\\s;]+?)("[\\s,}}]+){1}`,
        "g"
      ),
      replacement: `$1[${word} redacted]$3`,
    },
    // "name" comes after "value"
    // {
    //    "value": "[capture]",
    //    "something": "not wanted",
    //    "name": "[word]"
    // }
    {
      regex: new RegExp(
        `("value": ")([\\w+-_:&+=#$~/()\\\\.\\,*!|%"\\s;]+)("[,\\s}}]+)([\\s\\w+:"-\\\\%!*\`()~'#.]*"name": "${word}")`,
        "g"
      ),
      replacement: `$1[${word} redacted]$3$4`,
    },
  ];
}

function removeContentForMimeTypes(input: string) {
  const harJSON = JSON.parse(input);

  const entries = harJSON.log.entries;
  if (!entries) {
    throw new Error("failed to find entries in HAR file");
  }

  for (const entry of entries) {
    const response = entry.response;
    if (response && scrubedMimeTypes.includes(response.content.mimeType)) {
      response.content.text = `[${response.content.mimeType} redacted]`;
    }
  }

  return JSON.stringify(harJSON, null, 2);
}

export function sanitize(input: string) {
  // Remove specific mime responses first
  input = removeContentForMimeTypes(input);

  // trim the list of words we are looking for down to the ones actually in the HAR file
  const wordList = defaultWordList.filter((val) => input.includes(val));

  // build list of regexes needed to actually scrub the file
  const wordSpecificScrubList = wordList.map((word) => buildRegex(word));
  const allScrubList = defaultRegex.concat(wordSpecificScrubList);

  for (const scrubList of allScrubList) {
    for (const scrub of scrubList) {
      input = input.replace(scrub.regex, scrub.replacement);
    }
  }

  return input;
}
