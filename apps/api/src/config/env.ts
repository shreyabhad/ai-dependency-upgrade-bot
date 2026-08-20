import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { loadEnvFile } from "node:process";

const envPath = resolve(process.cwd(), ".env");

if (existsSync(envPath)) {
  loadEnvFile(envPath);
}

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function requireNumberEnv(name: string): number {
  const rawValue = requireEnv(name);
  const value = Number(rawValue);

  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(
      `Environment variable ${name} must be a positive integer.`,
    );
  }

  return value;
}

export const env = {
  githubAppId: requireEnv("GITHUB_APP_ID"),
  githubPrivateKeyPath: requireEnv("GITHUB_PRIVATE_KEY_PATH"),
  githubInstallationId: requireNumberEnv("GITHUB_INSTALLATION_ID"),
  githubRepoOwner: requireEnv("GITHUB_REPO_OWNER"),
  githubRepoName: requireEnv("GITHUB_REPO_NAME"),
};