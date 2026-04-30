import { describe, expect, it } from '@jest/globals';
import request from 'supertest';
import app from '../src/app';

async function registerAndLogin() {
  const email = `flow${Date.now()}@example.com`;
  const password = 'password123';

  const registerResponse = await request(app).post('/api/v1/auth/register').send({
    name: 'Flow User',
    email,
    password,
  });

  return {
    userId: registerResponse.body.data.user.id as number,
    token: registerResponse.body.data.accessToken as string,
  };
}

describe('Account, Address, Cart, Orders Endpoints', () => {
  it('gets current user by id', async () => {
    const { userId, token } = await registerAndLogin();
    const response = await request(app)
      .get(`/api/v1/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data.user.id).toBe(userId);
  });

  it('creates and lists addresses', async () => {
    const { token } = await registerAndLogin();

    const createResponse = await request(app)
      .post('/api/v1/addresses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        label: 'Home',
        street: '123 Main St',
        city: 'Sao Paulo',
        state: 'SP',
        zipCode: '01000-000',
        isDefault: true,
      });

    expect(createResponse.status).toBe(201);

    const listResponse = await request(app)
      .get('/api/v1/addresses')
      .set('Authorization', `Bearer ${token}`);

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.data.addresses.length).toBeGreaterThan(0);
  });

  it('adds item to cart and reads cart totals', async () => {
    const { token } = await registerAndLogin();

    const addResponse = await request(app)
      .post('/api/v1/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: 1, quantity: 1 });

    expect(addResponse.status).toBe(201);

    const cartResponse = await request(app)
      .get('/api/v1/cart')
      .set('Authorization', `Bearer ${token}`);

    expect(cartResponse.status).toBe(200);
    expect(Array.isArray(cartResponse.body.data.items)).toBe(true);
    expect(cartResponse.body.data.totals).toHaveProperty('total');
  });

  it('returns empty order list for new user', async () => {
    const { token } = await registerAndLogin();
    const response = await request(app)
      .get('/api/v1/orders')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(Array.isArray(response.body.data.orders)).toBe(true);
  });
});
