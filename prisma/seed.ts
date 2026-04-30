import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create users
  const hashedUserPassword = await bcrypt.hash('password123', 12);
  const hashedAdminPassword = await bcrypt.hash('admin123', 12);

  const regularUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'João Silva',
      email: 'user@example.com',
      password: hashedUserPassword,
      role: UserRole.USER,
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@electroshop.com' },
    update: {},
    create: {
      name: 'Admin ElectroShop',
      email: 'admin@electroshop.com',
      password: hashedAdminPassword,
      role: UserRole.ADMIN,
    },
  });

  console.log('✅ Users created');

  // Create categories
  const celulares = await prisma.category.upsert({
    where: { name: 'Celulares' },
    update: {},
    create: {
      name: 'Celulares',
      icon: 'phone-portrait-outline',
    },
  });

  const computadores = await prisma.category.upsert({
    where: { name: 'Computadores' },
    update: {},
    create: {
      name: 'Computadores',
      icon: 'desktop-outline',
    },
  });

  const notebooks = await prisma.category.upsert({
    where: { name: 'Notebooks' },
    update: {},
    create: {
      name: 'Notebooks',
      icon: 'laptop-outline',
    },
  });

  console.log('✅ Categories created');

  // Create products
  const products = [
    // Celulares
    {
      categoryId: celulares.id,
      name: 'iPhone 15 Pro Max',
      description:
        'O iPhone 15 Pro Max conta com a tecnologia mais avançada da Apple. Com chip A17 Pro, câmera de 48MP e tela Super Retina XDR de 6.7 polegadas.',
      price: 9999.99,
      originalPrice: 10999.99,
      stock: 15,
      imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569',
      imageAlt: 'iPhone 15 Pro Max',
      rating: 4.8,
      ratingCount: 234,
      badge: 'Novo',
      isActive: true,
    },
    {
      categoryId: celulares.id,
      name: 'Samsung Galaxy S24 Ultra',
      description:
        'Galaxy S24 Ultra com S Pen integrada, câmera de 200MP e tela Dynamic AMOLED 2X de 6.8 polegadas. O melhor da Samsung.',
      price: 8499.99,
      originalPrice: 9299.99,
      stock: 20,
      imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c',
      imageAlt: 'Samsung Galaxy S24 Ultra',
      rating: 4.7,
      ratingCount: 189,
      badge: 'Lançamento',
      isActive: true,
    },
    {
      categoryId: celulares.id,
      name: 'Xiaomi 14 Pro',
      description:
        'Xiaomi 14 Pro com Snapdragon 8 Gen 3, câmera Leica de 50MP e carregamento ultrarrápido de 120W.',
      price: 4999.99,
      originalPrice: null,
      stock: 30,
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97',
      imageAlt: 'Xiaomi 14 Pro',
      rating: 4.6,
      ratingCount: 145,
      badge: null,
      isActive: true,
    },

    // Computadores
    {
      categoryId: computadores.id,
      name: 'iMac 24" M3',
      description:
        'iMac com chip M3, tela Retina 4.5K de 24 polegadas e design ultrafino em alumínio. Perfeito para criadores de conteúdo.',
      price: 15999.99,
      originalPrice: 16999.99,
      stock: 8,
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
      imageAlt: 'iMac 24 polegadas',
      rating: 4.9,
      ratingCount: 87,
      badge: 'Novo',
      isActive: true,
    },
    {
      categoryId: computadores.id,
      name: 'PC Gamer RTX 4080',
      description:
        'PC Gamer completo com RTX 4080, Intel i9-14900K, 32GB RAM DDR5 e SSD 2TB NVMe. Pronto para jogos em 4K.',
      price: 12999.99,
      originalPrice: null,
      stock: 5,
      imageUrl: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c',
      imageAlt: 'PC Gamer RTX 4080',
      rating: 4.8,
      ratingCount: 156,
      badge: null,
      isActive: true,
    },

    // Notebooks
    {
      categoryId: notebooks.id,
      name: 'MacBook Pro 16" M3 Max',
      description:
        'MacBook Pro com chip M3 Max, 36GB de RAM, SSD de 1TB e tela Liquid Retina XDR. O notebook mais poderoso da Apple.',
      price: 24999.99,
      originalPrice: 26999.99,
      stock: 6,
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
      imageAlt: 'MacBook Pro 16 polegadas',
      rating: 4.9,
      ratingCount: 203,
      badge: 'Lançamento',
      isActive: true,
    },
    {
      categoryId: notebooks.id,
      name: 'Dell XPS 15',
      description:
        'Dell XPS 15 com Intel i7-13700H, RTX 4060, 16GB RAM e tela OLED 3.5K touch. Design premium em alumínio.',
      price: 10999.99,
      originalPrice: 11999.99,
      stock: 12,
      imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
      imageAlt: 'Dell XPS 15',
      rating: 4.7,
      ratingCount: 178,
      badge: null,
      isActive: true,
    },
    {
      categoryId: notebooks.id,
      name: 'Lenovo Legion 5 Pro',
      description:
        'Notebook gamer Lenovo Legion 5 Pro com Ryzen 7, RTX 4070, 16GB RAM e tela QHD 165Hz. Ideal para jogos.',
      price: 7999.99,
      originalPrice: null,
      stock: 10,
      imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302',
      imageAlt: 'Lenovo Legion 5 Pro',
      rating: 4.6,
      ratingCount: 134,
      badge: null,
      isActive: true,
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log('✅ Products created');

  // Create addresses for regular user
  await prisma.address.create({
    data: {
      userId: regularUser.id,
      label: 'Casa',
      street: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      isDefault: true,
    },
  });

  await prisma.address.create({
    data: {
      userId: regularUser.id,
      label: 'Trabalho',
      street: 'Av. Paulista, 1000',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
      isDefault: false,
    },
  });

  console.log('✅ Addresses created');

  // Create accessibility settings for regular user
  await prisma.accessibilitySettings.create({
    data: {
      userId: regularUser.id,
      fontScale: 1.0,
      highContrast: false,
      largeButtons: false,
    },
  });

  console.log('✅ Accessibility settings created');

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
