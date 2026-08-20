import { createGitHubApp } from "./app.js";
import { env } from "../config/env.js";

export async function createInstallationOctokit() {
  const app = await createGitHubApp();

  return app.getInstallationOctokit(
    env.githubInstallationId,
  );
}