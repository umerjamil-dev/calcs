 'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Scale, Ruler, Activity, CheckCircle2, AlertCircle, ChevronRight, Share2, RefreshCcw } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function BMICalculatorPage() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<string>('');
  const [categoryColor, setCategoryColor] = useState<string>('');

  const calculateBMI = (e: React.FormEvent) => {
    e.preventDefault();
    let calculatedBmi = 0;

    if (unit === 'metric') {
      const heightInMeters = parseFloat(heightCm) / 100;
      const weightInKg = parseFloat(weight);
      if (heightInMeters > 0 && weightInKg > 0) {
        calculatedBmi = weightInKg / (heightInMeters * heightInMeters);
      }
    } else {
      const totalInches = (parseFloat(heightFt) * 12) + parseFloat(heightIn);
      const weightInLbs = parseFloat(weight);
      if (totalInches > 0 && weightInLbs > 0) {
        calculatedBmi = (weightInLbs / (totalInches * totalInches)) * 703;
      }
    }

    if (calculatedBmi > 0) {
      setBmi(parseFloat(calculatedBmi.toFixed(1)));
      determineCategory(calculatedBmi);
    }
  };

  const determineCategory = (bmiVal: number) => {
    if (bmiVal < 18.5) {
      setCategory('Underweight');
      setCategoryColor('#A855F7'); // Purple-500
    } else if (bmiVal >= 18.5 && bmiVal < 25) {
      setCategory('Normal Weight');
      setCategoryColor('#4ECB8D'); // Mint
    } else if (bmiVal >= 25 && bmiVal < 30) {
      setCategory('Overweight');
      setCategoryColor('#FACC15'); // Yellow-400
    } else {
      setCategory('Obese');
      setCategoryColor('#EF4444'); // Red-500
    }
  };

  const reset = () => {
    setBmi(null);
    setAge('');
    setHeightCm('');
    setHeightFt('');
    setHeightIn('');
    setWeight('');
  };

  return (
    <main className="bg-cream/20 min-h-screen font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-forest relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-mint/5 rounded-l-full blur-3xl" />
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 bg-mint/10 text-mint px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-8"
              >
                <Activity className="w-3 h-3" /> Health Measurement Tool
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white text-5xl lg:text-7xl font-display font-bold leading-tight mb-8"
              >
                BMI Calculator <br />
                <span className="text-mint">Health Tracker</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-white/60 text-lg lg:text-xl max-w-xl mb-8 font-medium leading-relaxed"
              >
                Body Mass Index (BMI) is a simple measurement that uses your height and weight to work out if your weight is healthy.
              </motion.p>
            </div>

            {/* Calculator Card - Styled like Image */}
            <div className="lg:col-span-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[48px] p-8 lg:p-12 shadow-[0_30px_100px_rgba(0,0,0,0.3)] border border-white/10"
              >
                {!bmi ? (
                  <form onSubmit={calculateBMI} className="space-y-8">
                    {/* Unit Toggle */}
                    <div className="flex bg-forest/5 p-1.5 rounded-2xl">
                      <button 
                        type="button"
                        onClick={() => setUnit('imperial')}
                        className={`flex-1 py-4 rounded-xl font-black text-sm transition-all ${unit === 'imperial' ? 'bg-white text-forest shadow-md' : 'text-forest/40 hover:text-forest'}`}
                      >
                        US Imperial (lbs/ft)
                      </button>
                      <button 
                        type="button"
                        onClick={() => setUnit('metric')}
                        className={`flex-1 py-4 rounded-xl font-black text-sm transition-all ${unit === 'metric' ? 'bg-white text-forest shadow-md' : 'text-forest/40 hover:text-forest'}`}
                      >
                        Metric (kg/cm)
                      </button>
                    </div>

                    {/* Age & Gender */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="text-[10px] font-black text-forest/40 uppercase tracking-[2px] mb-4 block">Age</label>
                        <div className="flex group">
                          <input 
                            type="number" 
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            placeholder="25"
                            className="w-full bg-forest/5 border-r border-forest/10 p-5 rounded-l-2xl focus:outline-none focus:bg-white transition-all font-bold text-forest"
                          />
                          <div className="bg-forest/5 px-6 flex items-center text-forest/30 font-bold text-sm rounded-r-2xl group-focus-within:bg-white transition-all">years</div>
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-forest/40 uppercase tracking-[2px] mb-4 block">Gender</label>
                        <div className="flex gap-4">
                          <button 
                            type="button"
                            onClick={() => setGender('male')}
                            className={`flex-1 py-5 rounded-2xl border-2 transition-all font-bold flex items-center justify-center gap-2 ${gender === 'male' ? 'border-mint bg-mint/5 text-forest' : 'border-forest/5 text-forest/40 hover:border-forest/10'}`}
                          >
                            <span className="text-xl">♂</span> MALE
                          </button>
                          <button 
                            type="button"
                            onClick={() => setGender('female')}
                            className={`flex-1 py-5 rounded-2xl border-2 transition-all font-bold flex items-center justify-center gap-2 ${gender === 'female' ? 'border-pink-200 bg-pink-50 text-forest' : 'border-forest/5 text-forest/40 hover:border-forest/10'}`}
                          >
                            <span className="text-xl">♀</span> FEMALE
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Height & Weight */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="text-[10px] font-black text-forest/40 uppercase tracking-[2px] mb-4 block">Height</label>
                        {unit === 'imperial' ? (
                          <div className="flex gap-4">
                            <div className="flex flex-1 group">
                              <input 
                                type="number" 
                                value={heightFt}
                                onChange={(e) => setHeightFt(e.target.value)}
                                placeholder="5"
                                className="w-full bg-forest/5 border-r border-forest/10 p-5 rounded-l-2xl focus:outline-none focus:bg-white transition-all font-bold text-forest"
                              />
                              <div className="bg-forest/5 px-4 flex items-center text-forest/30 font-bold text-sm rounded-r-2xl group-focus-within:bg-white">ft</div>
                            </div>
                            <div className="flex flex-1 group">
                              <input 
                                type="number" 
                                value={heightIn}
                                onChange={(e) => setHeightIn(e.target.value)}
                                placeholder="9"
                                className="w-full bg-forest/5 border-r border-forest/10 p-5 rounded-l-2xl focus:outline-none focus:bg-white transition-all font-bold text-forest"
                              />
                              <div className="bg-forest/5 px-4 flex items-center text-forest/30 font-bold text-sm rounded-r-2xl group-focus-within:bg-white">in</div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex group">
                            <input 
                              type="number" 
                              value={heightCm}
                              onChange={(e) => setHeightCm(e.target.value)}
                              placeholder="175"
                              className="w-full bg-forest/5 border-r border-forest/10 p-5 rounded-l-2xl focus:outline-none focus:bg-white transition-all font-bold text-forest"
                            />
                            <div className="bg-forest/5 px-6 flex items-center text-forest/30 font-bold text-sm rounded-r-2xl group-focus-within:bg-white">cm</div>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-forest/40 uppercase tracking-[2px] mb-4 block">Weight</label>
                        <div className="flex group">
                          <input 
                            type="number" 
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            placeholder={unit === 'imperial' ? "154" : "70"}
                            className="w-full bg-forest/5 border-r border-forest/10 p-5 rounded-l-2xl focus:outline-none focus:bg-white transition-all font-bold text-forest"
                          />
                          <div className="bg-forest/5 px-6 flex items-center text-forest/30 font-bold text-sm rounded-r-2xl group-focus-within:bg-white">
                            {unit === 'imperial' ? 'lbs' : 'kg'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-forest text-mint py-6 rounded-3xl font-black text-xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                    >
                      <Activity className="w-6 h-6" /> Calculate My BMI
                    </button>
                  </form>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <div className="mb-12">
                      <div className="text-forest/30 text-[10px] font-black uppercase tracking-[4px] mb-4">Your BMI is</div>
                      <div className="text-7xl lg:text-9xl font-display font-black text-forest mb-6">
                        {bmi.toFixed(1)}
                      </div>
                      <div 
                        className="inline-block px-10 py-3 rounded-full text-sm font-black uppercase tracking-widest text-white shadow-xl"
                        style={{ backgroundColor: categoryColor }}
                      >
                        {category}
                      </div>
                    </div>

                    <div className="mb-12 px-4">
                      <div className="flex h-3 w-full rounded-full bg-forest/5 overflow-hidden mb-4 shadow-inner">
                        <div className="h-full bg-purple-500 w-[18.5%]" />
                        <div className="h-full bg-mint w-[6.4%]" />
                        <div className="h-full bg-yellow-400 w-[5%]" />
                        <div className="h-full bg-orange-500 w-[5%]" />
                        <div className="h-full bg-red-600 flex-1" />
                      </div>
                      <div className="flex justify-between text-[9px] font-black text-forest/30 uppercase tracking-widest">
                        <span>Underweight</span>
                        <span>Healthy</span>
                        <span>Overweight</span>
                        <span>Obese</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <button 
                        onClick={() => window.print()}
                        className="flex-1 bg-forest/5 text-forest py-4 rounded-2xl font-bold text-sm hover:bg-forest hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        <Share2 className="w-4 h-4" /> Download Report (PDF)
                      </button>
                      <button 
                        onClick={() => { setBmi(null); setWeight(''); setHeightCm(''); setHeightFt(''); setHeightIn(''); }}
                        className="flex-1 border-2 border-forest/5 text-forest py-4 rounded-2xl font-bold text-sm hover:bg-forest/5 transition-all flex items-center justify-center gap-2"
                      >
                        <RefreshCcw className="w-4 h-4" /> Reset
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Educational Content */}
      <section className="py-24">
        <div className="container-custom">
          {/* What is BMI */}
          <div className="max-w-4xl mx-auto mb-24">
            <div className="inline-flex items-center gap-2 bg-mint/10 text-mint px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
              Expert Guide
            </div>
            <h2 className="text-forest text-4xl lg:text-5xl font-display font-bold mb-8">What exactly is Body Mass Index?</h2>
            <div className="space-y-6 text-ink-muted text-lg leading-relaxed">
              <p>
                Body Mass Index (BMI) is a value derived from the mass (weight) and height of a person. The BMI is defined as the body mass divided by the square of the body height, and is expressed in units of kg/m².
              </p>
              <p>
                BMI is a convenient rule of thumb used to broadly categorize a person as underweight, normal weight, overweight, or obese based on tissue mass (muscle, fat, and bone) and height.
              </p>
              <div className="bg-forest p-10 rounded-[32px] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
                <h3 className="text-mint font-bold mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5" /> Quick Fact
                </h3>
                <p className="text-white/80 font-medium italic">
                  "While BMI is not a direct measure of body fatness, it is moderately correlated with more direct measures of body fat obtained from skinfold thickness measurements, bioelectrical impedance, and other methods."
                </p>
              </div>
            </div>
          </div>

          {/* BMI Table */}
          <div className="bg-white rounded-[40px] p-8 lg:p-16 border border-forest/5 shadow-sm mb-24">
            <h2 className="text-forest text-3xl font-display font-bold mb-12 text-center lg:text-left">BMI Categories for Adults</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-forest/10">
                    <th className="pb-6 text-xs font-black text-forest/30 uppercase tracking-[2px]">Category</th>
                    <th className="pb-6 text-xs font-black text-forest/30 uppercase tracking-[2px]">BMI Range (kg/m²)</th>
                    <th className="pb-6 text-xs font-black text-forest/30 uppercase tracking-[2px]">Status</th>
                  </tr>
                </thead>
                <tbody className="text-forest font-medium">
                  <tr className="border-b border-forest/5">
                    <td className="py-6">Underweight</td>
                    <td className="py-6 font-bold">{"<"} 18.5</td>
                    <td className="py-6 text-blue-500 font-bold">Low Risk</td>
                  </tr>
                  <tr className="border-b border-forest/5 bg-mint/5">
                    <td className="py-6 text-mint">Healthy Weight</td>
                    <td className="py-6 font-bold">18.5 – 24.9</td>
                    <td className="py-6 text-mint font-bold">Optimal</td>
                  </tr>
                  <tr className="border-b border-forest/5">
                    <td className="py-6">Overweight</td>
                    <td className="py-6 font-bold">25.0 – 29.9</td>
                    <td className="py-6 text-yellow-600 font-bold">Moderate Risk</td>
                  </tr>
                  <tr className="border-b border-forest/5">
                    <td className="py-6">Obese (Class I)</td>
                    <td className="py-6 font-bold">30.0 – 34.9</td>
                    <td className="py-6 text-red-400 font-bold">High Risk</td>
                  </tr>
                  <tr>
                    <td className="py-6">Obese (Class II)</td>
                    <td className="py-6 font-bold">35.0 +</td>
                    <td className="py-6 text-red-600 font-bold">Very High Risk</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* BMI Formula Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
            <div className="bg-cream rounded-[40px] p-10 border border-forest/5">
              <div className="w-12 h-12 bg-forest rounded-xl flex items-center justify-center text-mint mb-8">
                <Ruler className="w-6 h-6" />
              </div>
              <h3 className="text-forest text-2xl font-bold mb-6">Metric Formula</h3>
              <p className="text-ink-muted mb-8 font-medium">The standard metric formula for BMI calculation used worldwide.</p>
              <div className="bg-white p-8 rounded-2xl border border-forest/10 font-mono text-forest font-bold text-center">
                BMI = weight (kg) / [height (m)]²
              </div>
            </div>

            <div className="bg-mint-xlight rounded-[40px] p-10 border border-mint/10">
              <div className="w-12 h-12 bg-forest rounded-xl flex items-center justify-center text-orange-400 mb-8">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-forest text-2xl font-bold mb-6">Imperial Formula</h3>
              <p className="text-ink-muted mb-8 font-medium">The formula commonly used in the United States and United Kingdom.</p>
              <div className="bg-white p-8 rounded-2xl border border-mint/20 font-mono text-forest font-bold text-center">
                BMI = 703 × weight (lb) / [height (in)]²
              </div>
            </div>
          </div>

          {/* New Section: BMI by Age */}
          <div className="mb-24">
            <div className="inline-flex items-center gap-2 bg-sky/10 text-sky px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
              Age-Based Guidance
            </div>
            <h2 className="text-forest text-4xl lg:text-5xl font-display font-bold mb-8">Healthy BMI Range by Age</h2>
            <p className="text-ink-muted text-lg mb-12 max-w-3xl leading-relaxed">
              Research suggests that the relationship between BMI and health risk shifts slightly with age. Older adults with a slightly higher BMI may have better outcomes than those at the low end of the range.
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { age: "20–39", range: "18.5 – 24.9", label: "Standard WHO range" },
                { age: "40–59", range: "19.0 – 25.9", label: "Slightly broader range" },
                { age: "60–69", range: "21.0 – 26.9", label: "Higher BMI may be protective" },
                { age: "70+", range: "22.0 – 27.9", label: "Underweight is riskier in old age" }
              ].map((item, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl border border-forest/5 shadow-sm text-center">
                  <div className="text-forest/30 text-[10px] font-black uppercase tracking-widest mb-4">Ages {item.age}</div>
                  <div className="text-forest text-2xl font-display font-black mb-2">{item.range}</div>
                  <div className="text-ink-muted text-xs font-medium">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* New Section: Gender Differences */}
          <div className="mb-24">
            <h2 className="text-forest text-4xl lg:text-5xl font-display font-bold mb-8">BMI for Women vs Men</h2>
            <p className="text-ink-muted text-lg mb-12 max-w-3xl leading-relaxed">
              While the formula is identical, biological differences mean that two people with the same BMI can have different health profiles.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-blue-50/50 p-10 rounded-[40px] border border-blue-100">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-500 mb-6 shadow-sm">
                  ♂
                </div>
                <h3 className="text-forest text-2xl font-bold mb-6">BMI in Men</h3>
                <ul className="space-y-4 text-ink-muted font-medium">
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-400 mt-1" /> Higher muscle-to-fat ratio on average</li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-400 mt-1" /> Visceral fat accumulates faster with age</li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-400 mt-1" /> Waist {">"} 40 inches = Increased risk</li>
                </ul>
              </div>
              <div className="bg-pink-50/50 p-10 rounded-[40px] border border-pink-100">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-pink-500 mb-6 shadow-sm">
                  ♀
                </div>
                <h3 className="text-forest text-2xl font-bold mb-6">BMI in Women</h3>
                <ul className="space-y-4 text-ink-muted font-medium">
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-pink-400 mt-1" /> Naturally higher body fat percentage</li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-pink-400 mt-1" /> Hormonal changes affect fat distribution</li>
                  <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-pink-400 mt-1" /> Waist {">"} 35 inches = Increased risk</li>
                </ul>
              </div>
            </div>
          </div>

          {/* New Section: Asian Standards (Fully Styled like Image) */}
          <div className="mb-24">
            <div className="inline-flex items-center gap-2 bg-mint/10 text-mint px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
              Asian & South Asian Standards
            </div>
            <h2 className="text-forest text-4xl lg:text-5xl font-display font-bold mb-8">BMI Calculator Pakistan — Asian BMI Standards</h2>
            <p className="text-ink-muted text-lg mb-12 max-w-3xl leading-relaxed">
              Research by the WHO Expert Consultation found that Asian populations face higher health risks at lower BMI values. Use these adjusted thresholds for more accurate results in South Asian regions.
            </p>

            {/* Colorful Bar */}
            <div className="flex h-12 w-full rounded-xl overflow-hidden mb-12 shadow-sm">
              <div className="w-[10%] bg-purple-500 flex items-center justify-center text-[10px] text-white font-bold">&lt;18.5</div>
              <div className="w-[30%] bg-mint flex items-center justify-center text-[10px] text-white font-bold">18.5–22.9</div>
              <div className="w-[25%] bg-yellow-400 flex items-center justify-center text-[10px] text-white font-bold">23–27.4</div>
              <div className="w-[20%] bg-orange-500 flex items-center justify-center text-[10px] text-white font-bold">27.5–32.4</div>
              <div className="w-[15%] bg-red-600 flex items-center justify-center text-[10px] text-white font-bold">32.5+</div>
            </div>

            <div className="bg-white rounded-[40px] border border-forest/5 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-forest/5">
                    <th className="p-8 text-[10px] font-black text-forest/40 uppercase tracking-[2px]">Classification</th>
                    <th className="p-8 text-[10px] font-black text-forest/40 uppercase tracking-[2px]">Standard WHO (kg/m²)</th>
                    <th className="p-8 text-[10px] font-black text-forest/40 uppercase tracking-[2px]">Asian Recommended (kg/m²)</th>
                  </tr>
                </thead>
                <tbody className="text-forest font-medium">
                  <tr className="border-b border-forest/5">
                    <td className="p-8 flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-purple-500" /> Underweight
                    </td>
                    <td className="p-8">&lt; 18.5</td>
                    <td className="p-8 text-purple-500 font-bold">&lt; 18.5</td>
                  </tr>
                  <tr className="border-b border-forest/5 bg-mint/5">
                    <td className="p-8 flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-mint" /> Normal Weight <span className="text-mint font-black">✓</span>
                    </td>
                    <td className="p-8">18.5 – 24.9</td>
                    <td className="p-8 text-mint font-black">18.5 – 22.9</td>
                  </tr>
                  <tr className="border-b border-forest/5">
                    <td className="p-8 flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-yellow-400" /> Overweight / At Risk
                    </td>
                    <td className="p-8">25.0 – 29.9</td>
                    <td className="p-8 text-yellow-500 font-bold">23.0 – 27.4</td>
                  </tr>
                  <tr className="border-b border-forest/5">
                    <td className="p-8 flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-orange-500" /> Obese Class I
                    </td>
                    <td className="p-8">30.0 – 34.9</td>
                    <td className="p-8 text-orange-500 font-bold">27.5 – 32.4</td>
                  </tr>
                  <tr>
                    <td className="p-8 flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-red-600" /> Obese Class II & III
                    </td>
                    <td className="p-8">35.0 +</td>
                    <td className="p-8 text-red-600 font-bold">32.5 +</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-8 p-6 bg-cream/30 rounded-2xl border border-forest/5">
              <p className="text-ink-muted text-sm font-medium italic">
                Scientific basis: At the same BMI, Asian individuals tend to have higher body fat percentages and greater cardiovascular risk compared to White Europeans.
              </p>
            </div>
          </div>

          {/* New Section: Ideal BMI Guide */}
          <div className="mb-24">
            <div className="inline-flex items-center gap-2 bg-mint/10 text-mint px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
              Take Action
            </div>
            <h2 className="text-forest text-4xl lg:text-5xl font-display font-bold mb-8">How to Reach a Healthy BMI — Ideal BMI Guide</h2>
            <p className="text-ink-muted text-lg mb-12 max-w-3xl leading-relaxed">
              Whether you need to lose, gain, or maintain weight as per BMI, the key is a sustainable, evidence-based approach. Crash diets and extreme exercise can harm your health and are rarely effective long-term.
            </p>

            {/* Program Comparison Table */}
            <div className="bg-[#F0F7FF] rounded-[48px] p-8 lg:p-16 border border-blue-100 mb-16 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/5 rounded-full -mr-16 -mt-16" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-blue-500 text-[10px] font-black uppercase tracking-widest mb-6">
                   <CheckCircle2 className="w-4 h-4" /> Editor's Comparison — 2025
                </div>
                <h3 className="text-forest text-2xl lg:text-3xl font-bold mb-10">Top Weight Management Programs</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-forest text-white">
                        <th className="p-5 rounded-tl-2xl text-[10px] font-black uppercase tracking-widest">Program</th>
                        <th className="p-5 text-[10px] font-black uppercase tracking-widest">Best For</th>
                        <th className="p-5 text-[10px] font-black uppercase tracking-widest">Why It Works</th>
                        <th className="p-5 rounded-tr-2xl text-[10px] font-black uppercase tracking-widest">Get Started</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      <tr className="border-b border-forest/5 bg-mint/5">
                        <td className="p-6">
                          <div className="font-bold text-forest mb-1">Noom</div>
                          <div className="flex text-yellow-400 text-xs">★★★★★ 4.8</div>
                        </td>
                        <td className="p-6 text-sm font-medium text-forest/70">Overweight - BMI 25–34</td>
                        <td className="p-6 text-sm font-medium text-forest/70">Psychology-based. 78% of users lose weight in 4 months.</td>
                        <td className="p-6"><button className="bg-mint text-forest px-6 py-2 rounded-xl font-bold text-xs">Free Quiz →</button></td>
                      </tr>
                      <tr className="border-b border-forest/5">
                        <td className="p-6">
                          <div className="font-bold text-forest mb-1">Weight Watchers</div>
                          <div className="flex text-yellow-400 text-xs">★★★★☆ 4.5</div>
                        </td>
                        <td className="p-6 text-sm font-medium text-forest/70">Any BMI - Flexible diet</td>
                        <td className="p-6 text-sm font-medium text-forest/70">No foods banned. Points system. 60+ years of clinical validation.</td>
                        <td className="p-6"><button className="border-2 border-forest/10 text-forest px-6 py-2 rounded-xl font-bold text-xs hover:bg-forest/5 transition-all">See Offer →</button></td>
                      </tr>
                      <tr>
                        <td className="p-6">
                          <div className="font-bold text-forest mb-1">Found Health</div>
                          <div className="flex text-yellow-400 text-xs">★★★★☆ 4.4</div>
                        </td>
                        <td className="p-6 text-sm font-medium text-forest/70">Obese Class I–III</td>
                        <td className="p-6 text-sm font-medium text-forest/70">Doctor-led. FDA-approved medication support where appropriate.</td>
                        <td className="p-6"><button className="border-2 border-forest/10 text-forest px-6 py-2 rounded-xl font-bold text-xs hover:bg-forest/5 transition-all">Start Now →</button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-8 text-[10px] text-forest/30 font-medium italic">
                   Affiliate Disclosure: We may earn a small commission if you sign up at no cost to you. Always consult your GP before starting any health programme.
                </p>
              </div>
            </div>

            {/* 6 Step Roadmap */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              {[
                { n: "1", t: "Calculate your TDEE", d: "Find your Total Daily Energy Expenditure — how many calories your body burns daily. Use our TDEE Calculator to get your number." },
                { n: "2", t: "Create a calorie target", d: "For fat loss: eat 300–500 kcal below TDEE. For weight gain: eat 250–400 kcal above. Our Calorie Calculator sets this automatically." },
                { n: "3", t: "Optimise protein intake", d: "Eat 1.6–2.2g protein per kg bodyweight to preserve muscle while losing fat. Our Protein Calculator shows your daily target." },
                { n: "4", t: "Exercise regularly", d: "150+ minutes of moderate cardio per week (walking, cycling) plus 2–3 strength training sessions. Muscle burns more calories." },
                { n: "5", t: "Sleep 7–9 hours", d: "Poor sleep increases cortisol and hunger hormones. Adults sleeping less than 6 hours have significantly higher obesity rates." },
                { n: "6", t: "Track & adjust monthly", d: "Recalculate your BMI monthly. As weight changes, your targets shift. Consistent tracking is the #1 predictor of long-term success." }
              ].map((step, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl border border-forest/5 shadow-sm flex gap-6 group hover:shadow-xl transition-all">
                  <div className="w-10 h-10 bg-forest rounded-full flex items-center justify-center text-mint font-bold shrink-0 group-hover:scale-110 transition-transform">{step.n}</div>
                  <div>
                    <h4 className="text-forest font-bold mb-2">{step.t}</h4>
                    <p className="text-ink-muted text-sm leading-relaxed font-medium">{step.d}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Ad Placeholder Before FAQ */}
            <div className="bg-cream/50 border-2 border-dashed border-forest/10 rounded-3xl p-10 text-center mb-16">
              <div className="text-forest/20 text-xs font-black uppercase tracking-[4px] mb-2">AD UNIT 4 — Before FAQ Leaderboard (728×90)</div>
              <p className="text-forest/10 text-[10px] font-bold">Highly engaged users here — paste AdSense/Ezoic code snippet</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Considerations Section (Updated to 6 Cards) */}
      <section className="py-24 bg-forest text-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-6">Limitations of BMI</h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto font-medium">
              BMI is a useful screening tool, but it doesn't tell the whole story about your health.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              { title: "Muscle vs Fat", desc: "Muscle is denser than fat. Athletes and bodybuilders often have a high BMI despite very low body fat.", icon: "💪" },
              { title: "Age & Bone Density", desc: "As we age, we typically lose muscle and bone density. Older adults may have a 'normal' BMI but high body fat.", icon: "👵" },
              { title: "Ethnicity", desc: "Standard BMI thresholds were developed for European populations. Asian populations often face higher risks at lower BMI values.", icon: "🌍" },
              { title: "Pregnancy", desc: "BMI is not an accurate measure during pregnancy. Use our specialized Pregnancy Weight Gain Calculator instead.", icon: "🤰" },
              { title: "Fat Distribution", desc: "Two people with identical BMIs can have different fat distributions. Abdominal fat carries much higher risk.", icon: "📏" },
              { title: "Children & Teens", desc: "Standard adult BMI categories do not apply to children. Use age- and sex-specific growth charts instead.", icon: "🧒" }
            ].map((item, i) => (
              <div key={i} className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-all">
                <div className="text-3xl mb-6">{item.icon}</div>
                <h4 className="text-xl font-bold mb-4">{item.title}</h4>
                <p className="text-white/50 text-sm leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="bg-mint/10 border-l-4 border-mint p-6 rounded-r-2xl max-w-4xl mx-auto">
             <p className="text-mint font-medium text-sm">
                <strong>Better together:</strong> For a more complete picture of your health, combine BMI with waist circumference, waist-to-hip ratio, and body fat percentage. Our Body Fat Calculator can help.
             </p>
          </div>
        </div>
      </section>

      {/* Best Smart Scales Section */}
      <section className="py-24 bg-[#F9FBFD]">
        <div className="container-custom">
          <div className="mb-16">
            <span className="text-mint text-[10px] font-black uppercase tracking-[4px] block mb-4">Recommended Tools</span>
            <h2 className="text-forest text-4xl lg:text-5xl font-display font-bold mb-6">Best Smart Scales to Track Your BMI</h2>
            <p className="text-ink-muted text-lg font-medium max-w-3xl mb-8 leading-relaxed">
              Automatically measure BMI, body fat, muscle mass and 13+ metrics. Syncs with Apple Health, Google Fit & Fitbit.
            </p>
            <div className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest">
              Available on Amazon
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                tag: "AMAZON'S CHOICE",
                tagColor: "bg-orange-500",
                title: "Etekcity Smart Scale — WiFi",
                features: ["14 metrics: BMI, body fat, muscle mass", "Wi-Fi + Bluetooth connectivity", "Apple Health, Google Fit sync"],
                price: "$79.99",
                oldPrice: "$99.99",
                rating: "4.8/5 • 22,000+ reviews"
              },
              {
                tag: "BEST VALUE",
                tagColor: "bg-mint",
                title: "RENPHO Bluetooth Scale",
                features: ["13 metrics including BMI", "Smartphone App sync", "89,000+ verified reviews"],
                price: "$25.99",
                oldPrice: "$34.99",
                rating: "4.8/5 • 89,000+ reviews"
              },
              {
                tag: "BUDGET PICK",
                tagColor: "bg-sky",
                title: "FITINDEX Smart Scale",
                features: ["13 body composition metrics", "400 lb capacity", "Unlimited users, app sync"],
                price: "$19.98",
                oldPrice: "$29.99",
                rating: "4.5/5 • 41,000+ reviews"
              }
            ].map((product, i) => (
              <div key={i} className="bg-white rounded-[32px] overflow-hidden border border-forest/5 shadow-sm hover:shadow-xl transition-all flex flex-col">
                <div className="p-8 pb-0">
                  <div className={`${product.tagColor} text-white text-[9px] font-black px-3 py-1 rounded-full inline-block mb-6`}>{product.tag}</div>
                  <div className="aspect-square bg-cream rounded-2xl mb-8 flex items-center justify-center p-8">
                     {/* Placeholder for Product Image */}
                     <div className="w-full h-full border-2 border-dashed border-forest/10 rounded-xl flex items-center justify-center text-forest/20 font-black text-xs italic">Product Image</div>
                  </div>
                  <h3 className="text-forest font-bold text-lg mb-4">{product.title}</h3>
                  <ul className="space-y-3 mb-8">
                    {product.features.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-ink-muted font-medium">
                        <CheckCircle2 className="w-3 h-3 text-mint mt-0.5" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-auto p-8 pt-0 border-t border-forest/5">
                  <div className="flex items-baseline gap-2 mt-6 mb-2">
                    <span className="text-2xl font-black text-forest">{product.price}</span>
                    <span className="text-sm text-forest/20 line-through font-bold">{product.oldPrice}</span>
                    <span className="text-[10px] font-black text-red-500 uppercase">Save 20%</span>
                  </div>
                  <div className="text-[10px] text-yellow-500 font-bold mb-6 flex items-center gap-1">
                    ★★★★★ <span className="text-forest/30 ml-1">{product.rating}</span>
                  </div>
                  <button className="w-full bg-orange-500 text-white py-4 rounded-xl font-black text-sm shadow-lg hover:bg-orange-600 transition-all">
                    View on Amazon →
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex gap-3 items-start max-w-4xl opacity-50">
            <Info className="w-4 h-4 text-sky shrink-0 mt-0.5" />
            <p className="text-[10px] text-forest font-medium italic">
              We may earn a commission from qualifying Amazon purchases at no extra cost to you. Products are independently selected based on reviews, ratings, and features — not sponsored placement.
            </p>
          </div>
        </div>
      </section>

      {/* Educational Content */}
      <section className="py-24 no-print">
        <div className="container-custom">
          {/* What is BMI */}
          <div className="max-w-4xl mx-auto mb-24">
            <div className="inline-flex items-center gap-2 bg-mint/10 text-mint px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
              Expert Guide
            </div>
            <h2 className="text-forest text-4xl lg:text-5xl font-display font-bold mb-8">What exactly is Body Mass Index?</h2>
            <div className="space-y-6 text-ink-muted text-lg leading-relaxed">
              <p>
                Body Mass Index (BMI) is a value derived from the mass (weight) and height of a person. The BMI is defined as the body mass divided by the square of the body height, and is expressed in units of kg/m².
              </p>
              <p>
                BMI is a convenient rule of thumb used to broadly categorize a person as underweight, normal weight, overweight, or obese based on tissue mass (muscle, fat, and bone) and height.
              </p>
              <div className="bg-forest p-10 rounded-[32px] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
                <h3 className="text-mint font-bold mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5" /> Quick Fact
                </h3>
                <p className="text-white/80 font-medium italic">
                  "While BMI is not a direct measure of body fatness, it is moderately correlated with more direct measures of body fat obtained from skinfold thickness measurements, bioelectrical impedance, and other methods."
                </p>
              </div>
            </div>
          </div>

          {/* BMI Table */}
          <div className="bg-white rounded-[40px] p-8 lg:p-16 border border-forest/5 shadow-sm mb-24">
            <h2 className="text-forest text-3xl font-display font-bold mb-12 text-center lg:text-left">BMI Categories for Adults</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-forest/5">
                    <th className="pb-6 text-[10px] font-black text-forest/30 uppercase tracking-widest">Category</th>
                    <th className="pb-6 text-[10px] font-black text-forest/30 uppercase tracking-widest">BMI Range (kg/m²)</th>
                    <th className="pb-6 text-[10px] font-black text-forest/30 uppercase tracking-widest">Health Risk</th>
                  </tr>
                </thead>
                <tbody className="text-forest font-medium">
                  {[
                    { cat: "Underweight", range: "< 18.5", risk: "Nutritional Deficiency", color: "text-purple-500" },
                    { cat: "Normal Weight", range: "18.5 – 24.9", risk: "Low", color: "text-mint" },
                    { cat: "Overweight", range: "25.0 – 29.9", risk: "Increased", color: "text-yellow-500" },
                    { cat: "Obese (Class I)", range: "30.0 – 34.9", risk: "High", color: "text-orange-500" },
                    { cat: "Obese (Class II)", range: "35.0 – 39.9", risk: "Very High", color: "text-red-500" },
                    { cat: "Obese (Class III)", range: "≥ 40.0", risk: "Extremely High", color: "text-red-700" },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-forest/5 last:border-0">
                      <td className={`py-6 font-bold ${row.color}`}>{row.cat}</td>
                      <td className="py-6">{row.range}</td>
                      <td className="py-6">{row.risk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-[4/5] rounded-[48px] bg-forest/5 overflow-hidden border border-forest/10">
                <div className="absolute inset-0 flex items-center justify-center text-forest/20 font-black text-9xl">BMI</div>
                {/* Visual indicator placeholder */}
                <div className="absolute bottom-12 left-12 right-12 bg-white p-8 rounded-3xl shadow-2xl border border-forest/5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-mint flex items-center justify-center text-white font-bold">22</div>
                    <div>
                      <div className="text-xs font-black text-forest/30 uppercase">Sample BMI</div>
                      <div className="text-forest font-bold">Healthy Range</div>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-forest/5 rounded-full overflow-hidden">
                    <div className="h-full bg-mint w-[60%]" />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 bg-pink-50 text-pink-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                Age & Gender Factors
              </div>
              <h2 className="text-forest text-4xl font-display font-bold mb-8 leading-tight">BMI for Men vs. Women: Is there a difference?</h2>
              <p className="text-ink-muted text-lg mb-8 leading-relaxed">
                While the BMI formula is identical for all adults, the interpretation often differs based on body composition. Women naturally tend to have a higher percentage of body fat than men at the same BMI level.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[32px] border border-forest/5 shadow-sm">
                  <h3 className="text-forest font-bold mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-mint" /> For Men
                  </h3>
                  <ul className="space-y-4 text-ink-muted font-medium">
                    <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-mint mt-1" /> Higher muscle mass index</li>
                    <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-mint mt-1" /> Lower body fat percentage</li>
                    <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-mint mt-1" /> Visceral fat risk focus</li>
                  </ul>
                </div>
                <div className="bg-white p-8 rounded-[32px] border border-forest/5 shadow-sm">
                  <h3 className="text-forest font-bold mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-pink-400" /> For Women
                  </h3>
                  <ul className="space-y-4 text-ink-muted font-medium">
                    <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-pink-400 mt-1" /> Naturally higher body fat percentage</li>
                    <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-pink-400 mt-1" /> Hormonal changes affect fat distribution</li>
                    <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-pink-400 mt-1" /> Waist {">"} 35 inches = Increased risk</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* New Section: Asian Standards (Fully Styled like Image) */}
          <div className="mt-24">
            <div className="inline-flex items-center gap-2 bg-mint/10 text-mint px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
              Asian & South Asian Standards
            </div>
            <h2 className="text-forest text-4xl lg:text-5xl font-display font-bold mb-8">BMI Calculator Pakistan — Asian BMI Standards</h2>
            <p className="text-ink-muted text-lg mb-12 max-w-3xl leading-relaxed">
              Research by the WHO Expert Consultation found that Asian populations face higher health risks at lower BMI values. Use these adjusted thresholds for more accurate results in South Asian regions.
            </p>

            {/* Colorful Bar */}
            <div className="flex h-12 w-full rounded-xl overflow-hidden mb-12 shadow-sm">
              <div className="w-[10%] bg-purple-500 flex items-center justify-center text-[10px] text-white font-bold">&lt;18.5</div>
              <div className="w-[30%] bg-mint flex items-center justify-center text-[10px] text-white font-bold">18.5–22.9</div>
              <div className="w-[25%] bg-yellow-400 flex items-center justify-center text-[10px] text-white font-bold">23–27.4</div>
              <div className="w-[20%] bg-orange-500 flex items-center justify-center text-[10px] text-white font-bold">27.5–32.4</div>
              <div className="w-[15%] bg-red-600 flex items-center justify-center text-[10px] text-white font-bold">32.5+</div>
            </div>

            <div className="bg-white rounded-[40px] border border-forest/5 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-forest/5">
                    <th className="p-8 text-[10px] font-black text-forest/40 uppercase tracking-[2px]">Classification</th>
                    <th className="p-8 text-[10px] font-black text-forest/40 uppercase tracking-[2px]">Standard WHO (kg/m²)</th>
                    <th className="p-8 text-[10px] font-black text-forest/40 uppercase tracking-[2px]">Asian Recommended (kg/m²)</th>
                  </tr>
                </thead>
                <tbody className="text-forest font-bold text-sm">
                  <tr className="border-b border-forest/5">
                    <td className="p-8 flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Underweight
                    </td>
                    <td className="p-8 text-forest/40">&lt; 18.5</td>
                    <td className="p-8">&lt; 18.5</td>
                  </tr>
                  <tr className="bg-mint/5 border-b border-forest/5">
                    <td className="p-8 flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-mint" /> Normal Weight
                    </td>
                    <td className="p-8 text-forest/40">18.5 – 24.9</td>
                    <td className="p-8 flex items-center gap-3">
                      18.5 – 22.9 <div className="text-mint">✓</div>
                    </td>
                  </tr>
                  <tr className="border-b border-forest/5">
                    <td className="p-8 flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" /> Overweight
                    </td>
                    <td className="p-8 text-forest/40">25.0 – 29.9</td>
                    <td className="p-8">23.0 – 27.4</td>
                  </tr>
                  <tr className="border-b border-forest/5">
                    <td className="p-8 flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Obese
                    </td>
                    <td className="p-8 text-forest/40">30.0 – 34.9</td>
                    <td className="p-8">27.5 – 32.4</td>
                  </tr>
                  <tr>
                    <td className="p-8 flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-600" /> Severely Obese
                    </td>
                    <td className="p-8 text-forest/40">≥ 35.0</td>
                    <td className="p-8">≥ 32.5</td>
                  </tr>
                </tbody>
              </table>
              <div className="p-8 bg-forest/5 border-t border-forest/10 flex items-start gap-4">
                <Info className="w-5 h-5 text-sky shrink-0 mt-0.5" />
                <p className="text-xs text-ink-muted leading-relaxed font-medium">
                  Individuals with a South Asian background have a higher risk of developing cardiovascular disease and type 2 diabetes at a lower BMI compared to white populations. These adjusted ranges help identify risk earlier.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Smart Scales Grid */}
      <section className="py-24 bg-cream/30 no-print">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-mint text-[10px] font-black uppercase tracking-[4px] block mb-4">Recommended Hardware</span>
            <h2 className="text-forest text-4xl lg:text-5xl font-display font-bold mb-6">Best Smart Scales for 2024</h2>
            <p className="text-ink-muted text-lg max-w-3xl mx-auto font-medium">Track your weight, body fat %, and muscle mass with these high-precision smart scales that sync directly with your phone.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Withings Body Comp",
                image: "https://images.unsplash.com/photo-1591197172027-ef3d5366ef53?q=80&w=800&auto=format&fit=crop",
                rating: "4.8 (2,400+ reviews)",
                price: "$199",
                oldPrice: "$249",
                features: ["Nerve health tracking", "Vascular age", "Body water & muscle mass", "Apple Health & Google Fit sync"],
                badge: "Best Overall"
              },
              {
                name: "Eufy Smart Scale P3",
                image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop",
                rating: "4.7 (5,100+ reviews)",
                price: "$89",
                oldPrice: "$119",
                features: ["3D Virtual Model", "Heart rate tracking", "Large screen display", "unlimited users"],
                badge: "Best Value"
              },
              {
                name: "Renpho Smart Scale",
                image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop",
                rating: "4.9 (120,000+ reviews)",
                price: "$29",
                oldPrice: "$39",
                features: ["Bluetooth sync", "Compact design", "13 essential metrics", "Highly accurate"],
                badge: "Top Rated"
              }
            ].map((product, i) => (
              <div key={i} className="bg-white rounded-[40px] overflow-hidden border border-forest/5 shadow-sm hover:shadow-2xl transition-all flex flex-col group">
                <div className="relative h-64 overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-6 right-6 bg-forest text-mint text-[10px] font-black uppercase px-4 py-2 rounded-full shadow-lg">
                    {product.badge}
                  </div>
                </div>
                <div className="p-8 flex-grow">
                  <h3 className="text-xl font-bold text-forest mb-4">{product.name}</h3>
                  <ul className="space-y-3 mb-8">
                    {product.features.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-ink-muted font-medium">
                        <CheckCircle2 className="w-3 h-3 text-mint mt-0.5" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white no-print">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-16">
            <span className="text-mint text-[10px] font-black uppercase tracking-[4px] block mb-4">Common Questions</span>
            <h2 className="text-forest text-4xl lg:text-5xl font-display font-bold mb-6">Frequently Asked Questions</h2>
            <p className="text-ink-muted text-lg font-medium">These are the most common questions people ask about BMI. Click any question to expand.</p>
          </div>

          <div className="space-y-4">
            {[
              { q: "What is a healthy BMI?", a: "A healthy BMI for adults is generally considered to be between 18.5 and 24.9. This range is associated with the lowest risk of developing chronic health conditions." },
              { q: "Is BMI different for men and women?", a: "The formula is the same, but biological differences mean women naturally have higher body fat percentages than men at the same BMI. Interpretation should consider these factors." },
              { q: "What is a good BMI for a 50-year-old woman?", a: "For women over 50, a slightly higher BMI (21–26) may be protective against bone density loss and other age-related health issues." },
              { q: "What BMI is considered obese?", a: "A BMI of 30.0 or higher is medically classified as obese, which is further divided into Class I, II, and III based on the severity." },
              { q: "Can you have a normal BMI but still be unhealthy?", a: "Yes. This is often called 'normal weight obesity' or 'skinny fat,' where a person has a normal weight but a high percentage of body fat and low muscle mass." },
              { q: "How accurate is the BMI calculator?", a: "BMI is a reliable screening tool for most people, but it does not account for muscle mass, bone density, or overall body composition." }
            ].map((faq, i) => (
              <motion.div 
                key={i}
                className="border border-forest/5 rounded-[24px] overflow-hidden"
              >
                <button 
                  onClick={() => setAge(age === `q-${i}` ? '' : `q-${i}`)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-cream/30 transition-all group"
                >
                  <span className="text-forest font-bold">{faq.q}</span>
                  <div className="w-8 h-8 rounded-full bg-forest/5 flex items-center justify-center text-forest group-hover:bg-forest group-hover:text-white transition-all">
                    {age === `q-${i}` ? '−' : '+'}
                  </div>
                </button>
                <AnimatePresence>
                  {age === `q-${i}` && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-cream/20"
                    >
                      <div className="p-6 pt-0 text-ink-muted leading-relaxed font-medium">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-24 no-print">
        <div className="container-custom">
          <div className="bg-forest rounded-[48px] p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
            
            <div className="relative z-10">
              <div className="flex justify-center gap-1 mb-8 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-2xl">★</span>
                ))}
              </div>
              <h2 className="text-white text-4xl lg:text-6xl font-display font-bold mb-6 tracking-tight">
                Know your number. Now take action.
              </h2>
              <p className="text-white/60 text-lg lg:text-xl max-w-2xl mx-auto mb-12 font-medium">
                Over 4 million people use HealthCalcsPro monthly. Get a personalised weight plan matched to your BMI result — free to start.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-forest px-10 py-5 rounded-2xl font-black text-lg shadow-xl hover:scale-105 transition-all">
                  Take Free Weight Loss Quiz →
                </button>
                <button className="bg-white/10 text-white border-2 border-white/20 px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/20 transition-all">
                  Use Calorie Calculator
                </button>
              </div>
              <p className="mt-8 text-white/30 text-xs font-medium">
                Sponsored link • Free to try • No credit card needed for the quiz
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Tools Section */}
      <section className="pb-32 bg-white no-print">
        <div className="container-custom">
          <div className="mb-16">
            <span className="text-mint text-[10px] font-black uppercase tracking-[4px] block mb-4">Next Steps</span>
            <h2 className="text-forest text-3xl lg:text-4xl font-display font-bold mb-6">Related Health Calculators</h2>
            <p className="text-ink-muted text-lg max-w-2xl font-medium">
              Now that you know your BMI, use these tools to build a complete picture of your health.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Calorie Calculator", icon: "🍎", href: "/calories" },
              { name: "TDEE Calculator", icon: "⚡", href: "/tdee" },
              { name: "Body Fat Calculator", icon: "📏", href: "/body-fat" },
              { name: "Ideal Weight Calculator", icon: "🎯", href: "/ideal-weight" },
              { name: "BMR Calculator", icon: "🧬", href: "/bmr" },
              { name: "Protein Calculator", icon: "🍗", href: "/protein" },
              { name: "Water Intake Calculator", icon: "💧", href: "/water" },
              { name: "Sleep Calculator", icon: "😴", href: "/sleep" }
            ].map((tool, i) => (
              <a 
                key={i} 
                href={tool.href}
                className="bg-white p-8 rounded-3xl border border-forest/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-center group"
              >
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{tool.icon}</div>
                <div className="text-forest font-bold text-sm leading-tight">{tool.name}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
