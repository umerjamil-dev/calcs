'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Globe, Heart, Activity, Scale, Calculator, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const calculatorGroups = [
    {
      title: "Body & Weight",
      icon: <Scale className="w-4 h-4" />,
      links: [
        { name: "BMI Calculator", href: "/bmi" },
        { name: "Calorie Calculator", href: "/calorie" },
        { name: "Ideal Weight", href: "/ideal-weight" },
        { name: "Body Fat %", href: "/body-fat" },
        { name: "BMR Calculator", href: "/bmr" },
        { name: "Weight Loss", href: "/weight-loss" },
      ]
    },
    {
      title: "Fitness & Sport",
      icon: <Activity className="w-4 h-4" />,
      links: [
        { name: "TDEE Calculator", href: "/tdee" },
        { name: "Heart Rate", href: "/heart-rate" },
        { name: "Protein Intake", href: "/protein" },
        { name: "Keto Calculator", href: "/keto" },
        { name: "One Rep Max", href: "/1rm" },
        { name: "Running Pace", href: "/pace" },
      ]
    },
    {
      title: "Health & Life",
      icon: <Heart className="w-4 h-4" />,
      links: [
        { name: "Water Intake", href: "/water" },
        { name: "Sleep Calculator", href: "/sleep" },
        { name: "Due Date Calc", href: "/due-date" },
        { name: "Period Tracker", href: "/period" },
        { name: "BAC Calculator", href: "/bac" },
        { name: "Age Calculator", href: "/age" },
      ]
    }
  ];

  const pageLinks = [
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <footer className="bg-forest text-white relative overflow-hidden">
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-mint/[0.04] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="container-custom relative z-10">

        {/* CTA Banner Strip */}
        <div className="pt-16 pb-14 border-b border-white/[0.06]">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl lg:text-3xl font-display font-bold text-white mb-2">
                Ready to take control of your health?
              </h3>
              <p className="text-white/40 text-sm font-medium">
                25 free calculators. No sign-up. No ads. Just science.
              </p>
            </div>
            <Link
              href="/calculators"
              className="flex items-center gap-2.5 bg-mint text-forest px-8 py-4 rounded-full font-bold text-sm shadow-[0_8px_30px_rgba(78,203,141,0.25)] hover:shadow-[0_12px_40px_rgba(78,203,141,0.4)] hover:-translate-y-0.5 transition-all flex-shrink-0"
            >
              Explore All Tools
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16 py-16 border-b border-white/[0.06]">

          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-2.5 no-underline mb-8">
              <div className="w-10 h-10 rounded-xl bg-mint text-forest flex items-center justify-center shadow-[0_4px_16px_rgba(78,203,141,0.2)]">
                <Calculator className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold font-display text-white leading-none tracking-tight">
                  Health<span className="text-mint">Calcs</span>
                </span>
                <span className="text-[8px] font-bold uppercase tracking-[3.5px] text-white/30 leading-none mt-1">Pro</span>
              </div>
            </Link>

            <p className="text-white/35 text-sm leading-relaxed mb-8 max-w-xs">
              Clinical-grade health calculators trusted by millions. All tools are free, private, and backed by peer-reviewed research.
            </p>

            {/* Newsletter */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[3px] text-mint/70 mb-3">Newsletter</p>
              <div className="relative">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl py-3.5 pl-5 pr-12 text-white text-sm placeholder-white/20 focus:outline-none focus:border-mint/40 focus:bg-white/[0.08] transition-all"
                />
                <button className="absolute right-1.5 top-1.5 bottom-1.5 w-9 h-9 bg-mint text-forest rounded-lg flex items-center justify-center hover:bg-white transition-all">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <p className="text-white/15 text-[10px] mt-2.5 font-medium">Join 50k+ health enthusiasts</p>
            </div>
          </div>

          {/* Calculator Links */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
              {calculatorGroups.map((group, i) => (
                <div key={i}>
                  <div className="flex items-center gap-2.5 mb-6">
                    <div className="w-7 h-7 rounded-lg bg-mint/10 flex items-center justify-center text-mint">
                      {group.icon}
                    </div>
                    <h4 className="text-white font-bold text-xs tracking-wide">{group.title}</h4>
                  </div>
                  <ul className="space-y-3.5">
                    {group.links.map((link, idx) => (
                      <li key={idx}>
                        <Link
                          href={link.href}
                          className="flex items-center gap-2 text-white/30 hover:text-white text-xs font-medium transition-all group"
                        >
                          <span className="w-0 group-hover:w-3 h-[1px] bg-mint transition-all origin-left" />
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Pages + Trust */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold text-xs tracking-wide mb-6">Pages</h4>
            <ul className="space-y-3.5 mb-10">
              {pageLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-white/30 hover:text-white text-xs font-medium transition-all group"
                  >
                    <span className="w-0 group-hover:w-3 h-[1px] bg-mint transition-all origin-left" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-white/15 text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-mint/40" /> HIPAA Ready
              </div>
              <div className="flex items-center gap-2 text-white/15 text-[10px] font-bold uppercase tracking-wider">
                <Globe className="w-3.5 h-3.5 text-mint/40" /> SSL Secured
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap justify-center gap-6 text-[10px] font-bold uppercase tracking-[2px] text-white/15">
            <Link href="#" className="hover:text-mint/60 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-mint/60 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-mint/60 transition-colors">Disclaimer</Link>
            <Link href="#" className="hover:text-mint/60 transition-colors">Cookies</Link>
          </div>
          <p className="text-white/10 text-[10px] font-medium tracking-wider text-center lg:text-right">
            © 2024 HealthCalcsPro — All calculations are for informational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
