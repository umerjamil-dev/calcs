'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView, animate } from 'framer-motion';
import { Scale, Apple } from 'lucide-react';

const Counter = ({ value, duration = 2, decimals = 0 }: { value: number, duration?: number, decimals?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration: duration,
        onUpdate: (latest) => setCount(latest),
      });
      return () => controls.stop();
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{count.toFixed(decimals)}</span>;
};

export default function Hero({ stats }: { stats: any[] }) {
  return (
    <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 bg-forest text-center flex flex-col items-center">
      <div className="container-custom relative z-10">
        {/* Top Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-mint text-sm font-bold mb-10 backdrop-blur-sm"
        >
          ✨ 100% Free — No Sign-up Required
        </motion.div>
        
        {/* Main Headline */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col mb-10"
        >
          <h1 className="text-white text-5xl sm:text-6xl lg:text-8xl font-display font-black leading-[1.05] tracking-tight">
            Your Body.
          </h1>
          <h1 className="text-mint italic text-5xl sm:text-6xl lg:text-8xl font-display font-black leading-[1.05] tracking-tight">
            Your Numbers.
          </h1>
          <h1 className="text-white text-5xl sm:text-6xl lg:text-8xl font-display font-black leading-[1.05] tracking-tight">
            Your Health.
          </h1>
        </motion.div>
        
        {/* Subtext */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white/70 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium px-4"
        >
          25 science-backed health calculators to help you reach your fitness goals. 
          Used by millions across the US, UK and Europe.
        </motion.p>
        
        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-16 lg:mb-24 px-6"
        >
          <Link href="/bmi" className="bg-mint text-forest px-8 sm:px-10 py-4 sm:py-5 rounded-full font-bold text-base sm:text-lg flex items-center justify-center gap-3 transition-all hover:scale-105 hover:bg-white shadow-xl">
            <Scale className="w-5 h-5" /> Calculate My BMI
          </Link>
          <Link href="/calories" className="bg-transparent text-white border-2 border-white/20 px-8 sm:px-10 py-4 sm:py-5 rounded-full font-bold text-base sm:text-lg flex items-center justify-center gap-3 hover:bg-white/10 transition-all hover:scale-105">
            <Apple className="w-5 h-5 text-mint" /> Find My Calories
          </Link>
        </motion.div>

        {/* Stats Row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20 pt-16 border-t border-white/5"
        >
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <span className="text-white text-4xl lg:text-5xl font-display font-black mb-1 tracking-tighter">
                <Counter value={stat.target} decimals={stat.decimals || 0} />
                {stat.suffix}
              </span>
              <span className="text-white/40 text-[10px] font-black uppercase tracking-[3px]">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Decorative subtle gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(78,203,141,0.05)_0%,transparent_70%)] pointer-events-none" />
    </section>
  );
}
