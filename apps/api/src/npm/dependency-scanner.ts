import type { PackageJson } from "../github/package-json.js";
import { getLatestNpmVersion } from "./registry.js";
import {
  classifyUpgrade,
  type UpgradeType,
} from "./version.js";

export type DependencyKind =
  | "dependency"
  | "devDependency";

export type DependencyScanResult = {
  name: string;
  kind: DependencyKind;
  currentRange: string;
  latestVersion: string;
  upgradeType: UpgradeType;
};
export async function scanDependency(
  name: string,
  currentRange: string,
  kind: DependencyKind,
): Promise<DependencyScanResult> {
  const latestVersion = await getLatestNpmVersion(name);

  const upgradeType = classifyUpgrade(
    currentRange,
    latestVersion,
  );

  return {
    name,
    kind,
    currentRange,
    latestVersion,
    upgradeType,
  };
}
export async function scanPackageDependencies(
  packageJson: PackageJson,
): Promise<DependencyScanResult[]> {
  const dependencies = packageJson.dependencies ?? {};
  const devDependencies = packageJson.devDependencies ?? {};

  const results: DependencyScanResult[] = [];

  for (const [name, currentRange] of Object.entries(dependencies)) {
    const result = await scanDependency(
      name,
      currentRange,
      "dependency",
    );

    results.push(result);
  }

  for (const [name, currentRange] of Object.entries(devDependencies)) {
    const result = await scanDependency(
      name,
      currentRange,
      "devDependency",
    );

    results.push(result);
  }

  return results;
}
export function getMajorUpgradeCandidates(
  results: DependencyScanResult[],
): DependencyScanResult[] {
  return results.filter(
    (result) => result.upgradeType === "major",
  );
}