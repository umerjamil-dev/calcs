'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Scale, Zap, Activity, Droplets, Baby, Heart } from 'lucide-react';

export default function PopularTools() {
  const popular = [
    { title: "BMI Calculator", desc: "Calculate your Body Mass Index instantly", icon: <Scale className="text-orange-400" /> },
    { title: "Calorie Calculator", desc: "Find your exact daily calorie needs (TDEE) based on your age, weight...", icon: <Zap className="text-red-500" /> },
    { title: "Ideal Weight Calculator", desc: "Discover your ideal healthy weight range using multiple proven formulas", icon: <Activity className="text-pink-500" /> },
    { title: "Water Intake Calculator", desc: "Calculate exactly how much water you should drink each day based on your body", icon: <Droplets className="text-sky-500" /> },
    { title: "Pregnancy Due Date Calculator", desc: "Calculate your estimated due date and track your pregnancy week by week", icon: <Baby className="text-purple-500" /> },
    { title: "Macros Calculator", desc: "Get your personalised daily protein, carbs and fat targets for your fitness goal", icon: <Heart className="text-orange-500" /> },
  ];

  return (
    <section className="bg-cream py-24 lg:py-32">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* Left Column: Text */}
          <div className="max-w-xl">
            <h2 className="text-forest text-4xl lg:text-5xl font-display font-bold mb-8 leading-tight">
              Free Health Calculators for Every Goal
            </h2>
            <div className="space-y-6 text-ink-muted text-lg leading-relaxed">
              <p>
                Whether you want to lose weight, build muscle, stay hydrated, or plan a pregnancy, healthcalcspro has the right tool for you. Our calculators are used by millions of people in the US, UK and across Europe every month.
              </p>
              <p>
                Each calculator is built using the latest scientific research and validated medical formulas. We update them regularly to ensure accuracy for the current year.
              </p>
              
              <h3 className="text-forest text-2xl font-bold pt-6">Why Use an Online Health Calculator?</h3>
              <p>
                Health calculators give you a personalised starting point for your wellness journey. Instead of generic advice, you get numbers tailored to your unique body — helping you set realistic goals and track meaningful progress.
              </p>
              <p className="text-sm italic opacity-60 pt-6">
                Remember: while our tools are highly accurate, they are for informational purposes only. Always discuss significant health changes with a qualified healthcare professional.
              </p>
            </div>
          </div>

          {/* Right Column: Tools List */}
          <div>
            <h3 className="text-forest text-2xl font-display font-bold mb-8">Our Most Popular Tools</h3>
            <div className="space-y-4">
              {popular.map((tool, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link 
                    href="/bmi" 
                    className="group flex items-center gap-6 bg-white p-6 rounded-[20px] border border-forest/5 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shadow-inner group-hover:bg-mint/10 transition-colors">
                      {tool.icon}
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-forest font-bold mb-1">{tool.title}</h4>
                      <p className="text-ink-muted text-xs line-clamp-1">{tool.desc}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-forest/20 group-hover:text-mint group-hover:translate-x-1 transition-all" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
