import { readPublicGitHubFile } from "../github/public-file.js";

export type MigrationGuideSource = {
  path: string;
  content: string;
};

function getMigrationGuidePaths(
  targetMajor: number,
): string[] {
  return [
    `Migration-Guide-V${targetMajor}.md`,
    `MIGRATION-V${targetMajor}.md`,
    "MIGRATION.md",
    "MIGRATING.md",
    "UPGRADE.md",
    "UPGRADING.md",
    `docs/Migration-Guide-V${targetMajor}.md`,
    `docs/Guides/Migration-Guide-V${targetMajor}.md`,
    `docs/migration-v${targetMajor}.md`,
    "docs/MIGRATION.md",
    "docs/UPGRADE.md",
  ];
}

export async function findMigrationGuide(
  owner: string,
  repo: string,
  targetMajor: number,
): Promise<MigrationGuideSource | null> {
  const paths = getMigrationGuidePaths(targetMajor);

  for (const path of paths) {
    const content = await readPublicGitHubFile(
      owner,
      repo,
      path,
    );

    if (content) {
      return {
        path,
        content,
      };
    }
  }

  return null;
}