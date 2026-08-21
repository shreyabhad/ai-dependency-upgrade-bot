import semver from "semver";

export type UpgradeType =
  | "major"
  | "minor"
  | "patch"
  | "none";

export function classifyUpgrade(
  currentRange: string,
  latestVersion: string,
): UpgradeType {
  const currentVersion = semver.minVersion(currentRange);
  const latest = semver.parse(latestVersion);

  if (!currentVersion) {
    throw new Error(
      `Could not understand current version range: ${currentRange}`,
    );
  }

  if (!latest) {
    throw new Error(
      `Could not understand latest version: ${latestVersion}`,
    );
  }

  if (latest.major > currentVersion.major) {
    return "major";
  }

  if (
    latest.major === currentVersion.major &&
    latest.minor > currentVersion.minor
  ) {
    return "minor";
  }

  if (
    latest.major === currentVersion.major &&
    latest.minor === currentVersion.minor &&
    latest.patch > currentVersion.patch
  ) {
    return "patch";
  }

  return "none";
}