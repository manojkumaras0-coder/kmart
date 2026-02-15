import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                <div className="flex items-center justify-between">
                    {/* Logo - Premium Branding */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-primary-600/20 group-hover:scale-110 transition-transform">
                            🛒
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tighter">KMart<span className="text-primary-600">.</span></h1>
                    </Link>

                    {/* Navigation - Minimalist & Bold */}
                    <nav className="hidden md:flex items-center space-x-10">
                        <Link to="/" className="text-xs font-black uppercase tracking-[0.25em] text-gray-400 hover:text-primary-600 transition-colors">Home</Link>
                        <Link to="/products" className="text-xs font-black uppercase tracking-[0.25em] text-gray-400 hover:text-primary-600 transition-colors">Marketplace</Link>
                        <Link to="/about" className="text-xs font-black uppercase tracking-[0.25em] text-gray-400 hover:text-primary-600 transition-colors">About</Link>
                        <Link to="/contact" className="text-xs font-black uppercase tracking-[0.25em] text-gray-400 hover:text-primary-600 transition-colors">Contact</Link>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center space-x-6">
                        {/* Cart - Premium Floating Icon */}
                        <Link to="/cart" className="relative p-2.5 text-gray-900 hover:bg-gray-50 rounded-xl transition-all group">
                            <span className="text-2xl">🧺</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Authentication / User Section */}
                        <div className="flex items-center space-x-4 border-l border-gray-100 pl-6">
                            {isAuthenticated ? (
                                <>
                                    <div className="hidden sm:block text-right">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary-600 leading-none mb-1">Authenticated</p>
                                        <p className="text-sm font-bold text-gray-900 tracking-tight leading-none">{user?.firstName || user?.email.split('@')[0]}</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 py-3 px-5 rounded-xl transition-all"
                                    >
                                        Exit
                                    </button>
                                </>
                            ) : (
                                <div className="flex items-center space-x-3">
                                    <Link
                                        to="/login"
                                        className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="text-xs font-black uppercase tracking-widest bg-gray-900 text-white px-5 py-3 rounded-xl hover:bg-black transition-all shadow-xl shadow-gray-900/10"
                                    >
                                        Elite Access
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
