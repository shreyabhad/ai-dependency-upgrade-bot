import {
  findFirstReleaseForMajor,
  getLatestGitHubRelease,
  getStableGitHubReleases,
  listGitHubReleases,
} from "../github/releases.js";
import { parseGitHubRepositoryUrl } from "../github/repository-url.js";
import { getNpmPackageInfo } from "../npm/registry.js";
import { getMajorReleaseNotes } from "../migration/release-notes.js";
import { findChangelog } from "../migration/changelog.js";
import { findMigrationGuide } from "../migration/migration-guide.js";

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
const targetMajor = 5;

const majorReleaseNotes = getMajorReleaseNotes(
  releases,
  targetMajor,
);

console.log(
  `\nMajor v${targetMajor} migration source:`,
);

if (!majorReleaseNotes) {
  console.log("Not found");
} else {
  console.log(`Tag: ${majorReleaseNotes.tagName}`);
  console.log(`URL: ${majorReleaseNotes.url}`);

  if (majorReleaseNotes.notes) {
    const preview = majorReleaseNotes.notes.slice(0, 1000);

    console.log("\nRelease notes preview:");
    console.log("------------------------------------------");
    console.log(preview);
  } else {
    console.log("\nRelease notes: not available");
  }
}

const changelog = await findChangelog(
  githubRepository.owner,
  githubRepository.repo,
);

console.log("\nChangelog discovery:");

if (!changelog) {
  console.log("No changelog file found");
} else {
  console.log(`Found: ${changelog.path}`);
  console.log("------------------------------------------");
  console.log(changelog.content.slice(0, 1000));
}
const migrationGuide = await findMigrationGuide(
  githubRepository.owner,
  githubRepository.repo,
  targetMajor,
);

console.log("\nMigration guide discovery:");

if (!migrationGuide) {
  console.log("No migration guide found");
} else {
  console.log(`Found: ${migrationGuide.path}`);
  console.log("------------------------------------------");
  console.log(migrationGuide.content.slice(0, 1000));
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