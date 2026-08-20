import { Buffer } from "node:buffer";

import { env } from "../config/env.js";
import { createInstallationOctokit } from "../github/installation.js";

type PackageJson = {
  name?: string;
  version?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

async function main(): Promise<void> {
  const octokit = await createInstallationOctokit();

  const response = await octokit.request(
    "GET /repos/{owner}/{repo}/contents/{path}",
    {
      owner: env.githubRepoOwner,
      repo: env.githubRepoName,
      path: "apps/api/package.json",
    },
  );

  const data = response.data;

  if (
    Array.isArray(data) ||
    data.type !== "file" ||
    !("content" in data)
  ) {
    throw new Error(
      "package.json was not returned as a readable file.",
    );
  }

  const contents = Buffer.from(
    data.content,
    "base64",
  ).toString("utf8");

  const packageJson = JSON.parse(contents) as PackageJson;

  const dependencies = packageJson.dependencies ?? {};
  const devDependencies = packageJson.devDependencies ?? {};

  console.log("Successfully read package.json from GitHub.");
  console.log("------------------------------------------");
  console.log(`Repository: ${env.githubRepoOwner}/${env.githubRepoName}`);
  console.log(`Package: ${packageJson.name ?? "unnamed"}`);
  console.log(`Version: ${packageJson.version ?? "unknown"}`);
  console.log(`Dependencies: ${Object.keys(dependencies).length}`);
  console.log(
    `Dev dependencies: ${Object.keys(devDependencies).length}`,
  );

  console.log("\nDependencies:");

  if (Object.keys(dependencies).length === 0) {
    console.log("No production dependencies found.");
  } else {
    for (const [name, version] of Object.entries(dependencies)) {
      console.log(`- ${name}: ${version}`);
    }
  }

  console.log("\nDevelopment dependencies:");

  if (Object.keys(devDependencies).length === 0) {
    console.log("No development dependencies found.");
  } else {
    for (const [name, version] of Object.entries(devDependencies)) {
      console.log(`- ${name}: ${version}`);
    }
  }
}

main().catch((error: unknown) => {
  console.error("Failed to read package.json.");

  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }

  process.exit(1);
});