import { describe, expect, it, beforeEach, afterEach } from '@jest/globals';
import { getDb, closeDb, initDb } from '../../src/database/connection';
import fs from 'fs';
import path from 'path';

const TEST_DB_PATH = path.join(__dirname, 'test.db');

describe('Database Connection', () => {
  beforeEach(() => {
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
  });

  afterEach(() => {
    closeDb();
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
  });

  it('initializes database with foreign keys enabled', () => {
    initDb(TEST_DB_PATH);
    const db = getDb();
    
    const result = db.prepare('PRAGMA foreign_keys').get() as { foreign_keys: number };
    expect(result.foreign_keys).toBe(1);
  });

  it('initializes database with WAL mode enabled', () => {
    initDb(TEST_DB_PATH);
    const db = getDb();
    
    const result = db.prepare('PRAGMA journal_mode').get() as { journal_mode: string };
    expect(result.journal_mode).toBe('wal');
  });

  it('returns same instance on multiple getDb calls', () => {
    initDb(TEST_DB_PATH);
    const db1 = getDb();
    const db2 = getDb();
    
    expect(db1).toBe(db2);
  });

  it('does not reinitialize on subsequent initDb calls', () => {
    initDb(TEST_DB_PATH);
    const db1 = getDb();
    initDb(TEST_DB_PATH); // Should do nothing
    const db2 = getDb();
    expect(db1).toBe(db2);
  });

  it('throws error if getDb called before initDb', () => {
    expect(() => getDb()).toThrow('Database not initialized');
  });

  it('closes database and resets state', () => {
    initDb(TEST_DB_PATH);
    getDb(); // Ensure initialized
    closeDb();
    expect(() => getDb()).toThrow('Database not initialized');
  });
});
