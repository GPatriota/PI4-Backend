import { describe, expect, it } from '@jest/globals';
import request from 'supertest';
import app from '../src/app';

describe('Catalog Endpoints', () => {
  it('returns categories with productCount', async () => {
    const response = await request(app).get('/api/v1/categories');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(Array.isArray(response.body.data.categories)).toBe(true);
    expect(response.body.data.categories.length).toBeGreaterThan(0);
    expect(response.body.data.categories[0]).toHaveProperty('productCount');
  });

  it('returns paginated products list', async () => {
    const response = await request(app).get('/api/v1/products?page=1&limit=2&active=true');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(Array.isArray(response.body.data.products)).toBe(true);
    expect(response.body.data.pagination).toHaveProperty('total');
  });

  it('returns 404 for unknown product id', async () => {
    const response = await request(app).get('/api/v1/products/999999');

    expect(response.status).toBe(404);
  });
});
