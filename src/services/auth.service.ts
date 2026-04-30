import { getDb } from '../database/connection';
import { hashPassword, comparePassword } from '../utils/password.util';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.util';
import { ConflictError, UnauthorizedError, NotFoundError } from '../utils/errors.util';
import { RegisterInput, LoginInput } from '../validators/auth.validator';

type UserRow = {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: string;
};

export class AuthService {
  async register(data: RegisterInput) {
    const db = getDb();
    // Check if user already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(data.email);

    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    // Determine role based on email
    const role = data.email.toLowerCase().includes('admin') ? 'ADMIN' : 'USER';

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const result = db
      .prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)')
      .run(data.name, data.email, hashedPassword);

    const user = db
      .prepare('SELECT id, name, email, createdAt FROM users WHERE id = ?')
      .get(Number(result.lastInsertRowid)) as Omit<UserRow, 'password'>;

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role,
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async login(data: LoginInput) {
    const db = getDb();
    // Find user
    const user = db
      .prepare('SELECT id, name, email, password, createdAt FROM users WHERE email = ?')
      .get(data.email) as UserRow | undefined;

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await comparePassword(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const role = user.email.toLowerCase().includes('admin') ? 'ADMIN' : 'USER';

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role,
        createdAt: user.createdAt,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(token: string) {
    const db = getDb();
    // Verify refresh token
    const payload = verifyRefreshToken(token);

    // Check if user still exists
    const user = db
      .prepare('SELECT id, name, email, createdAt FROM users WHERE id = ?')
      .get(payload.userId) as Omit<UserRow, 'password'> | undefined;

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const role = user.email.toLowerCase().includes('admin') ? 'ADMIN' : 'USER';

    // Generate new tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async getMe(userId: number) {
    const db = getDb();
    const user = db
      .prepare('SELECT id, name, email, createdAt FROM users WHERE id = ?')
      .get(userId) as Omit<UserRow, 'password'> | undefined;

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return {
      ...user,
      role: user.email.toLowerCase().includes('admin') ? 'ADMIN' : 'USER',
      updatedAt: null,
    };
  }
}
