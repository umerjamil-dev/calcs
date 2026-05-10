'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogSection from '@/components/BlogSection';

export default function BlogPage() {
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
            Health Blog
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/60 text-lg lg:text-xl max-w-2xl mx-auto font-medium"
          >
            Expert advice, scientific guides, and tips to help you master your health metrics.
          </motion.p>
        </div>
      </section>

      {/* Blog Content Section */}
      {/* We reuse the existing BlogSection component which already has the grid and styling */}
      <BlogSection />

      {/* Extra space for clean footer transition */}
      <div className="pb-24" />

      <Footer />
    </main>
  );
}
