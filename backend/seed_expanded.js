
import { supabase } from './config/database.js';

const products = [
    // FRUITS
    {
        name: 'Honeycrisp Apples',
        description: 'Premium, jumbo-sized apples with a perfect balance of sweet and tart with a signature crunch.',
        category: 'Fruits',
        price: 2.99,
        stock_quantity: 100,
        unit: 'lb',
        image_url: 'https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?auto=format&fit=crop&q=80&w=800'
    },
    {
        name: 'Fresh Strawberries',
        description: 'Grown for flavor, these vibrant red strawberries are hand-picked at peak ripeness.',
        category: 'Fruits',
        price: 3.99,
        stock_quantity: 80,
        unit: '1lb Pack',
        image_url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&q=80&w=800'
    },
    {
        name: 'Blueberries',
        description: 'Plump and juicy blueberries, perfect for snacking or morning parfaits.',
        category: 'Fruits',
        price: 4.49,
        stock_quantity: 60,
        unit: '6oz Pack',
        image_url: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&q=80&w=800'
    },
    {
        name: 'Navel Oranges',
        description: 'Large, seedless oranges known for their sweet flavor and easy-to-peel skin.',
        category: 'Fruits',
        price: 1.49,
        stock_quantity: 200,
        unit: 'lb',
        image_url: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&q=80&w=800'
    },
    {
        name: 'Red Seedless Grapes',
        description: 'Firm and sweet grapes, grown in the finest vineyards.',
        category: 'Fruits',
        price: 2.49,
        stock_quantity: 150,
        unit: 'lb',
        image_url: 'https://images.unsplash.com/photo-1599819177626-c0d9c1b7c6e1?auto=format&fit=crop&q=80&w=800'
    },

    // VEGETABLES
    {
        name: 'Seedless Cucumber',
        description: 'Long and thin, with a crisp bite and no seeds. Perfect for salads.',
        category: 'Vegetables',
        price: 1.50,
        stock_quantity: 120,
        unit: 'ea',
        image_url: 'https://images.unsplash.com/photo-1449333256619-8b24deaa1930?auto=format&fit=crop&q=80&w=800'
    },
    {
        name: 'Roma Tomatoes',
        description: 'Firm and meaty, these tomatoes are ideal for sauces and slicing.',
        category: 'Vegetables',
        price: 1.29,
        stock_quantity: 180,
        unit: 'lb',
        image_url: 'https://images.unsplash.com/photo-1546470427-227c2e1e1a0d?auto=format&fit=crop&q=80&w=800'
    },
    {
        name: 'Baby Carrots',
        description: 'Sweet, bite-sized carrots cleaned and ready to eat.',
        category: 'Vegetables',
        price: 1.79,
        stock_quantity: 90,
        unit: '1lb Bag',
        image_url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=800'
    },
    {
        name: 'Fresh Broccoli Crowns',
        description: 'Tight, dark green florets, harvested fresh daily.',
        category: 'Vegetables',
        price: 1.99,
        stock_quantity: 100,
        unit: 'lb',
        image_url: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&q=80&w=800'
    },
    {
        name: 'Red Bell Peppers',
        description: 'Sweet and crunchy, these thick-walled peppers add vibrant color to any dish.',
        category: 'Vegetables',
        price: 1.50,
        stock_quantity: 120,
        unit: 'ea',
        image_url: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&q=80&w=800'
    },

    // MEATS
    {
        name: 'Boneless Chicken Breast',
        description: 'Premium quality, trimmed chicken breast. High protein and lean.',
        category: 'Meats',
        price: 4.99,
        stock_quantity: 50,
        unit: 'lb',
        image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&q=80&w=800'
    },
    {
        name: 'Ribeye Steak (Choice)',
        description: 'Rich marbling and tender texture make this a favorite for the grill.',
        category: 'Meats',
        price: 15.99,
        stock_quantity: 30,
        unit: 'lb',
        image_url: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&q=80&w=800'
    },
    {
        name: 'Atlantic Salmon Fillet',
        description: 'Sustainably sourced, rich in Omega-3s. Vibrant pink color and buttery flavor.',
        category: 'Meats',
        price: 12.99,
        stock_quantity: 25,
        unit: 'lb',
        image_url: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&q=80&w=800'
    },
    {
        name: 'Applewood Smoked Bacon',
        description: 'Thick-cut, naturally smoked bacon for an authentic premium flavor.',
        category: 'Meats',
        price: 7.99,
        stock_quantity: 40,
        unit: '12oz Pack',
        image_url: 'https://images.unsplash.com/photo-1528607929212-2636ec44253e?auto=format&fit=crop&q=80&w=800'
    },
    {
        name: 'Lean Ground Beef',
        description: '93% Lean ground beef, perfect for burgers and lean meal prep.',
        category: 'Meats',
        price: 6.49,
        stock_quantity: 60,
        unit: 'lb',
        image_url: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&q=80&w=800'
    }
];

async function seedProducts() {
    console.log('Seeding products...');
    const { data, error } = await supabase
        .from('products')
        .insert(products);

    if (error) {
        console.error('Error seeding products:', error);
    } else {
        console.log('Successfully seeded 15 premium products!');
    }
}

seedProducts();
