'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, ShieldCheck, Globe, Star, Heart, Activity, Scale, Zap, ChevronRight } from 'lucide-react';

export default function Footer() {
  const calculatorGroups = [
    {
      title: "Body & Weight",
      icon: <Scale className="w-4 h-4" />,
      links: ["BMI Calculator", "Calorie Calculator", "Ideal Weight", "Body Fat %", "BMR Calculator", "Weight Loss", "Macros Calc"]
    },
    {
      title: "Fitness & Sport",
      icon: <Activity className="w-4 h-4" />,
      links: ["TDEE Calculator", "Heart Rate", "Protein Intake", "Keto Calculator", "One Rep Max", "Walking Calc", "Cycling Burn"]
    },
    {
      title: "Health & Life",
      icon: <Heart className="w-4 h-4" />,
      links: ["Water Intake", "Sleep Calculator", "Due Date Calc", "Period Tracker", "Diabetes Risk", "Blood Pressure", "Full Suite →"]
    }
  ];

  return (
    <footer className="bg-forest pt-24 pb-12 text-white relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-mint/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container-custom relative z-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-24">
          
          {/* Brand & Newsletter Column */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-10">
              <div className="bg-mint text-forest w-12 h-12 rounded-[18px] flex items-center justify-center font-display font-black text-xl shadow-[0_0_20px_rgba(78,203,141,0.2)]">hc</div>
              <div className="text-3xl font-display font-bold text-white tracking-tight">HealthCalcsPro</div>
            </div>
            <p className="text-white/40 text-base leading-relaxed mb-12">
              The gold standard in health calculation. We provide clinical-grade tools to help you master your body metrics.
            </p>

            {/* Newsletter Integrated Below Logo */}
            <div className="mb-12">
              <div className="flex items-center gap-2 text-mint mb-4">
                <Star className="w-3 h-3 fill-mint" />
                <span className="text-[10px] font-black uppercase tracking-[3px]">Stay Informed</span>
              </div>
              <div className="relative group">
                <input 
                  type="email" 
                  placeholder="your@email.com" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-white text-sm focus:outline-none focus:border-mint/50 transition-all"
                />
                <button className="absolute right-2 top-2 bottom-2 w-10 h-10 bg-mint text-forest rounded-xl flex items-center justify-center hover:bg-white transition-all">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <p className="text-white/20 text-[10px] mt-4 font-medium italic">Join 50k+ weekly readers</p>
            </div>

            <div className="flex flex-wrap gap-3">
              {['US', 'UK', 'EU', 'Global'].map(tag => (
                <span key={tag} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black tracking-widest text-white/40 uppercase">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Mega Menu columns */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
              {calculatorGroups.map((group, i) => (
                <div key={i} className="group/col">
                  <div className="flex items-center gap-3 mb-10">
                    <div className="w-8 h-8 rounded-lg bg-mint/10 flex items-center justify-center text-mint">
                      {group.icon}
                    </div>
                    <h4 className="text-white font-bold text-sm tracking-wide group-hover/col:text-mint transition-colors">{group.title}</h4>
                  </div>
                  <ul className="space-y-5">
                    {group.links.map(link => (
                      <li key={link}>
                        <Link href="#" className="flex items-center gap-2 text-white/30 hover:text-white transition-all text-xs font-medium group/link">
                          <span className="w-0 group-hover/link:w-2 h-[1px] bg-mint transition-all" />
                          {link}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legal & Final Footer */}
        <div className="pt-12 border-t border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-wrap gap-8 text-[10px] font-black uppercase tracking-[2px] text-white/20">
              <Link href="#" className="hover:text-mint transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-mint transition-colors">Terms</Link>
              <Link href="#" className="hover:text-mint transition-colors">Disclaimer</Link>
              <Link href="#" className="hover:text-mint transition-colors">Cookies</Link>
              <Link href="#" className="hover:text-mint transition-colors">Contact</Link>
            </div>
            <div className="flex justify-start lg:justify-end gap-8 grayscale opacity-30">
              <div className="flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-tighter">
                <ShieldCheck className="w-4 h-4" /> HIPAA COMPLIANT
              </div>
              <div className="flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-tighter">
                <Globe className="w-4 h-4" /> SECURE DATA
              </div>
            </div>
          </div>
          <div className="mt-12 text-center lg:text-left text-white/10 text-[10px] font-medium uppercase tracking-widest">
            © 2024 HEALTHCALCSPRO — ADVANCED HEALTH ANALYTICS PLATFORM. ALL CALCULATIONS ARE FOR INFORMATIONAL PURPOSES ONLY.
          </div>
        </div>
      </div>
    </footer>
  );
}
