-- Sample Categories
INSERT INTO categories (name, description, image_url) VALUES
('Fruits', 'Fresh fruits and berries', 'https://images.unsplash.com/photo-1610832958506-aa56368176cf'),
('Vegetables', 'Fresh vegetables and greens', 'https://images.unsplash.com/photo-1540420773420-3366772f4999'),
('Dairy', 'Milk, cheese, yogurt and more', 'https://images.unsplash.com/photo-1628088062854-d1870b4553da'),
('Bakery', 'Fresh bread and baked goods', 'https://images.unsplash.com/photo-1509440159596-0249088772ff'),
('Meat', 'Fresh meat and poultry', 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f'),
('Beverages', 'Drinks and refreshments', 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9d');

-- Sample Products - Fruits
INSERT INTO products (name, description, category, price, discount_price, stock_quantity, unit, image_url) VALUES
('Fresh Apples', 'Crisp and sweet red apples', 'Fruits', 3.99, 2.99, 150, 'lb', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6'),
('Organic Bananas', 'Ripe organic bananas', 'Fruits', 2.49, NULL, 200, 'lb', 'https://images.unsplash.com/photo-1603833665858-e61d17a86224'),
('Strawberries', 'Sweet fresh strawberries', 'Fruits', 4.99, 3.99, 80, 'lb', 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6'),
('Oranges', 'Juicy navel oranges', 'Fruits', 3.49, NULL, 120, 'lb', 'https://images.unsplash.com/photo-1547514701-42782101795e'),
('Grapes', 'Seedless green grapes', 'Fruits', 5.99, 4.49, 90, 'lb', 'https://images.unsplash.com/photo-1599819177626-c0d9c1b7c6e1'),
('Watermelon', 'Sweet seedless watermelon', 'Fruits', 6.99, 5.99, 45, 'each', 'https://images.unsplash.com/photo-1587049352846-4a222e784720');

-- Sample Products - Vegetables
INSERT INTO products (name, description, category, price, discount_price, stock_quantity, unit, image_url) VALUES
('Fresh Tomatoes', 'Vine-ripened tomatoes', 'Vegetables', 2.99, NULL, 100, 'lb', 'https://images.unsplash.com/photo-1546470427-227c2e1e1a0d'),
('Organic Carrots', 'Crunchy organic carrots', 'Vegetables', 1.99, 1.49, 150, 'lb', 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37'),
('Fresh Broccoli', 'Green fresh broccoli crowns', 'Vegetables', 2.49, NULL, 80, 'lb', 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc'),
('Bell Peppers', 'Mixed color bell peppers', 'Vegetables', 3.99, 2.99, 110, 'lb', 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83'),
('Lettuce', 'Fresh romaine lettuce', 'Vegetables', 2.99, NULL, 95, 'head', 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1'),
('Spinach', 'Organic baby spinach', 'Vegetables', 3.49, 2.99, 70, 'bunch', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb');

-- Sample Products - Dairy
INSERT INTO products (name, description, category, price, discount_price, stock_quantity, unit, image_url) VALUES
('Whole Milk', 'Fresh whole milk gallon', 'Dairy', 4.99, NULL, 120, 'gallon', 'https://images.unsplash.com/photo-1550583724-b2692b85b150'),
('Greek Yogurt', 'Plain Greek yogurt', 'Dairy', 5.99, 4.99, 85, 'container', 'https://images.unsplash.com/photo-1488477181946-6428a0291777'),
('Cheddar Cheese', 'Sharp cheddar cheese block', 'Dairy', 6.99, NULL, 60, 'lb', 'https://images.unsplash.com/photo-1452195100486-9cc805987862'),
('Butter', 'Unsalted butter sticks', 'Dairy', 4.49, 3.99, 100, 'lb', 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d'),
('Eggs', 'Large fresh eggs dozen', 'Dairy', 3.99, NULL, 150, 'dozen', 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f'),
('Cream Cheese', 'Philadelphia cream cheese', 'Dairy', 3.49, 2.79, 90, 'package', 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c');

-- Sample Products - Bakery
INSERT INTO products (name, description, category, price, discount_price, stock_quantity, unit, image_url) VALUES
('Whole Wheat Bread', 'Fresh baked whole wheat bread', 'Bakery', 3.99, NULL, 75, 'loaf', 'https://images.unsplash.com/photo-1509440159596-0249088772ff'),
('Croissants', 'Buttery French croissants', 'Bakery', 5.99, 4.99, 50, 'pack', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a'),
('Bagels', 'Plain bagels pack of 6', 'Bakery', 4.49, NULL, 65, 'pack', 'https://images.unsplash.com/photo-1551106652-a5bcf4b29e84'),
('Sourdough Bread', 'Artisan sourdough loaf', 'Bakery', 6.99, 5.99, 40, 'loaf', 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73'),
('Muffins', 'Blueberry muffins pack of 4', 'Bakery', 5.49, NULL, 55, 'pack', 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa'),
('Dinner Rolls', 'Soft dinner rolls pack of 12', 'Bakery', 3.99, 2.99, 80, 'pack', 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df');

-- Sample Products - Meat
INSERT INTO products (name, description, category, price, discount_price, stock_quantity, unit, image_url) VALUES
('Chicken Breast', 'Boneless skinless chicken breast', 'Meat', 8.99, 7.99, 60, 'lb', 'https://images.unsplash.com/photo-1604503468506-a8da13d82791'),
('Ground Beef', 'Lean ground beef 90/10', 'Meat', 7.99, NULL, 70, 'lb', 'https://images.unsplash.com/photo-1603048588665-791ca8aea617'),
('Pork Chops', 'Center cut pork chops', 'Meat', 6.99, 5.99, 50, 'lb', 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6'),
('Salmon Fillet', 'Fresh Atlantic salmon', 'Meat', 12.99, 10.99, 35, 'lb', 'https://images.unsplash.com/photo-1485921325833-c519f76c4927'),
('Turkey Breast', 'Sliced deli turkey breast', 'Meat', 9.99, NULL, 45, 'lb', 'https://images.unsplash.com/photo-1587593810167-a84920ea0781'),
('Bacon', 'Thick cut bacon', 'Meat', 7.49, 6.49, 85, 'lb', 'https://images.unsplash.com/photo-1528607929212-2636ec44253e');

-- Sample Products - Beverages
INSERT INTO products (name, description, category, price, discount_price, stock_quantity, unit, image_url) VALUES
('Orange Juice', 'Fresh squeezed orange juice', 'Beverages', 5.99, NULL, 90, 'bottle', 'https://images.unsplash.com/photo-1600271886742-f049cd451bba'),
('Coffee Beans', 'Premium arabica coffee beans', 'Beverages', 12.99, 10.99, 55, 'lb', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e'),
('Green Tea', 'Organic green tea bags', 'Beverages', 6.99, NULL, 70, 'box', 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9'),
('Sparkling Water', 'Flavored sparkling water 12-pack', 'Beverages', 4.99, 3.99, 100, 'pack', 'https://images.unsplash.com/photo-1523362628745-0c100150b504'),
('Almond Milk', 'Unsweetened almond milk', 'Beverages', 4.49, NULL, 80, 'carton', 'https://images.unsplash.com/photo-1550583724-b2692b85b150'),
('Apple Cider', 'Fresh apple cider', 'Beverages', 5.49, 4.49, 60, 'bottle', 'https://images.unsplash.com/photo-1570544820299-1f9e4f5f1f1f');

-- Verify insertion
SELECT 'Categories inserted:' as info, COUNT(*) as count FROM categories
UNION ALL
SELECT 'Products inserted:' as info, COUNT(*) as count FROM products;
