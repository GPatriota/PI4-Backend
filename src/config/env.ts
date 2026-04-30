import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  SQLITE_DB_PATH: z.string().default('./data/electroshop.db'),
  PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  ALLOWED_ORIGINS: z.string().default('http://localhost:8081'),
  MERCADO_PAGO_ACCESS_TOKEN: z.string().optional(),
  MERCADO_PAGO_SUCCESS_URL: z.string().default('electroshop://payment/success'),
  MERCADO_PAGO_FAILURE_URL: z.string().default('electroshop://payment/failure'),
  MERCADO_PAGO_PENDING_URL: z.string().default('electroshop://payment/pending'),
  MERCADO_PAGO_WEBHOOK_URL: z.string().url().optional(),
});

const env = envSchema.parse(process.env);

export default {
  database: {
    path: env.SQLITE_DB_PATH,
  },
  server: {
    port: parseInt(env.PORT, 10),
    env: env.NODE_ENV,
  },
  jwt: {
    accessSecret: env.JWT_ACCESS_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
    accessExpiresIn: env.JWT_ACCESS_EXPIRES_IN,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  },
  cors: {
    origins: env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()),
  },
  mercadoPago: {
    accessToken: env.MERCADO_PAGO_ACCESS_TOKEN,
    successUrl: env.MERCADO_PAGO_SUCCESS_URL,
    failureUrl: env.MERCADO_PAGO_FAILURE_URL,
    pendingUrl: env.MERCADO_PAGO_PENDING_URL,
    webhookUrl: env.MERCADO_PAGO_WEBHOOK_URL,
  },
};
