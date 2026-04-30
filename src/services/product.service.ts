import { getDb } from '../database/connection';
import { NotFoundError } from '../utils/errors.util';
import { CreateProductInput, UpdateProductInput, GetProductsQuery } from '../validators/product.validator';

type ProductRow = {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number | null;
  stock: number;
  imageUrl: string | null;
  imageAlt: string | null;
  rating: number | null;
  ratingCount: number | null;
  badge: string | null;
  isActive: number;
  createdAt: string;
  categoryName: string;
  categoryIcon: string;
};

export class ProductService {
  async getProducts(filters: GetProductsQuery) {
    const { category, search, active, page = 1, limit = 10 } = filters;
    const db = getDb();

    const whereParts: string[] = [];
    const values: unknown[] = [];

    if (category) {
      whereParts.push('LOWER(c.name) = LOWER(?)');
      values.push(category);
    }

    if (search) {
      whereParts.push('(LOWER(p.name) LIKE LOWER(?) OR LOWER(p.description) LIKE LOWER(?))');
      values.push(`%${search}%`, `%${search}%`);
    }

    if (active !== undefined) {
      whereParts.push('p.isActive = ?');
      values.push(active === 'true' ? 1 : 0);
    }

    const whereClause = whereParts.length > 0 ? `WHERE ${whereParts.join(' AND ')}` : '';

    // Calculate pagination
    const skip = (page - 1) * limit;

    const products = db
      .prepare(
        `
        SELECT
          p.*,
          c.name as categoryName,
          c.icon as categoryIcon
        FROM products p
        INNER JOIN categories c ON c.id = p.categoryId
        ${whereClause}
        ORDER BY p.createdAt DESC
        LIMIT ? OFFSET ?
      `
      )
      .all(...values, limit, skip) as ProductRow[];

    const totalResult = db
      .prepare(
        `
        SELECT COUNT(*) as count
        FROM products p
        INNER JOIN categories c ON c.id = p.categoryId
        ${whereClause}
      `
      )
      .get(...values) as { count: number };

    const total = totalResult.count;

    const mappedProducts = products.map((product) => ({
      id: product.id,
      categoryId: product.categoryId,
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      stock: product.stock,
      imageUrl: product.imageUrl,
      imageAlt: product.imageAlt,
      rating: product.rating,
      ratingCount: product.ratingCount,
      badge: product.badge,
      isActive: Boolean(product.isActive),
      createdAt: product.createdAt,
      category: {
        id: product.categoryId,
        name: product.categoryName,
        icon: product.categoryIcon,
      },
    }));

    return {
      products: mappedProducts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProductById(id: number) {
    const db = getDb();
    const product = db
      .prepare(
        `
        SELECT
          p.*,
          c.name as categoryName,
          c.icon as categoryIcon
        FROM products p
        INNER JOIN categories c ON c.id = p.categoryId
        WHERE p.id = ?
      `
      )
      .get(id) as ProductRow | undefined;

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    return {
      id: product.id,
      categoryId: product.categoryId,
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      stock: product.stock,
      imageUrl: product.imageUrl,
      imageAlt: product.imageAlt,
      rating: product.rating,
      ratingCount: product.ratingCount,
      badge: product.badge,
      isActive: Boolean(product.isActive),
      createdAt: product.createdAt,
      category: {
        id: product.categoryId,
        name: product.categoryName,
        icon: product.categoryIcon,
      },
    };
  }

  async createProduct(data: CreateProductInput) {
    const db = getDb();
    const category = db.prepare('SELECT id FROM categories WHERE id = ?').get(data.categoryId);

    if (!category) {
      throw new NotFoundError('Category not found');
    }

    const result = db
      .prepare(
        `
        INSERT INTO products (
          name, description, price, originalPrice, stock, categoryId,
          imageUrl, imageAlt, rating, ratingCount, badge, isActive
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
      )
      .run(
        data.name,
        data.description,
        data.price,
        data.originalPrice ?? null,
        data.stock,
        data.categoryId,
        data.imageUrl ?? null,
        data.imageAlt ?? null,
        data.rating ?? null,
        data.ratingCount ?? null,
        data.badge ?? null,
        data.isActive ? 1 : 0
      );

    return this.getProductById(Number(result.lastInsertRowid));
  }

  async updateProduct(id: number, data: UpdateProductInput) {
    // Check if product exists
    const db = getDb();
    const existingProduct = db.prepare('SELECT id FROM products WHERE id = ?').get(id);

    if (!existingProduct) {
      throw new NotFoundError('Product not found');
    }

    // Check if category exists (if categoryId is being updated)
    if (data.categoryId) {
      const category = db.prepare('SELECT id FROM categories WHERE id = ?').get(data.categoryId);

      if (!category) {
        throw new NotFoundError('Category not found');
      }
    }

    const updates: string[] = [];
    const values: unknown[] = [];

    Object.entries(data).forEach(([key, value]) => {
      updates.push(`${key} = ?`);
      if (key === 'isActive') {
        values.push(value ? 1 : 0);
      } else {
        values.push(value);
      }
    });

    if (updates.length > 0) {
      db.prepare(`UPDATE products SET ${updates.join(', ')} WHERE id = ?`).run(...values, id);
    }

    return this.getProductById(id);
  }

  async deleteProduct(id: number) {
    // Check if product exists
    const db = getDb();
    const existingProduct = db.prepare('SELECT id FROM products WHERE id = ?').get(id);

    if (!existingProduct) {
      throw new NotFoundError('Product not found');
    }

    // Soft delete by setting isActive to false
    db.prepare('UPDATE products SET isActive = 0 WHERE id = ?').run(id);

    return { message: 'Product deleted successfully' };
  }
}
