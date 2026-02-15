import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';

const Success = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const { fetchCart } = useCart();

    useEffect(() => {
        // Refresh cart to ensure it's cleared after payment
        fetchCart();
    }, [fetchCart]);

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center justify-center text-center">
                <div className="relative mb-16">
                    <div className="absolute -inset-10 bg-primary-100/30 rounded-full blur-3xl animate-pulse"></div>
                    <div className="relative w-40 h-40 bg-primary-600 rounded-[2.5rem] flex items-center justify-center text-7xl shadow-2xl shadow-primary-600/40">
                        ✨
                    </div>
                </div>

                <span className="text-primary-600 font-bold uppercase tracking-[0.4em] text-xs block mb-6">Transaction Successful</span>
                <h1 className="text-6xl md:text-7xl font-black text-gray-900 tracking-tighter mb-8 italic">
                    Pure Gratitude.
                </h1>

                <p className="text-gray-500 font-medium italic max-w-lg mx-auto mb-16 leading-relaxed">
                    Your collection is being prepared by our artisans. An electronic receipt has been dispatched to your registered address.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mb-16">
                    <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 flex flex-col items-center">
                        <span className="text-2xl mb-4">📜</span>
                        <h4 className="font-black text-gray-900 text-sm uppercase tracking-widest mb-1">Session Identity</h4>
                        <p className="text-[10px] font-mono text-gray-400 truncate w-full">{sessionId || 'CS_TEST_CONFIRMED'}</p>
                    </div>
                    <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 flex flex-col items-center">
                        <span className="text-2xl mb-4">🚚</span>
                        <h4 className="font-black text-gray-900 text-sm uppercase tracking-widest mb-1">Delivery Speed</h4>
                        <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest tracking-tighter">Elite Priority</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link
                        to="/products"
                        className="px-12 py-5 bg-gray-900 text-white font-black text-xl rounded-2xl hover:bg-black transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:-translate-y-1"
                    >
                        Continue Exploring
                    </Link>
                    <Link
                        to="/orders"
                        className="px-12 py-5 bg-white border border-gray-200 text-gray-900 font-black text-xl rounded-2xl hover:bg-gray-50 transition-all"
                    >
                        Track Shipment
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Success;
