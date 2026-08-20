import { createGitHubApp } from "../github/app.js";

const INSTALLATION_ID = 155147280;

async function main(): Promise<void> {
  const app = await createGitHubApp();

  const octokit = await app.getInstallationOctokit(INSTALLATION_ID);

  const { data } = await octokit.request(
    "GET /installation/repositories",
  );

  console.log(`Found ${data.total_count} accessible repository/repositories:`);

  for (const repository of data.repositories) {
    console.log("------------------------------");
    console.log(`Repository: ${repository.full_name}`);
    console.log(`Repository ID: ${repository.id}`);
    console.log(`Private: ${repository.private}`);
    console.log(`Default branch: ${repository.default_branch}`);
  }
}

main().catch((error: unknown) => {
  console.error("Failed to list installation repositories.");

  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }

  process.exit(1);
});