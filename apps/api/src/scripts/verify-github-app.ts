import { createGitHubApp } from "../github/app.js";

type GitHubAppInfo = {
  id: number;
  name: string;
  slug: string;
};

async function main(): Promise<void> {
  const app = await createGitHubApp();

  const response = await app.octokit.request("GET /app");

  const data = response.data as GitHubAppInfo;

  console.log("GitHub App authentication successful.");
  console.log(`Name: ${data.name}`);
  console.log(`Slug: ${data.slug}`);
  console.log(`App ID: ${data.id}`);
}

main().catch((error: unknown) => {
  console.error("GitHub App authentication failed.");

  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }

  process.exit(1);
});