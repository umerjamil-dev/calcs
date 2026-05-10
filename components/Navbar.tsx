'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Menu, X, Plus, Activity, Heart, Sparkles, Dumbbell, Baby, Droplets, Scale, Timer, Zap, Moon, Beer, ChevronRight, ArrowRight } from 'lucide-react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [isHomeMenuOpen, setIsHomeMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const categories = [
        {
            id: "health",
            title: "Health",
            icon: <Activity className="w-5 h-5" />,
            count: "9 Calculators",
            color: "bg-mint-xlight",
            textColor: "text-forest",
            links: [
                { name: "BMI Calculator", href: "/bmi", icon: <Scale className="w-4 h-4" /> },
                { name: "Calorie Calculator", href: "/calorie", icon: <Zap className="w-4 h-4" /> },
                { name: "Ideal Weight", href: "/ideal-weight", icon: <Activity className="w-4 h-4" /> },
                { name: "Water Intake", href: "/water", icon: <Droplets className="w-4 h-4" /> },
                { name: "Body Fat %", href: "/body-fat", icon: <Activity className="w-4 h-4" /> },
                { name: "TDEE Calculator", href: "/tdee", icon: <Zap className="w-4 h-4" /> },
                { name: "BMR Calculator", href: "/bmr", icon: <Activity className="w-4 h-4" /> },
                { name: "Age Calculator", href: "/age", icon: <Activity className="w-4 h-4" /> },
                { name: "GFR Calculator", href: "/gfr", icon: <Activity className="w-4 h-4" /> },
            ]
        },
        {
            id: "fitness",
            title: "Fitness",
            icon: <Dumbbell className="w-5 h-5" />,
            count: "8 Calculators",
            color: "bg-[#fff4e8]",
            textColor: "text-[#f97316]",
            links: [
                { name: "Macros Calculator", href: "/macros", icon: <Activity className="w-4 h-4" /> },
                { name: "One Rep Max", href: "/1rm", icon: <Dumbbell className="w-4 h-4" /> },
                { name: "Running Pace", href: "/pace", icon: <Timer className="w-4 h-4" /> },
                { name: "Protein Calculator", href: "/protein", icon: <Activity className="w-4 h-4" /> },
                { name: "Weight Loss", href: "/weight-loss", icon: <Scale className="w-4 h-4" /> },
                { name: "Keto Calculator", href: "/keto", icon: <Activity className="w-4 h-4" /> },
                { name: "Heart Rate", href: "/heart-rate", icon: <Heart className="w-4 h-4" /> },
                { name: "Macro Calc", href: "/macro-calc", icon: <Activity className="w-4 h-4" /> },
            ]
        },
        {
            id: "women",
            title: "Women Health",
            icon: <Baby className="w-5 h-5" />,
            count: "6 Calculators",
            color: "bg-[#ffeef4]",
            textColor: "text-[#ec4899]",
            links: [
                { name: "Due Date", href: "/due-date", icon: <Baby className="w-4 h-4" /> },
                { name: "Ovulation", href: "/ovulation", icon: <Activity className="w-4 h-4" /> },
                { name: "Period Calculator", href: "/period", icon: <Activity className="w-4 h-4" /> },
                { name: "Pregnancy", href: "/pregnancy", icon: <Baby className="w-4 h-4" /> },
                { name: "Conception", href: "/conception", icon: <Sparkles className="w-4 h-4" /> },
                { name: "Preg. Weight", href: "/preg-weight", icon: <Scale className="w-4 h-4" /> },
            ]
        },
        {
            id: "lifestyle",
            title: "Lifestyle",
            icon: <Sparkles className="w-5 h-5" />,
            count: "2 Calculators",
            color: "bg-[#f0eeff]",
            textColor: "text-[#6366f1]",
            links: [
                { name: "Sleep Calculator", href: "/sleep", icon: <Moon className="w-4 h-4" /> },
                { name: "BAC Calculator", href: "/bac", icon: <Beer className="w-4 h-4" /> },
            ]
        }
    ];

    const currentLinks = categories.find(c => c.id === activeCategory)?.links || [];

    return (
        <header 
            className={`fixed top-0 left-0 right-0 z-[1000] flex items-center transition-all duration-500 border-b ${
                isScrolled 
                ? 'h-18 bg-forest/95 backdrop-blur-2xl ' 
                : 'h-[72px] '
            }`}
        >
            <div className="container-custom flex justify-between items-center h-full">
                {/* Logo */}
                <Link href="/" className="group flex items-center no-underline">
                    <div className="bg-gradient-to-br from-forest to-forest-mid text-mint w-[38px] h-[38px] rounded-xl flex items-center justify-center font-display font-black text-lg border border-mint/30 transition-all duration-300 group-hover:rotate-[-5deg] group-hover:scale-110 group-hover:border-mint shadow-lg">
                        hc
                    </div>
                    <span className="text-2xl font-bold text-white font-display ml-3 tracking-tighter">
                        HealthCalcs<span className="text-mint">Pro</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex gap-8 items-center bg-white/5 p-1 rounded-full border border-white/10">
                    <div 
                        className="relative h-11 flex items-center"
                        onMouseEnter={() => setIsHomeMenuOpen(true)}
                        onMouseLeave={() => {
                            setIsHomeMenuOpen(false);
                            setActiveCategory(null);
                        }}
                    >
                        <Link href="/" className={`px-[18px] py-2 rounded-full transition-all duration-300 flex items-center gap-1.5 font-semibold text-sm ${isHomeMenuOpen ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
                            Home <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-500 ${isHomeMenuOpen ? 'rotate-180' : ''}`} />
                        </Link>
                        
                        <AnimatePresence>
                            {isHomeMenuOpen && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.3, ease: [0.165, 0.84, 0.44, 1] }}
                                    className="absolute top-[calc(100%+12px)] left-0 min-w-[240px] bg-white rounded-3xl shadow-[0_30px_60px_-12px_rgba(10,79,60,0.25)] p-3 overflow-visible border border-forest/5 flex"
                                >
                                    {/* Category List */}
                                    <div className="flex flex-col w-[240px] gap-1">
                                        {categories.map((cat) => (
                                            <div
                                                key={cat.id}
                                                onMouseEnter={() => setActiveCategory(cat.id)}
                                                className={`flex items-center justify-between px-4 py-3.5 rounded-2xl cursor-pointer transition-all duration-200 ${activeCategory === cat.id ? `${cat.color} ${cat.textColor}` : 'text-ink-mid hover:bg-cream'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="opacity-70">{cat.icon}</span>
                                                    <span className="font-bold text-sm">{cat.title}</span>
                                                </div>
                                                <ChevronRight className={`w-4 h-4 transition-transform ${activeCategory === cat.id ? 'translate-x-1' : 'opacity-20'}`} />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Sub-Sub Menu (Links) */}
                                    <AnimatePresence mode="wait">
                                        {activeCategory && (
                                            <motion.div
                                                key={activeCategory}
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 5 }}
                                                className="absolute left-[calc(100%+8px)] top-0 w-[280px] bg-white rounded-3xl shadow-[20px_30px_60px_-12px_rgba(10,79,60,0.2)] p-4 border border-forest/5"
                                            >
                                                <div className="text-[10px] uppercase tracking-widest font-black text-forest/30 mb-4 px-3 flex justify-between items-center">
                                                    <span>{activeCategory} Calculators</span>
                                                    <span className="bg-forest/5 px-2 py-0.5 rounded text-forest/40">{currentLinks.length}</span>
                                                </div>
                                                <div className="grid grid-cols-1 gap-1">
                                                    {currentLinks.map((link, idx) => (
                                                        <Link 
                                                            key={idx} 
                                                            href={link.href}
                                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-ink-mid hover:text-forest hover:bg-cream transition-all text-sm font-medium group/link"
                                                        >
                                                            <span className="opacity-30 group-hover/link:opacity-100 transition-opacity">{link.icon}</span>
                                                            {link.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <Link href="/about" className="text-white/70 hover:text-white hover:bg-white/10 px-[18px] py-2 rounded-full transition-all duration-300 font-semibold text-sm">About</Link>
                    <Link href="/blog" className="text-white/70 hover:text-white hover:bg-white/10 px-[18px] py-2 rounded-full transition-all duration-300 font-semibold text-sm">Blog</Link>
                    <Link href="/contact" className="text-white/70 hover:text-white hover:bg-white/10 px-[18px] py-2 rounded-full transition-all duration-300 font-semibold text-sm">Contact</Link>
                </nav>

                <div className=" flex gap-4 items-center">
                    <Link href="/calculators" className=" hidden sm:flex bg-mint text-forest px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 shadow-[0_4px_15px_rgba(78,203,141,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(78,203,141,0.4)] hover:bg-white">
                        Calculate Now
                    </Link>
                    <button 
                        className="lg:hidden w-11 h-11 flex items-center justify-center bg-white/10 rounded-xl text-white border border-white/10"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Side-Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop Overlay */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-forest/60 backdrop-blur-md z-[998] lg:hidden"
                        />
                        
                        {/* Drawer Content */}
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-[400px] bg-forest z-[999] flex flex-col p-6 overflow-y-auto lg:hidden shadow-[-20px_0_60px_rgba(0,0,0,0.5)] border-l border-white/10"
                        >
                            <div className="flex items-center justify-between mb-12">
                                <Link href="/" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                                    <div className="bg-mint text-forest w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm">hc</div>
                                    <span className="text-xl font-bold text-white ml-2">HealthCalcs<span className="text-mint">Pro</span></span>
                                </Link>
                                <button 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl border border-white/10 text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <nav className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-white/30 text-[10px] font-black uppercase tracking-[4px] mb-4 px-2">Calculator Suite</h3>
                                    {categories.map((cat) => (
                                        <div key={cat.id} className="bg-white/5 rounded-2xl overflow-hidden border border-white/5">
                                            <button 
                                                onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                                                className="w-full flex items-center justify-between p-4 text-white hover:bg-white/5 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-xl ${cat.color} ${cat.textColor} flex items-center justify-center`}>
                                                        {cat.icon}
                                                    </div>
                                                    <span className="font-bold text-sm">{cat.title}</span>
                                                </div>
                                                <ChevronDown className={`w-3 h-3 text-white/40 transition-transform duration-300 ${activeCategory === cat.id ? 'rotate-180' : ''}`} />
                                            </button>
                                            
                                            <AnimatePresence>
                                                {activeCategory === cat.id && (
                                                    <motion.div 
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden bg-white/5"
                                                    >
                                                        <div className="p-4 pt-0 grid grid-cols-1 gap-1">
                                                            {cat.links.map((link, idx) => (
                                                                <Link 
                                                                    key={idx} 
                                                                    href={link.href}
                                                                    className="flex items-center gap-3 p-3 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all text-xs font-medium"
                                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                                >
                                                                    <span className="opacity-40">{link.icon}</span>
                                                                    {link.name}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 gap-3 pt-6 border-t border-white/10">
                                    <Link href="/about" className="p-4 bg-white/5 rounded-2xl text-lg font-bold text-white flex items-center justify-between group" onClick={() => setIsMobileMenuOpen(false)}>
                                        About Us <ArrowRight className="w-4 h-4 text-mint" />
                                    </Link>
                                    <Link href="/blog" className="p-4 bg-white/5 rounded-2xl text-lg font-bold text-white flex items-center justify-between group" onClick={() => setIsMobileMenuOpen(false)}>
                                        Health Blog <ArrowRight className="w-4 h-4 text-mint" />
                                    </Link>
                                    <Link href="/contact" className="p-4 bg-white/5 rounded-2xl text-lg font-bold text-white flex items-center justify-between group" onClick={() => setIsMobileMenuOpen(false)}>
                                        Contact <ArrowRight className="w-4 h-4 text-mint" />
                                    </Link>
                                </div>

                                <Link 
                                    href="/calculators" 
                                    className="mt-6 bg-mint text-forest p-5 rounded-2xl font-black text-center text-sm shadow-[0_10px_30px_rgba(78,203,141,0.2)]"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    START CALCULATING →
                                </Link>
                            </nav>
                            
                            <div className="mt-12 pt-12 border-t border-white/5 pb-6 text-center">
                                <p className="text-white/20 text-[9px] font-black uppercase tracking-[3px]">healthcalcspro © 2024</p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
