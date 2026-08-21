import { Buffer } from "node:buffer";

import { createInstallationOctokit } from "./installation.js";

export type PackageJson = {
  name?: string;
  version?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

export async function readPackageJson(
  owner: string,
  repo: string,
  path: string,
): Promise<PackageJson> {
  const octokit = await createInstallationOctokit();

  const response = await octokit.request(
    "GET /repos/{owner}/{repo}/contents/{path}",
    {
      owner,
      repo,
      path,
    },
  );

  const data = response.data;

  if (
    Array.isArray(data) ||
    data.type !== "file" ||
    !("content" in data)
  ) {
    throw new Error(
      `${path} was not returned as a readable file.`,
    );
  }

  const contents = Buffer.from(
    data.content,
    "base64",
  ).toString("utf8");

  const parsed: unknown = JSON.parse(contents);

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    Array.isArray(parsed)
  ) {
    throw new Error(`${path} does not contain a valid JSON object.`);
  }

  return parsed as PackageJson;
}