import { readFile } from "node:fs/promises";
import { App } from "@octokit/app";

import { env } from "../config/env.js";

export async function createGitHubApp(): Promise<App> {
  const privateKey = await readFile(
    env.githubPrivateKeyPath,
    "utf8",
  );

  return new App({
    appId: env.githubAppId,
    privateKey,
  });
}