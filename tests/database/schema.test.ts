import { describe, expect, it, beforeEach, afterEach } from '@jest/globals';
import { initDb, getDb, closeDb } from '../../src/database/connection';
import { createTables } from '../../src/database/schema';
import fs from 'fs';
import path from 'path';

const TEST_DB_PATH = path.join(__dirname, 'test-schema.db');

describe('Database Schema', () => {
  beforeEach(() => {
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
    initDb(TEST_DB_PATH);
  });

  afterEach(() => {
    closeDb();
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
  });

  it('creates all required tables', () => {
    createTables();
    const db = getDb();

    const tables = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `).all() as { name: string }[];

    const tableNames = tables.map(t => t.name);
    
    expect(tableNames).toContain('users');
    expect(tableNames).toContain('categories');
    expect(tableNames).toContain('products');
    expect(tableNames).toContain('cartItems');
    expect(tableNames).toContain('orders');
    expect(tableNames).toContain('orderItems');
    expect(tableNames).toContain('addresses');
    expect(tableNames).toContain('accessibilitySettings');
  });

  it('creates users table with correct schema', () => {
    createTables();
    const db = getDb();

    const info = db.prepare('PRAGMA table_info(users)').all() as Array<{
      name: string;
      type: string;
      notnull: number;
      pk: number;
    }>;

    const columns = info.map(c => c.name);
    expect(columns).toContain('id');
    expect(columns).toContain('name');
    expect(columns).toContain('email');
    expect(columns).toContain('password');
    expect(columns).toContain('createdAt');
  });

  it('enforces foreign key constraints', () => {
    createTables();
    const db = getDb();

    // Try to insert cart item with non-existent user
    expect(() => {
      db.prepare('INSERT INTO cartItems (userId, productId, quantity) VALUES (?, ?, ?)').run(999, 1, 1);
    }).toThrow();
  });

  it('cascades deletes for user-related data', () => {
    createTables();
    const db = getDb();
    
    // Insert user
    const userResult = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)').run('Test User', 'test@example.com', 'hashedpassword');
    const userId = userResult.lastInsertRowid as number;
    
    // Insert category and product
    const categoryResult = db.prepare('INSERT INTO categories (name, icon) VALUES (?, ?)').run('Electronics', 'icon-electronics');
    const categoryId = categoryResult.lastInsertRowid as number;
    const productResult = db.prepare('INSERT INTO products (name, categoryId, price, stock, rating) VALUES (?, ?, ?, ?, ?)').run('Test Product', categoryId, 100, 10, 4.5);
    const productId = productResult.lastInsertRowid as number;
    
    // Insert cart item
    db.prepare('INSERT INTO cartItems (userId, productId, quantity) VALUES (?, ?, ?)').run(userId, productId, 2);
    
    // Insert order
    const orderResult = db.prepare('INSERT INTO orders (userId, status, paymentStatus, subtotal, total) VALUES (?, ?, ?, ?, ?)').run(userId, 'pending', 'pending', 100, 100);
    const orderId = orderResult.lastInsertRowid as number;
    
    // Insert order item
    db.prepare('INSERT INTO orderItems (orderId, productId, quantity, unitPrice) VALUES (?, ?, ?, ?)').run(orderId, productId, 1, 100);
    
    // Insert address
    db.prepare('INSERT INTO addresses (userId, label, street, city, state, zipCode) VALUES (?, ?, ?, ?, ?, ?)').run(userId, 'Home', '123 Main St', 'Test City', 'TS', '12345');
    
    // Insert accessibility settings
    db.prepare('INSERT INTO accessibilitySettings (userId, fontScale, highContrast, largeButtons) VALUES (?, ?, ?, ?)').run(userId, 1.0, 1, 0);
    
    // Delete user
    db.prepare('DELETE FROM users WHERE id = ?').run(userId);
    
    // Verify all related records were deleted
    const cartCount = db.prepare('SELECT COUNT(*) as count FROM cartItems WHERE userId = ?').get(userId) as { count: number };
    expect(cartCount.count).toBe(0);
    
    const orderCount = db.prepare('SELECT COUNT(*) as count FROM orders WHERE userId = ?').get(userId) as { count: number };
    expect(orderCount.count).toBe(0);
    
    const addressCount = db.prepare('SELECT COUNT(*) as count FROM addresses WHERE userId = ?').get(userId) as { count: number };
    expect(addressCount.count).toBe(0);
    
    const accessibilityCount = db.prepare('SELECT COUNT(*) as count FROM accessibilitySettings WHERE userId = ?').get(userId) as { count: number };
    expect(accessibilityCount.count).toBe(0);
  });

  it('enforces check constraint on order status', () => {
    createTables();
    const db = getDb();
    
    // Insert valid user first
    const userResult = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)').run('Test User', 'test@example.com', 'hashedpassword');
    const userId = userResult.lastInsertRowid as number;
    
    // Try invalid order status
    expect(() => {
      db.prepare('INSERT INTO orders (userId, status, paymentStatus, subtotal, total) VALUES (?, ?, ?, ?, ?)').run(userId, 'invalid_status', 'pending', 100, 100);
    }).toThrow();
    
    // Try invalid payment status
    expect(() => {
      db.prepare('INSERT INTO orders (userId, status, paymentStatus, subtotal, total) VALUES (?, ?, ?, ?, ?)').run(userId, 'pending', 'invalid_payment', 100, 100);
    }).toThrow();
  });

  it('enforces unique constraint on cartItems', () => {
    createTables();
    const db = getDb();
    
    // Insert user
    const userResult = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)').run('Test User', 'test@example.com', 'hashedpassword');
    const userId = userResult.lastInsertRowid as number;
    
    // Insert category and product
    const categoryResult = db.prepare('INSERT INTO categories (name, icon) VALUES (?, ?)').run('Electronics', 'icon-electronics');
    const categoryId = categoryResult.lastInsertRowid as number;
    const productResult = db.prepare('INSERT INTO products (name, categoryId, price, stock, rating) VALUES (?, ?, ?, ?, ?)').run('Test Product', categoryId, 100, 10, 4.5);
    const productId = productResult.lastInsertRowid as number;
    
    // First insert should work
    db.prepare('INSERT INTO cartItems (userId, productId, quantity) VALUES (?, ?, ?)').run(userId, productId, 1);
    
    // Second insert of same user+product should fail
    expect(() => {
      db.prepare('INSERT INTO cartItems (userId, productId, quantity) VALUES (?, ?, ?)').run(userId, productId, 1);
    }).toThrow();
  });
});
