'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Activity } from 'lucide-react';

interface Tool {
  name: string;
  desc: string;
  icon: React.ReactNode;
  theme: string;
  accent: string;
  badge?: string;
  href?: string;
}

export default function CalculatorGrid({ tools }: { tools: Tool[] }) {
  // Show 25 cards
  const allTools = [...tools, ...tools, ...tools].slice(0, 25);

  return (
    <section id="calculators" className="section-padding bg-cream">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl lg:text-6xl font-display font-bold mb-6 tracking-tight text-forest">
            Calculators for <span className="text-sky italic">Everything</span>
          </h2>
          <p className="text-ink-muted text-lg">
            Explore our comprehensive suite of health tools categorized for your convenience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allTools.map((tool, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.02 }}
              className="group bg-white p-6 rounded-[24px] border border-forest/5 shadow-sm hover:shadow-xl transition-all relative overflow-hidden flex flex-col"
            >
              <div className="absolute top-0 left-0 w-full h-[3px] bg-mint scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${tool.theme} opacity-10 blur-2xl group-hover:opacity-30 transition-opacity`} />
              
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.theme} ${tool.accent} flex items-center justify-center mb-6 shadow-inner text-white`}>
                {React.isValidElement(tool.icon) ? React.cloneElement(tool.icon as React.ReactElement<any>, { className: 'w-5 h-5' }) : tool.icon}
              </div>
              
              <h3 className="text-xl font-display font-bold mb-3 text-forest">{tool.name}</h3>
              <p className="text-ink-muted leading-relaxed mb-6 text-xs flex-grow">
                {tool.desc}
              </p>
              
              <Link href={tool.href || "#"} className="inline-flex items-center gap-2 font-bold text-forest group-hover:text-mint transition-colors text-xs">
                Launch Tool <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>

       
      </div>
    </section>
  );
}
