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
    <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 text-center flex flex-col items-center overflow-hidden bg-forest">
      {/* Gradient Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-forest via-forest-mid to-forest-light" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(78,203,141,0.25)_0%,transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(33,150,180,0.15)_0%,transparent_55%)]" />

      {/* Floating Glow Orbs */}
      <div className="absolute top-[-120px] right-[-80px] w-[500px] h-[500px] rounded-full bg-mint/[0.07] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-60px] w-[400px] h-[400px] rounded-full bg-sky/[0.08] blur-[100px] pointer-events-none" />
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-mint/[0.04] blur-[80px] pointer-events-none" />

      {/* Subtle Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M60 0H0v60\' fill=\'none\' stroke=\'white\' stroke-width=\'.5\'/%3E%3C/svg%3E")', backgroundSize: '60px 60px' }} />

      <div className="container-custom relative z-10">
        {/* Top Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/[0.08] border border-white/[0.12] rounded-full text-mint text-sm font-bold mb-10 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
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
          <h1 className="bg-gradient-to-r from-mint via-mint-light to-sky bg-clip-text text-transparent italic text-5xl sm:text-6xl lg:text-8xl font-display font-black leading-[1.05] tracking-tight">
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
          className="text-white/60 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium px-4"
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
          <Link href="/bmi" className="relative bg-mint text-forest px-8 sm:px-10 py-4 sm:py-5 rounded-full font-bold text-base sm:text-lg flex items-center justify-center gap-3 transition-all hover:scale-105 shadow-[0_8px_40px_rgba(78,203,141,0.35)] hover:shadow-[0_12px_50px_rgba(78,203,141,0.5)]">
            <Scale className="w-5 h-5" /> Calculate My BMI
          </Link>
          <Link href="/calories" className="bg-white/[0.08] text-white border border-white/15 backdrop-blur-sm px-8 sm:px-10 py-4 sm:py-5 rounded-full font-bold text-base sm:text-lg flex items-center justify-center gap-3 hover:bg-white/15 transition-all hover:scale-105">
            <Apple className="w-5 h-5 text-mint" /> Find My Calories
          </Link>
        </motion.div>

        {/* Stats Row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20 pt-16 border-t border-white/[0.08]"
        >
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <span className="text-white text-4xl lg:text-5xl font-display font-black mb-1 tracking-tighter">
                <Counter value={stat.target} decimals={stat.decimals || 0} />
                {stat.suffix}
              </span>
              <span className="text-white/30 text-[10px] font-black uppercase tracking-[3px]">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
