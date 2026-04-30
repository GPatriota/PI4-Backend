-- Seed data for ElectroShop Backend

-- Insert Users
INSERT INTO "User" (name, email, password, role, "updatedAt") VALUES
  ('João Silva', 'user@example.com', '$2b$12$TO9yti8sN7PB84qKEm7xS.L2uwjfol0cqVCxiKZDOGwAujeKH8lC2', 'USER', NOW()),
  ('Admin ElectroShop', 'admin@electroshop.com', '$2b$12$.gD/0aaia..sk/PbSGgo1Obu8U85cPmW2sWW4Doat/xjOrC4Sy14C', 'ADMIN', NOW())
ON CONFLICT (email) DO NOTHING;

-- Insert Categories
INSERT INTO "Category" (name, icon) VALUES
  ('Celulares', 'phone-portrait-outline'),
  ('Computadores', 'desktop-outline'),
  ('Notebooks', 'laptop-outline')
ON CONFLICT (name) DO NOTHING;

-- Get the category and user IDs for use in subsequent inserts
DO $$
DECLARE
  cat_celulares_id INT;
  cat_computadores_id INT;
  cat_notebooks_id INT;
  user_regular_id INT;
BEGIN
  -- Get category IDs
  SELECT id INTO cat_celulares_id FROM "Category" WHERE name = 'Celulares';
  SELECT id INTO cat_computadores_id FROM "Category" WHERE name = 'Computadores';
  SELECT id INTO cat_notebooks_id FROM "Category" WHERE name = 'Notebooks';
  
  -- Get user ID
  SELECT id INTO user_regular_id FROM "User" WHERE email = 'user@example.com';
  
  -- Insert Products
  INSERT INTO "Product" ("categoryId", name, description, price, "originalPrice", stock, "imageUrl", "imageAlt", rating, "ratingCount", badge, "isActive", "updatedAt") VALUES
    -- Celulares
    (cat_celulares_id, 'iPhone 15 Pro Max', 
     'O iPhone 15 Pro Max conta com a tecnologia mais avançada da Apple. Com chip A17 Pro, câmera de 48MP e tela Super Retina XDR de 6.7 polegadas.',
     9999.99, 10999.99, 15, 
     'https://images.unsplash.com/photo-1695048133142-1a20484d2569', 
     'iPhone 15 Pro Max', 4.8, 234, 'Novo', true, NOW()),
    
    (cat_celulares_id, 'Samsung Galaxy S24 Ultra',
     'Galaxy S24 Ultra com S Pen integrada, câmera de 200MP e tela Dynamic AMOLED 2X de 6.8 polegadas. O melhor da Samsung.',
     8499.99, 9299.99, 20,
     'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c',
     'Samsung Galaxy S24 Ultra', 4.7, 189, 'Lançamento', true, NOW()),
    
    (cat_celulares_id, 'Xiaomi 14 Pro',
     'Xiaomi 14 Pro com Snapdragon 8 Gen 3, câmera Leica de 50MP e carregamento ultrarrápido de 120W.',
     4999.99, NULL, 30,
     'https://images.unsplash.com/photo-1598327105666-5b89351aff97',
     'Xiaomi 14 Pro', 4.6, 145, NULL, true, NOW()),
    
    -- Computadores
    (cat_computadores_id, 'iMac 24" M3',
     'iMac com chip M3, tela Retina 4.5K de 24 polegadas e design ultrafino em alumínio. Perfeito para criadores de conteúdo.',
     15999.99, 16999.99, 8,
     'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
     'iMac 24 polegadas', 4.9, 87, 'Novo', true, NOW()),
    
    (cat_computadores_id, 'PC Gamer RTX 4080',
     'PC Gamer completo com RTX 4080, Intel i9-14900K, 32GB RAM DDR5 e SSD 2TB NVMe. Pronto para jogos em 4K.',
     12999.99, NULL, 5,
     'https://images.unsplash.com/photo-1587202372634-32705e3bf49c',
     'PC Gamer RTX 4080', 4.8, 156, NULL, true, NOW()),
    
    -- Notebooks
    (cat_notebooks_id, 'MacBook Pro 16" M3 Max',
     'MacBook Pro com chip M3 Max, 36GB de RAM, SSD de 1TB e tela Liquid Retina XDR. O notebook mais poderoso da Apple.',
     24999.99, 26999.99, 6,
     'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
     'MacBook Pro 16 polegadas', 4.9, 203, 'Lançamento', true, NOW()),
    
    (cat_notebooks_id, 'Dell XPS 15',
     'Dell XPS 15 com Intel i7-13700H, RTX 4060, 16GB RAM e tela OLED 3.5K touch. Design premium em alumínio.',
     10999.99, 11999.99, 12,
     'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
     'Dell XPS 15', 4.7, 178, NULL, true, NOW()),
    
    (cat_notebooks_id, 'Lenovo Legion 5 Pro',
     'Notebook gamer Lenovo Legion 5 Pro com Ryzen 7, RTX 4070, 16GB RAM e tela QHD 165Hz. Ideal para jogos.',
     7999.99, NULL, 10,
     'https://images.unsplash.com/photo-1603302576837-37561b2e2302',
     'Lenovo Legion 5 Pro', 4.6, 134, NULL, true, NOW())
  ON CONFLICT DO NOTHING;
  
  -- Insert Addresses for regular user
  INSERT INTO "Address" ("userId", label, street, city, state, "zipCode", "isDefault") VALUES
    (user_regular_id, 'Casa', 'Rua das Flores, 123', 'São Paulo', 'SP', '01234-567', true),
    (user_regular_id, 'Trabalho', 'Av. Paulista, 1000', 'São Paulo', 'SP', '01310-100', false)
  ON CONFLICT DO NOTHING;
  
  -- Insert Accessibility Settings for regular user
  INSERT INTO "AccessibilitySettings" ("userId", "fontScale", "highContrast", "largeButtons") VALUES
    (user_regular_id, 1.0, false, false)
  ON CONFLICT DO NOTHING;
END $$;
