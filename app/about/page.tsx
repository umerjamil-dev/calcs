'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Globe, Zap, Activity, Info } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
  const stats = [
    { value: "25", label: "Health Calculators" },
    { value: "2M+", label: "Monthly Users" },
    { value: "190+", label: "Countries" },
    { value: "2024", label: "Formulas Updated" },
  ];

  const values = [
    {
      title: "Scientific Accuracy",
      desc: "Every formula is sourced from peer-reviewed research. We cite our sources and update regularly when evidence evolves.",
      icon: <Activity className="w-6 h-6 text-forest" />,
      color: "bg-mint-xlight"
    },
    {
      title: "Privacy First",
      desc: "We never store your health data. All calculations happen client-side in your browser. No accounts, no tracking.",
      icon: <ShieldCheck className="w-6 h-6 text-sky" />,
      color: "bg-sky/10"
    },
    {
      title: "Always Free",
      desc: "Health information is a public good. Our tools will always be free, without hidden fees or premium tiers.",
      icon: <Zap className="w-6 h-6 text-orange-500" />,
      color: "bg-orange-50"
    },
    {
      title: "Globally Inclusive",
      desc: "We support metric and imperial units and tailor content for US, UK, and European users with relevant references.",
      icon: <Globe className="w-6 h-6 text-purple-500" />,
      color: "bg-purple-50"
    }
  ];

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Header */}
      <section className="bg-forest pt-40 pb-24 text-center">
        <div className="container-custom">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white text-5xl lg:text-7xl font-display font-bold mb-6 tracking-tight"
          >
            About HealthCalcsPro
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/60 text-lg lg:text-xl max-w-2xl mx-auto font-medium"
          >
            We're on a mission to make accurate health information accessible to everyone — free, forever.
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-mint text-[10px] font-black uppercase tracking-[4px] block mb-4">Our Mission</span>
              <h2 className="text-forest text-4xl lg:text-5xl font-display font-bold mb-8 leading-tight">
                Health knowledge shouldn't be behind a paywall
              </h2>
              <div className="space-y-6 text-ink-muted text-lg leading-relaxed">
                <p>
                  HealthCalcsPro was built on a simple belief: everyone deserves access to accurate, science-backed health tools — regardless of their income, location, or background.
                </p>
                <p>
                  Our platform provides clinical-grade calculators that use formulas derived from peer-reviewed research and reputable health authorities including the WHO, NHS, and US National Institutes of Health.
                </p>
                <p>
                  Every calculator is regularly updated to reflect the latest research. Every content piece is reviewed for medical accuracy. And every user interaction is private — we never store your personal health data.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-cream rounded-[40px] aspect-square flex items-center justify-center p-12"
            >
              <div className="w-full h-full bg-forest/5 rounded-[32px] border-2 border-dashed border-forest/10 flex items-center justify-center">
                <div className="bg-forest text-mint w-24 h-24 rounded-3xl flex items-center justify-center font-display font-black text-4xl shadow-2xl">
                  hc
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="bg-white border-y border-forest/5 py-16">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-forest text-4xl lg:text-5xl font-display font-black mb-2">{stat.value}</div>
                <div className="text-ink-muted text-xs font-black uppercase tracking-widest opacity-40">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 lg:py-32 bg-cream/30">
        <div className="container-custom">
          <div className="mb-16 text-center lg:text-left">
            <h2 className="text-forest text-4xl lg:text-5xl font-display font-bold mb-6 tracking-tight">
              Our Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-[32px] border border-forest/5 shadow-sm hover:shadow-xl transition-all"
              >
                <div className={`w-14 h-14 ${value.color} rounded-2xl flex items-center justify-center mb-6`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-forest mb-4">{value.title}</h3>
                <p className="text-ink-muted leading-relaxed">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Medical Disclaimer Box */}
          <div className="mt-20 bg-orange-50/50 border-l-4 border-orange-400 p-8 rounded-r-2xl flex gap-6 items-start">
            <div className="bg-orange-400 text-white p-2 rounded-lg">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <p className="text-ink-muted font-medium italic">
                <strong>Medical Disclaimer:</strong> HealthCalcsPro provides health information and calculators for educational purposes only. Our tools are not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional for personalised medical guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
