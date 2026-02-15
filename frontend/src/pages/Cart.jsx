import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';

const Cart = () => {
    const { cartItems, loading, updateQuantity, removeItem, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    if (loading && cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="flex items-center justify-center h-[50vh]">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                        <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Verifying Collection</span>
                    </div>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center justify-center text-center">
                    <div className="text-[10rem] mb-12 grayscale opacity-20">🛒</div>
                    <h2 className="text-4xl font-black text-gray-900 mb-6 tracking-tight">Your Collection is Waiting.</h2>
                    <p className="text-gray-500 font-medium mb-12 italic max-w-sm">
                        It seems you haven't selected any treasures yet. Our aisles are bursting with freshness.
                    </p>
                    <Link
                        to="/products"
                        className="px-12 py-5 bg-gray-900 text-white font-black text-xl rounded-2xl hover:bg-black transition-all hover:shadow-2xl"
                    >
                        Start Exploring
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="mb-16">
                    <span className="text-primary-600 font-bold uppercase tracking-[0.3em] text-xs block mb-4">Your Selection</span>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tight">Checkout.</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-20 items-start">
                    {/* Cart Items List */}
                    <div className="space-y-12">
                        <div className="space-y-8">
                            {cartItems.map((item) => {
                                const product = item.product;
                                const price = product.discount_price || product.price;

                                return (
                                    <div key={item.id} className="group flex flex-col sm:flex-row items-center gap-8 pb-8 border-b border-gray-50">
                                        <div className="w-40 h-40 flex-shrink-0 bg-gray-50 rounded-[2rem] overflow-hidden border border-gray-100 group-hover:border-primary-100 transition-colors">
                                            {product.image_url ? (
                                                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-6xl grayscale opacity-30">🧺</div>
                                            )}
                                        </div>

                                        <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-6 w-full text-center sm:text-left">
                                            <div className="space-y-2">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-primary-600">{product.category || 'Handpicked'}</span>
                                                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{product.name}</h3>
                                                <p className="text-xs font-bold text-gray-400 italic lowercase tracking-tight">Per {product.unit}</p>

                                                <div className="pt-4 flex items-center justify-center sm:justify-start gap-4">
                                                    <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                            className="w-10 h-10 flex items-center justify-center text-lg font-light hover:bg-white rounded-lg transition-all"
                                                        >
                                                            −
                                                        </button>
                                                        <span className="w-12 text-center font-black text-lg">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="w-10 h-10 flex items-center justify-center text-lg font-light hover:bg-white rounded-lg transition-all"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400 hover:text-red-600 transition-colors"
                                                    >
                                                        Discard
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="sm:text-right">
                                                <p className="text-3xl font-black text-gray-900 tracking-tighter italic">${(price * item.quantity).toFixed(2)}</p>
                                                {product.discount_price && (
                                                    <p className="text-sm text-gray-300 font-bold line-through tracking-tight">${(product.price * item.quantity).toFixed(2)}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 space-y-6 sm:space-y-0 text-center sm:text-left">
                            <Link to="/products" className="group flex items-center space-x-3 text-gray-400 font-black text-sm uppercase tracking-widest hover:text-gray-900 transition-colors">
                                <span className="transform group-hover:-translate-x-2 transition-transform">←</span>
                                <span>Modify Collection</span>
                            </Link>
                            <button
                                onClick={clearCart}
                                className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 hover:text-red-400 transition-colors"
                            >
                                Empty All Items
                            </button>
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <aside className="lg:sticky lg:top-24">
                        <div className="bg-gray-50 rounded-[3rem] p-10 border border-gray-100 shadow-inner">
                            <h2 className="text-xs font-black text-gray-900 uppercase tracking-[0.4em] mb-10">Investment Summary</h2>

                            <div className="space-y-6 mb-10">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Subtotal</span>
                                    <span className="text-xl font-black text-gray-900 tracking-tighter">${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Courier</span>
                                    <span className="text-sm font-black text-green-600 uppercase tracking-widest italic tracking-tight">Complimentary</span>
                                </div>
                                <div className="pt-6 border-t border-gray-200/50 flex justify-between items-end">
                                    <div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-1">Final Total</span>
                                        <span className="text-4xl font-black text-primary-600 tracking-tighter italic leading-none">${cartTotal.toFixed(2)}</span>
                                    </div>
                                    <span className="text-xs font-bold text-gray-300 uppercase tracking-[0.2em]">USD</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full py-6 bg-gray-900 text-white rounded-[1.5rem] font-black text-xl hover:bg-black transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:-translate-y-1 mb-8 group overflow-hidden relative"
                            >
                                <span className="relative z-10">Secure Checkout</span>
                                <div className="absolute inset-x-0 bottom-0 h-1 bg-primary-500 transform translate-y-2 group-hover:translate-y-0 transition-transform"></div>
                            </button>

                            <div className="flex items-center justify-center space-x-3 text-gray-400">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-[10px] font-black uppercase tracking-widest">Encrypted SSL Connection</span>
                            </div>
                        </div>

                        {/* Secondary Value Add */}
                        <div className="mt-8 p-8 border border-gray-100 rounded-[2.5rem] flex items-center space-x-6">
                            <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-xl flex-shrink-0">📦</div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm">Carbon Neutral Delivery</h4>
                                <p className="text-[10px] text-gray-400 font-medium">Your selection supports our local reforestation partner.</p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Cart;
