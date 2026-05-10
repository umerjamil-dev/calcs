'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, Globe, Smartphone, ShieldCheck, Star } from 'lucide-react';

export default function WhySection() {
  const features = [
    {
      title: "Science-Backed Formulas",
      desc: "Every calculator uses clinically validated formulas including Mifflin-St Jeor, Hamwi, Devine and more.",
      icon: <Activity className="w-6 h-6" />
    },
    {
      title: "Instant Results",
      desc: "Get your results in milliseconds. No waiting, no loading, no accounts — just instant, accurate answers.",
      icon: <Zap className="w-6 h-6" />
    },
    {
      title: "US, UK & EU Ready",
      desc: "Support for both metric and imperial units. Optimised for users in the US, UK and across Europe.",
      icon: <Globe className="w-6 h-6" />
    },
    {
      title: "Mobile First",
      desc: "Works beautifully on any device — phone, tablet or desktop — with a clean, distraction-free interface.",
      icon: <Smartphone className="w-6 h-6" />
    },
    {
      title: "100% Private",
      desc: "We never store your personal health data. All calculations happen in your browser — completely private.",
      icon: <ShieldCheck className="w-6 h-6" />
    },
    {
      title: "Always Free",
      desc: "No subscriptions, no premium features, no paywalls. All 25 health calculators are free forever.",
      icon: <Star className="w-6 h-6" />
    }
  ];

  return (
    <section className="bg-forest py-24 lg:py-32 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(78,203,141,0.08)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="container-custom relative z-10 text-center">
        <div className="mb-16">
          <span className="text-mint text-[10px] font-black uppercase tracking-[4px] block mb-4">Why HealthCalcsPro?</span>
          <h2 className="text-white text-4xl lg:text-6xl font-display font-bold mb-6 tracking-tight">
            Built for accuracy. Designed for you.
          </h2>
          <p className="text-white/60 text-lg lg:text-xl max-w-2xl mx-auto font-medium">
            We obsess over scientific accuracy so you get results you can trust.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20 mt-20">
          {features.map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-mint mb-8 shadow-xl backdrop-blur-sm">
                {feature.icon}
              </div>
              <h3 className="text-white text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed max-w-[300px]">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
