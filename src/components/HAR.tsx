// import { useState } from "react";

type HARProps = {
  input: string;
};

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
];

function buildRegex(word: string) {
  return {
    single_use: {
      // user:pass URL: whatever[://]user:[capture][@]whatever
      regex: /(:\/\/[\w+-.%!*()`~']*?:)([\w+-.%!*()`~']+)(@)/,
      replacement: "$1[password redacted]$3",
    },
    word_patterns: [
      {
        // [full word]=[capture][& | ", | "\s | "} | ;]
        regex: new RegExp(`([\\s";,&?]+${word}=)([\\w+-_/=#|.%&:!*()\`~'"]+?)(&|",|"\\s|"}}|;){1}`, "g"),
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
      //   // Same as above, but backwards in case "name" comes after "value"
      //   // {
      //   //   "name": "not wanted/captured"
      //   //   "value": "unwanted capture"
      //   // }
      //   // {
      //   //    "value": "[capture]["],
      //   //    "something": "not wanted",
      //   //    "name": "[word]"
      //   // }
      {
        regex: new RegExp(
          `("value": ")([\\w+-_:&\\+=#$~/()\\.\\,\\*\\!|%"\\s;]+)({1})([\\s\\w+:"-\\%!*()\`~'#.]*"name": "${word}"){{1}}`,
          "g"
        ),
        replacement: `$1[${word} redacted]$3$4`,
      },
    ],
  };
}

function sanitize(input: string) {
  console.log("sanitize clicked");
  //   trim the list of words we are looking for down to the ones actually in the HAR file
  const redactList = defaultWordList.filter((val) => input.includes(val));
  console.log(redactList);
  const scrubList = redactList.map((word) => buildRegex(word));
  for (const scrub of scrubList) {
    for (const pattern of scrub.word_patterns) {
      input = input.replace(pattern.regex, pattern.replacement);
    }
  }
  console.log(input);
  console.log("done");
}

export const HAR: React.FC<HARProps> = ({ input = "" }) => {
  //   const [sanitizedHar, setSanitizedHar] = useState<string>("");

  return <div>{input ? <button onClick={() => sanitize(input)}>Sanitize</button> : <p>no har</p>}</div>;
};
