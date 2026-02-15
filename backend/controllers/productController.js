import { supabase } from '../config/database.js';

// Get all products with pagination, search, and filters
export const getAllProducts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 12,
            search = '',
            category = '',
            sortBy = 'created_at',
            order = 'desc',
            minPrice,
            maxPrice,
            isOrganic,
            inStock,
        } = req.query;

        const offset = (page - 1) * limit;

        console.log('Fetching products with params:', { search, category, sortBy, order, minPrice, maxPrice, isOrganic, inStock });

        // Build query
        let query = supabase
            .from('products')
            .select('*', { count: 'exact' })
            .eq('is_active', true);

        // Search filter
        if (search) {
            query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
        }

        // Category filter
        if (category) {
            const categoryList = Array.isArray(category)
                ? category
                : category.split(',').map(c => c.trim()).filter(c => c);

            console.log('Applying category filter:', categoryList);

            if (categoryList.length > 1) {
                const orFilter = categoryList.map(c => `category.eq.${c}`).join(',');
                query = query.or(orFilter);
            } else if (categoryList.length === 1) {
                query = query.eq('category', categoryList[0]);
            }
        }

        // Price range filter
        if (minPrice) {
            query = query.gte('price', minPrice);
        }
        if (maxPrice) {
            query = query.lte('price', maxPrice);
        }

        // Organic filter
        if (isOrganic === 'true') {
            query = query.eq('is_organic', true);
        }

        // Availability filter
        if (inStock === 'true') {
            query = query.gt('stock_quantity', 0);
        }

        // Sorting
        query = query.order(sortBy, { ascending: order === 'asc' });

        // Pagination
        query = query.range(offset, offset + parseInt(limit) - 1);

        const { data: products, error, count } = await query;

        if (error) {
            console.error('Get products error:', error);
            return res.status(500).json({ error: 'Failed to fetch products' });
        }

        res.json({
            products,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count,
                totalPages: Math.ceil(count / limit),
            },
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get single product by ID
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const { data: product, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .eq('is_active', true)
            .single();

        if (error || !product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ product });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Create new product (Admin only)
export const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            category,
            price,
            discountPrice,
            stockQuantity,
            unit,
            imageUrl,
        } = req.body;

        // Validate required fields
        if (!name || !price) {
            return res.status(400).json({ error: 'Name and price are required' });
        }

        const { data: product, error } = await supabase
            .from('products')
            .insert([
                {
                    name,
                    description,
                    category,
                    price,
                    discount_price: discountPrice,
                    stock_quantity: stockQuantity || 0,
                    unit: unit || 'piece',
                    image_url: imageUrl,
                    is_active: true,
                },
            ])
            .select()
            .single();

        if (error) {
            console.error('Create product error:', error);
            return res.status(500).json({ error: 'Failed to create product' });
        }

        res.status(201).json({
            message: 'Product created successfully',
            product,
        });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update product (Admin only)
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            description,
            category,
            price,
            discountPrice,
            stockQuantity,
            unit,
            imageUrl,
            isActive,
        } = req.body;

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (category !== undefined) updateData.category = category;
        if (price !== undefined) updateData.price = price;
        if (discountPrice !== undefined) updateData.discount_price = discountPrice;
        if (stockQuantity !== undefined) updateData.stock_quantity = stockQuantity;
        if (unit !== undefined) updateData.unit = unit;
        if (imageUrl !== undefined) updateData.image_url = imageUrl;
        if (isActive !== undefined) updateData.is_active = isActive;

        const { data: product, error } = await supabase
            .from('products')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error || !product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({
            message: 'Product updated successfully',
            product,
        });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete product (Admin only)
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Soft delete - set is_active to false
        const { data: product, error } = await supabase
            .from('products')
            .update({ is_active: false })
            .eq('id', id)
            .select()
            .single();

        if (error || !product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all categories
export const getCategories = async (req, res) => {
    try {
        const { data: categories, error } = await supabase
            .from('categories')
            .select('*')
            .order('name');

        if (error) {
            console.error('Get categories error:', error);
            return res.status(500).json({ error: 'Failed to fetch categories' });
        }

        res.json({ categories });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get featured products
export const getFeaturedProducts = async (req, res) => {
    try {
        const { limit = 6 } = req.query;

        const { data: products, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .not('discount_price', 'is', null)
            .order('created_at', { ascending: false })
            .limit(parseInt(limit));

        if (error) {
            console.error('Get featured products error:', error);
            return res.status(500).json({ error: 'Failed to fetch featured products' });
        }

        res.json({ products });
    } catch (error) {
        console.error('Get featured products error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
