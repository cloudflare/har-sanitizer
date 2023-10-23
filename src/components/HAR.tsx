import { useState } from "react";
import { DownloadHar } from "./DownloadHar";

type HARProps = {
  input: string;
  name: string;
};

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
  "CF_Authorization",
  "vses2",
];

function buildRegex(word: string) {
  return [
    {
      // [full word]=[capture][& | ", | "\s | "} | ;]
      regex: new RegExp(`([\\s";,&?]+${word}=)([\\w+-_/=#|.%&:!*()\`~'"]+?)(&|\\\\",|",|"\\s|"}}|;){1}`, "g"),
      replacement: `$1[${word} redacted]$3`,
    },
    // Set up this way in case "value" isn't directly after "name", but
    // excludes {} to prevent grabbing the next object
    // {
    //    "name": "[word]",
    //    "something": "not wanted",
    //    "value": "[capture]["]
    // }
    // {
    //   "name": "not wanted",
    //   "value": "unwanted capture"
    {
      regex: new RegExp(
        `("name": "${word}",[\\s\\w+:"-\\%!*()\`~'.#]*?"value": ")([\\w+-_:&\\+=#~/$()\\.\\,\\*\\!|%"\\s;]+?)("[\\s,}}]+){1}`,
        "g"
      ),
      replacement: `$1[${word} redacted]$3`,
    },
    // Same as above, but backwards in case "name" comes after "value"
    // {
    //   "name": "not wanted/captured"
    //   "value": "unwanted capture"
    // }
    // {
    //    "value": "[capture]["],
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

  return JSON.stringify(harJSON);
}

function sanitize(input: string, setSanitizedHar: (value: string) => void) {
  input = removeContentForMimeTypes(input);
  //   trim the list of words we are looking for down to the ones actually in the HAR file
  const redactList = defaultWordList.filter((val) => input.includes(val));

  // build list of regexes needed to actually scrub the file
  const scrubList = redactList.map((word) => buildRegex(word));

  for (const scrub of scrubList) {
    for (const pattern of scrub) {
      input = input.replace(pattern.regex, pattern.replacement);
    }
  }

  setSanitizedHar(input);
}

export const HAR: React.FC<HARProps> = ({ input = "", name = "" }) => {
  const [sanitizedHar, setSanitizedHar] = useState<string>("");

  return (
    <>
      <div>{input ? <button onClick={() => sanitize(input, setSanitizedHar)}>Sanitize</button> : <p>no har</p>}</div>
      {sanitizedHar && <DownloadHar har={sanitizedHar} name={name} />}
    </>
  );
};
