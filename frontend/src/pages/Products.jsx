import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import { productsAPI } from '../services/api';

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pagination, setPagination] = useState({});
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
    const [isOrganic, setIsOrganic] = useState(searchParams.get('isOrganic') === 'true');
    const [inStock, setInStock] = useState(searchParams.get('inStock') === 'true');
    const [showFilters, setShowFilters] = useState(false);

    // Get query params
    const page = parseInt(searchParams.get('page')) || 1;
    const search = searchParams.get('search') || '';
    const categoryQuery = searchParams.get('category') || '';
    const sortBy = searchParams.get('sortBy') || 'created_at';

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [page, search, categoryQuery, sortBy, minPrice, maxPrice, isOrganic, inStock]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await productsAPI.getAll({
                page,
                search,
                category: categoryQuery,
                sortBy,
                minPrice,
                maxPrice,
                isOrganic,
                inStock
            });
            setProducts(response.data.products);
            setPagination(response.data.pagination);
        } catch (err) {
            setError('Failed to load products');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await productsAPI.getCategories();
            setCategories(response.data.categories);
        } catch (err) {
            console.error('Failed to load categories:', err);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const searchValue = formData.get('search');
        setSearchParams({ ...Object.fromEntries(searchParams), search: searchValue, page: 1 });
    };

    const handleCategoryChange = (cat) => {
        const params = { ...Object.fromEntries(searchParams), page: 1 };
        if (cat) {
            params.category = cat;
        } else {
            delete params.category;
        }
        setSearchParams(params);
        if (window.innerWidth < 1024) setShowFilters(false);
    };

    const handleSortChange = (sort) => {
        setSearchParams({ ...Object.fromEntries(searchParams), sortBy: sort });
    };

    const handlePageChange = (newPage) => {
        setSearchParams({ ...Object.fromEntries(searchParams), page: newPage });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Cinematic Marketplace Header */}
            <div className="relative h-[50vh] md:h-[60vh] flex items-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[20s] hover:scale-110"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=2000')`,
                        filter: 'brightness(0.7)'
                    }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
                        <div className="max-w-2xl">
                            <span className="inline-block px-4 py-1 rounded-full bg-primary-600/20 text-primary-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-4 md:mb-6 backdrop-blur-sm border border-primary-500/30">
                                Est. 2024 • The Marketplace
                            </span>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 md:mb-6 leading-tight font-serif italic">
                                Freshness <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-green-300">
                                    Reimagined.
                                </span>
                            </h1>
                            <p className="text-base md:text-xl text-gray-200 font-medium leading-relaxed mb-6 md:mb-10 max-w-lg italic">
                                We believe in the power of real food. KMart brings the farmers market experience directly to your digital doorstep.
                            </p>
                        </div>

                        {/* Search Bar - Premium Glass Look */}
                        <div className="flex justify-center lg:justify-end">
                            <form onSubmit={handleSearch} className="relative w-full max-w-lg group">
                                <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl rounded-[2rem] md:rounded-[2.5rem] border border-white/20 shadow-2xl transition-all group-hover:bg-white/15"></div>
                                <input
                                    type="text"
                                    name="search"
                                    defaultValue={search}
                                    placeholder="Search our aisles..."
                                    className="relative w-full px-6 md:px-10 py-5 md:py-6 rounded-[2rem] md:rounded-[2.5rem] bg-transparent text-white placeholder:text-gray-300 outline-none transition-all font-medium text-base md:text-lg"
                                />
                                <button type="submit" className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 bg-primary-500 text-white p-3 md:p-4 rounded-full hover:bg-primary-400 transition-all hover:scale-110 active:scale-95 shadow-xl shadow-primary-500/20">
                                    <span className="text-xl md:text-2xl leading-none block">🔍</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="bg-primary-950 border-y border-primary-900 overflow-x-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 min-w-max md:min-w-0">
                    <div className="grid grid-cols-4 gap-4 md:gap-8 text-center">
                        <div className="space-y-1 px-4">
                            <div className="text-2xl md:text-3xl font-black text-primary-400 italic font-serif">98%</div>
                            <div className="text-[8px] md:text-[10px] font-bold text-primary-300 uppercase tracking-[0.2em]">Freshness Rate</div>
                        </div>
                        <div className="space-y-1 px-4 border-l border-white/10">
                            <div className="text-2xl md:text-3xl font-black text-primary-400 italic font-serif">2hr</div>
                            <div className="text-[8px] md:text-[10px] font-bold text-primary-300 uppercase tracking-[0.2em]">Avg. Delivery</div>
                        </div>
                        <div className="space-y-1 px-4 border-l border-white/10">
                            <div className="text-2xl md:text-3xl font-black text-primary-400 italic font-serif">500+</div>
                            <div className="text-[8px] md:text-[10px] font-bold text-primary-300 uppercase tracking-[0.2em]">Local Farms</div>
                        </div>
                        <div className="space-y-1 px-4 border-l border-white/10">
                            <div className="text-2xl md:text-3xl font-black text-primary-400 italic font-serif">24/7</div>
                            <div className="text-[8px] md:text-[10px] font-bold text-primary-300 uppercase tracking-[0.2em]">Expert Support</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
                {/* Mobile Filter Toggle */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden w-full mb-8 py-4 bg-gray-900 text-white font-bold rounded-2xl flex items-center justify-center space-x-2"
                >
                    <span>{showFilters ? '✕ Close Filters' : '🔍 Refine Selection'}</span>
                </button>

                <div className="flex flex-col lg:grid lg:grid-cols-[280px_1fr] gap-8 md:gap-16">
                    {/* Sidebar - Modern Filter UI */}
                    <aside className={`space-y-12 h-fit lg:sticky lg:top-24 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <div>
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.4em] mb-8">Categories</h3>
                            <div className="space-y-2">
                                <button
                                    onClick={() => handleCategoryChange('')}
                                    className={`w-full text-left px-6 py-4 rounded-2xl font-bold transition-all flex justify-between items-center ${!categoryQuery ? 'bg-primary-600 text-white shadow-xl shadow-primary-600/20' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    <span>All Aboard</span>
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleCategoryChange(cat.name)}
                                        className={`w-full text-left px-6 py-4 rounded-2xl font-bold transition-all flex justify-between items-center ${categoryQuery === cat.name ? 'bg-primary-600 text-white shadow-xl shadow-primary-600/20' : 'text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        <span>{cat.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Advanced Filters */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.4em] mb-8">Price Range</h3>
                                <div className="flex items-center space-x-4">
                                    <div className="relative flex-1">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={minPrice}
                                            onChange={(e) => {
                                                setMinPrice(e.target.value);
                                                setSearchParams({ ...Object.fromEntries(searchParams), minPrice: e.target.value, page: 1 });
                                            }}
                                            className="w-full pl-8 pr-4 py-3 rounded-xl bg-gray-50 border-none outline-none font-bold text-sm"
                                        />
                                    </div>
                                    <span className="text-gray-300">/</span>
                                    <div className="relative flex-1">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs">$</span>
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={maxPrice}
                                            onChange={(e) => {
                                                setMaxPrice(e.target.value);
                                                setSearchParams({ ...Object.fromEntries(searchParams), maxPrice: e.target.value, page: 1 });
                                            }}
                                            className="w-full pl-8 pr-4 py-3 rounded-xl bg-gray-50 border-none outline-none font-bold text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.4em] mb-6">Preferences</h3>

                                <label className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 cursor-pointer group hover:bg-gray-100 transition-colors">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm text-gray-900">Organic Only</span>
                                        <span className="text-[10px] text-gray-400 font-medium">Purity guaranteed 🌿</span>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={isOrganic}
                                        onChange={(e) => {
                                            const val = e.target.checked;
                                            setIsOrganic(val);
                                            const params = { ...Object.fromEntries(searchParams), page: 1 };
                                            if (val) params.isOrganic = 'true';
                                            else delete params.isOrganic;
                                            setSearchParams(params);
                                        }}
                                        className="w-5 h-5 rounded-lg border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                                    />
                                </label>

                                <label className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 cursor-pointer group hover:bg-gray-100 transition-colors">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-sm text-gray-900">In Stock</span>
                                        <span className="text-[10px] text-gray-400 font-medium">Ready to ship 🚚</span>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={inStock}
                                        onChange={(e) => {
                                            const val = e.target.checked;
                                            setInStock(val);
                                            const params = { ...Object.fromEntries(searchParams), page: 1 };
                                            if (val) params.inStock = 'true';
                                            else delete params.inStock;
                                            setSearchParams(params);
                                        }}
                                        className="w-5 h-5 rounded-lg border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                                    />
                                </label>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.4em] mb-8">Sort By</h3>
                            <div className="relative group">
                                <select
                                    value={sortBy}
                                    onChange={(e) => handleSortChange(e.target.value)}
                                    className="w-full appearance-none px-6 py-4 rounded-2xl bg-gray-50 border-none outline-none font-bold text-gray-900 cursor-pointer transition-all hover:bg-gray-100"
                                >
                                    <option value="created_at">Latest Arrivals</option>
                                    <option value="name">Alphabetical</option>
                                    <option value="price">Value (Low-High)</option>
                                    <option value="-price">Luxury (High-Low)</option>
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">↓</div>
                            </div>
                        </div>

                        {/* Decorative Sidebar Element */}
                        <div className="bg-primary-50 p-8 rounded-[2rem] md:rounded-[2.5rem] border border-primary-100/50">
                            <span className="text-2xl mb-4 block">🍎</span>
                            <h4 className="font-black text-primary-900 text-sm mb-2 uppercase">Member Benefit</h4>
                            <p className="text-xs text-primary-700/70 font-medium leading-relaxed">
                                Subscribe now to get 20% off your first 3 artisanal baskets.
                            </p>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1">
                        {/* Error Handling */}
                        {error && (
                            <div className="mb-8 md:mb-12 p-6 bg-red-50 border border-red-100 text-red-600 rounded-3xl font-bold flex items-center">
                                <span className="text-2xl mr-4 flex-shrink-0">⚠️</span>
                                {error}
                            </div>
                        )}

                        {/* Loading State - Skeleton Cards */}
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-10">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="space-y-4 animate-pulse">
                                        <div className="bg-gray-100 h-[300px] md:h-[350px] rounded-[2rem] md:rounded-[2.5rem]"></div>
                                        <div className="h-6 bg-gray-100 rounded-full w-3/4"></div>
                                        <div className="h-4 bg-gray-50 rounded-full w-1/2"></div>
                                    </div>
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-24 md:py-32 bg-gray-50 rounded-[2.5rem] md:rounded-[3rem] border-2 border-dashed border-gray-100">
                                <div className="text-6xl md:text-8xl mb-8 grayscale opacity-50 transition-all hover:grayscale-0 hover:opacity-100 cursor-default">🧺</div>
                                <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">No treasures found...</h3>
                                <p className="text-gray-500 font-medium italic max-w-xs mx-auto mb-10">
                                    Our artisans are gathering more. Try adjusting your search or explore a different category.
                                </p>
                                <button
                                    onClick={() => handleCategoryChange('')}
                                    className="px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all"
                                >
                                    View All Products
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-12 md:space-y-16">
                                {/* Products Grid - Spacious Layout */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-10">
                                    {products.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {/* Pagination - Premium Styled */}
                                {pagination.totalPages > 1 && (
                                    <div className="flex flex-col md:flex-row justify-between items-center py-8 md:py-12 border-t border-gray-50 space-y-6 md:space-y-0">
                                        <button
                                            onClick={() => handlePageChange(page - 1)}
                                            disabled={page === 1}
                                            className="group flex items-center space-x-3 text-gray-500 font-black disabled:opacity-20 disabled:cursor-not-allowed transition-all hover:text-gray-900"
                                        >
                                            <span className="transform group-hover:-translate-x-2 transition-transform">←</span>
                                            <span className="uppercase tracking-widest text-[10px] md:text-xs">Previous</span>
                                        </button>

                                        <div className="flex items-center space-x-2 md:space-x-4">
                                            {[...Array(pagination.totalPages)].map((_, i) => (
                                                <button
                                                    key={i + 1}
                                                    onClick={() => handlePageChange(i + 1)}
                                                    className={`w-8 h-8 md:w-10 md:h-10 rounded-xl font-bold text-xs md:text-sm transition-all focus:ring-4 focus:ring-primary-500/20 ${page === i + 1 ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'}`}
                                                >
                                                    {i + 1}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => handlePageChange(page + 1)}
                                            disabled={page === pagination.totalPages}
                                            className="group flex items-center space-x-3 text-gray-500 font-black disabled:opacity-20 disabled:cursor-not-allowed transition-all hover:text-gray-900"
                                        >
                                            <span className="uppercase tracking-widest text-[10px] md:text-xs">Next</span>
                                            <span className="transform group-hover:translate-x-2 transition-transform">→</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Products;
