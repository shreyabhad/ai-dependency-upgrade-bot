import semver from "semver";
export type GitHubRelease = {
  tagName: string;
  name: string | null;
  body: string | null;
  htmlUrl: string;
  publishedAt: string | null;
  prerelease: boolean;
  draft: boolean;
};

type GitHubReleaseResponse = {
  tag_name: string;
  name: string | null;
  body: string | null;
  html_url: string;
  published_at: string | null;
  prerelease: boolean;
  draft: boolean;
};

export async function getLatestGitHubRelease(
  owner: string,
  repo: string,
): Promise<GitHubRelease | null> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/releases/latest`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "ai-dependency-upgrade-bot",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      signal: AbortSignal.timeout(10_000),
    },
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `GitHub release request failed for ${owner}/${repo}: ${response.status} ${response.statusText}`,
    );
  }

  const release =
    (await response.json()) as GitHubReleaseResponse;

  return {
    tagName: release.tag_name,
    name: release.name,
    body: release.body,
    htmlUrl: release.html_url,
    publishedAt: release.published_at,
    prerelease: release.prerelease,
    draft: release.draft,
  };
}
export async function listGitHubReleases(
  owner: string,
  repo: string,
): Promise<GitHubRelease[]> {
  const perPage = 100;
  const maxPages = 5;

  const allReleases: GitHubRelease[] = [];

  for (let page = 1; page <= maxPages; page++) {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/releases?per_page=${perPage}&page=${page}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "ai-dependency-upgrade-bot",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        signal: AbortSignal.timeout(10_000),
      },
    );

    if (response.status === 404) {
      return [];
    }

    if (!response.ok) {
      throw new Error(
        `GitHub releases request failed for ${owner}/${repo}: ${response.status} ${response.statusText}`,
      );
    }

    const releases =
      (await response.json()) as GitHubReleaseResponse[];

    allReleases.push(
      ...releases.map((release) => ({
        tagName: release.tag_name,
        name: release.name,
        body: release.body,
        htmlUrl: release.html_url,
        publishedAt: release.published_at,
        prerelease: release.prerelease,
        draft: release.draft,
      })),
    );

    if (releases.length < perPage) {
      break;
    }
  }

  return allReleases;
}
export function getStableGitHubReleases(
  releases: GitHubRelease[],
): GitHubRelease[] {
  return releases.filter(
    (release) =>
      !release.prerelease &&
      !release.draft,
  );
}
export function findFirstReleaseForMajor(
  releases: GitHubRelease[],
  targetMajor: number,
): GitHubRelease | null {
  const stableReleases = getStableGitHubReleases(releases);

  const matchingReleases = stableReleases
    .map((release) => ({
      release,
      version: semver.coerce(release.tagName),
    }))
    .filter(
      (
        item,
      ): item is {
        release: GitHubRelease;
        version: semver.SemVer;
      } =>
        item.version !== null &&
        item.version.major === targetMajor,
    )
    .sort((a, b) =>
      semver.compare(a.version, b.version),
    );

  return matchingReleases[0]?.release ?? null;
}