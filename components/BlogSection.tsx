'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Scale, Zap, Droplets } from 'lucide-react';

export default function BlogSection() {
  const posts = [
    {
      category: "BMI",
      title: "How to Calculate BMI Correctly: The Complete 2025 Guide",
      excerpt: "Learn the exact BMI formula, what your number means, and why BMI alone may not tell the whole story about your health.",
      date: "Jan 12, 2025",
      readTime: "8 min read",
      icon: <Scale className="w-10 h-10" />,
      theme: "from-mint/20 to-sky/20"
    },
    {
      category: "CALORIES",
      title: "Best Daily Calorie Intake for Weight Loss (US & UK Guide)",
      excerpt: "Discover how many calories you really need to cut to lose weight safely — without starving yourself or slowing your metabolism.",
      date: "Jan 8, 2025",
      readTime: "7 min read",
      icon: <Zap className="w-10 h-10" />,
      theme: "from-orange-100 to-red-100"
    },
    {
      category: "HYDRATION",
      title: "How Much Water Should You Drink Daily? Science-Backed Answer",
      excerpt: "The 8-glasses-a-day rule is outdated. Here's exactly how much water your body needs based on your weight and lifestyle.",
      date: "Jan 5, 2025",
      readTime: "6 min read",
      icon: <Droplets className="w-10 h-10" />,
      theme: "from-blue-100 to-sky-100"
    }
  ];

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="container-custom">
        <div className="mb-16 text-center lg:text-left">
          <span className="text-mint text-[10px] font-black uppercase tracking-[4px] block mb-4">Health Blog</span>
          <h2 className="text-forest text-4xl lg:text-6xl font-display font-bold mb-6 tracking-tight">
            Expert Health Guides
          </h2>
          <p className="text-ink-muted text-lg lg:text-xl max-w-2xl font-medium">
            In-depth articles to help you understand your health numbers and make better decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white rounded-[32px] border border-forest/5 overflow-hidden hover:shadow-2xl transition-all flex flex-col"
            >
              <div className={`h-48 bg-gradient-to-br ${post.theme} flex items-center justify-center relative overflow-hidden`}>
                <div className="text-forest/80 group-hover:scale-110 transition-transform duration-500">
                  {post.icon}
                </div>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <div className="p-8 flex-grow">
                <span className="inline-block px-3 py-1 bg-mint/10 text-mint text-[10px] font-black rounded-full mb-4 tracking-widest">
                  {post.category}
                </span>
                <h3 className="text-xl font-display font-bold text-forest mb-4 group-hover:text-mint transition-colors">
                  {post.title}
                </h3>
                <p className="text-ink-muted text-sm leading-relaxed mb-6">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center gap-6 pt-6 border-t border-forest/5 text-[10px] font-bold text-ink-light uppercase tracking-widest">
                  <span className="flex items-center gap-2">🗓️ {post.date}</span>
                  <span className="flex items-center gap-2">⏱️ {post.readTime}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="bg-mint text-forest px-10 py-5 rounded-full font-bold text-lg flex items-center justify-center gap-3 mx-auto hover:bg-forest hover:text-white transition-all hover:scale-105 shadow-xl">
            View All Articles →
          </button>
        </div>
      </div>
    </section>
  );
}
