type NpmRepository =
  | string
  | {
      type?: string;
      url?: string;
      directory?: string;
    };

type NpmPackageMetadata = {
  name: string;
  "dist-tags"?: {
    latest?: string;
  };
  repository?: NpmRepository;
  homepage?: string;
};

export type NpmPackageInfo = {
  name: string;
  latestVersion: string;
  repositoryUrl?: string;
  homepage?: string;
};

async function fetchNpmPackageMetadata(
  packageName: string,
): Promise<NpmPackageMetadata> {
  const encodedPackageName = encodeURIComponent(packageName);

  const response = await fetch(
    `https://registry.npmjs.org/${encodedPackageName}`,
    {
      headers: {
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(10_000),
    },
  );

  if (!response.ok) {
    throw new Error(
      `npm registry request failed for ${packageName}: ${response.status} ${response.statusText}`,
    );
  }

  return (await response.json()) as NpmPackageMetadata;
}

export async function getNpmPackageInfo(
  packageName: string,
): Promise<NpmPackageInfo> {
  const metadata = await fetchNpmPackageMetadata(packageName);

  const latestVersion = metadata["dist-tags"]?.latest;

  if (!latestVersion) {
    throw new Error(
      `npm registry did not return a latest version for ${packageName}.`,
    );
  }

  let repositoryUrl: string | undefined;

  if (typeof metadata.repository === "string") {
    repositoryUrl = metadata.repository;
  } else if (metadata.repository?.url) {
    repositoryUrl = metadata.repository.url;
  }

  return {
    name: metadata.name,
    latestVersion,
    ...(repositoryUrl ? { repositoryUrl } : {}),
    ...(metadata.homepage ? { homepage: metadata.homepage } : {}),
  };
}

export async function getLatestNpmVersion(
  packageName: string,
): Promise<string> {
  const packageInfo = await getNpmPackageInfo(packageName);

  return packageInfo.latestVersion;
}