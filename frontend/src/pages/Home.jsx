import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { healthCheck } from '../services/api';

const Home = () => {
    useEffect(() => {
        // "Wake up" the backend (Render free tier) as soon as user lands on Home
        healthCheck().catch(() => { });
    }, []);
    const { user } = useAuth();
    const navigate = useNavigate();

    const categories = [
        { name: 'Fruits & Berries', query: 'Fruits', icon: '🍎', bg: 'bg-red-50', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&q=80&w=800' },
        { name: 'Organic Greens', query: 'Vegetables', icon: '🥦', bg: 'bg-green-50', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800' },
        { name: 'Dairy & Bakery', query: 'Dairy,Bakery', icon: '🧀', bg: 'bg-yellow-50', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800' },
        { name: 'Premium Meats', query: 'Meats', icon: '🥩', bg: 'bg-rose-50', image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&q=80&w=800' },
        { name: 'Market Seafood', query: 'Seafood', icon: '🐟', bg: 'bg-cyan-50', image: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&q=80&w=800' },
    ];

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Cinematic Hero Section */}
            <div className="relative h-[70vh] md:h-[85vh] flex items-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[30s] scale-110 animate-slow-zoom"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=2000')`,
                        filter: 'brightness(0.65)'
                    }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
                    <div className="space-y-4 md:space-y-6">
                        <span className="inline-block px-4 md:px-6 py-1.5 md:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold tracking-widest text-[10px] md:text-sm uppercase">
                            Experience Local Quality
                        </span>
                        <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-white leading-tight">
                            The Finest <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                                Nature Has to Offer.
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl lg:text-2xl text-gray-200 max-w-2xl mx-auto font-medium px-4">
                            Farm-fresh ingredients delivered daily from our partners right to your kitchen table.
                        </p>
                        <div className="pt-4 md:pt-8 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 px-4">
                            <button
                                onClick={() => navigate('/products')}
                                className="px-8 md:px-12 py-4 md:py-5 bg-primary-600 text-white font-black text-lg md:text-xl rounded-2xl hover:bg-primary-700 transition-all hover:shadow-[0_20px_60px_-15px_rgba(5,150,105,0.4)] hover:-translate-y-1 w-full sm:w-auto"
                            >
                                Start Shopping
                            </button>
                            <button
                                onClick={() => document.getElementById('explore').scrollIntoView({ behavior: 'smooth' })}
                                className="px-8 md:px-12 py-4 md:py-5 bg-white/10 backdrop-blur-lg border-2 border-white/30 text-white font-black text-lg md:text-xl rounded-2xl hover:bg-white/20 transition-all w-full sm:w-auto"
                            >
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Category Grid */}
            <div id="explore" className="py-16 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-16 space-y-4">
                        <div className="max-w-xl">
                            <span className="text-primary-600 font-bold uppercase tracking-[0.3em] text-xs md:text-sm block mb-4">Curated Selection</span>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight">Exquisite Taste in <br /> Every Category</h2>
                        </div>
                        <button onClick={() => navigate('/products')} className="text-gray-900 font-black flex items-center space-x-2 group">
                            <span>Browse All Aisles</span>
                            <span className="transform md:group-hover:translate-x-2 transition-transform">→</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {categories.map((cat, idx) => (
                            <div
                                key={idx}
                                onClick={() => navigate(`/products?category=${encodeURIComponent(cat.query)}`)}
                                className="group relative h-[300px] md:h-[400px] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden cursor-pointer shadow-lg md:shadow-xl"
                            >
                                <img
                                    src={cat.image || `https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=500`}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 md:group-hover:scale-110"
                                    alt={cat.name}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                                    <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-md rounded-xl md:rounded-2xl flex items-center justify-center text-2xl md:text-3xl mb-4">
                                        {cat.icon}
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-black text-white">{cat.name}</h3>
                                    <div className="h-1 w-0 md:group-hover:w-full bg-primary-500 transition-all duration-500 rounded-full mt-4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Value Proposition Section */}
            <div className="py-16 md:py-24 bg-gray-50 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-50 rounded-l-[5rem] md:rounded-l-[10rem] -mr-40 z-0"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
                        <div className="relative order-2 lg:order-1">
                            <div className="grid grid-cols-2 gap-4">
                                <img src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=500" className="rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl mt-6 md:mt-12" alt="Market" />
                                <img src="https://images.unsplash.com/photo-1516594798947-e65505dbb29d?auto=format&fit=crop&q=80&w=500" className="rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl" alt="Produce" />
                            </div>
                            <div className="absolute -bottom-6 md:-bottom-10 -right-6 md:-right-10 bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl md:shadow-2xl border border-gray-100 hidden sm:block max-w-[220px] md:max-w-[280px]">
                                <div className="flex items-center space-x-3 md:space-x-4 mb-3 md:mb-4 text-yellow-500">
                                    <span className="text-xl md:text-2xl font-black italic">Excellent</span>
                                    <div className="flex text-xs md:text-base">{'★'.repeat(5)}</div>
                                </div>
                                <p className="text-sm md:text-base text-gray-600 italic">"The freshest ingredients I've ever had delivered. Truly premium!"</p>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2">
                            <span className="text-primary-600 font-bold uppercase tracking-[0.3em] text-xs md:text-sm block mb-4">Why KMart?</span>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-8">Elevating the Art of Grocery Shopping</h2>
                            <div className="space-y-6 md:space-y-10">
                                <div className="flex items-start space-x-4 md:space-x-6 group">
                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-xl md:rounded-2xl shadow-md md:shadow-lg flex items-center justify-center text-2xl md:text-3xl flex-shrink-0 md:group-hover:bg-primary-600 md:group-hover:text-white transition-all">🚚</div>
                                    <div>
                                        <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-1 md:mb-2">Concierge Delivery</h4>
                                        <p className="text-sm md:text-base text-gray-600">Your groceries aren't just dropped off; they're handled with the care they deserve.</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4 md:space-x-6 group">
                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-xl md:rounded-2xl shadow-md md:shadow-lg flex items-center justify-center text-2xl md:text-3xl flex-shrink-0 md:group-hover:bg-primary-600 md:group-hover:text-white transition-all">🛡️</div>
                                    <div>
                                        <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-1 md:mb-2">Purity Guarantee</h4>
                                        <p className="text-sm md:text-base text-gray-600">Every single item undergoes a rigorous 5-point quality check before it leaves us.</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4 md:space-x-6 group">
                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-xl md:rounded-2xl shadow-md md:shadow-lg flex items-center justify-center text-2xl md:text-3xl flex-shrink-0 md:group-hover:bg-primary-600 md:group-hover:text-white transition-all">🌿</div>
                                    <div>
                                        <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-1 md:mb-2">Sustainable Sourcing</h4>
                                        <p className="text-sm md:text-base text-gray-600">We prioritize local farmers who use regenerative agriculture practices.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Brand Story Snippet */}
            <div className="py-16 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-primary-900 rounded-[2rem] md:rounded-[3rem] overflow-hidden p-8 md:p-24 relative">
                        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
                            <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" alt="texture" />
                        </div>
                        <div className="relative z-10 max-w-2xl text-center md:text-left">
                            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 md:mb-8 leading-tight">Our Journey to <br /> Your Kitchen.</h2>
                            <p className="text-lg md:text-xl text-primary-100 mb-8 md:mb-10 leading-relaxed font-light">
                                KMart was born from a passion for quality and a respect for nature.
                                We've built a world where convenience doesn't mean compromising on freshness.
                            </p>
                            <Link to="/about" className="inline-flex items-center space-x-4 text-white font-bold group">
                                <span className="text-lg md:text-xl border-b-2 border-primary-500 pb-1">Discover Our Story</span>
                                <span className="transform md:group-hover:translate-x-3 transition-transform text-2xl">→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Newsletter CTA */}
            <div className="pb-16 md:pb-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="bg-gray-50 rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-24 border border-gray-100">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4 md:mb-6 italic">Join the Inner Circle</h2>
                        <p className="text-base md:text-xl text-gray-600 mb-8 md:mb-12 max-w-xl mx-auto italic">
                            Subscribe to receive exclusive access to our seasonal harvests and limited-run artisanal treasures.
                        </p>
                        <div className="max-w-md mx-auto flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <input
                                type="email"
                                placeholder="Your elegant email address"
                                className="flex-1 px-6 md:px-8 py-4 md:py-5 rounded-2xl bg-white border border-gray-200 outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium text-sm md:text-base"
                            />
                            <button className="px-8 md:px-10 py-4 md:py-5 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all text-sm md:text-base">
                                Join
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Footer */}
            <footer className="bg-white border-t border-gray-100 pt-16 md:pt-24 pb-8 md:pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-16 md:mb-24">
                        <div className="space-y-4 md:space-y-6">
                            <Link to="/" className="flex items-center space-x-2">
                                <span className="text-2xl md:text-3xl">🛒</span>
                                <h1 className="text-xl md:text-2xl font-black text-primary-600">KMart</h1>
                            </Link>
                            <p className="text-gray-500 font-medium max-w-xs italic text-sm md:text-base">
                                Redefining the modern grocery experience with sophistication and care.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-black text-gray-900 mb-4 md:mb-6 uppercase tracking-widest text-[10px] md:text-xs">Exhibition</h4>
                            <ul className="space-y-3 md:space-y-4 text-gray-500 font-medium text-sm md:text-base">
                                <li><Link to="/products" className="hover:text-primary-600 transition-colors">Our Aisles</Link></li>
                                <li><Link to="/about" className="hover:text-primary-600 transition-colors">Our Story</Link></li>
                                <li><Link to="/" className="hover:text-primary-600 transition-colors">Seasonal Specials</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-black text-gray-900 mb-4 md:mb-6 uppercase tracking-widest text-[10px] md:text-xs">Support</h4>
                            <ul className="space-y-3 md:space-y-4 text-gray-500 font-medium text-sm md:text-base">
                                <li><Link to="/contact" className="hover:text-primary-600 transition-colors">Concierge</Link></li>
                                <li><Link to="/faq" className="hover:text-primary-600 transition-colors">Order Tracking</Link></li>
                                <li><Link to="/privacy" className="hover:text-primary-600 transition-colors">Sustainability Report</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-black text-gray-900 mb-4 md:mb-6 uppercase tracking-widest text-[10px] md:text-xs">Socials</h4>
                            <div className="flex space-x-3 md:space-x-4">
                                <span className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 rounded-xl flex items-center justify-center cursor-pointer hover:bg-primary-50 transition-all hover:text-primary-600 text-xs md:text-sm">IG</span>
                                <span className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 rounded-xl flex items-center justify-center cursor-pointer hover:bg-primary-50 transition-all hover:text-primary-600 text-xs md:text-sm">TW</span>
                                <span className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 rounded-xl flex items-center justify-center cursor-pointer hover:bg-primary-50 transition-all hover:text-primary-600 text-xs md:text-sm">FB</span>
                            </div>
                        </div>
                    </div>
                    <div className="pt-8 md:pt-12 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center text-gray-400 text-[10px] md:text-sm font-medium space-y-4 md:space-y-0 text-center md:text-left">
                        <p>&copy; 2026 KMart Concierge. All rights reserved.</p>
                        <div className="flex space-x-6 md:space-x-8 italic">
                            <span>Privacy Policy</span>
                            <span>Terms of Service</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
