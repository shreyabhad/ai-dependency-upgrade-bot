import {
  getLatestGitHubRelease,
  getStableGitHubReleases,
  listGitHubReleases,
} from "../github/releases.js";
import { parseGitHubRepositoryUrl } from "../github/repository-url.js";
import { getNpmPackageInfo } from "../npm/registry.js";

async function main(): Promise<void> {
  const packageName = "fastify";

  const packageInfo = await getNpmPackageInfo(packageName);

  console.log(`Package: ${packageInfo.name}`);
  console.log(`Latest version: ${packageInfo.latestVersion}`);
  console.log(
    `Repository: ${packageInfo.repositoryUrl ?? "not available"}`,
  );

  if (!packageInfo.repositoryUrl) {
    console.log("GitHub repository: not available");
    return;
  }

  const githubRepository = parseGitHubRepositoryUrl(
    packageInfo.repositoryUrl,
  );

  if (!githubRepository) {
    console.log("GitHub repository: not detected");
    return;
  }

  console.log(`GitHub owner: ${githubRepository.owner}`);
  console.log(`GitHub repo: ${githubRepository.repo}`);
  const release = await getLatestGitHubRelease(
  githubRepository.owner,
  githubRepository.repo,
);

if (!release) {
  console.log("Latest GitHub release: not available");
  return;
}

console.log("\nLatest GitHub release:");
console.log(`Tag: ${release.tagName}`);
console.log(`Name: ${release.name ?? "unnamed"}`);
console.log(`Published: ${release.publishedAt ?? "unknown"}`);
console.log(`URL: ${release.htmlUrl}`);

const releases = await listGitHubReleases(
  githubRepository.owner,
  githubRepository.repo,
);

const stableReleases = getStableGitHubReleases(releases);

console.log("\nRecent stable GitHub releases:");

for (const item of stableReleases.slice(0, 5)) {
  console.log(`- ${item.tagName}`);
}
}

main().catch((error: unknown) => {
  console.error("Failed to check npm package metadata.");

  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }

  process.exit(1);
});