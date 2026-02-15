import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const [imageError, setImageError] = useState(false);
    const [adding, setAdding] = useState(false);
    const { addToCart, cartItems, updateQuantity, removeItem } = useCart();
    const inCartItem = cartItems?.find(item => (item.product_id || item.product?.id) === product.id);
    const inCartQty = inCartItem?.quantity || 0;

    const hasDiscount = product.discount_price && product.discount_price < product.price;
    const displayPrice = hasDiscount ? product.discount_price : product.price;
    const discountPercentage = hasDiscount
        ? Math.round(((product.price - product.discount_price) / product.price) * 100)
        : 0;

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setAdding(true);
        const result = await addToCart(product.id, 1);
        setAdding(false);

        if (!result.success) {
            alert(result.error);
        }
    };

    const handleIncrement = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (inCartItem) {
            await updateQuantity(inCartItem.id, inCartQty + 1);
        }
    };

    const handleDecrement = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (inCartItem) {
            if (inCartQty > 1) {
                await updateQuantity(inCartItem.id, inCartQty - 1);
            } else {
                await removeItem(inCartItem.id);
            }
        }
    };

    return (
        <div className="group relative bg-white rounded-[2rem] border border-gray-100 p-4 transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2">
            <Link to={`/products/${product.id}`} className="block">
                {/* Product Image Wrapper */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-gray-50 mb-6">
                    {imageError || !product.image_url ? (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-200">
                            <span className="text-6xl mb-2">🧺</span>
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Freshly Picked</span>
                        </div>
                    ) : (
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={() => setImageError(true)}
                        />
                    )}

                    {/* Overlay Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {hasDiscount && (
                            <div className="bg-white/90 backdrop-blur-md text-red-600 px-4 py-1.5 rounded-full text-xs font-black shadow-sm">
                                SAVE {discountPercentage}%
                            </div>
                        )}
                        {inCartQty > 0 && (
                            <div className="bg-primary-600 text-white px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest shadow-[0_10px_20px_-5px_rgba(22,163,74,0.4)] flex items-center space-x-2 border-2 border-white">
                                <span className="w-2.5 h-2.5 bg-white rounded-full animate-ping"></span>
                                <span>{inCartQty} Selected</span>
                            </div>
                        )}
                        {product.stock_quantity > 0 && product.stock_quantity < 10 && (
                            <div className="bg-primary-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                                Limited Stock
                            </div>
                        )}
                    </div>

                    {/* Availability Overlay */}
                    {product.stock_quantity === 0 && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center p-6 text-center">
                            <div className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl">
                                Restocking Soon
                            </div>
                        </div>
                    )}

                    {/* Quantity Selector / Add Button Overlay */}
                    {inCartQty === 0 ? (
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock_quantity === 0 || adding}
                            className="absolute bottom-4 right-4 w-12 h-12 bg-gray-900 text-white rounded-2xl shadow-2xl flex items-center justify-center translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black disabled:hidden z-20"
                        >
                            {adding ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <span className="text-2xl font-light">+</span>
                            )}
                        </button>
                    ) : (
                        <div
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                            className="absolute bottom-4 left-4 right-4 bg-gray-900 text-white rounded-2xl shadow-2xl h-14 flex items-center justify-between px-2 z-20 transition-all duration-300"
                        >
                            <button
                                onClick={handleDecrement}
                                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors text-xl font-bold"
                            >
                                -
                            </button>
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] uppercase tracking-widest font-black text-gray-400">Selected</span>
                                <span className="text-sm font-black">{inCartQty}</span>
                            </div>
                            <button
                                onClick={handleIncrement}
                                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors text-xl font-bold"
                            >
                                +
                            </button>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="px-2 pb-2">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-black text-primary-600 uppercase tracking-[0.2em]">
                            {product.category || 'Handpicked'}
                        </span>
                        {product.is_organic && (
                            <span className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em] flex items-center">
                                <span className="mr-1">🌿</span> Organic
                            </span>
                        )}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2 truncate group-hover:text-primary-600 transition-colors">
                        {product.name}
                    </h3>

                    <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-black text-gray-900 tracking-tight">
                            ${displayPrice.toFixed(2)}
                        </span>
                        {hasDiscount && (
                            <span className="text-sm text-gray-400 font-bold line-through">
                                ${product.price.toFixed(2)}
                            </span>
                        )}
                        <span className="text-xs text-gray-400 font-medium">/{product.unit}</span>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
