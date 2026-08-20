import { createGitHubApp } from "../github/app.js";

async function main(): Promise<void> {
  const app = await createGitHubApp();

  const { data: installations } = await app.octokit.request(
    "GET /app/installations",
  );

  if (installations.length === 0) {
    console.log("No GitHub App installations found.");
    return;
  }

  console.log(`Found ${installations.length} installation(s):`);

  for (const installation of installations) {
    const accountName =
      installation.account && "login" in installation.account
        ? installation.account.login
        : "unknown";

    console.log("------------------------------");
    console.log(`Installation ID: ${installation.id}`);
    console.log(`Account: ${accountName}`);
    console.log(`Target type: ${installation.target_type}`);
    console.log(
      `Repository selection: ${installation.repository_selection}`,
    );
  }
}

main().catch((error: unknown) => {
  console.error("Failed to list GitHub App installations.");

  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }

  process.exit(1);
});