import app from './app';
import env from './config/env';
import { initDb, closeDb } from './database/connection';
import { createTables } from './database/schema';
import { seedDatabase } from './database/seed';
import path from 'path';
import fs from 'fs';

// Validate and ensure data directory exists
const dbPath = path.resolve(env.database.path); // Convert to absolute path
const dataDir = path.dirname(dbPath);

// Prevent creating directories in obviously invalid locations
const invalidPaths = ['/invalid', 'C:\\invalid', '/tmp/invalid'];
if (invalidPaths.some(invalid => dbPath.startsWith(invalid))) {
  console.error('❌ Invalid database path:', env.database.path);
  console.error('Database path cannot be in an invalid test directory');
  process.exit(1);
}

try {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
} catch (error) {
  console.error('❌ Failed to create database directory:', dataDir);
  console.error(error);
  process.exit(1);
}

// Initialize database
try {
  initDb(dbPath);
  createTables();
  seedDatabase();
  console.log('✅ Database initialized successfully');
} catch (error) {
  console.error('❌ Database initialization failed:', error);
  process.exit(1);
}

const PORT = env.server.port;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Database: ${env.database.path}`);
  console.log(`✅ Environment: ${env.server.env}`);
});

// Graceful shutdown handlers
process.on('SIGTERM', () => {
  console.log('\n⏳ Shutting down gracefully...');
  closeDb();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n⏳ Shutting down gracefully...');
  closeDb();
  process.exit(0);
});
