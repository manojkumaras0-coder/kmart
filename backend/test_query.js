
import { supabase } from './config/database.js';

async function testQuery() {
    console.log('Testing "Dairy,Bakery" query...');

    const categoryList = ['Dairy', 'Bakery'];

    // Check capitalization in products table
    const { data: samples, error: sampleError } = await supabase
        .from('products')
        .select('category, name')
        .limit(100);

    const categoriesInDb = [...new Set(samples.map(p => p.category))];
    console.log('Categories present in DB:', categoriesInDb);

    const { data: products, error } = await supabase
        .from('products')
        .select('name, category')
        .in('category', categoryList)
        .eq('is_active', true);

    if (error) {
        console.error('Query error:', error);
    } else {
        console.log(`Found ${products.length} products for [${categoryList.join(', ')}]`);
        products.forEach(p => console.log(` - ${p.name} (${p.category})`));
    }
}

testQuery();
