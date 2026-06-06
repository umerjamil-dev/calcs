'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Menu, X, Activity, Heart, Sparkles, Dumbbell, Baby, Droplets, Scale, Timer, Zap, Moon, Beer, ArrowUpRight, Calculator, Search } from 'lucide-react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 30);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const categories = [
        {
            id: "health",
            title: "Health",
            icon: <Activity className="w-4 h-4" />,
            accent: "#10b981",
            links: [
                { name: "BMI Calculator", href: "/bmi" },
                { name: "Calorie Calculator", href: "/calorie" },
                { name: "Ideal Weight", href: "/ideal-weight" },
                { name: "Water Intake", href: "/water" },
                { name: "Body Fat %", href: "/body-fat" },
                { name: "TDEE Calculator", href: "/tdee" },
                { name: "BMR Calculator", href: "/bmr" },
                { name: "Age Calculator", href: "/age" },
                { name: "GFR Calculator", href: "/gfr" },
            ]
        },
        {
            id: "fitness",
            title: "Fitness",
            icon: <Dumbbell className="w-4 h-4" />,
            accent: "#f97316",
            links: [
                { name: "Macros Calculator", href: "/macros" },
                { name: "One Rep Max", href: "/1rm" },
                { name: "Running Pace", href: "/pace" },
                { name: "Protein Calculator", href: "/protein" },
                { name: "Weight Loss", href: "/weight-loss" },
                { name: "Keto Calculator", href: "/keto" },
                { name: "Heart Rate", href: "/heart-rate" },
                { name: "Macro Calc", href: "/macro-calc" },
            ]
        },
        {
            id: "women",
            title: "Women Health",
            icon: <Baby className="w-4 h-4" />,
            accent: "#ec4899",
            links: [
                { name: "Due Date", href: "/due-date" },
                { name: "Ovulation", href: "/ovulation" },
                { name: "Period Calculator", href: "/period" },
                { name: "Pregnancy", href: "/pregnancy" },
                { name: "Conception", href: "/conception" },
                { name: "Preg. Weight", href: "/preg-weight" },
            ]
        },
        {
            id: "lifestyle",
            title: "Lifestyle",
            icon: <Sparkles className="w-4 h-4" />,
            accent: "#8b5cf6",
            links: [
                { name: "Sleep Calculator", href: "/sleep" },
                { name: "BAC Calculator", href: "/bac" },
            ]
        }
    ];

    const navLinks = [
        { label: 'About', href: '/about' },
        { label: 'Blog', href: '/blog' },
        { label: 'Contact', href: '/contact' },
    ];

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-700 ease-out ${
                    isScrolled
                        ? 'py-0'
                        : 'py-3'
                }`}
            >
                {/* Main Nav Bar */}
                <div
                    className={`w-full transition-all duration-700 ease-out ${
                        isScrolled
                            ? 'bg-white/80 backdrop-blur-2xl shadow-[0_1px_0_rgba(0,0,0,0.04),0_8px_30px_rgba(0,0,0,0.06)]'
                            : 'bg-transparent'
                    }`}
                >
                    <div className="container-custom">
                        <div className="flex items-center justify-between h-[64px]">
                            {/* Logo */}
                            <Link href="/" className="group flex items-center gap-2.5 no-underline flex-shrink-0 lg:flex-1">
                                <div className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-500 ${
                                    isScrolled
                                        ? 'bg-forest text-white'
                                        : 'bg-white/15 text-white backdrop-blur-sm border border-white/20'
                                }`}>
                                    <Calculator className="w-[18px] h-[18px]" />
                                </div>
                                <div className="flex flex-col">
                                    <span className={`text-lg font-bold font-display leading-none tracking-tight transition-colors duration-500 ${
                                        isScrolled ? 'text-ink' : 'text-white'
                                    }`}>
                                        Health<span className={`transition-colors duration-500 ${isScrolled ? 'text-forest' : 'text-mint'}`}>Calcs</span>
                                    </span>
                                    <span className={`text-[8px] font-bold uppercase tracking-[3.5px] leading-none mt-1 transition-colors duration-500 ${
                                        isScrolled ? 'text-ink-light' : 'text-white/35'
                                    }`}>
                                        Pro
                                    </span>
                                </div>
                            </Link>

                            {/* Desktop Nav Links */}
                            <nav className="hidden lg:flex items-center gap-1 justify-center flex-1">
                                {/* Calculators Dropdown */}
                                <div
                                    className="relative"
                                    onMouseEnter={() => setActiveDropdown('calc')}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <button
                                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                                            activeDropdown === 'calc'
                                                ? (isScrolled ? 'bg-forest/[0.08] text-forest' : 'bg-white/20 text-white')
                                                : (isScrolled ? 'text-ink-mid hover:bg-forest/[0.05] hover:text-forest' : 'text-white/80 hover:text-white hover:bg-white/10')
                                        }`}
                                    >
                                        Calculators
                                        <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${activeDropdown === 'calc' ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Mega Menu Dropdown */}
                                    <AnimatePresence>
                                        {activeDropdown === 'calc' && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                                                transition={{ duration: 0.2, ease: 'easeOut' }}
                                                className="absolute top-[calc(100%+12px)] left-[-20px] w-[680px] bg-white rounded-3xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.03)] p-6 z-50"
                                            >
                                                <div className="grid grid-cols-2 gap-6">
                                                    {categories.map((cat) => (
                                                        <div key={cat.id}>
                                                            <div className="flex items-center gap-2 mb-3 px-1">
                                                                <div
                                                                    className="w-6 h-6 rounded-md flex items-center justify-center"
                                                                    style={{ backgroundColor: cat.accent + '18', color: cat.accent }}
                                                                >
                                                                    {cat.icon}
                                                                </div>
                                                                <span className="text-xs font-bold text-ink tracking-wide">{cat.title}</span>
                                                            </div>
                                                            <div className="flex flex-col gap-0.5">
                                                                {cat.links.map((link, idx) => (
                                                                    <Link
                                                                        key={idx}
                                                                        href={link.href}
                                                                        className="flex items-center justify-between px-3 py-2 rounded-xl text-[13px] text-ink-muted hover:text-ink hover:bg-cream transition-all font-medium group"
                                                                    >
                                                                        {link.name}
                                                                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {navLinks.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`px-4 py-2 rounded-full text-[13px] font-semibold tracking-wide transition-all duration-300 ${
                                            isScrolled
                                                ? 'text-ink-mid hover:bg-forest/[0.05] hover:text-forest'
                                                : 'text-white/80 hover:text-white hover:bg-white/10'
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>

                            {/* Right Side: CTA + Mobile Toggle */}
                            <div className="flex items-center gap-3 flex-1 justify-end">
                                <Link
                                    href="/calculators"
                                    className={`hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-bold tracking-wide transition-all duration-500 ${
                                        isScrolled
                                            ? 'bg-forest text-white shadow-lg shadow-forest/20 hover:shadow-xl hover:shadow-forest/30 hover:-translate-y-0.5'
                                            : 'bg-mint text-forest shadow-[0_4px_24px_rgba(78,203,141,0.3)] hover:shadow-[0_8px_32px_rgba(78,203,141,0.45)] hover:-translate-y-0.5'
                                    }`}
                                >
                                    Try Now
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                </Link>

                                <button
                                    className={`lg:hidden w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                                        isScrolled
                                            ? 'bg-forest/[0.06] text-ink-mid hover:bg-forest/10'
                                            : 'bg-white/10 text-white hover:bg-white/20'
                                    }`}
                                    onClick={() => setIsMobileMenuOpen(true)}
                                >
                                    <Menu className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Full-Screen Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[9999] bg-forest overflow-y-auto lg:hidden"
                    >
                        {/* Mobile Header */}
                        <div className="flex items-center justify-between px-6 py-5">
                            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                                <div className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white">
                                        <Calculator className="w-[18px] h-[18px]" />
                                    </div>
                                    <span className="text-lg font-bold font-display text-white tracking-tight">
                                        Health<span className="text-mint">Calcs</span>
                                    </span>
                                </div>
                            </Link>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Mobile Content */}
                        <div className="px-6 py-8">
                            <p className="text-white/30 text-[10px] font-black uppercase tracking-[5px] mb-6">Calculators</p>

                            <div className="flex flex-col gap-2">
                                {categories.map((cat, catIdx) => (
                                    <motion.div
                                        key={cat.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: catIdx * 0.08, duration: 0.4 }}
                                    >
                                        <button
                                            onClick={() => setActiveDropdown(activeDropdown === cat.id ? null : cat.id)}
                                            className="w-full flex items-center justify-between py-4 border-b border-white/8 group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                                                    style={{ backgroundColor: cat.accent + '20', color: cat.accent }}
                                                >
                                                    {cat.icon}
                                                </div>
                                                <span className="text-white font-semibold text-base">{cat.title}</span>
                                            </div>
                                            <ChevronDown className={`w-4 h-4 text-white/40 transition-transform duration-300 ${activeDropdown === cat.id ? 'rotate-180' : ''}`} />
                                        </button>

                                        <AnimatePresence>
                                            {activeDropdown === cat.id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="py-3 pl-11 flex flex-col gap-1">
                                                        {cat.links.map((link, idx) => (
                                                            <Link
                                                                key={idx}
                                                                href={link.href}
                                                                className="text-white/60 hover:text-white text-sm font-medium py-2 transition-colors"
                                                                onClick={() => setIsMobileMenuOpen(false)}
                                                            >
                                                                {link.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Page Links */}
                            <div className="mt-10">
                                <p className="text-white/30 text-[10px] font-black uppercase tracking-[5px] mb-5">Pages</p>
                                <div className="flex flex-col gap-1">
                                    {navLinks.map((item, idx) => (
                                        <motion.div
                                            key={item.href}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 + idx * 0.06 }}
                                        >
                                            <Link
                                                href={item.href}
                                                className="flex items-center justify-between py-3.5 border-b border-white/8 text-white/70 hover:text-white font-semibold transition-colors"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                {item.label}
                                                <ArrowUpRight className="w-4 h-4 opacity-30" />
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* CTA */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="mt-12"
                            >
                                <Link
                                    href="/calculators"
                                    className="flex items-center justify-center gap-2 bg-mint text-forest py-4 rounded-2xl font-bold text-sm shadow-[0_8px_30px_rgba(78,203,141,0.3)]"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Start Calculating
                                    <ArrowUpRight className="w-4 h-4" />
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
