import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts",
  },
  datasource: {
    // LOCAL: DATABASE_URL dans .env
    // SUPABASE: remplacer par l'URL pooler + directUrl pour migrations
    url: process.env.DATABASE_URL!,
    // Pour Supabase migrations (décommenter + remplacer DATABASE_URL par l'URL pooler):
    // directUrl: process.env.DIRECT_URL!,
  },
});
