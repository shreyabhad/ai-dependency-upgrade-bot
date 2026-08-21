import { classifyUpgrade } from "../npm/version.js";

const examples = [
  {
    current: "^5.12.1",
    latest: "6.0.0",
  },
  {
    current: "^5.12.1",
    latest: "5.13.0",
  },
  {
    current: "^5.12.1",
    latest: "5.12.2",
  },
  {
    current: "^5.12.1",
    latest: "5.12.1",
  },
];

for (const example of examples) {
  const result = classifyUpgrade(
    example.current,
    example.latest,
  );

  console.log(
    `${example.current} -> ${example.latest} = ${result}`,
  );
}