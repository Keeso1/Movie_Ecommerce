// prisma.config.ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  // Path to the Prisma schema that DEFINES the client shape
  schema: "prisma/schema.prisma",

  // Migration configuration (safe and explicit)
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },

  // Datasource configuration
  datasource: {
    url: env("DATABASE_URL"),
  },
});
