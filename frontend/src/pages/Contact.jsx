import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 8000);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Cinematic Header */}
            <div className="relative h-[40vh] bg-primary-900 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <img src="https://www.transparenttextures.com/patterns/leaf.png" className="w-full h-full object-cover" alt="texture" />
                </div>
                <div className="relative z-10 text-center space-y-4">
                    <span className="text-primary-400 font-bold uppercase tracking-[0.4em] text-xs block">Concierge Support</span>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight italic">How can we assist you?</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Information Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-gray-100 flex flex-col h-full">
                            <h3 className="text-xl font-black text-gray-900 mb-8 tracking-tight">Visit Our Atelier</h3>

                            <div className="space-y-10 flex-1">
                                <div className="flex items-start space-x-6 group">
                                    <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-primary-600 group-hover:text-white transition-all shadow-sm">📍</div>
                                    <div>
                                        <h4 className="font-black text-gray-900 text-sm uppercase tracking-widest mb-1">Office</h4>
                                        <p className="text-gray-500 font-medium leading-relaxed italic">1480 Paseo Verde Pkwy,<br />Henderson, NV 89012</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-6 group">
                                    <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-primary-600 group-hover:text-white transition-all shadow-sm">📧</div>
                                    <div>
                                        <h4 className="font-black text-gray-900 text-sm uppercase tracking-widest mb-1">Electronic Mail</h4>
                                        <p className="text-gray-500 font-medium italic">concierge@kmart.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-6 group">
                                    <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-primary-600 group-hover:text-white transition-all shadow-sm">📞</div>
                                    <div>
                                        <h4 className="font-black text-gray-900 text-sm uppercase tracking-widest mb-1">Direct Line</h4>
                                        <p className="text-gray-500 font-medium italic">+1 (555) 123-4567</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 pt-8 border-t border-gray-50">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Response Time</p>
                                <p className="text-sm font-bold text-primary-600 mt-1 italic">Under 60 Minutes</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form Area */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 p-8 md:p-16">
                            {submitted ? (
                                <div className="text-center py-20 animate-fade-in-up">
                                    <div className="text-9xl mb-10 grayscale">📨</div>
                                    <h3 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Transmission Received.</h3>
                                    <p className="text-gray-500 font-medium italic max-w-sm mx-auto">
                                        Thank you for your inquiry. A dedicated member of our concierge team will reach out to you shortly.
                                    </p>
                                    <div className="mt-12 h-1 w-24 bg-primary-500 mx-auto rounded-full"></div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-10 group">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-4">Full Identity</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-8 py-5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary-500/30 outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300"
                                                placeholder="Manoj Kumar"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-4">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-8 py-5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary-500/30 outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300"
                                                placeholder="manoj@example.com"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-4">Subject of Inquiry</label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-8 py-5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary-500/30 outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300"
                                            placeholder="How may we assist?"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-4">Message Content</label>
                                        <textarea
                                            name="message"
                                            rows="5"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-8 py-5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary-500/30 outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300 resize-none"
                                            placeholder="Please describe your requirements..."
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full py-6 bg-gray-900 text-white rounded-[1.5rem] font-black text-xl hover:bg-black transition-all hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:-translate-y-1 group relative overflow-hidden"
                                    >
                                        <span className="relative z-10">Dispatch Message</span>
                                        <div className="absolute inset-x-0 bottom-0 h-1 bg-primary-500 transform translate-y-2 group-hover:translate-y-0 transition-transform"></div>
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
