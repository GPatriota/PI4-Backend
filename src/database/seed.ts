import { getDb } from './connection';

export function seedDatabase(): void {
  const db = getDb();

  const transaction = db.transaction(() => {
    // Check if already seeded
    const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number };
    if (categoryCount.count > 0) {
      console.log('Database already seeded, skipping...');
      return;
    }

    console.log('Seeding database...');

    // Seed categories
    const categories = [
      { name: 'Smartphones', icon: 'phone-portrait-outline' },
      { name: 'Laptops', icon: 'laptop-outline' },
      { name: 'Tablets', icon: 'tablet-portrait-outline' },
      { name: 'Acessórios', icon: 'headset-outline' },
      { name: 'TVs', icon: 'tv-outline' },
    ];

    const insertCategory = db.prepare('INSERT INTO categories (name, icon) VALUES (?, ?)');
    for (const cat of categories) {
      insertCategory.run(cat.name, cat.icon);
    }

    // Seed products
    const products = [
      {
        categoryId: 1,
        name: 'iPhone 15 Pro',
        description: 'Latest iPhone with A17 Pro chip',
        price: 7999.00,
        originalPrice: 8999.00,
        stock: 50,
        imageUrl: 'https://via.placeholder.com/300x300?text=iPhone+15+Pro',
        rating: 4.8,
        ratingCount: 1250,
        badge: 'Oferta',
        isActive: 1,
      },
      {
        categoryId: 2,
        name: 'MacBook Pro 14"',
        description: 'M3 Pro chip, 18GB RAM, 512GB SSD',
        price: 15999.00,
        originalPrice: null,
        stock: 25,
        imageUrl: 'https://via.placeholder.com/300x300?text=MacBook+Pro',
        rating: 4.9,
        ratingCount: 890,
        badge: 'Novo',
        isActive: 1,
      },
      {
        categoryId: 1,
        name: 'Samsung Galaxy S24',
        description: 'Snapdragon 8 Gen 3, 256GB',
        price: 4999.00,
        originalPrice: 5499.00,
        stock: 75,
        imageUrl: 'https://via.placeholder.com/300x300?text=Galaxy+S24',
        rating: 4.7,
        ratingCount: 2100,
        badge: 'Oferta',
        isActive: 1,
      },
      {
        categoryId: 3,
        name: 'iPad Air',
        description: 'M2 chip, 128GB, Wi-Fi',
        price: 4599.00,
        originalPrice: null,
        stock: 40,
        imageUrl: 'https://via.placeholder.com/300x300?text=iPad+Air',
        rating: 4.8,
        ratingCount: 650,
        badge: null,
        isActive: 1,
      },
      {
        categoryId: 4,
        name: 'AirPods Pro',
        description: 'Active Noise Cancellation',
        price: 1899.00,
        originalPrice: 2199.00,
        stock: 120,
        imageUrl: 'https://via.placeholder.com/300x300?text=AirPods+Pro',
        rating: 4.9,
        ratingCount: 3400,
        badge: 'Mais vendido',
        isActive: 1,
      },
    ];

    const insertProduct = db.prepare(`
      INSERT INTO products (categoryId, name, description, price, originalPrice, stock, imageUrl, rating, ratingCount, badge, isActive)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const prod of products) {
      insertProduct.run(
        prod.categoryId,
        prod.name,
        prod.description,
        prod.price,
        prod.originalPrice,
        prod.stock,
        prod.imageUrl,
        prod.rating,
        prod.ratingCount,
        prod.badge,
        prod.isActive
      );
    }

    console.log('✅ Database seeded successfully');
  });

  transaction();
}
