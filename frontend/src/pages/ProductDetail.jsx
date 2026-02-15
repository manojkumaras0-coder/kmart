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
        const result = await addToCart(id, quantity, product);
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 animate-pulse">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">
                        <div className="bg-gray-100 rounded-[2rem] md:rounded-[2.5rem] aspect-square"></div>
                        <div className="space-y-8 py-6 md:py-10">
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-24">
                {/* Refined Breadcrumb */}
                <nav className="mb-8 md:mb-12 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
                    <ol className="flex items-center space-x-4 text-[10px] md:text-xs font-black uppercase tracking-[0.25em] text-gray-400 whitespace-nowrap">
                        <li><Link to="/" className="hover:text-primary-600 transition-colors">Home</Link></li>
                        <li><span className="opacity-30">/</span></li>
                        <li><Link to="/products" className="hover:text-primary-600 transition-colors">Marketplace</Link></li>
                        <li><span className="opacity-30">/</span></li>
                        <li className="text-gray-900">{product.name}</li>
                    </ol>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_500px] gap-10 md:gap-20 items-start">
                    {/* Left: Cinematic Image Section */}
                    <div className="space-y-6 md:space-y-8">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-primary-100/30 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"></div>
                            <div className="relative aspect-square rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-gray-50 border border-transparent group-hover:border-primary-100 transition-all cursor-zoom-in shadow-xl md:shadow-2xl">
                                {imageError || !product.image_url ? (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                                        <span className="text-7xl md:text-9xl mb-4 opacity-50">🛒</span>
                                        <span className="text-[10px] md:text-sm font-black uppercase tracking-widest text-center px-4">Handpicked for you</span>
                                    </div>
                                ) : (
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-[1.5s] md:group-hover:scale-110"
                                        onError={() => setImageError(true)}
                                    />
                                )}

                                {hasDiscount && (
                                    <div className="absolute top-4 left-4 md:top-8 md:left-8 bg-white/90 backdrop-blur-md px-4 md:px-6 py-1.5 md:py-2 rounded-full shadow-lg">
                                        <span className="text-red-600 font-black text-[10px] md:text-sm uppercase tracking-widest">-{discountPercentage}% Edition</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Interactive Info Cards */}
                        <div className="grid grid-cols-3 gap-3 md:gap-6">
                            <div className="p-4 md:p-6 bg-gray-50 rounded-2xl md:rounded-3xl border border-gray-100">
                                <span className="text-xl md:text-2xl mb-1 md:mb-2 block">🌿</span>
                                <span className="block text-[8px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Source</span>
                                <span className="text-[10px] md:text-xs font-bold text-gray-900 lowercase italic">Farm Fresh</span>
                            </div>
                            <div className="p-4 md:p-6 bg-gray-50 rounded-2xl md:rounded-3xl border border-gray-100">
                                <span className="text-xl md:text-2xl mb-1 md:mb-2 block">🚛</span>
                                <span className="block text-[8px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Speed</span>
                                <span className="text-[10px] md:text-xs font-bold text-gray-900 lowercase italic">2hr Delivery</span>
                            </div>
                            <div className="p-4 md:p-6 bg-gray-50 rounded-2xl md:rounded-3xl border border-gray-100">
                                <span className="text-xl md:text-2xl mb-1 md:mb-2 block">🍎</span>
                                <span className="block text-[8px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Type</span>
                                <span className="text-[10px] md:text-xs font-bold text-gray-900 lowercase italic">Pure Organic</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Technical Spec & Add to Cart Container */}
                    <div className="lg:sticky lg:top-24 space-y-10 md:space-y-12">
                        <div className="space-y-4 md:space-y-6">
                            <div className="flex items-center space-x-3">
                                <span className="px-3 py-1 bg-primary-50 text-primary-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                    {product.category || 'Limited Edition'}
                                </span>
                                {product.stock_quantity > 0 ? (
                                    <span className="text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                                        Available In-Store
                                    </span>
                                ) : (
                                    <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">
                                        Sold Out for the day
                                    </span>
                                )}
                            </div>

                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-2 md:mb-4 leading-tight italic font-serif ">{product.name}</h1>

                            {inCartQty > 0 && (
                                <div className="inline-flex items-center space-x-3 bg-primary-50 text-primary-700 px-4 md:px-6 py-2 rounded-2xl mb-4 md:mb-8 border border-primary-100">
                                    <span className="flex h-3 w-3 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
                                    </span>
                                    <span className="font-bold text-xs md:text-sm">{inCartQty} already in your collection</span>
                                </div>
                            )}

                            <div className="flex items-baseline space-x-4">
                                <div className="text-4xl md:text-5xl font-black text-primary-600 tracking-tighter">
                                    ${displayPrice.toFixed(2)}
                                </div>
                                {hasDiscount && (
                                    <div className="text-xl md:text-2xl text-gray-300 font-bold line-through">
                                        ${product.price.toFixed(2)}
                                    </div>
                                )}
                                <div className="text-[10px] md:text-sm text-gray-400 font-bold tracking-widest uppercase">
                                    Per {product.unit}
                                </div>
                            </div>

                            <p className="text-base md:text-lg text-gray-500 leading-relaxed font-medium italic">
                                "{product.description || 'Experience the unparalleled quality and refined taste of our seasonal selection, handpicked for those who value excellence.'}"
                            </p>
                        </div>

                        {/* Order Configuration Box */}
                        <div className="bg-gray-50 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 space-y-6 md:space-y-8 border border-gray-100 shadow-inner">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                                <span className="text-xs md:text-sm font-black uppercase tracking-widest text-gray-900 text-center sm:text-left">Select Quantity</span>
                                <div className="flex items-center bg-white rounded-2xl p-1 shadow-sm border border-gray-100 justify-center">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-xl font-light hover:bg-gray-50 rounded-xl transition-colors"
                                        disabled={product.stock_quantity === 0}
                                    >
                                        −
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        readOnly
                                        className="w-12 md:w-16 text-center font-black text-lg md:text-xl bg-transparent outline-none"
                                    />
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                                        className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-xl font-light hover:bg-gray-50 rounded-xl transition-colors"
                                        disabled={product.stock_quantity === 0}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.stock_quantity === 0 || adding}
                                    className="flex-1 bg-gray-900 text-white py-5 rounded-2xl text-lg font-black shadow-xl flex items-center justify-center space-x-4 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black transition-all"
                                >
                                    {adding ? (
                                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <span>Add to Collection</span>
                                            <span className="text-xs opacity-60">|</span>
                                            <span className="text-xs opacity-80 uppercase tracking-widest">+{quantity}</span>
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => navigate(-1)}
                                    className="sm:w-20 py-5 bg-white border border-gray-200 rounded-2xl flex items-center justify-center hover:bg-gray-50 transition-all font-black text-xl"
                                >
                                    ←
                                </button>
                            </div>

                            {product.stock_quantity > 0 && (
                                <div className="flex justify-between items-center py-4 border-t border-gray-200/50">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Total Investment</span>
                                    <span className="text-xl md:text-2xl font-black text-primary-900 tracking-tighter">
                                        ${(displayPrice * quantity).toFixed(2)}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Final Value Prop */}
                        <div className="flex items-center space-x-4 md:space-x-6 p-4 md:p-6 bg-white rounded-3xl border border-gray-50">
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-green-50 rounded-2xl flex items-center justify-center text-xl md:text-2xl flex-shrink-0">🛡️</div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm md:text-base">KMart Quality Seal</h4>
                                <p className="text-[10px] md:text-xs text-gray-500 font-medium">100% satisfaction or direct door-step replacement.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
