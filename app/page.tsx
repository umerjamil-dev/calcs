'use client';

import React from 'react';
import { Scale, Zap, Activity, Droplets, Heart, Baby, Users } from 'lucide-react';
import Hero from '@/components/Hero';
import StatsBar from '@/components/StatsBar';
import CalculatorGrid from '@/components/CalculatorGrid';
import BlogSection from '@/components/BlogSection';
import WhySection from '@/components/WhySection';
import PopularTools from '@/components/PopularTools';
import Footer from '@/components/Footer';
import AdSlot from '@/components/AdSlot';

export default function Home() {
  const stats = [
    { target: 2, suffix: "M+", label: "Monthly Calculations" },
    { target: 25, label: "Health Tools" },
    { target: 190, suffix: "+", label: "Countries Reached" },
    { target: 4.9, decimals: 1, suffix: " ★", label: "User Rating" },
  ];

  const tools = [
    { 
      name: "BMI Calculator", 
      desc: "Calculate your Body Mass Index and find out if you're in a healthy range.",
      icon: <Scale />,
      theme: "from-[#e8faf3] to-[#d1f5e8]",
      accent: "text-forest",
      badge: "Popular"
    },
    { 
      name: "Calorie Calculator", 
      desc: "Estimate the number of calories you burn each day based on your activity level.",
      icon: <Zap />,
      theme: "from-[#e3f4f9] to-[#c7e9f3]",
      accent: "text-sky"
    },
    { 
      name: "Ideal Weight", 
      desc: "Find your recommended weight based on your height, age, and body type.",
      icon: <Activity />,
      theme: "from-[#f0eeff] to-[#e0d9ff]",
      accent: "text-[#6366f1]"
    },
    { 
      name: "Water Intake", 
      desc: "Stay hydrated by calculating how much water you should drink daily.",
      icon: <Droplets />,
      theme: "from-[#e4f9f6] to-[#c7f3ed]",
      accent: "text-[#14b8a6]"
    },
    { 
      name: "Body Fat %", 
      desc: "Estimate your body fat percentage using your measurements.",
      icon: <Heart />,
      theme: "from-[#fff4e8] to-[#ffe8cc]",
      accent: "text-[#f97316]"
    },
    { 
      name: "Due Date Calc", 
      desc: "Track your pregnancy progress and estimate your baby's due date.",
      icon: <Baby />,
      theme: "from-[#ffeef4] to-[#ffd6e4]",
      accent: "text-[#ec4899]"
    },
    { 
      name: "Macros Calc", 
      desc: "Determine your ideal ratio of proteins, fats, and carbs.",
      icon: <Activity />,
      theme: "from-[#e8faf3] to-[#d1f5e8]",
      accent: "text-forest"
    },
    { 
      name: "BMR Calculator", 
      desc: "Calculate your Basal Metabolic Rate for weight management.",
      icon: <Zap />,
      theme: "from-[#e3f4f9] to-[#c7e9f3]",
      accent: "text-sky"
    },
    { 
      name: "Weight Loss", 
      desc: "Plan your weight loss journey with precise timelines.",
      icon: <Scale />,
      theme: "from-[#f0eeff] to-[#e0d9ff]",
      accent: "text-[#6366f1]"
    },
    { 
      name: "Heart Rate", 
      desc: "Find your target heart rate zones for optimal training.",
      icon: <Heart />,
      theme: "from-[#fff4e8] to-[#ffe8cc]",
      accent: "text-[#f97316]"
    },
    { 
      name: "Keto Calculator", 
      desc: "Calculate your optimal macros for a ketogenic diet.",
      icon: <Activity />,
      theme: "from-[#e4f9f6] to-[#c7f3ed]",
      accent: "text-[#14b8a6]"
    },
    { 
      name: "Sleep Calculator", 
      desc: "Find the best time to wake up based on your sleep cycles.",
      icon: <Users />,
      theme: "from-[#f0eeff] to-[#e0d9ff]",
      accent: "text-[#6366f1]"
    },
    { 
      name: "Protein Intake", 
      desc: "Calculate how much protein you need for muscle growth.",
      icon: <Activity />,
      theme: "from-[#e8faf3] to-[#d1f5e8]",
      accent: "text-forest"
    }
  ];

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Hero stats={stats} />
      <AdSlot type="horizontal" className="pt-12" />
      <CalculatorGrid tools={tools} />
      <AdSlot type="horizontal" />
      <WhySection />
      <BlogSection />
      <PopularTools />
      <AdSlot type="horizontal" className="pb-12" />
      <Footer />
    </main>
  );
}
