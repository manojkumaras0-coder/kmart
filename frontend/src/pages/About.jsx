import React from 'react';
import Navbar from '../components/Navbar';

const About = () => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Simple Clean Header */}
            <div className="bg-gray-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
                    <span className="text-primary-600 font-bold uppercase tracking-[0.3em] text-xs block mb-4">Our Journey</span>
                    <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight font-serif italic mb-6">
                        The Story Behind <span className="text-primary-600">KMart.</span>
                    </h1>
                    <p className="text-gray-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                        From a small local vision to a digital gateway for the finest seasonal treasures. Discover who we are and why we do it.
                    </p>
                </div>
            </div>

            {/* Meet the Founder - Personal Photo Visibility Fixed */}
            <div id="story" className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="relative group">
                            {/* Decorative Elements */}
                            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 group-hover:opacity-50 transition-opacity"></div>

                            <div className="relative z-10 bg-gray-50 p-4 rounded-[2.5rem] shadow-2xl border border-gray-100 transition-transform duration-500 hover:rotate-2">
                                <img
                                    src="/about_hero.jpg"
                                    alt="Founder Manoj Kumar"
                                    className="w-full aspect-square object-cover rounded-[2rem] shadow-inner"
                                />
                                <div className="absolute bottom-10 -right-10 bg-white p-6 rounded-2xl shadow-xl max-w-[200px] border border-gray-50">
                                    <p className="text-sm italic text-gray-600">"Quality is not an act, it is a habit. At KMart, it's our daily tradition."</p>
                                    <p className="mt-4 font-bold text-primary-600">- Manoj Kumar</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-primary-600 font-black text-sm uppercase tracking-[0.4em] mb-4">A Message from Our Founder</h3>
                                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-[1.15]"> Bringing the Best <br /> to Your Table.</h2>
                            </div>
                            <p className="text-xl text-gray-600 leading-relaxed font-light">
                                "I started KMart with a mission to bridge the gap between hard-working local farmers
                                and families who value health and quality. We've meticulously designed our delivery
                                chain to ensure that when you open a KMart bag, the aroma of freshness fills your kitchen."
                            </p>
                            <p className="text-lg text-gray-500 leading-relaxed">
                                Our platform isn't just a store; it's a commitment to a more sustainable,
                                transparent food system. We believe transparency builds trust, and trust
                                is the foundation of every meal.
                            </p>
                            <div className="pt-6">
                                <button onClick={() => window.location.href = '/contact'} className="flex items-center group text-gray-900 font-bold text-lg hover:text-primary-600 transition-colors">
                                    <span>Personalized Grocery Support</span>
                                    <span className="ml-3 transform group-hover:translate-x-2 transition-transform">→</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Interactive Grid Sections */}
            <div className="bg-gray-50 py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                        {/* Vision Card */}
                        <div className="relative group overflow-hidden rounded-[2rem] h-[450px]">
                            <img src="https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&q=80&w=1000" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Vision" />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/40 to-transparent"></div>
                            <div className="absolute inset-x-0 bottom-0 p-10 translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                                <span className="text-primary-400 font-bold uppercase tracking-widest text-sm mb-4 block">Future Outlook</span>
                                <h3 className="text-4xl font-bold text-white mb-4">Our Vision</h3>
                                <p className="text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 max-w-sm mb-6">
                                    To revolutionize the global grocery ecosystem by merging artisan quality with
                                    cutting-edge accessibility.
                                </p>
                                <div className="w-12 h-1 bg-primary-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                            </div>
                        </div>

                        {/* Mission Card */}
                        <div className="relative group overflow-hidden rounded-[2rem] h-[450px]">
                            <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Mission" />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                            <div className="absolute inset-x-0 bottom-0 p-10 translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                                <span className="text-green-400 font-bold uppercase tracking-widest text-sm mb-4 block">Daily Commitment</span>
                                <h3 className="text-4xl font-bold text-white mb-4">Our Mission</h3>
                                <p className="text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 max-w-sm mb-6">
                                    Empowering households with the transparency and convenience required for a healthier lifestyle.
                                </p>
                                <div className="w-12 h-1 bg-green-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quality Icons Grid */}
            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                        <div className="text-center group">
                            <div className="w-24 h-24 bg-primary-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 transition-all group-hover:bg-primary-600 group-hover:text-white group-hover:rotate-12">
                                <span className="text-4xl">🌱</span>
                            </div>
                            <h4 className="text-2xl font-bold text-gray-900 mb-4">100% Organic</h4>
                            <p className="text-gray-500 leading-relaxed font-medium">Sourced from certified organic farms that prioritize soil health and biodiversity.</p>
                        </div>
                        <div className="text-center group">
                            <div className="w-24 h-24 bg-primary-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 transition-all group-hover:bg-primary-600 group-hover:text-white group-hover:rotate-12">
                                <span className="text-4xl">🚛</span>
                            </div>
                            <h4 className="text-2xl font-bold text-gray-900 mb-4">Zero Waste Delivery</h4>
                            <p className="text-gray-500 leading-relaxed font-medium">Our commitment to the planet means compostable packaging and optimized routes.</p>
                        </div>
                        <div className="text-center group">
                            <div className="w-24 h-24 bg-primary-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 transition-all group-hover:bg-primary-600 group-hover:text-white group-hover:rotate-12">
                                <span className="text-4xl">🍎</span>
                            </div>
                            <h4 className="text-2xl font-bold text-gray-900 mb-4">Farm-to-Door</h4>
                            <p className="text-gray-500 leading-relaxed font-medium">By cutting out the middlemen, we ensure produce reaches you within hours of harvest.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Final CTA Area */}
            <div className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-primary-600"></div>
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
                    <img src="https://www.transparenttextures.com/patterns/leaf.png" className="w-full h-full object-cover" alt="texture" />
                </div>
                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-5xl font-black text-white mb-8">Elevate Your Everyday Essentials</h2>
                    <p className="text-xl text-primary-100 mb-12">Join the thousands of happy families who have made KMart their primary choice for freshness.</p>
                    <button onClick={() => window.location.href = '/register'} className="bg-white text-primary-600 px-12 py-5 rounded-full font-black text-xl hover:shadow-[0_20px_50px_rgba(255,255,255,0.3)] transition-all hover:-translate-y-1">
                        Get Started with 20% Off
                    </button>
                </div>
            </div>
        </div>
    );
};

export default About;
