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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center justify-center text-center">
                    <div className="text-[10rem] mb-12 grayscale opacity-20">🛒</div>
                    <h2 className="text-4xl font-black text-gray-900 mb-6 tracking-tight">Checkout is empty.</h2>
                    <button onClick={() => navigate('/products')} className="px-12 py-5 bg-gray-900 text-white font-black text-xl rounded-2xl">
                        Back to Marketplace
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="mb-16">
                    <span className="text-primary-600 font-bold uppercase tracking-[0.3em] text-xs block mb-4">Final Step</span>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tight">Order Summary.</h1>
                </div>

                <div className="bg-gray-50 rounded-[3rem] p-10 md:p-16 border border-gray-100 shadow-inner space-y-12">
                    {/* Item List */}
                    <div className="space-y-6">
                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.4em] mb-8">Selected Treasures</h3>
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex justify-between items-center py-4 border-b border-gray-200/50">
                                <div>
                                    <h4 className="font-bold text-gray-900">{item.product.name}</h4>
                                    <p className="text-xs text-gray-500 font-medium italic">QTY: {item.quantity} × ${(item.product.discount_price || item.product.price).toFixed(2)}</p>
                                </div>
                                <span className="text-lg font-black text-gray-900 tracking-tighter">
                                    ${((item.product.discount_price || item.product.price) * item.quantity).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className="space-y-4 pt-8">
                        <div className="flex justify-between items-center text-gray-500">
                            <span className="font-bold uppercase tracking-widest text-xs">Marketplace Total</span>
                            <span className="font-black">${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-500">
                            <span className="font-bold uppercase tracking-widest text-xs">Premium Courier</span>
                            <span className="font-black text-green-600 uppercase tracking-tighter text-xs">Complimentary</span>
                        </div>
                        <div className="pt-8 border-t border-gray-200 flex justify-between items-end">
                            <div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-1">Grand Investment</span>
                                <span className="text-5xl font-black text-primary-600 tracking-tighter italic leading-none">${cartTotal.toFixed(2)}</span>
                            </div>
                            <span className="text-sm font-bold text-gray-300 uppercase tracking-[0.2em]">USD</span>
                        </div>
                    </div>

                    {error && (
                        <div className="p-6 bg-red-50 border border-red-100 rounded-2xl text-red-600 font-bold text-sm italic text-center">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Action */}
                    <button
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full py-8 bg-gray-900 text-white rounded-[2rem] font-black text-2xl hover:bg-black transition-all hover:shadow-[0_30px_60px_rgba(0,0,0,0.3)] hover:-translate-y-1 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="relative z-10">{loading ? 'Processing Transaction...' : 'Confirm & Pay Securely'}</span>
                        <div className="absolute inset-0 bg-primary-600 transform translate-y-full group-hover:translate-y-[95%] transition-transform duration-500"></div>
                    </button>

                    <div className="flex items-center justify-center space-x-6 text-gray-400">
                        <div className="flex items-center space-x-2">
                            <span className="text-xl">🛡️</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">Stripe Secure</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-xl">💳</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">Encoded SSL</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
