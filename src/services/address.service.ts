import { getDb } from '../database/connection';
import { NotFoundError, ForbiddenError } from '../utils/errors.util';
import { CreateAddressInput, UpdateAddressInput } from '../validators/address.validator';

export class AddressService {
  async getAddresses(userId: number) {
    const db = getDb();
    const addresses = db
      .prepare(
        `
        SELECT id, userId, label, street, city, state, zipCode, isDefault
        FROM addresses
        WHERE userId = ?
        ORDER BY isDefault DESC, id ASC
      `
      )
      .all(userId) as Array<{
      id: number;
      userId: number;
      label: string;
      street: string;
      city: string;
      state: string;
      zipCode: string;
      isDefault: number;
    }>;

    return addresses.map((address) => ({ ...address, isDefault: Boolean(address.isDefault) }));
  }

  async createAddress(userId: number, data: CreateAddressInput) {
    const db = getDb();
    // If isDefault is true, unset other defaults
    if (data.isDefault) {
      db.prepare('UPDATE addresses SET isDefault = 0 WHERE userId = ? AND isDefault = 1').run(userId);
    }

    const result = db
      .prepare(
        `
        INSERT INTO addresses (userId, label, street, city, state, zipCode, isDefault)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `
      )
      .run(
        userId,
        data.label,
        data.street,
        data.city,
        data.state,
        data.zipCode,
        data.isDefault ? 1 : 0
      );

    const address = db
      .prepare('SELECT id, userId, label, street, city, state, zipCode, isDefault FROM addresses WHERE id = ?')
      .get(Number(result.lastInsertRowid)) as {
      id: number;
      userId: number;
      label: string;
      street: string;
      city: string;
      state: string;
      zipCode: string;
      isDefault: number;
    };

    return { ...address, isDefault: Boolean(address.isDefault) };
  }

  async updateAddress(userId: number, addressId: number, data: UpdateAddressInput) {
    const db = getDb();
    // Check if address exists and belongs to user
    const existingAddress = db
      .prepare('SELECT id, userId FROM addresses WHERE id = ?')
      .get(addressId) as { id: number; userId: number } | undefined;

    if (!existingAddress) {
      throw new NotFoundError('Address not found');
    }

    if (existingAddress.userId !== userId) {
      throw new ForbiddenError('You can only update your own addresses');
    }

    // If isDefault is true, unset other defaults
    if (data.isDefault) {
      db.prepare('UPDATE addresses SET isDefault = 0 WHERE userId = ? AND isDefault = 1 AND id <> ?').run(
        userId,
        addressId
      );
    }

    const updates: string[] = [];
    const values: unknown[] = [];
    Object.entries(data).forEach(([key, value]) => {
      updates.push(`${key} = ?`);
      values.push(key === 'isDefault' ? (value ? 1 : 0) : value);
    });

    if (updates.length > 0) {
      db.prepare(`UPDATE addresses SET ${updates.join(', ')} WHERE id = ?`).run(...values, addressId);
    }

    const address = db
      .prepare('SELECT id, userId, label, street, city, state, zipCode, isDefault FROM addresses WHERE id = ?')
      .get(addressId) as {
      id: number;
      userId: number;
      label: string;
      street: string;
      city: string;
      state: string;
      zipCode: string;
      isDefault: number;
    };

    return { ...address, isDefault: Boolean(address.isDefault) };
  }

  async deleteAddress(userId: number, addressId: number) {
    const db = getDb();
    // Check if address exists and belongs to user
    const existingAddress = db
      .prepare('SELECT id, userId FROM addresses WHERE id = ?')
      .get(addressId) as { id: number; userId: number } | undefined;

    if (!existingAddress) {
      throw new NotFoundError('Address not found');
    }

    if (existingAddress.userId !== userId) {
      throw new ForbiddenError('You can only delete your own addresses');
    }

    db.prepare('DELETE FROM addresses WHERE id = ?').run(addressId);

    return { message: 'Address deleted successfully' };
  }

  async setDefaultAddress(userId: number, addressId: number) {
    const db = getDb();
    // Check if address exists and belongs to user
    const existingAddress = db
      .prepare('SELECT id, userId FROM addresses WHERE id = ?')
      .get(addressId) as { id: number; userId: number } | undefined;

    if (!existingAddress) {
      throw new NotFoundError('Address not found');
    }

    if (existingAddress.userId !== userId) {
      throw new ForbiddenError('You can only update your own addresses');
    }

    // Unset all other defaults for this user
    db.prepare('UPDATE addresses SET isDefault = 0 WHERE userId = ? AND isDefault = 1').run(userId);

    // Set this address as default
    db.prepare('UPDATE addresses SET isDefault = 1 WHERE id = ?').run(addressId);
    const address = db
      .prepare('SELECT id, userId, label, street, city, state, zipCode, isDefault FROM addresses WHERE id = ?')
      .get(addressId) as {
      id: number;
      userId: number;
      label: string;
      street: string;
      city: string;
      state: string;
      zipCode: string;
      isDefault: number;
    };

    return { ...address, isDefault: Boolean(address.isDefault) };
  }
}
