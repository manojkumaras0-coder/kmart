
import { supabase } from './config/database.js';

async function standardizeCategories() {
    console.log('Standardizing categories table...');

    // 1. Update "Meat" to "Meats" in categories table
    const { error: meatError } = await supabase
        .from('categories')
        .update({ name: 'Meats' })
        .eq('name', 'Meat');

    if (meatError) console.error('Error updating Meat to Meats in categories:', meatError);
    else console.log('Standardized Meat -> Meats in categories table');

    // 2. Add "Seafood" to categories table
    const { data: existingSeafood, error: checkError } = await supabase
        .from('categories')
        .select('id')
        .eq('name', 'Seafood')
        .single();

    if (checkError && checkError.code === 'PGRST116') {
        const { error: insertError } = await supabase
            .from('categories')
            .insert([{
                name: 'Seafood',
                description: 'Premium fresh seafood',
                image_url: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927'
            }]);

        if (insertError) console.error('Error adding Seafood to categories:', insertError);
        else console.log('Added Seafood to categories table');
    }

    console.log('Category table standardization complete.');
}

standardizeCategories();
