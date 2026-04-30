// Constants for the application

export const SHIPPING = {
  COST: 19.9,
  FREE_THRESHOLD: 499,
} as const;

export const INSTALLMENTS = {
  MAX_COUNT: 12,
  MIN_VALUE: 100,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const PASSWORD = {
  MIN_LENGTH: 8,
  SALT_ROUNDS: 12,
} as const;
