import { getDb } from '../database/connection';
import { hashPassword } from '../utils/password.util';
import { NotFoundError, ForbiddenError, ConflictError } from '../utils/errors.util';
import { UpdateUserInput, UpdateAccessibilityInput } from '../validators/user.validator';

export class UserService {
  async getUserById(userId: number, requestingUserId: number, requestingUserRole: string) {
    const db = getDb();
    // Only allow users to access their own data unless they're admin
    if (userId !== requestingUserId && requestingUserRole !== 'ADMIN') {
      throw new ForbiddenError('You can only access your own user data');
    }

    const user = db
      .prepare('SELECT id, name, email, createdAt FROM users WHERE id = ?')
      .get(userId) as { id: number; name: string; email: string; createdAt: string } | undefined;

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const accessibilitySettings = db
      .prepare(
        'SELECT userId, fontScale, highContrast, largeButtons FROM accessibilitySettings WHERE userId = ?'
      )
      .get(userId) as
      | { userId: number; fontScale: number; highContrast: number; largeButtons: number }
      | undefined;

    return {
      ...user,
      role: user.email.toLowerCase().includes('admin') ? 'ADMIN' : 'USER',
      updatedAt: null,
      accessibilitySettings: accessibilitySettings
        ? {
            userId: accessibilitySettings.userId,
            fontScale: accessibilitySettings.fontScale,
            highContrast: Boolean(accessibilitySettings.highContrast),
            largeButtons: Boolean(accessibilitySettings.largeButtons),
          }
        : null,
    };
  }

  async updateUser(
    userId: number,
    data: UpdateUserInput,
    requestingUserId: number,
    requestingUserRole: string
  ) {
    const db = getDb();
    // Only allow users to update their own data unless they're admin
    if (userId !== requestingUserId && requestingUserRole !== 'ADMIN') {
      throw new ForbiddenError('You can only update your own user data');
    }

    // Check if user exists
    const existingUser = db
      .prepare('SELECT id, email FROM users WHERE id = ?')
      .get(userId) as { id: number; email: string } | undefined;

    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    // Check if email is already taken
    if (data.email && data.email !== existingUser.email) {
      const emailExists = db.prepare('SELECT id FROM users WHERE email = ?').get(data.email);

      if (emailExists) {
        throw new ConflictError('Email is already in use');
      }
    }

    // Prepare update data
    const updateData: {
      name?: string;
      email?: string;
      password?: string;
    } = {};

    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.password) {
      updateData.password = await hashPassword(data.password);
    }

    // Update user
    const updates: string[] = [];
    const values: unknown[] = [];

    if (updateData.name !== undefined) {
      updates.push('name = ?');
      values.push(updateData.name);
    }
    if (updateData.email !== undefined) {
      updates.push('email = ?');
      values.push(updateData.email);
    }
    if (updateData.password !== undefined) {
      updates.push('password = ?');
      values.push(updateData.password);
    }

    if (updates.length > 0) {
      db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...values, userId);
    }

    const user = db
      .prepare('SELECT id, name, email, createdAt FROM users WHERE id = ?')
      .get(userId) as { id: number; name: string; email: string; createdAt: string };

    return {
      ...user,
      role: user.email.toLowerCase().includes('admin') ? 'ADMIN' : 'USER',
      updatedAt: null,
    };
  }

  async deleteUser(userId: number, requestingUserId: number, requestingUserRole: string) {
    const db = getDb();
    // Only allow users to delete their own account unless they're admin
    if (userId !== requestingUserId && requestingUserRole !== 'ADMIN') {
      throw new ForbiddenError('You can only delete your own account');
    }

    // Check if user exists
    const existingUser = db.prepare('SELECT id FROM users WHERE id = ?').get(userId);

    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    // Delete user (cascade delete will handle related records)
    db.prepare('DELETE FROM users WHERE id = ?').run(userId);

    return { message: 'User deleted successfully' };
  }

  async updateAccessibilitySettings(
    userId: number,
    data: UpdateAccessibilityInput,
    requestingUserId: number
  ) {
    const db = getDb();
    // Only allow users to update their own settings
    if (userId !== requestingUserId) {
      throw new ForbiddenError('You can only update your own accessibility settings');
    }

    // Check if user exists
    const existingUser = db.prepare('SELECT id FROM users WHERE id = ?').get(userId);

    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    // Upsert accessibility settings
    const existingSettings = db
      .prepare('SELECT userId FROM accessibilitySettings WHERE userId = ?')
      .get(userId);

    if (existingSettings) {
      db.prepare(
        `
        UPDATE accessibilitySettings
        SET fontScale = ?, highContrast = ?, largeButtons = ?
        WHERE userId = ?
      `
      ).run(
        data.fontScale ?? 1.0,
        data.highContrast === undefined ? 0 : data.highContrast ? 1 : 0,
        data.largeButtons === undefined ? 0 : data.largeButtons ? 1 : 0,
        userId
      );
    } else {
      db.prepare(
        `
        INSERT INTO accessibilitySettings (userId, fontScale, highContrast, largeButtons)
        VALUES (?, ?, ?, ?)
      `
      ).run(
        userId,
        data.fontScale ?? 1.0,
        data.highContrast ? 1 : 0,
        data.largeButtons ? 1 : 0
      );
    }

    const settings = db
      .prepare(
        'SELECT userId, fontScale, highContrast, largeButtons FROM accessibilitySettings WHERE userId = ?'
      )
      .get(userId) as { userId: number; fontScale: number; highContrast: number; largeButtons: number };

    return {
      userId: settings.userId,
      fontScale: settings.fontScale,
      highContrast: Boolean(settings.highContrast),
      largeButtons: Boolean(settings.largeButtons),
    };
  }
}
