import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import { paymentAPI } from '../services/api';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

const Checkout = () => {
    const { cartItems, cartTotal } = useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handlePayment = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await paymentAPI.createCheckoutSession();
            const { url } = response.data;

            // Redirect to Stripe Checkout
            window.location.href = url;
        } catch (err) {
            console.error('Payment error:', err);
            setError(err.response?.data?.error || 'Failed to initiate payment. Please try again.');
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col items-center justify-center text-center">
                    <div className="text-[6rem] md:text-[10rem] mb-8 md:mb-12 grayscale opacity-20">🛒</div>
                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 tracking-tight">Checkout is empty.</h2>
                    <button onClick={() => navigate('/products')} className="px-10 py-4 md:px-12 md:py-5 bg-gray-900 text-white font-black text-lg md:text-xl rounded-2xl">
                        Back to Marketplace
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 lg:py-24">
                <div className="mb-10 md:mb-16">
                    <span className="text-primary-600 font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs block mb-2 md:mb-4">Final Step</span>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Order Summary.</h1>
                </div>

                <div className="bg-gray-50 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 lg:p-16 border border-gray-100 shadow-inner space-y-8 md:space-y-12">
                    {/* Item List */}
                    <div className="space-y-4 md:space-y-6">
                        <h3 className="text-[10px] md:text-xs font-black text-gray-900 uppercase tracking-[0.4em] mb-6 md:mb-8">Selected Treasures</h3>
                        <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex justify-between items-center py-3 md:py-4 border-b border-gray-200/50 last:border-0">
                                    <div className="flex-1 pr-4">
                                        <h4 className="font-bold text-gray-900 text-sm md:text-base leading-tight">{item.product.name}</h4>
                                        <p className="text-[10px] md:text-xs text-gray-500 font-medium italic">QTY: {item.quantity} × ${(item.product.discount_price || item.product.price).toFixed(2)}</p>
                                    </div>
                                    <span className="text-base md:text-lg font-black text-gray-900 tracking-tighter shrink-0">
                                        ${((item.product.discount_price || item.product.price) * item.quantity).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Totals */}
                    <div className="space-y-3 md:space-y-4 pt-6 md:pt-8 border-t border-gray-200">
                        <div className="flex justify-between items-center text-gray-500">
                            <span className="font-bold uppercase tracking-widest text-[10px] md:text-xs">Marketplace Total</span>
                            <span className="font-black text-sm md:text-base">${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-500">
                            <span className="font-bold uppercase tracking-widest text-[10px] md:text-xs">Premium Courier</span>
                            <span className="font-black text-green-600 uppercase tracking-tighter text-[10px] md:text-xs">Complimentary</span>
                        </div>
                        <div className="pt-6 md:pt-8 border-t border-gray-200/50 flex justify-between items-end">
                            <div>
                                <span className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-1">Grand Investment</span>
                                <span className="text-4xl md:text-5xl font-black text-primary-600 tracking-tighter italic leading-none">${cartTotal.toFixed(2)}</span>
                            </div>
                            <span className="text-[10px] md:text-sm font-bold text-gray-300 uppercase tracking-[0.2em]">USD</span>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 md:p-6 bg-red-50 border border-red-100 rounded-xl md:rounded-2xl text-red-600 font-bold text-xs md:text-sm italic text-center">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Action */}
                    <button
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full py-6 md:py-8 bg-gray-900 text-white rounded-[1.5rem] md:rounded-[2rem] font-black text-xl md:text-2xl hover:bg-black transition-all hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="relative z-10">{loading ? 'Processing Transaction...' : 'Confirm & Pay Securely'}</span>
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-primary-500 transform translate-y-2 group-hover:translate-y-0 transition-transform"></div>
                    </button>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-gray-400">
                        <div className="flex items-center space-x-2">
                            <span className="text-lg md:text-xl">🛡️</span>
                            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">Stripe Secure</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-lg md:text-xl">💳</span>
                            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">Encoded SSL</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
