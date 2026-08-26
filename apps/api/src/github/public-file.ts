export async function readPublicGitHubFile(
  owner: string,
  repo: string,
  path: string,
): Promise<string | null> {
  const encodedOwner = encodeURIComponent(owner);
  const encodedRepo = encodeURIComponent(repo);

  const encodedPath = path
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");

  const response = await fetch(
    `https://api.github.com/repos/${encodedOwner}/${encodedRepo}/contents/${encodedPath}`,
    {
      headers: {
        Accept: "application/vnd.github.raw+json",
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
      `GitHub file request failed for ${owner}/${repo}/${path}: ${response.status} ${response.statusText}`,
    );
  }

  return response.text();
}