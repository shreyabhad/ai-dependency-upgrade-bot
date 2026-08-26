import {
  findFirstReleaseForMajor,
  type GitHubRelease,
} from "../github/releases.js";

export type MajorReleaseNotes = {
  tagName: string;
  url: string;
  publishedAt: string | null;
  notes: string | null;
};

export function getMajorReleaseNotes(
  releases: GitHubRelease[],
  targetMajor: number,
): MajorReleaseNotes | null {
  const release = findFirstReleaseForMajor(
    releases,
    targetMajor,
  );

  if (!release) {
    return null;
  }

  return {
    tagName: release.tagName,
    url: release.htmlUrl,
    publishedAt: release.publishedAt,
    notes: release.body,
  };
}