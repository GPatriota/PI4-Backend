import { afterAll, afterEach, beforeAll, beforeEach } from '@jest/globals';
import path from 'path';
import { initDb, closeDb } from '../src/database/connection';
import { createTables } from '../src/database/schema';
import { seedDatabase } from '../src/database/seed';
import env from '../src/config/env';

// Test setup for Jest
beforeAll(() => {
  const dbPath = path.resolve(env.database.path);
  initDb(dbPath);
  createTables();
  seedDatabase();
});

afterAll(() => {
  closeDb();
});

beforeEach(() => {
  // Setup before each test
});

afterEach(() => {
  // Cleanup after each test
});
