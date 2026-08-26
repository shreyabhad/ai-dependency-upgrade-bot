import { listGitHubReleases } from "../github/releases.js";
import {
  findChangelog,
  type ChangelogSource,
} from "./changelog.js";
import {
  findMigrationGuide,
  type MigrationGuideSource,
} from "./migration-guide.js";
import {
  getMajorReleaseNotes,
  type MajorReleaseNotes,
} from "./release-notes.js";

export type MigrationContext = {
  owner: string;
  repo: string;
  targetMajor: number;
  releaseNotes: MajorReleaseNotes | null;
  changelog: ChangelogSource | null;
  migrationGuide: MigrationGuideSource | null;
};

export async function discoverMigrationContext(
  owner: string,
  repo: string,
  targetMajor: number,
): Promise<MigrationContext> {
  const releases = await listGitHubReleases(
    owner,
    repo,
  );

  const releaseNotes = getMajorReleaseNotes(
    releases,
    targetMajor,
  );

  const [changelog, migrationGuide] = await Promise.all([
    findChangelog(owner, repo),
    findMigrationGuide(owner, repo, targetMajor),
  ]);

  return {
    owner,
    repo,
    targetMajor,
    releaseNotes,
    changelog,
    migrationGuide,
  };
}