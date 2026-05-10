'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Clock, Globe, Send } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ContactPage() {
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
            Contact Us
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/60 text-lg lg:text-xl max-w-2xl mx-auto font-medium"
          >
            Have a question, found an error, or want to collaborate? We'd love to hear from you.
          </motion.p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left Column: Form */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7"
            >
              <h2 className="text-forest text-3xl font-display font-bold mb-10">Send Us a Message</h2>
              <form className="space-y-6">
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="w-full bg-white border border-forest/10 rounded-2xl py-5 px-8 text-forest focus:outline-none focus:border-mint transition-colors shadow-sm"
                />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full bg-white border border-forest/10 rounded-2xl py-5 px-8 text-forest focus:outline-none focus:border-mint transition-colors shadow-sm"
                />
                <select className="w-full bg-white border border-forest/10 rounded-2xl py-5 px-8 text-forest/60 focus:outline-none focus:border-mint transition-colors shadow-sm appearance-none cursor-pointer">
                  <option>General Enquiry</option>
                  <option>Bug Report</option>
                  <option>Media/Press</option>
                  <option>Collaboration</option>
                </select>
                <textarea 
                  placeholder="Your message..." 
                  rows={6}
                  className="w-full bg-white border border-forest/10 rounded-2xl py-5 px-8 text-forest focus:outline-none focus:border-mint transition-colors shadow-sm resize-none"
                />
                <button 
                  type="submit" 
                  className="w-full bg-forest text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-forest-mid transition-all shadow-xl active:scale-[0.98]"
                >
                  Send Message <Send className="w-5 h-5" />
                </button>
              </form>
            </motion.div>

            {/* Right Column: Info Cards */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 space-y-8"
            >
              <div className="bg-mint-xlight/50 rounded-[40px] p-10 border border-mint/10">
                <h3 className="text-forest text-2xl font-bold mb-10">Get in Touch</h3>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 bg-forest rounded-xl flex items-center justify-center text-mint shadow-lg">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-forest font-bold text-sm mb-1">Email</h4>
                      <p className="text-ink-muted text-sm font-medium">hello@healthcalcspro.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 bg-forest rounded-xl flex items-center justify-center text-orange-400 shadow-lg">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-forest font-bold text-sm mb-1">Response Time</h4>
                      <p className="text-ink-muted text-sm font-medium">1-2 business days</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 bg-forest rounded-xl flex items-center justify-center text-sky shadow-lg">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-forest font-bold text-sm mb-1">Coverage</h4>
                      <div className="flex gap-2">
                        {['US', 'UK', 'GB', 'EU'].map(tag => (
                          <span key={tag} className="text-[10px] font-black text-ink-light uppercase tracking-widest">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-12 border-t border-mint/10">
                  <h4 className="text-forest font-bold text-sm mb-4">Common Questions</h4>
                  <div className="space-y-4 text-xs text-ink-muted leading-relaxed font-medium">
                    <p>For calculator errors, please include your inputs so we can reproduce and fix the issue quickly.</p>
                    <p>For media enquiries and content partnerships, please use the "Media / Press" category.</p>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
