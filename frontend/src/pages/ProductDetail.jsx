import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, cartItems } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [adding, setAdding] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const inCartItem = cartItems?.find(item => item.product_id === id);
    const inCartQty = inCartItem?.quantity || 0;
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await productsAPI.getById(id);
            setProduct(response.data.product);
        } catch (err) {
            setError('Product not found');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        setAdding(true);
        const result = await addToCart(id, quantity);
        setAdding(false);

        if (result.success) {
            alert(`Added ${quantity} ${product.name} to cart!`);
        } else {
            alert(result.error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                        <div className="animate-pulse bg-gray-100 rounded-[2.5rem] aspect-square"></div>
                        <div className="space-y-8 py-10">
                            <div className="h-4 bg-gray-100 rounded-full w-24"></div>
                            <div className="h-12 bg-gray-100 rounded-full w-full"></div>
                            <div className="h-8 bg-gray-100 rounded-full w-1/3"></div>
                            <div className="space-y-4">
                                <div className="h-4 bg-gray-50 rounded-full w-full"></div>
                                <div className="h-4 bg-gray-50 rounded-full w-5/6"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center p-8">
                    <div className="text-center max-w-md">
                        <div className="text-8xl mb-8 grayscale">🥥</div>
                        <h2 className="text-3xl font-black text-gray-900 mb-4">Discovery Failed</h2>
                        <p className="text-gray-500 font-medium mb-10 leading-relaxed italic">
                            This specific treasure seems to have vanished from our collection. {error}
                        </p>
                        <button onClick={() => navigate('/products')} className="px-10 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all">
                            Back to Aisles
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const hasDiscount = product.discount_price && product.discount_price < product.price;
    const displayPrice = hasDiscount ? product.discount_price : product.price;
    const discountPercentage = hasDiscount
        ? Math.round(((product.price - product.discount_price) / product.price) * 100)
        : 0;

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
                {/* Refined Breadcrumb */}
                <nav className="mb-12">
                    <ol className="flex items-center space-x-4 text-xs font-black uppercase tracking-[0.25em] text-gray-400">
                        <li><Link to="/" className="hover:text-primary-600 transition-colors">Home</Link></li>
                        <li><span className="opacity-30">/</span></li>
                        <li><Link to="/products" className="hover:text-primary-600 transition-colors">Marketplace</Link></li>
                        <li><span className="opacity-30">/</span></li>
                        <li className="text-gray-900">{product.name}</li>
                    </ol>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_500px] gap-20 items-start">
                    {/* Left: Cinematic Image Section */}
                    <div className="space-y-8">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-primary-100/30 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-gray-50 border border-transparent group-hover:border-primary-100 transition-all cursor-zoom-in">
                                {imageError || !product.image_url ? (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                                        <span className="text-9xl mb-4 opacity-50">🛒</span>
                                        <span className="text-sm font-black uppercase tracking-widest">Handpicked for you</span>
                                    </div>
                                ) : (
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                                        onError={() => setImageError(true)}
                                    />
                                )}

                                {hasDiscount && (
                                    <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md px-6 py-2 rounded-full shadow-xl">
                                        <span className="text-red-600 font-black text-sm uppercase tracking-widest">-{discountPercentage}% Edition</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Interactive Info Cards */}
                        <div className="grid grid-cols-3 gap-6">
                            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                <span className="text-2xl mb-2 block">🌿</span>
                                <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Source</span>
                                <span className="text-xs font-bold text-gray-900 lowercase italic">Farm Fresh</span>
                            </div>
                            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                <span className="text-2xl mb-2 block">🚛</span>
                                <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Speed</span>
                                <span className="text-xs font-bold text-gray-900 lowercase italic">2hr Delivery</span>
                            </div>
                            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                <span className="text-2xl mb-2 block">🍎</span>
                                <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Type</span>
                                <span className="text-xs font-bold text-gray-900 lowercase italic">Pure Organic</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Technical Spec & Add to Cart Container */}
                    <div className="lg:sticky lg:top-24 space-y-12">
                        <div className="space-y-6">
                            <div className="flex items-center space-x-3">
                                <span className="px-3 py-1 bg-primary-50 text-primary-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                    {product.category || 'Limited Edition'}
                                </span>
                                {product.stock_quantity > 0 ? (
                                    <span className="text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                                        Available in Aisle {Math.floor(Math.random() * 12) + 1}
                                    </span>
                                ) : (
                                    <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">
                                        Sold Out for the day
                                    </span>
                                )}
                            </div>

                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">{product.name}</h1>

                            {inCartQty > 0 && (
                                <div className="inline-flex items-center space-x-3 bg-primary-50 text-primary-700 px-6 py-2 rounded-2xl mb-8 border border-primary-100">
                                    <span className="flex h-3 w-3 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
                                    </span>
                                    <span className="font-bold text-sm">{inCartQty} already in your collection</span>
                                </div>
                            )}

                            <div className="flex items-baseline space-x-4">
                                <div className="text-5xl font-black text-primary-600 tracking-tighter">
                                    ${displayPrice.toFixed(2)}
                                </div>
                                {hasDiscount && (
                                    <div className="text-2xl text-gray-300 font-bold line-through">
                                        ${product.price.toFixed(2)}
                                    </div>
                                )}
                                <div className="text-sm text-gray-400 font-bold tracking-widest uppercase">
                                    Per {product.unit}
                                </div>
                            </div>

                            <p className="text-lg text-gray-500 leading-relaxed font-medium italic">
                                "{product.description || 'Experience the unparalleled quality and refined taste of our seasonal selection, handpicked for those who value excellence.'}"
                            </p>
                        </div>

                        {/* Order Configuration Box */}
                        <div className="bg-gray-50 rounded-[2.5rem] p-10 space-y-8 border border-gray-100 shadow-inner">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-black uppercase tracking-widest text-gray-900">Select Quantity</span>
                                <div className="flex items-center bg-white rounded-2xl p-1 shadow-sm border border-gray-100">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-12 h-12 flex items-center justify-center text-xl font-light hover:bg-gray-50 rounded-xl transition-colors"
                                        disabled={product.stock_quantity === 0}
                                    >
                                        −
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        readOnly
                                        className="w-16 text-center font-black text-xl bg-transparent outline-none"
                                    />
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                                        className="w-12 h-12 flex items-center justify-center text-xl font-light hover:bg-gray-50 rounded-xl transition-colors"
                                        disabled={product.stock_quantity === 0}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock_quantity === 0 || adding}
                                    className="flex-1 btn-primary py-5 rounded-[2rem] text-xl font-black shadow-2xl shadow-primary-600/30 flex items-center justify-center space-x-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {adding ? (
                                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <span>Add to Collection</span>
                                            <span className="text-sm opacity-60">|</span>
                                            <span className="text-sm opacity-80 uppercase tracking-widest">+ {quantity} items</span>
                                        </>
                                    )}
                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-primary-500 transform translate-y-2 group-hover:translate-y-0 transition-transform"></div>
                                </button>
                                <button
                                    onClick={() => navigate(-1)}
                                    className="w-20 py-6 bg-white border border-gray-200 rounded-[1.5rem] flex items-center justify-center hover:bg-gray-50 transition-all font-black"
                                >
                                    ←
                                </button>
                            </div>

                            {product.stock_quantity > 0 && (
                                <div className="flex justify-between items-center py-4 border-t border-gray-200/50">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Total Investment</span>
                                    <span className="text-2xl font-black text-primary-900 tracking-tighter">
                                        ${(displayPrice * quantity).toFixed(2)}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Final Value Prop */}
                        <div className="flex items-center space-x-6 p-6">
                            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">🛡️</div>
                            <div>
                                <h4 className="font-bold text-gray-900">KMart Quality Seal</h4>
                                <p className="text-xs text-gray-500 font-medium">100% satisfaction or direct door-step replacement.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
