'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate } from 'framer-motion';

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

interface Stat {
  target: number;
  suffix?: string;
  label: string;
  decimals?: number;
}

export default function StatsBar({ stats }: { stats: Stat[] }) {
  return (
    <section className="bg-white py-16 border-b border-forest/5 relative z-20">
      <div className="container-custom">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="text-forest text-5xl lg:text-6xl font-display font-bold tracking-tighter mb-3">
                <Counter value={stat.target} decimals={stat.decimals || 0} />
                {stat.suffix}
              </div>
              <div className="text-ink-muted text-sm font-medium opacity-60 uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
