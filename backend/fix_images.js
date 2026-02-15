
import { supabase } from './config/database.js';

const imageMap = {
    'Fresh Apples': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=800',
    'Organic Bananas': 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&q=80&w=800',
    'Strawberries': 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&q=80&w=800',
    'Oranges': 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&q=80&w=800',
    'Grapes': 'https://images.unsplash.com/photo-1599819177626-c0d9c1b7c6e1?auto=format&fit=crop&q=80&w=800',
    'Watermelon': 'https://images.unsplash.com/photo-1587049352846-4a222e784720?auto=format&fit=crop&q=80&w=800',
    'Fresh Tomatoes': 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e17?auto=format&fit=crop&q=80&w=800',
    'Roma Tomatoes': 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e17?auto=format&fit=crop&q=80&w=800',
    'Organic Carrots': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=800',
    'Baby Carrots': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&q=80&w=800',
    'Fresh Broccoli': 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&q=80&w=800',
    'Fresh Broccoli Crowns': 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&q=80&w=800',
    'Bell Peppers': 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&q=80&w=800',
    'Red Bell Peppers': 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&q=80&w=800',
    'Lettuce': 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&q=80&w=800',
    'Spinach': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=800',
    'Seedless Cucumber': 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&q=80&w=800',
    'Whole Milk': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=800',
    'Greek Yogurt': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=800',
    'Cheddar Cheese': 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&q=80&w=800',
    'Butter': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=800',
    'Eggs': 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&q=80&w=800',
    'Cream Cheese': 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?auto=format&fit=crop&q=80&w=800',
    'Whole Wheat Bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800',
    'Croissants': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800',
    'Bagels': 'https://images.unsplash.com/photo-1551106652-a5bcf4b29e84?auto=format&fit=crop&q=80&w=800',
    'Sourdough Bread': 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=800',
    'Muffins': 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&q=80&w=800',
    'Dinner Rolls': 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&q=80&w=800',
    'Chicken Breast': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&q=80&w=800',
    'Boneless Chicken Breast': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&q=80&w=800',
    'Ground Beef': 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&q=80&w=800',
    'Lean Ground Beef': 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&q=80&w=800',
    'Pork Chops': 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?auto=format&fit=crop&q=80&w=800',
    'Salmon Fillet': 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&q=80&w=800',
    'Atlantic Salmon Fillet': 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&q=80&w=800',
    'Ribeye Steak': 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&q=80&w=800',
    'Ribeye Steak (Choice)': 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&q=80&w=800'
};

async function fixImages() {
    console.log('Fixing product images with better URLs...');
    const { data: products, error: fetchError } = await supabase.from('products').select('id, name');

    if (fetchError) {
        console.error('Error fetching products:', fetchError);
        return;
    }

    let updatedCount = 0;
    for (const prod of products) {
        const newUrl = imageMap[prod.name];
        if (newUrl) {
            const { error: updateError } = await supabase
                .from('products')
                .update({ image_url: newUrl })
                .eq('id', prod.id);

            if (!updateError) {
                updatedCount++;
                console.log(`Updated: ${prod.name}`);
            }
        }
    }
    console.log(`Successfully updated ${updatedCount} product images.`);
}

fixImages();
