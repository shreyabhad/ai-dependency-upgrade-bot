import { discoverMigrationContext } from "../migration/context.js";

async function main(): Promise<void> {
  const context = await discoverMigrationContext(
    "fastify",
    "fastify",
    5,
  );

  console.log("Migration context discovered.");
  console.log("------------------------------------------");
  console.log(`Repository: ${context.owner}/${context.repo}`);
  console.log(`Target major: ${context.targetMajor}`);

  console.log(
    `Release notes: ${
      context.releaseNotes?.tagName ?? "not found"
    }`,
  );

  console.log(
    `Changelog: ${
      context.changelog?.path ?? "not found"
    }`,
  );

  console.log(
    `Migration guide: ${
      context.migrationGuide?.path ?? "not found"
    }`,
  );
}

main().catch((error: unknown) => {
  console.error("Failed to discover migration context.");

  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }

  process.exit(1);
});