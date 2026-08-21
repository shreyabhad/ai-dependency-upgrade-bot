import { env } from "../config/env.js";
import { readPackageJson } from "../github/package-json.js";
import { scanPackageDependencies } from "../npm/dependency-scanner.js";

const PACKAGE_JSON_PATH = "apps/api/package.json";

async function main(): Promise<void> {
  console.log(
    `Scanning ${env.githubRepoOwner}/${env.githubRepoName}...`,
  );

  const packageJson = await readPackageJson(
    env.githubRepoOwner,
    env.githubRepoName,
    PACKAGE_JSON_PATH,
  );

  const results = await scanPackageDependencies(packageJson);

  console.log(`\nPackage: ${packageJson.name ?? "unnamed"}`);
  console.log(`Path: ${PACKAGE_JSON_PATH}`);
  console.log("------------------------------------------");

  for (const result of results) {
    console.log(`Package: ${result.name}`);
    console.log(`Type: ${result.kind}`);
    console.log(`Current range: ${result.currentRange}`);
    console.log(`Latest version: ${result.latestVersion}`);
    console.log(`Upgrade: ${result.upgradeType}`);
    console.log("------------------------------------------");
  }

  const majorUpgrades = results.filter(
    (result) => result.upgradeType === "major",
  );

  console.log(
    `Major upgrades found: ${majorUpgrades.length}`,
  );
}

main().catch((error: unknown) => {
  console.error("Dependency scan failed.");

  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }

  process.exit(1);
});