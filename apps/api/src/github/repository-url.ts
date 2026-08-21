export type GitHubRepository = {
  owner: string;
  repo: string;
};

export function parseGitHubRepositoryUrl(
  repositoryUrl: string,
): GitHubRepository | null {
  let normalizedUrl = repositoryUrl.trim();

  if (normalizedUrl.startsWith("git+")) {
    normalizedUrl = normalizedUrl.slice(4);
  }

  if (normalizedUrl.startsWith("git@github.com:")) {
    normalizedUrl = normalizedUrl.replace(
      "git@github.com:",
      "https://github.com/",
    );
  }

  let url: URL;

  try {
    url = new URL(normalizedUrl);
  } catch {
    return null;
  }

  if (url.hostname !== "github.com") {
    return null;
  }

  const parts = url.pathname
    .split("/")
    .filter(Boolean);

  if (parts.length < 2) {
    return null;
  }

  const owner = parts[0];
  let repo = parts[1];

  if (!owner || !repo) {
    return null;
  }

  if (repo.endsWith(".git")) {
    repo = repo.slice(0, -4);
  }

  return {
    owner,
    repo,
  };
}