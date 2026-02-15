-- Quick test queries for KMart database

-- 1. View all categories
SELECT * FROM categories ORDER BY name;

-- 2. View all products
SELECT id, name, category, price, discount_price, stock_quantity, is_active 
FROM products 
ORDER BY category, name;

-- 3. View products with discounts
SELECT name, category, price, discount_price, 
       ROUND(((price - discount_price) / price * 100)::numeric, 0) as discount_percent
FROM products 
WHERE discount_price IS NOT NULL
ORDER BY discount_percent DESC;

-- 4. Count products by category
SELECT category, COUNT(*) as product_count
FROM products
WHERE is_active = true
GROUP BY category
ORDER BY product_count DESC;

-- 5. View out of stock products
SELECT name, category, stock_quantity
FROM products
WHERE stock_quantity = 0;

-- 6. Search products by name
SELECT name, category, price
FROM products
WHERE name ILIKE '%apple%'
ORDER BY name;

-- 7. Get products in price range
SELECT name, category, price
FROM products
WHERE price BETWEEN 3.00 AND 6.00
ORDER BY price;

-- 8. View most expensive products
SELECT name, category, price
FROM products
ORDER BY price DESC
LIMIT 10;

-- 9. View cheapest products
SELECT name, category, price
FROM products
ORDER BY price ASC
LIMIT 10;

-- 10. Get total inventory value
SELECT 
    SUM(price * stock_quantity) as total_inventory_value,
    COUNT(*) as total_products,
    SUM(stock_quantity) as total_items
FROM products
WHERE is_active = true;
