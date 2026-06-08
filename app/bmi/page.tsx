'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type Unit = 'imperial' | 'metric';
type Gender = 'male' | 'female';
type BMICategory = 'severe' | 'moderate' | 'mild' | 'normal' | 'overweight' | 'obese1' | 'obese2' | 'obese3';

const catColors: Record<BMICategory, string> = {
  severe: '#7c3aed', moderate: '#6366f1', mild: '#60a5fa', normal: '#10b981',
  overweight: '#f59e0b', obese1: '#f97316', obese2: '#ef4444', obese3: '#b91c1c',
};
const catLabels: Record<BMICategory, string> = {
  severe: 'Severe Thinness', moderate: 'Moderate Thinness', mild: 'Mild Thinness', normal: 'Normal Weight',
  overweight: 'Overweight', obese1: 'Obese Class I', obese2: 'Obese Class II', obese3: 'Obese Class III',
};

function getCategory(bmi: number): BMICategory {
  if (bmi < 16) return 'severe';
  if (bmi < 17) return 'moderate';
  if (bmi < 18.5) return 'mild';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  if (bmi < 35) return 'obese1';
  if (bmi < 40) return 'obese2';
  return 'obese3';
}

export default function BMICalculatorPage() {
  const [unit, setUnit] = useState<Unit>('imperial');
  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState('');
  const [ft, setFt] = useState('');
  const [inch, setInch] = useState('');
  const [cm, setCm] = useState('');
  const [lbs, setLbs] = useState('');
  const [kg, setKg] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const calculate = () => {
    let w: number, h: number;
    if (unit === 'metric') {
      w = parseFloat(kg); h = parseFloat(cm) / 100;
      if (!w || !h) return;
      setBmi(parseFloat((w / (h * h)).toFixed(1)));
    } else {
      const totalIn = (parseFloat(ft) * 12) + parseFloat(inch);
      w = parseFloat(lbs);
      if (!w || !totalIn) return;
      setBmi(parseFloat(((w / (totalIn * totalIn)) * 703).toFixed(1)));
    }
  };

  const reset = () => { setBmi(null); setAge(''); setFt(''); setInch(''); setCm(''); setLbs(''); setKg(''); };

  const cat = bmi ? getCategory(bmi) : null;
  const bmiPrime = bmi ? parseFloat((bmi / 25).toFixed(2)) : null;
  const ponderal = bmi && unit === 'metric' ? parseFloat((parseFloat(kg) / Math.pow(parseFloat(cm) / 100, 3)).toFixed(1)) : null;

  const healthyRange = () => {
    let hm: number;
    if (unit === 'metric') { hm = parseFloat(cm) / 100; }
    else { hm = ((parseFloat(ft) * 12) + parseFloat(inch)) * 0.0254; }
    if (!hm) return '—';
    const lo = (18.5 * hm * hm).toFixed(1);
    const hi = (24.9 * hm * hm).toFixed(1);
    return unit === 'metric' ? `${lo} – ${hi} kg` : `${(parseFloat(lo) * 2.205).toFixed(1)} – ${(parseFloat(hi) * 2.205).toFixed(1)} lbs`;
  };

  const weightDiff = () => {
    if (!bmi) return '—';
    let w: number, hm: number;
    if (unit === 'metric') { w = parseFloat(kg); hm = parseFloat(cm) / 100; }
    else { w = parseFloat(lbs) * 0.4536; hm = ((parseFloat(ft) * 12) + parseFloat(inch)) * 0.0254; }
    if (!w || !hm) return '—';
    const idealW = 22 * hm * hm;
    const diff = w - idealW;
    if (Math.abs(diff) < 1) return 'At ideal weight!';
    return diff > 0 ? `Lose ${Math.abs(diff).toFixed(1)} kg` : `Gain ${Math.abs(diff).toFixed(1)} kg`;
  };

  const suggestion = () => {
    if (!bmi) return '';
    if (bmi < 18.5) return 'You are underweight. Consider consulting a doctor and increasing calorie intake with nutrient-rich foods.';
    if (bmi < 25) return 'Great job! You are in the healthy BMI range. Maintain your weight with a balanced diet and regular exercise.';
    if (bmi < 30) return 'You are slightly overweight. A moderate calorie deficit and 150+ min/week of exercise can help.';
    return 'Your BMI indicates obesity. Please consult a healthcare professional for a personalised weight management plan.';
  };

  const downloadPDF = () => {
    if (!bmi || !cat) return;
    const unitLabel = unit === 'metric' ? 'kg/cm' : 'lbs/ft';
    const hVal = unit === 'metric' ? `${cm} cm` : `${ft || 0} ft ${inch || 0} in`;
    const wVal = unit === 'metric' ? `${kg} kg` : `${lbs} lbs`;
    const printWin = window.open('', '_blank');
    if (!printWin) return;
    printWin.document.write(`<!DOCTYPE html><html><head><title>BMI Report — HealthCalcsPro</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#111;padding:48px;max-width:620px;margin:0 auto}
.header{border-bottom:2px solid #e5e7eb;padding-bottom:16px;margin-bottom:28px}
.logo{font-size:22px;font-weight:bold;color:#0d7a59;margin-bottom:2px}
.sub{font-size:12px;color:#6b7280}
.score-box{text-align:center;padding:36px;background:linear-gradient(135deg,#f0fdf4,#ecfdf5);border-radius:16px;margin:28px 0}
.score-num{font-size:72px;font-weight:bold;color:${catColors[cat]}}
.score-unit{font-size:14px;color:#6b7280;margin-top:4px}
.score-cat{display:inline-block;margin-top:14px;padding:6px 22px;border-radius:20px;color:#fff;font-weight:600;font-size:14px;background:${catColors[cat]}}
table{width:100%;border-collapse:collapse;margin:24px 0}
td{padding:11px 8px;border-bottom:1px solid #e5e7eb;font-size:13px}
td:first-child{color:#6b7280}
td:last-child{text-align:right;font-weight:600}
.gauge{display:flex;height:14px;border-radius:7px;overflow:hidden;gap:1px;margin:24px 0 4px}
.gauge-labels{display:flex;justify-content:space-between;font-size:10px;color:#9ca3af}
.suggestion{background:#f0fdf4;border:1px solid #86efac;border-radius:12px;padding:18px;margin:24px 0;font-size:13px;line-height:1.6}
.footer{text-align:center;font-size:11px;color:#9ca3af;margin-top:40px;padding-top:16px;border-top:1px solid #e5e7eb}
@media print{body{padding:24px}}
</style></head><body>
<div class="header"><div class="logo">HealthCalcsPro</div><div class="sub">BMI Calculator Report · ${new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}</div></div>
<div class="score-box"><div class="score-num">${bmi}</div><div class="score-unit">kg/m²</div><div class="score-cat">${catLabels[cat]}</div></div>
<table>
<tr><td>Unit System</td><td>${unitLabel}</td></tr>
<tr><td>Age</td><td>${age || '—'} years</td></tr>
<tr><td>Gender</td><td>${gender}</td></tr>
<tr><td>Height</td><td>${hVal}</td></tr>
<tr><td>Weight</td><td>${wVal}</td></tr>
<tr><td>Healthy Weight Range</td><td>${healthyRange()}</td></tr>
<tr><td>Weight to Gain/Lose</td><td>${weightDiff()}</td></tr>
<tr><td>BMI Prime</td><td>${bmiPrime ?? '—'}</td></tr>
<tr><td>Ponderal Index</td><td>${ponderal ? ponderal + ' kg/m³' : '—'}</td></tr>
</table>
<div style="font-size:13px;font-weight:600;margin-top:28px;margin-bottom:4px">BMI Scale (WHO Classification)</div>
<div class="gauge">
<div style="flex:1;background:#7c3aed"></div><div style="flex:0.5;background:#6366f1"></div><div style="flex:0.75;background:#60a5fa"></div>
<div style="flex:3.25;background:#10b981"></div><div style="flex:2.5;background:#f59e0b"></div><div style="flex:2.5;background:#f97316"></div>
<div style="flex:2.5;background:#ef4444"></div><div style="flex:1;background:#b91c1c"></div>
</div>
<div class="gauge-labels"><span>16</span><span>17</span><span>18.5</span><span>25</span><span>30</span><span>35</span><span>40</span><span>40+</span></div>
<div class="suggestion"><strong>💡 Suggestion:</strong> ${suggestion()}</div>
<div class="footer">Generated by HealthCalcsPro · Based on WHO &amp; CDC guidelines<br/>This report is for informational purposes only and is not medical advice.</div>
</body></html>`);
    printWin.document.close();
    setTimeout(() => printWin.print(), 400);
  };

  return (
    <main className="min-h-screen bg-[#f9fafb] font-body">
      <Navbar />

      {/* Hero + Calculator */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d7a59 0%, #1a9e75 50%, #34d399 100%)' }}>
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6z'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: '60px 60px' }} />

        {/* Breadcrumb on gradient */}
        <div className="relative max-w-[1100px] mx-auto px-5 pt-28 text-[13px] text-white/60">
          <a href="/" className="hover:text-white transition-colors">Home</a>
          <span className="mx-1.5">›</span>
          <a href="/health-calculators" className="hover:text-white transition-colors">Health Calculators</a>
          <span className="mx-1.5">›</span>
          <span className="text-white/90">BMI Calculator</span>
        </div>

        <div className="max-w-[1100px] mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start py-14">
            {/* Left: Text */}
            <div className="pb-12 lg:pb-14">
              <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full mb-4 tracking-wide">
                ✓ Medically Reviewed · Free · Instant
              </div>
              <h1 className="text-white text-[clamp(2rem,4vw,2.75rem)] font-display font-bold leading-tight mb-3">BMI Calculator</h1>
              <p className="text-white/85 text-[15px] leading-relaxed mb-6">
                Calculate your <strong>Body Mass Index (BMI)</strong> instantly. Supports Imperial (lbs/ft) and Metric (kg/cm) units. Get your BMI score, category, personalized health advice, and Ponderal Index — all in one free tool.
              </p>
              <div className="flex gap-6 flex-wrap">
                {[{ v: '4M+', l: 'Calculations/mo' }, { v: '99.9%', l: 'Accuracy' }, { v: 'WHO', l: 'Guidelines' }, { v: 'Free', l: 'Forever' }].map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-white text-xl font-display font-bold">{s.v}</div>
                    <div className="text-white/70 text-[11px] uppercase tracking-wider">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Calculator Card */}
            <div>
              <div className="bg-white rounded-t-2xl shadow-[0_4px_32px_rgba(0,0,0,.1)] p-7">
                {/* Tabs */}
                <div className="flex bg-[#f3f4f6] rounded-lg p-[3px] gap-0.5 mb-5">
                  {(['imperial', 'metric'] as Unit[]).map(u => (
                    <button key={u} onClick={() => { setUnit(u); reset(); }}
                      className={`flex-1 py-2 rounded-md text-[13px] font-medium transition-all ${unit === u ? 'bg-white text-[#111827] shadow-sm' : 'text-[#6b7280] hover:text-[#374151]'}`}>
                      {u === 'imperial' ? '🇺🇸 Imperial (lbs/ft)' : '📏 Metric (kg/cm)'}
                    </button>
                  ))}
                </div>

                {/* Form */}
                <div className="grid grid-cols-2 gap-3.5 mb-3.5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-[#374151] uppercase tracking-wider">Age</label>
                    <div className="flex border-[1.5px] border-[#e5e7eb] rounded-lg overflow-hidden focus-within:border-[#1a9e75] focus-within:shadow-[0_0_0_3px_rgba(26,158,117,.12)]">
                      <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="25" className="flex-1 border-none outline-none px-3.5 py-2.5 text-[15px] min-w-0" />
                      <span className="px-3 bg-[#f9fafb] border-l border-[#e5e7eb] text-[13px] text-[#6b7280] flex items-center">years</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-[#374151] uppercase tracking-wider">Gender</label>
                    <div className="flex gap-2">
                      {(['male', 'female'] as Gender[]).map(g => (
                        <button key={g} onClick={() => setGender(g)}
                          className={`flex-1 py-2.5 border-[1.5px] rounded-lg text-[13px] font-medium transition-all ${gender === g ? 'border-[#1a9e75] text-[#1a9e75] bg-[#e6f7f2]' : 'border-[#e5e7eb] text-[#6b7280]'}`}>
                          {g === 'male' ? '♂ Male' : '♀ Female'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5 mb-3.5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-[#374151] uppercase tracking-wider">Height</label>
                    {unit === 'imperial' ? (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex border-[1.5px] border-[#e5e7eb] rounded-lg overflow-hidden focus-within:border-[#1a9e75]">
                          <input type="number" value={ft} onChange={e => setFt(e.target.value)} placeholder="5" className="flex-1 border-none outline-none px-3 py-2.5 text-[15px] min-w-0" />
                          <span className="px-2.5 bg-[#f9fafb] border-l border-[#e5e7eb] text-[13px] text-[#6b7280] flex items-center">ft</span>
                        </div>
                        <div className="flex border-[1.5px] border-[#e5e7eb] rounded-lg overflow-hidden focus-within:border-[#1a9e75]">
                          <input type="number" value={inch} onChange={e => setInch(e.target.value)} placeholder="9" className="flex-1 border-none outline-none px-3 py-2.5 text-[15px] min-w-0" />
                          <span className="px-2.5 bg-[#f9fafb] border-l border-[#e5e7eb] text-[13px] text-[#6b7280] flex items-center">in</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex border-[1.5px] border-[#e5e7eb] rounded-lg overflow-hidden focus-within:border-[#1a9e75] focus-within:shadow-[0_0_0_3px_rgba(26,158,117,.12)]">
                        <input type="number" value={cm} onChange={e => setCm(e.target.value)} placeholder="175" className="flex-1 border-none outline-none px-3.5 py-2.5 text-[15px] min-w-0" />
                        <span className="px-3 bg-[#f9fafb] border-l border-[#e5e7eb] text-[13px] text-[#6b7280] flex items-center">cm</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-[#374151] uppercase tracking-wider">Weight</label>
                    <div className="flex border-[1.5px] border-[#e5e7eb] rounded-lg overflow-hidden focus-within:border-[#1a9e75] focus-within:shadow-[0_0_0_3px_rgba(26,158,117,.12)]">
                      <input type="number" value={unit === 'imperial' ? lbs : kg} onChange={e => unit === 'imperial' ? setLbs(e.target.value) : setKg(e.target.value)} placeholder={unit === 'imperial' ? '154' : '70'} className="flex-1 border-none outline-none px-3.5 py-2.5 text-[15px] min-w-0" />
                      <span className="px-3 bg-[#f9fafb] border-l border-[#e5e7eb] text-[13px] text-[#6b7280] flex items-center">{unit === 'imperial' ? 'lbs' : 'kg'}</span>
                    </div>
                  </div>
                </div>

                <button onClick={calculate}
                  className="w-full py-3.5 text-white rounded-lg font-semibold text-base flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(26,158,117,.35)] transition-all"
                  style={{ background: 'linear-gradient(135deg, #0d7a59, #1a9e75)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Calculate My BMI
                </button>
              </div>

              {/* Result */}
              <AnimatePresence>
                {bmi !== null && cat && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="bg-white p-7 border-t border-[#e5e7eb]">
                    <div className="flex items-start gap-6 flex-wrap mb-6">
                      <div className="text-center flex-shrink-0">
                        <div className="text-[3.5rem] font-display font-bold leading-none" style={{ color: catColors[cat] }}>{bmi}</div>
                        <div className="text-[13px] text-[#6b7280] mt-0.5">kg/m²</div>
                        <div className="text-[14px] font-semibold mt-2 px-4 py-1.5 rounded-full inline-block text-white" style={{ backgroundColor: catColors[cat] }}>{catLabels[cat]}</div>
                      </div>
                      <div className="flex-1 min-w-0 text-[14px]">
                        {[
                          ['Healthy weight range', healthyRange()],
                          ['Weight to gain/lose', weightDiff()],
                          ['BMI Prime', bmiPrime?.toString() ?? '—'],
                          ['Ponderal Index', ponderal ? `${ponderal} kg/m³` : '—'],
                        ].map(([label, value], i) => (
                          <div key={i} className="flex justify-between py-2 border-b border-[#e5e7eb] last:border-0">
                            <span className="text-[#6b7280]">{label}</span><span className="font-semibold text-[#111827]">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Gauge */}
                    <div className="mb-4">
                      <div className="flex h-3.5 rounded-full overflow-hidden gap-0.5">
                        {([['severe', 1], ['moderate', 0.5], ['mild', 0.75], ['normal', 3.25], ['overweight', 2.5], ['obese1', 2.5], ['obese2', 2.5], ['obese3', 1]] as [BMICategory, number][]).map(([c, f]) => (
                          <div key={c} style={{ background: catColors[c], flex: f }} />
                        ))}
                      </div>
                      <div className="flex justify-between text-[10px] text-[#9ca3af] mt-1 px-0.5">
                        <span>16</span><span>17</span><span>18.5</span><span>25</span><span>30</span><span>35</span><span>40</span><span>40+</span>
                      </div>
                    </div>

                    {/* Extra metrics */}
                    <div className="grid grid-cols-3 gap-2.5 mb-4">
                      {[['BMI Prime', bmiPrime?.toString() ?? '—'], ['Ponderal Index', ponderal ? `${ponderal} kg/m³` : '—'], ['Healthy BMI', '18.5 – 24.9']].map(([l, v], i) => (
                        <div key={i} className="bg-[#f9fafb] border border-[#e5e7eb] rounded-lg p-3 text-center">
                          <div className="text-lg font-display font-semibold text-[#111827]">{v}</div>
                          <div className="text-[11px] text-[#6b7280] mt-0.5">{l}</div>
                        </div>
                      ))}
                    </div>

                    {/* Suggestion */}
                    <div className="bg-[#f0fdf4] border border-[#6ee7b7] rounded-lg p-4 text-[14px] text-[#374151] mb-4">
                      <strong className="text-[#0d7a59]">💡 Suggestion:</strong> {suggestion()}
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <button onClick={downloadPDF} className="py-2.5 bg-[#0d7a59] text-white rounded-lg text-[13px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#0a6349] transition-all">📥 Download PDF</button>
                      <button onClick={() => window.print()} className="py-2.5 border-[1.5px] border-[#e5e7eb] rounded-lg text-[13px] font-medium text-[#374151] flex items-center justify-center gap-1.5 hover:border-[#1a9e75] hover:text-[#1a9e75] hover:bg-[#e6f7f2] transition-all">🖨️ Print</button>
                      <button className="py-2.5 border-[1.5px] border-[#e5e7eb] rounded-lg text-[13px] font-medium text-[#374151] flex items-center justify-center gap-1.5 hover:border-[#1a9e75] hover:text-[#1a9e75] hover:bg-[#e6f7f2] transition-all">🔗 Share</button>
                      <button onClick={reset} className="py-2.5 border-[1.5px] border-[#e5e7eb] rounded-lg text-[13px] font-medium text-[#374151] flex items-center justify-center gap-1.5 hover:border-[#1a9e75] hover:text-[#1a9e75] hover:bg-[#e6f7f2] transition-all">↺ Recalculate</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Reviewed Bar */}
      <div className="bg-[#f0fdf4] border-y border-[#bbf7d0] py-3 text-center text-[13px] text-[#6b7280]">
        ✅ <strong className="text-[#0d7a59]">Medically Reviewed</strong> — Based on WHO & CDC guidelines. Last updated: January 2025
      </div>

      {/* Google Ad Slot 1 */}
      <div className="max-w-6xl mx-auto px-5 py-8">
        <div className="w-full h-[90px] lg:h-[120px] bg-[#f3f4f6] border-2 border-dashed border-[#d1d5db] rounded-xl flex flex-col items-center justify-center relative">
          <span className="text-[10px] font-bold uppercase tracking-[3px] text-[#9ca3af] mb-1">Advertisement</span>
          <span className="text-[#d1d5db] text-sm font-medium">Google Ad Placement</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white border-t border-[#e5e7eb]">
        <div className="max-w-6xl mx-auto px-5">

          {/* What is BMI */}
          <section className="py-12 border-b border-[#e5e7eb]">
            <div className="inline-block text-[11px] font-semibold uppercase tracking-wider text-[#1a9e75] bg-[#e6f7f2] px-2.5 py-1 rounded-full mb-3">Definition</div>
            <h2 className="text-[#111827] text-[clamp(1.4rem,3vw,1.9rem)] font-display font-semibold mb-4">What is BMI? — Body Mass Index Explained</h2>
            <p className="text-[#374151] text-[15px] leading-relaxed mb-4">Body Mass Index (BMI) is a numerical value calculated from your height and weight. BMI full form is Body Mass Index — first developed by Belgian mathematician Adolphe Quetelet in the 1830s. It is a quick, cost-free screening tool that classifies individuals as underweight, normal weight, overweight, or obese.</p>
            <div className="bg-[#f0f9ff] border-l-[3px] border-[#3b82f6] rounded-r-lg p-4 text-[14px] text-[#374151] mb-4">
              <strong>🏥 Clinical use:</strong> BMI is used as a screening tool, not a diagnostic measure. A high BMI may indicate increased risk of heart disease, type 2 diabetes, and certain cancers.
            </div>
            <h3 className="text-[#111827] text-base font-semibold mt-6 mb-2">BMI Formula — How to Calculate BMI</h3>
            <div className="bg-[#111827] text-white rounded-lg p-5 font-mono text-[15px] leading-loose">
              <span className="text-[#6ee7b7]">// Metric</span><br />
              BMI = <span className="text-[#93c5fd]">weight (kg)</span> ÷ <span className="text-[#93c5fd]">height (m)²</span><br /><br />
              <span className="text-[#6ee7b7]">// Imperial</span><br />
              BMI = <span className="text-[#93c5fd]">703</span> × <span className="text-[#93c5fd]">weight (lbs)</span> ÷ <span className="text-[#93c5fd]">height (inches)²</span><br /><br />
              <span className="text-[#6ee7b7]">// Example: 70kg, 1.75m tall</span><br />
              BMI = 70 ÷ (1.75)² = 70 ÷ 3.0625 = <span className="text-[#93c5fd]">22.9 → Normal</span>
            </div>
          </section>

          {/* BMI Chart */}
          <section className="py-12 border-b border-[#e5e7eb]">
            <div className="inline-block text-[11px] font-semibold uppercase tracking-wider text-[#1a9e75] bg-[#e6f7f2] px-2.5 py-1 rounded-full mb-3">WHO Classification</div>
            <h2 className="text-[#111827] text-[clamp(1.4rem,3vw,1.9rem)] font-display font-semibold mb-4">BMI Chart for Adults — Ranges & Categories</h2>
            {/* Visual bar */}
            <div className="flex h-12 rounded-xl overflow-hidden my-5 gap-px">
              {([['<16', 0.8, '#7c3aed'], ['16–17', 0.5, '#6366f1'], ['17–18.5', 0.75, '#60a5fa'], ['18.5–25', 3.25, '#10b981'], ['25–30', 2.5, '#f59e0b'], ['30–35', 2.5, '#f97316'], ['35–40', 2.5, '#ef4444'], ['40+', 1, '#b91c1c']] as const).map(([label, flex, color], i) => (
                <div key={i} className="flex items-end justify-center pb-2 text-[10px] text-white/90 font-semibold" style={{ flex: flex as number, background: color }}>{label}</div>
              ))}
            </div>
            <table className="w-full text-[14px] mt-4">
              <thead>
                <tr className="text-[12px] font-semibold uppercase tracking-wider text-[#6b7280] border-b-2 border-[#e5e7eb]">
                  <th className="py-2.5 text-left">Classification</th><th className="py-2.5 text-left">BMI Range</th><th className="py-2.5 text-left">Health Risk</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Severe Thinness', '< 16', 'Very High', '#7c3aed'],
                  ['Moderate Thinness', '16.0 – 16.9', 'High', '#6366f1'],
                  ['Mild Thinness', '17.0 – 18.4', 'Moderate', '#60a5fa'],
                  ['Normal Weight ✓', '18.5 – 24.9', 'Minimal', '#10b981', true],
                  ['Overweight', '25.0 – 29.9', 'Increased', '#f59e0b'],
                  ['Obese Class I', '30.0 – 34.9', 'High', '#f97316'],
                  ['Obese Class II', '35.0 – 39.9', 'Very High', '#ef4444'],
                  ['Obese Class III', '≥ 40.0', 'Extremely High', '#b91c1c'],
                ].map(([cat, range, risk, color, highlight], i) => (
                  <tr key={i} className={`border-b border-[#e5e7eb] last:border-0 ${highlight ? 'bg-[#f0fdf4]' : ''}`}>
                    <td className="py-2.5"><span className="inline-block w-2.5 h-2.5 rounded-full mr-2 align-middle" style={{ background: color as string }} />{highlight ? <strong>{cat}</strong> : cat}</td>
                    <td className="py-2.5">{highlight ? <strong>{range}</strong> : range}</td>
                    <td className="py-2.5">{highlight ? <strong>{risk}</strong> : risk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[13px] text-[#9ca3af] mt-2">Source: World Health Organization (WHO), 2000.</p>
          </section>

          {/* BMI by Age */}
          <section className="py-12 border-b border-[#e5e7eb]">
            <div className="inline-block text-[11px] font-semibold uppercase tracking-wider text-[#1a9e75] bg-[#e6f7f2] px-2.5 py-1 rounded-full mb-3">Age-Based Guidance</div>
            <h2 className="text-[#111827] text-[clamp(1.4rem,3vw,1.9rem)] font-display font-semibold mb-4">Healthy BMI Range by Age</h2>
            <p className="text-[#374151] text-[15px] mb-4">Research suggests that the relationship between BMI and health risk shifts slightly with age. Older adults with a slightly higher BMI may have better outcomes.</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
              {[{ a: 'Ages 20–35', r: '19 – 24.9', n: 'Standard WHO range' }, { a: 'Ages 36–50', r: '19 – 25.9', n: 'Slightly broader' }, { a: 'Ages 51–65', r: '21 – 26.9', n: 'Higher BMI may be protective' }, { a: 'Ages 65+', r: '22 – 27.9', n: 'Underweight is riskier' }].map((item, i) => (
                <div key={i} className="bg-[#f9fafb] border border-[#e5e7eb] rounded-lg p-3.5 text-center">
                  <div className="text-[12px] text-[#6b7280] mb-1.5">{item.a}</div>
                  <div className="text-base font-display font-semibold text-[#111827]">{item.r}</div>
                  <div className="text-[11px] text-[#9ca3af] mt-1">{item.n}</div>
                </div>
              ))}
            </div>
            <div className="bg-[#fffbeb] border-l-[3px] border-[#f59e0b] rounded-r-lg p-4 text-[14px] text-[#374151] mt-4">
              <strong>⚠️ Note:</strong> These are general guidelines. Always consult your physician for personalised advice.
            </div>
          </section>

          {/* Gender */}
          <section className="py-12 border-b border-[#e5e7eb]">
            <div className="inline-block text-[11px] font-semibold uppercase tracking-wider text-[#1a9e75] bg-[#e6f7f2] px-2.5 py-1 rounded-full mb-3">Gender Differences</div>
            <h2 className="text-[#111827] text-[clamp(1.4rem,3vw,1.9rem)] font-display font-semibold mb-4">BMI Calculator for Women vs Men</h2>
            <p className="text-[#374151] text-[15px] mb-4">The BMI formula is identical for men and women, but biological differences in body composition mean two people with the same BMI can have very different health profiles.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
              <div className="rounded-lg p-5 border border-[#e5e7eb]" style={{ background: 'linear-gradient(135deg,#eff6ff,#dbeafe)' }}>
                <div className="text-2xl mb-2.5">♂</div>
                <div className="font-semibold text-base mb-2">BMI in Men</div>
                <ul className="text-[13px] text-[#374151] space-y-1.5">{['Healthy BMI: 18.5–24.9', 'Higher muscle-to-fat ratio', 'Visceral fat accumulates faster with age', 'Waist >40 inches = increased risk'].map((t, i) => (<li key={i} className="flex gap-2"><span className="text-[#6b7280]">→</span>{t}</li>))}</ul>
              </div>
              <div className="rounded-lg p-5 border border-[#e5e7eb]" style={{ background: 'linear-gradient(135deg,#fff0f3,#fce7f3)' }}>
                <div className="text-2xl mb-2.5">♀</div>
                <div className="font-semibold text-base mb-2">BMI in Women</div>
                <ul className="text-[13px] text-[#374151] space-y-1.5">{['Normal BMI range: 18.5–24.9', '6–11% more body fat at same BMI', 'Hormonal changes affect fat distribution', 'Waist >35 inches = increased risk'].map((t, i) => (<li key={i} className="flex gap-2"><span className="text-[#6b7280]">→</span>{t}</li>))}</ul>
              </div>
            </div>
          </section>

          {/* Asian BMI */}
          <section className="py-12 border-b border-[#e5e7eb]">
            <div className="inline-block text-[11px] font-semibold uppercase tracking-wider text-[#1a9e75] bg-[#e6f7f2] px-2.5 py-1 rounded-full mb-3">Asian & South Asian Standards</div>
            <h2 className="text-[#111827] text-[clamp(1.4rem,3vw,1.9rem)] font-display font-semibold mb-4">BMI Calculator Pakistan — Asian BMI Standards</h2>
            <p className="text-[#374151] text-[15px] mb-4">Standard WHO BMI thresholds were developed from Western populations. Research found that Asian populations face higher health risks at lower BMI values.</p>
            <div className="bg-[#fdf4ff] border-l-[3px] border-[#a855f7] rounded-r-lg p-4 text-[14px] text-[#374151] mb-4">
              <strong>🔬 Scientific basis:</strong> At the same BMI, Asian individuals tend to have higher body fat percentages and more visceral fat compared to White Europeans.
            </div>
            <table className="w-full text-[14px] mt-4">
              <thead><tr className="text-[12px] font-semibold uppercase tracking-wider text-[#6b7280] border-b-2 border-[#e5e7eb]"><th className="py-2.5 text-left">Classification</th><th className="py-2.5 text-left">Standard WHO</th><th className="py-2.5 text-left">Asian Recommended</th></tr></thead>
              <tbody>
                {[['Underweight', '< 18.5', '< 18.5'], ['Normal Weight ✓', '18.5 – 24.9', '18.5 – 22.9', true], ['Overweight / At Risk', '25.0 – 29.9', '23.0 – 27.4'], ['Obese', '≥ 30.0', '≥ 27.5']].map(([cat, who, asian, hl], i) => (
                  <tr key={i} className={`border-b border-[#e5e7eb] last:border-0 ${hl ? 'bg-[#f0fdf4]' : ''}`}>
                    <td className="py-2.5">{hl ? <strong>{cat}</strong> : cat}</td><td className="py-2.5">{hl ? <strong>{who}</strong> : who}</td><td className="py-2.5">{hl ? <strong>{asian}</strong> : asian}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Children BMI */}
          <section className="py-12 border-b border-[#e5e7eb]">
            <div className="inline-block text-[11px] font-semibold uppercase tracking-wider text-[#1a9e75] bg-[#e6f7f2] px-2.5 py-1 rounded-full mb-3">Children & Teens</div>
            <h2 className="text-[#111827] text-[clamp(1.4rem,3vw,1.9rem)] font-display font-semibold mb-4">BMI for Kids — Child BMI Calculator Ages 2–20</h2>
            <p className="text-[#374151] text-[15px] mb-4">Children's BMI is plotted against age-and-sex-specific growth charts to determine a percentile ranking, unlike the fixed adult categories.</p>
            <table className="w-full text-[14px] mt-4">
              <thead><tr className="text-[12px] font-semibold uppercase tracking-wider text-[#6b7280] border-b-2 border-[#e5e7eb]"><th className="py-2.5 text-left">Category</th><th className="py-2.5 text-left">Percentile Range</th><th className="py-2.5 text-left">What it means</th></tr></thead>
              <tbody>
                {[
                  ['Underweight', 'Below 5th', 'Lower weight than 95% of peers', '#60a5fa'],
                  ['Healthy Weight ✓', '5th – 84th', 'Weight in healthy range', '#10b981', true],
                  ['Overweight', '85th – 94th', 'Higher than 85% of peers', '#f59e0b'],
                  ['Obese', '95th and above', 'Medical evaluation needed', '#ef4444'],
                ].map(([cat, pct, meaning, color, hl], i) => (
                  <tr key={i} className={`border-b border-[#e5e7eb] last:border-0 ${hl ? 'bg-[#f0fdf4]' : ''}`}>
                    <td className="py-2.5"><span className="inline-block w-2.5 h-2.5 rounded-full mr-2 align-middle" style={{ background: color as string }} />{hl ? <strong>{cat}</strong> : cat}</td>
                    <td className="py-2.5">{pct}</td><td className="py-2.5">{meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="bg-[#f0f9ff] border-l-[3px] border-[#3b82f6] rounded-r-lg p-4 text-[14px] text-[#374151] mt-4">
              <strong>👨‍⚕️ Important:</strong> Always use a Children's BMI Calculator for ages 2–20. Adult BMI calculators should not be used for children.
            </div>
          </section>

          {/* Limitations */}
          <section className="py-12 border-b border-[#e5e7eb]">
            <div className="inline-block text-[11px] font-semibold uppercase tracking-wider text-[#1a9e75] bg-[#e6f7f2] px-2.5 py-1 rounded-full mb-3">Limitations</div>
            <h2 className="text-[#111827] text-[clamp(1.4rem,3vw,1.9rem)] font-display font-semibold mb-4">Limitations of BMI — What It Doesn't Tell You</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-4">
              {[
                ['💪', 'Muscle vs Fat', 'Athletes and bodybuilders often have a high BMI despite very low body fat.'],
                ['👴', 'Age & Bone Density', 'Older adults may show a "normal" BMI despite having high body fat and low muscle.'],
                ['🌍', 'Ethnicity', 'Standard thresholds were developed on European populations. Asian groups have different patterns.'],
                ['🤰', 'Pregnancy', 'BMI is not accurate during pregnancy. Use our Pregnancy Weight Gain Calculator instead.'],
                ['📏', 'Fat Distribution', 'Abdominal (visceral) fat carries much higher health risk than subcutaneous fat.'],
                ['👧', 'Children & Teens', 'Standard adult categories do not apply. Use age- and sex-specific growth charts.'],
              ].map(([icon, title, desc], i) => (
                <div key={i} className="bg-[#fff8f1] border border-[#fed7aa] rounded-lg p-4">
                  <div className="text-xl mb-2">{icon}</div>
                  <div className="text-[13px] font-semibold text-[#111827] mb-1">{title}</div>
                  <div className="text-[12px] text-[#6b7280] leading-relaxed">{desc}</div>
                </div>
              ))}
            </div>
            <div className="bg-[#fffbeb] border-l-[3px] border-[#f59e0b] rounded-r-lg p-4 text-[14px] text-[#374151] mt-4">
              <strong>💡 Better together:</strong> Combine BMI with waist circumference, waist-to-hip ratio, and body fat percentage for a complete picture.
            </div>
          </section>

          {/* Google Ad Slot 2 */}
          <div className="py-6">
            <div className="w-full h-[250px] lg:h-[280px] bg-[#f3f4f6] border-2 border-dashed border-[#d1d5db] rounded-xl flex flex-col items-center justify-center">
              <span className="text-[10px] font-bold uppercase tracking-[3px] text-[#9ca3af] mb-1">Advertisement</span>
              <span className="text-[#d1d5db] text-sm font-medium">Google Ad Placement</span>
            </div>
          </div>

          {/* Smart Scales Product Grid */}
          <section className="py-12 border-b border-[#e5e7eb]">
            <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
              <div>
                <div className="inline-block text-[11px] font-semibold uppercase tracking-wider text-[#1a9e75] bg-[#e6f7f2] px-2.5 py-1 rounded-full mb-2">Recommended Tools</div>
                <h2 className="text-[#111827] text-[clamp(1.4rem,3vw,1.9rem)] font-display font-semibold mb-1">Best Smart Scales to Track Your BMI at Home</h2>
                <p className="text-[14px] text-[#6b7280]">Automatically measure BMI, body fat, muscle mass and 13+ metrics.</p>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-[#FF9900] text-white text-[11px] font-bold px-3 py-1.5 rounded-md">🛒 Available on Amazon</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { tag: "Amazon's Choice", tagBg: '#FF9900', name: 'Etekcity Smart Scale — WiFi, 14 Body Metrics', features: ['14 metrics: BMI, body fat, muscle mass', 'Wi-Fi + Bluetooth, Alexa compatible', 'Apple Health, Google Fit sync'], price: '$79.99', was: '$99.99', save: '20%', rating: '4.6/5 · 22,000+ reviews' },
                { tag: '🏆 Best Value', tagBg: '#10b981', name: 'RENPHO Bluetooth Body Fat Scale — 13 Metrics', features: ['13 metrics including BMI & body fat', 'Bluetooth app sync — iOS & Android', '89,000+ verified Amazon reviews'], price: '$25.99', was: '$35.99', save: '28%', rating: '4.6/5 · 89,000+ reviews' },
                { tag: '💰 Budget Pick', tagBg: '#3b82f6', name: 'FITINDEX Smart Scale — 400 lbs, 13 Metrics', features: ['13 body composition metrics', '400 lb capacity, baby weighing mode', 'Best price-to-feature ratio'], price: '$19.98', was: '$32.99', save: '39%', rating: '4.5/5 · 41,000+ reviews' },
                { tag: '🔥 Premium Pick', tagBg: '#7c3aed', name: 'Withings Body Scan — WiFi, Segmental Analysis', features: ['Full body segmental composition', 'Built-in retractable handle', 'FDA-cleared, 8 electrodes'], price: '$199.95', was: '$249.95', save: '20%', rating: '4.4/5 · 8,500+ reviews' },
                { tag: '📱 App Rated', tagBg: '#ec4899', name: 'YUNMAI Smart Scale Pro — 14 Metrics, ITO Coating', features: ['ITO-coated glass for higher accuracy', 'Apple Health & Google Fit integration', 'Multi-user support (up to 16)'], price: '$39.99', was: '$59.99', save: '33%', rating: '4.5/5 · 15,000+ reviews' },
                { tag: '⚡ Fast Shipping', tagBg: '#0ea5e9', name: 'GreaterGoods Smart Body Fat Scale — BMI + 10 Metrics', features: ['10 body composition metrics', 'Auto-calibration, 400 lb capacity', 'Set of 3 AAA batteries included'], price: '$24.95', was: '$39.95', save: '38%', rating: '4.5/5 · 12,800+ reviews' },
              ].map((p, i) => (
                <div key={i} className="bg-white border-[1.5px] border-[#e5e7eb] rounded-lg overflow-hidden hover:shadow-[0_8px_32px_rgba(0,0,0,.11)] hover:-translate-y-0.5 transition-all flex flex-col">
                  <div className="relative">
                    <div className="text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded inline-block absolute top-3 left-3 z-10" style={{ background: p.tagBg }}>{p.tag}</div>
                    <div className="flex flex-col items-center justify-end pb-3 pt-12 px-4" style={{ background: i === 0 ? 'linear-gradient(135deg, #ecfdf5, #d1fae5)' : i === 1 ? 'linear-gradient(135deg, #eef2ff, #e0e7ff)' : i === 2 ? 'linear-gradient(135deg, #eff6ff, #dbeafe)' : i === 3 ? 'linear-gradient(135deg, #f5f3ff, #ede9fe)' : i === 4 ? 'linear-gradient(135deg, #fdf2f8, #fce7f3)' : 'linear-gradient(135deg, #ecfeff, #cffafe)' }}>
                      {i === 0 && (
                        <svg viewBox="0 0 120 50" className="w-[68%] h-auto mb-2">
                          <rect x="5" y="5" width="110" height="40" rx="20" fill="white" stroke="#0d9488" strokeWidth="1.5"/>
                          <circle cx="60" cy="25" r="13" fill="#f0fdfa" stroke="#0d9488" strokeWidth="1"/>
                          <path d="M52 25 A8 8 0 1 1 68 25" fill="none" stroke="#5eead4" strokeWidth="2" strokeLinecap="round"/>
                          <line x1="60" y1="25" x2="64" y2="18" stroke="#0d9488" strokeWidth="1.5" strokeLinecap="round"/>
                          <circle cx="60" cy="25" r="2" fill="#0d9488"/>
                          <circle cx="22" cy="25" r="2" fill="#99f6e4"/><circle cx="98" cy="25" r="2" fill="#99f6e4"/>
                        </svg>
                      )}
                      {i === 1 && (
                        <svg viewBox="0 0 80 80" className="w-[46%] h-auto mb-2">
                          <rect x="5" y="5" width="70" height="70" rx="10" fill="white" stroke="#4f46e5" strokeWidth="1.5"/>
                          <rect x="20" y="15" width="40" height="16" rx="3" fill="#eef2ff" stroke="#4f46e5" strokeWidth="1"/>
                          <text x="40" y="27" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#4f46e5" fontFamily="sans-serif">25.4</text>
                          <circle cx="20" cy="57" r="6" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="1"/><circle cx="40" cy="57" r="6" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="1"/><circle cx="60" cy="57" r="6" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="1"/>
                        </svg>
                      )}
                      {i === 2 && (
                        <svg viewBox="0 0 80 80" className="w-[46%] h-auto mb-2">
                          <rect x="5" y="5" width="70" height="70" rx="5" fill="white" stroke="#3b82f6" strokeWidth="1.5"/>
                          <rect x="28" y="12" width="24" height="12" rx="2" fill="#dbeafe" stroke="#3b82f6" strokeWidth="0.8"/>
                          <text x="40" y="21" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#3b82f6" fontFamily="sans-serif">0.0</text>
                          <line x1="15" y1="40" x2="65" y2="40" stroke="#bfdbfe" strokeWidth="0.5"/><line x1="40" y1="30" x2="40" y2="65" stroke="#bfdbfe" strokeWidth="0.5"/>
                        </svg>
                      )}
                      {i === 3 && (
                        <svg viewBox="0 0 80 80" className="w-[46%] h-auto mb-2">
                          <rect x="5" y="5" width="70" height="70" rx="10" fill="white" stroke="#7c3aed" strokeWidth="1.5"/>
                          <rect x="15" y="12" width="50" height="16" rx="3" fill="#f5f3ff" stroke="#7c3aed" strokeWidth="0.8"/>
                          <text x="40" y="23" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#7c3aed" fontFamily="sans-serif">BODY SCAN</text>
                          <rect x="22" y="40" width="36" height="5" rx="2.5" fill="#ede9fe" stroke="#7c3aed" strokeWidth="0.5"/>
                          <line x1="10" y1="50" x2="70" y2="50" stroke="#7c3aed" strokeWidth="0.8" strokeDasharray="2 2"/>
                          <circle cx="25" cy="60" r="3" fill="#c4b5fd"/><circle cx="40" cy="60" r="3" fill="#c4b5fd"/><circle cx="55" cy="60" r="3" fill="#c4b5fd"/>
                        </svg>
                      )}
                      {i === 4 && (
                        <svg viewBox="0 0 80 80" className="w-[46%] h-auto mb-2">
                          <rect x="5" y="5" width="70" height="70" rx="10" fill="white" stroke="#db2777" strokeWidth="1.5"/>
                          <rect x="25" y="18" width="30" height="18" rx="3" fill="#fce7f3" stroke="#db2777" strokeWidth="1"/>
                          <circle cx="40" cy="27" r="6" fill="none" stroke="#db2777" strokeWidth="0.8"/>
                          <line x1="40" y1="27" x2="43" y2="23" stroke="#db2777" strokeWidth="1" strokeLinecap="round"/>
                          <text x="40" y="55" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#db2777" fontFamily="sans-serif">ITO</text>
                          <rect x="30" y="60" width="20" height="3" rx="1.5" fill="#fbcfe8"/>
                        </svg>
                      )}
                      {i === 5 && (
                        <svg viewBox="0 0 80 80" className="w-[46%] h-auto mb-2">
                          <rect x="5" y="5" width="70" height="70" rx="10" fill="white" stroke="#0891b2" strokeWidth="1.5"/>
                          <rect x="28" y="14" width="24" height="14" rx="7" fill="#ecfeff" stroke="#0891b2" strokeWidth="1"/>
                          <text x="40" y="24" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#0891b2" fontFamily="sans-serif">BMI</text>
                          <circle cx="25" cy="50" r="4" fill="#cffafe" stroke="#0891b2" strokeWidth="0.5"/><circle cx="40" cy="50" r="4" fill="#cffafe" stroke="#0891b2" strokeWidth="0.5"/><circle cx="55" cy="50" r="4" fill="#cffafe" stroke="#0891b2" strokeWidth="0.5"/>
                          <text x="40" y="65" textAnchor="middle" fontSize="5" fill="#0891b2" fontFamily="sans-serif">400 lbs</text>
                        </svg>
                      )}
                      <span className="text-[10px] font-semibold tracking-wider" style={{ color: i === 0 ? '#0d9488' : i === 1 ? '#4f46e5' : i === 2 ? '#3b82f6' : i === 3 ? '#7c3aed' : i === 4 ? '#db2777' : '#0891b2' }}>{i === 0 ? 'ETEKCity' : i === 1 ? 'RENPHO' : i === 2 ? 'FITINDEX' : i === 3 ? 'WITHINGS' : i === 4 ? 'YUNMAI' : 'GreaterGoods'}</span>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="text-[13px] font-semibold text-[#111827] mb-2 leading-snug">{p.name}</div>
                    <ul className="mb-3">{p.features.map((f, j) => (<li key={j} className="text-[11px] text-[#6b7280] py-0.5 flex gap-1.5"><span className="text-[#1a9e75] font-bold">✓</span>{f}</li>))}</ul>
                    <div className="mt-auto pt-2.5 border-t border-[#e5e7eb]">
                      <div className="flex items-baseline gap-2 flex-wrap mb-2">
                        <span className="text-xl font-display font-bold text-[#111827]">{p.price}</span>
                        <span className="text-[12px] text-[#9ca3af] line-through">{p.was}</span>
                        <span className="bg-[#ef4444] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">Save {p.save}</span>
                      </div>
                      <div className="text-[12px] text-[#6b7280] mb-2.5"><span className="text-[#f59e0b]">★★★★★</span> {p.rating}</div>
                      <a href="#" className="block w-full py-2.5 bg-[#FF9900] text-white rounded-lg text-[13px] font-bold text-center hover:bg-[#e08600] transition-all">View on Amazon →</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-[11px] text-[#9ca3af] mt-5">We may earn a commission from Amazon purchases at no extra cost to you.</p>
          </section>

          {/* How to Improve BMI + Program Comparison */}
          <section className="py-12 border-b border-[#e5e7eb]">
            <div className="inline-block text-[11px] font-semibold uppercase tracking-wider text-[#1a9e75] bg-[#e6f7f2] px-2.5 py-1 rounded-full mb-3">Take Action</div>
            <h2 className="text-[#111827] text-[clamp(1.4rem,3vw,1.9rem)] font-display font-semibold mb-4">How to Reach a Healthy BMI — Ideal BMI Guide</h2>
            {/* Program Compare */}
            <div className="bg-[#f8faff] border-[1.5px] border-[#dbeafe] rounded-lg p-6 my-6">
              <div className="inline-flex items-center gap-1.5 bg-[#dbeafe] text-[#1e40af] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-2.5">📋 Editor's Comparison — 2025</div>
              <h3 className="text-base font-display font-semibold mb-1">Top Weight Management Programs</h3>
              <p className="text-[13px] text-[#6b7280] mb-4">Ranked by clinical evidence and user success rates.</p>
              <div className="overflow-x-auto">
                <table className="w-full text-[13px] min-w-[480px]">
                  <thead><tr className="text-white text-[11px] font-semibold uppercase tracking-wider"><th className="py-2.5 px-3.5 bg-[#111827] rounded-tl-lg text-left">Program</th><th className="py-2.5 px-3.5 bg-[#111827] text-left">Best For</th><th className="py-2.5 px-3.5 bg-[#111827] text-left">Why It Works</th><th className="py-2.5 px-3.5 bg-[#111827] rounded-tr-lg text-center">Get Started</th></tr></thead>
                  <tbody>
                    {[
                      ['Noom', 'BMI 25–35', 'Psychology-based coaching. 78% lose weight in 4 months.', true],
                      ['WeightWatchers', 'Any BMI', 'Points system. 65+ years of clinical evidence.', false],
                      ['BetterMe', 'BMI 25–35', 'Workout + meal plan combo. Zero equipment needed.', false],
                      ['Lifesum', 'Any BMI', 'Daily calorie tracking with 1,000+ recipes.', false],
                      ['Simple', 'BMI 25–30', 'AI intermittent fasting guide.', false],
                    ].map(([name, best, why, top], i) => (
                      <tr key={i} className={`border-b border-[#e5e7eb] last:border-0 hover:bg-[#f0f9ff] ${top ? 'bg-[#f0fdf4]' : ''}`}>
                        <td className="py-3 px-3.5">{top && <span className="inline-block bg-[#1a9e75] text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded mb-1">🏆 #1 Pick</span>}<div className="font-bold">{name}</div><span className="text-[#f59e0b] text-[12px]">★★★★★</span></td>
                        <td className="py-3 px-3.5 text-[12px] text-[#6b7280]">{best}</td>
                        <td className="py-3 px-3.5 text-[12px] text-[#6b7280]">{why}</td>
                        <td className="py-3 px-3.5 text-center"><a href="#" className={`inline-block px-4 py-1.5 rounded-md text-[12px] font-bold ${top ? 'bg-[#1a9e75] text-white' : 'bg-transparent border-[1.5px] border-[#1a9e75] text-[#1a9e75]'}`}>{top ? 'Free Quiz →' : 'Try Now →'}</a></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-[#9ca3af] mt-3 text-center">Affiliate links — commission earned at no cost to you.</p>
            </div>
            {/* Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ['1', 'Calculate your TDEE', 'Find your Total Daily Energy Expenditure. Use our TDEE Calculator.'],
                ['2', 'Create a calorie target', 'For fat loss: eat 300–500 kcal below TDEE. For gain: 250–400 above.'],
                ['3', 'Optimise protein intake', 'Eat 1.6–2.2g protein per kg bodyweight to preserve muscle.'],
                ['4', 'Exercise regularly', '150+ minutes of moderate cardio/week plus 2–3 strength sessions.'],
                ['5', 'Sleep 7–9 hours', 'Poor sleep increases cortisol and hunger hormones significantly.'],
                ['6', 'Track & adjust monthly', 'Consistent tracking is the #1 predictor of long-term success.'],
              ].map(([n, t, d], i) => (
                <div key={i} className="flex gap-3.5 bg-[#f9fafb] rounded-lg p-4">
                  <div className="w-7 h-7 rounded-full bg-[#1a9e75] text-white text-[13px] font-semibold flex items-center justify-center flex-shrink-0">{n}</div>
                  <div><h4 className="text-[14px] font-semibold text-[#111827] mb-1">{t}</h4><p className="text-[13px] text-[#6b7280] leading-relaxed">{d}</p></div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="py-12 border-b border-[#e5e7eb]">
            <div className="inline-block text-[11px] font-semibold uppercase tracking-wider text-[#1a9e75] bg-[#e6f7f2] px-2.5 py-1 rounded-full mb-3">Common Questions</div>
            <h2 className="text-[#111827] text-[clamp(1.4rem,3vw,1.9rem)] font-display font-semibold mb-4">Frequently Asked Questions about BMI</h2>
            <div className="flex flex-col gap-1 mt-4">
              {[
                ['What is a healthy BMI?', 'A healthy BMI for adults is between 18.5 and 24.9 according to the WHO. Below 18.5 is underweight, 25–29.9 is overweight, and 30+ is obese. Asian populations may have a lower upper limit of 22.9.'],
                ['Is BMI different for men and women?', 'The formula is the same, but women naturally carry 6–11% more body fat at the same BMI. Interpretation should consider these biological differences.'],
                ['What is a good BMI for a 50-year-old woman?', 'The standard range (18.5–24.9) applies, but research suggests post-menopausal women in the 21–26 range may have the best outcomes.'],
                ['What BMI is considered obese?', 'A BMI of 30 or above. Class I: 30–34.9, Class II: 35–39.9, Class III: 40+. Each carries progressively higher health risks.'],
                ['Can you have a normal BMI but still be unhealthy?', 'Yes — called "normal weight obesity" or "skinny fat." A normal BMI with high visceral fat and poor metabolic health is still risky.'],
                ['How accurate is BMI?', 'BMI is a useful screening tool but not diagnostic. It\'s less accurate for athletes, elderly, and different ethnic groups. Use alongside other indicators.'],
                ['What is the BMI formula?', 'Metric: BMI = weight(kg) ÷ height(m)². Imperial: BMI = 703 × weight(lbs) ÷ height(in)². Example: 70kg at 170cm = 24.2 (Normal).'],
                ['What is BMI Prime?', 'Your BMI divided by 25 (upper normal limit). Less than 1.00 = normal/underweight, greater = overweight. Quick distance-from-boundary measure.'],
                ['How do I lower my BMI?', 'Create a 300–500 kcal/day deficit, eat 1.6–2g protein/kg, exercise 150+ min/week, add strength training, and sleep 7–9 hours.'],
                ['What is the ideal weight according to height?', 'Multiply height(m)² by 18.5 (lower) and 24.9 (upper). At 165cm: 50.4–67.8 kg.'],
                ['BMI formula for women in Pakistan?', 'Same formula globally, but South Asian women should use Asian thresholds (normal: 18.5–22.9 instead of 24.9). Average height: ~158cm.'],
                ['How to use BMI calculator in kg and feet?', 'Switch to Imperial tab for feet/inches input, or Metric tab for kg/cm. The calculator handles all conversions automatically.'],
              ].map(([q, a], i) => (
                <div key={i} className="border border-[#e5e7eb] rounded-lg overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full px-4.5 py-4 bg-white text-left text-[15px] font-medium text-[#111827] flex justify-between items-center gap-3 hover:bg-[#f9fafb] transition-all">
                    <span>{q}</span>
                    <span className={`text-lg text-[#6b7280] transition-transform flex-shrink-0 ${openFaq === i ? 'rotate-45 text-[#1a9e75]' : ''}`}>+</span>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <div className="px-4.5 pb-4 text-[14px] text-[#374151] leading-relaxed">{a}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </section>

          {/* Google Ad Slot 3 */}
          <div className="py-6">
            <div className="w-full h-[90px] lg:h-[120px] bg-[#f3f4f6] border-2 border-dashed border-[#d1d5db] rounded-xl flex flex-col items-center justify-center">
              <span className="text-[10px] font-bold uppercase tracking-[3px] text-[#9ca3af] mb-1">Advertisement</span>
              <span className="text-[#d1d5db] text-sm font-medium">Google Ad Placement</span>
            </div>
          </div>

          {/* Bottom CTA */}
          <section className="py-12">
            <div className="rounded-lg p-10 text-center relative overflow-hidden" style={{ background: 'linear-gradient(120deg, #0d7a59, #1a9e75, #059669)' }}>
              <div className="text-[22px] text-[#fbbf24] tracking-widest mb-3">★★★★★</div>
              <h3 className="text-white text-[clamp(1.4rem,3vw,1.9rem)] font-display font-semibold mb-2.5">Know your number. Now take action.</h3>
              <p className="text-white/80 text-[14px] max-w-[460px] mx-auto mb-6">Over 4 million people use HealthCalcsPro monthly. Get a personalised weight plan — free to start.</p>
              <div className="flex gap-3 justify-center flex-wrap">
                <a href="#" className="px-7 py-3 bg-white text-[#0d7a59] rounded-lg text-[15px] font-extrabold hover:bg-[#f0fdf4] hover:-translate-y-0.5 transition-all inline-block">Take Free Weight Loss Quiz →</a>
                <a href="/calorie-calculator" className="px-7 py-3 bg-transparent border-2 border-white/45 text-white rounded-lg text-[15px] font-semibold hover:border-white hover:bg-white/10 transition-all inline-block">Use Calorie Calculator</a>
              </div>
              <p className="text-white/40 text-[11px] mt-3.5">Sponsored link · Free to try · No credit card needed</p>
            </div>
          </section>

          {/* Related Calculators */}
          <section className="py-12">
            <div className="inline-block text-[11px] font-semibold uppercase tracking-wider text-[#1a9e75] bg-[#e6f7f2] px-2.5 py-1 rounded-full mb-3">Next Steps</div>
            <h2 className="text-[#111827] text-[clamp(1.4rem,3vw,1.9rem)] font-display font-semibold mb-4">Related Health Calculators</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
              {[
                ['🍎', 'Calorie Calculator', '/calorie'], ['⚡', 'TDEE Calculator', '/tdee'],
                ['📏', 'Body Fat Calculator', '/body-fat'], ['🎯', 'Ideal Weight Calculator', '/ideal-weight'],
                ['🧬', 'BMR Calculator', '/bmr'], ['🥩', 'Protein Calculator', '/protein'],
                ['💧', 'Water Intake Calculator', '/water'], ['😴', 'Sleep Calculator', '/sleep'],
              ].map(([icon, name, href], i) => (
                <a key={i} href={href} className="bg-white border border-[#e5e7eb] rounded-lg p-4 text-center hover:border-[#1a9e75] hover:bg-[#e6f7f2] hover:-translate-y-0.5 hover:shadow-[0_2px_16px_rgba(0,0,0,.06)] transition-all">
                  <div className="text-2xl mb-2">{icon}</div>
                  <div className="text-[13px] font-medium text-[#111827]">{name}</div>
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
