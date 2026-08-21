import { getLatestNpmVersion } from "../npm/registry.js";

async function main(): Promise<void> {
  const packageName = "fastify";

  const latestVersion = await getLatestNpmVersion(packageName);

  console.log(`Package: ${packageName}`);
  console.log(`Latest version: ${latestVersion}`);
}

main().catch((error: unknown) => {
  console.error("Failed to check npm package version.");

  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }

  process.exit(1);
});