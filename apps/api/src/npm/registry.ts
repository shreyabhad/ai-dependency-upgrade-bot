type NpmPackageMetadata = {
  name: string;
  "dist-tags": {
    latest: string;
  };
};

export async function getLatestNpmVersion(
  packageName: string,
): Promise<string> {
  const encodedPackageName = encodeURIComponent(packageName);

  const response = await fetch(
    `https://registry.npmjs.org/${encodedPackageName}`,
    {
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `npm registry request failed for ${packageName}: ${response.status} ${response.statusText}`,
    );
  }

  const metadata = (await response.json()) as NpmPackageMetadata;

  const latestVersion = metadata["dist-tags"]?.latest;

  if (!latestVersion) {
    throw new Error(
      `npm registry did not return a latest version for ${packageName}.`,
    );
  }

  return latestVersion;
}