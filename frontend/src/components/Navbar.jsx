import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        navigate('/login');
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-5">
                <div className="flex items-center justify-between">
                    {/* Logo - Premium Branding */}
                    <Link to="/" className="flex items-center space-x-3 group z-50">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-primary-600 rounded-lg md:rounded-xl flex items-center justify-center text-lg md:text-xl shadow-lg shadow-primary-600/20 group-hover:scale-110 transition-transform">
                            🛒
                        </div>
                        <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tighter">KMart<span className="text-primary-600">.</span></h1>
                    </Link>

                    {/* Navigation - Desktop */}
                    <nav className="hidden md:flex items-center space-x-10">
                        <Link to="/" className="text-xs font-black uppercase tracking-[0.25em] text-gray-400 hover:text-primary-600 transition-colors">Home</Link>
                        <Link to="/products" className="text-xs font-black uppercase tracking-[0.25em] text-gray-400 hover:text-primary-600 transition-colors">Marketplace</Link>
                        <Link to="/about" className="text-xs font-black uppercase tracking-[0.25em] text-gray-400 hover:text-primary-600 transition-colors">About</Link>
                        <Link to="/contact" className="text-xs font-black uppercase tracking-[0.25em] text-gray-400 hover:text-primary-600 transition-colors">Contact</Link>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center space-x-3 md:space-x-6">
                        {/* Cart - Premium Floating Icon */}
                        <Link to="/cart" className="relative p-2 md:p-2.5 text-gray-900 hover:bg-gray-50 rounded-xl transition-all group">
                            <span className="text-xl md:text-2xl">🧺</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-[8px] md:text-[10px] font-black rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center border-2 border-white shadow-sm">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Authentication / User Section - Desktop */}
                        <div className="hidden md:flex items-center space-x-4 border-l border-gray-100 pl-6">
                            {isAuthenticated ? (
                                <>
                                    <div className="hidden lg:block text-right">
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

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMenu}
                            className="md:hidden p-2 text-gray-900 hover:bg-gray-50 rounded-xl transition-all z-50"
                        >
                            {isMenuOpen ? (
                                <span className="text-2xl block w-6 h-6 flex items-center justify-center">✕</span>
                            ) : (
                                <span className="text-2xl block w-6 h-6 flex items-center justify-center">☰</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMenuOpen && (
                <div className="md:hidden fixed inset-0 bg-white z-40 pt-24 px-6 animate-in slide-in-from-top duration-300">
                    <nav className="flex flex-col space-y-8 mb-12">
                        <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black text-gray-900 border-b border-gray-50 pb-4">Home</Link>
                        <Link to="/products" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black text-gray-900 border-b border-gray-50 pb-4">Marketplace</Link>
                        <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black text-gray-900 border-b border-gray-50 pb-4">About</Link>
                        <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black text-gray-900 border-b border-gray-50 pb-4">Contact</Link>
                    </nav>

                    <div className="space-y-6 pt-6 border-t border-gray-100">
                        {isAuthenticated ? (
                            <div className="flex flex-col space-y-4">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-primary-600 mb-1">Authenticated as</p>
                                    <p className="text-xl font-bold text-gray-900">{user?.firstName || user?.email.split('@')[0]}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full bg-red-50 text-red-600 font-black uppercase tracking-widest py-5 rounded-2xl text-sm"
                                >
                                    Exit Account
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col space-y-4">
                                <Link
                                    to="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="w-full bg-gray-50 text-gray-900 text-center font-black uppercase tracking-widest py-5 rounded-2xl text-sm"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="w-full bg-gray-900 text-white text-center font-black uppercase tracking-widest py-5 rounded-2xl text-sm shadow-xl shadow-gray-900/10"
                                >
                                    Elite Access
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;

