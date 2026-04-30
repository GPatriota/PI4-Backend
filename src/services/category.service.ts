import { getDb } from '../database/connection';

export class CategoryService {
  async getCategories() {
    const db = getDb();
    const categories = db
      .prepare(
        `
        SELECT
          c.id,
          c.name,
          c.icon,
          COUNT(p.id) as productCount
        FROM categories c
        LEFT JOIN products p ON p.categoryId = c.id AND p.isActive = 1
        GROUP BY c.id, c.name, c.icon
        ORDER BY c.name ASC
      `
      )
      .all() as Array<{ id: number; name: string; icon: string; productCount: number }>;

    // Transform the response to include product count
    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      icon: category.icon,
      productCount: category.productCount,
    }));
  }
}
