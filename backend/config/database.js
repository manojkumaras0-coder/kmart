import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

let supabase = null;

if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️  Missing Supabase credentials. Database features will be disabled.');
    console.warn('   Please set SUPABASE_URL and SUPABASE_KEY in .env file to enable database.');
} else {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase client initialized');
}

export { supabase };

// Test database connection
export const testConnection = async () => {
    if (!supabase) {
        console.warn('⚠️  Supabase not configured. Skipping connection test.');
        return false;
    }

    try {
        const { data, error } = await supabase.from('users').select('count').limit(1);
        if (error) throw error;
        console.log('✅ Database connection successful');
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
};
