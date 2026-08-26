import { readPublicGitHubFile } from "../github/public-file.js";

export type ChangelogSource = {
  path: string;
  content: string;
};

const CHANGELOG_PATHS = [
  "CHANGELOG.md",
  "CHANGELOG",
  "CHANGES.md",
  "HISTORY.md",
  "docs/CHANGELOG.md",
];

export async function findChangelog(
  owner: string,
  repo: string,
): Promise<ChangelogSource | null> {
  for (const path of CHANGELOG_PATHS) {
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