import { describe, expect, it } from '@jest/globals';
import request from 'supertest';
import app from '../src/app';

describe('Authentication Endpoints', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app).post('/api/v1/auth/register').send({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123',
      });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
    });

    it('should fail with invalid email', async () => {
      const response = await request(app).post('/api/v1/auth/register').send({
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123',
      });

      expect(response.status).toBe(400);
    });

    it('should fail with short password', async () => {
      const response = await request(app).post('/api/v1/auth/register').send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'pass',
      });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      const email = `login${Date.now()}@example.com`;
      await request(app).post('/api/v1/auth/register').send({
        name: 'Login User',
        email,
        password: 'password123',
      });

      const response = await request(app).post('/api/v1/auth/login').send({
        email,
        password: 'password123',
      });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('accessToken');
    });

    it('should fail with invalid credentials', async () => {
      const email = `badlogin${Date.now()}@example.com`;
      await request(app).post('/api/v1/auth/register').send({
        name: 'Bad Login User',
        email,
        password: 'password123',
      });

      const response = await request(app).post('/api/v1/auth/login').send({
        email,
        password: 'wrongpassword',
      });

      expect(response.status).toBe(401);
    });
  });
});
