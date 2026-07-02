/**
 * PHRONESIS — Database Setup Script
 *
 * Run this once after deploying to Vercel to:
 *   1. Push the schema to your PostgreSQL database
 *   2. Seed the database with the elite fleet + site settings
 *
 * Usage (locally with DATABASE_URL set in .env):
 *   bun run scripts/setup-db.ts
 *
 * Or with an inline env var:
 *   DATABASE_URL="postgresql://..." bun run scripts/setup-db.ts
 */
import { db } from '../src/lib/db';

async function main() {
  console.log('🔧 PHRONESIS — Database Setup');
  console.log('   This will create all tables and seed the elite fleet.');
  console.log('');

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set.');
    console.error('   Set it in .env (local) or pass inline: DATABASE_URL="..." bun run scripts/setup-db.ts');
    process.exit(1);
  }

  console.log('📍 DATABASE_URL: ' + process.env.DATABASE_URL.replace(/:[^:@]+@/, ':***@'));
  console.log('');
  console.log('⚠️  Run `bun run db:push` first to create the schema, then this script to seed.');
  console.log('   Example:');
  console.log('     bun run db:push');
  console.log('     bun run scripts/setup-db.ts');
  console.log('');

  // Count existing records
  const cars = await db.car.count();
  const settings = await db.siteSettings.count();
  console.log(`Current state: ${cars} cars, ${settings} site settings`);

  if (cars > 0 || settings > 0) {
    console.log('⚠️  Database already has data. Aborting to prevent duplicates.');
    console.log('   To reset, drop all tables first (e.g. `bun run db:push --force-reset`).');
    process.exit(0);
  }

  console.log('');
  console.log('✅ Database is empty and ready.');
  console.log('   Run `bun run scripts/seed.ts` to populate the elite fleet.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await db.$disconnect(); });
