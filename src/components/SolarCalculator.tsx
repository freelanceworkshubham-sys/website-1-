import React, { useState, useMemo } from 'react';
import {
  Home,
  Building2,
  Factory,
  Zap,
  ArrowLeft,
  Minus,
  Plus,
  Delete,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from 'lucide-react';
import { CountUpNumber } from './CountUpNumber';

interface SolarCalculatorProps {
  onScheduleAudit: (estimateDetails: any) => void;
}

type CustomerType = 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL';

interface OptionalDetails {
  roofArea: string;
  consumerNumber: string;
}

/** Format currency with Indian grouping */
const formatINR = (val: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);
};

/** Format plain number with Indian comma convention */
const formatIndianNumber = (val: number): string => {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(val);
};

/* ─── Solar Ring SVG Component ───────────────────────────────────────── */
const SolarRing: React.FC<{ percent: number; capacityKw: number; tier: string }> = ({
  percent,
  capacityKw,
  tier,
}) => {
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (circumference * Math.min(percent, 100)) / 100;

  // tier-based accent color
  const ringColor =
    tier === 'HIGH' ? '#D97706' : tier === 'MEDIUM' ? '#F59E0B' : '#10B981';

  return (
    <div className="relative flex items-center justify-center">
      <svg width="180" height="180" viewBox="0 0 180 180" className="transform -rotate-90">
        {/* Track */}
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="#1E293B"
          strokeWidth="10"
          opacity="0.08"
        />
        {/* Active ring */}
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeOffset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {/* Center readout */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl sm:text-4xl font-extrabold font-telemetry text-slate-900 leading-none tracking-tight">
          {capacityKw}
        </span>
        <span className="text-sm font-bold text-amber-600 tracking-wide mt-0.5">
          kW
        </span>
        <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mt-1">
          Est. Capacity
        </span>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════ */
export const SolarCalculator: React.FC<SolarCalculatorProps> = ({ onScheduleAudit }) => {
  const [screenState, setScreenState] = useState<'INPUT' | 'CALCULATING' | 'RESULT'>('INPUT');
  const [calcStepIndex, setCalcStepIndex] = useState<number>(0);
  const [customerType, setCustomerType] = useState<CustomerType>('RESIDENTIAL');
  const [monthlyBill, setMonthlyBill] = useState<number>(6000);
  const [billString, setBillString] = useState<string>('6000');
  const [showOptional, setShowOptional] = useState<boolean>(false);
  const [optionalDetails, setOptionalDetails] = useState<OptionalDetails>({
    roofArea: '',
    consumerNumber: '',
  });

  /* ── Config per customer type ─────────────────────────────────────── */
  const config = useMemo(() => {
    switch (customerType) {
      case 'RESIDENTIAL':
        return {
          min: 1000, max: 50000, step: 500, defaultBill: 6000,
          presets: [2500, 5000, 7500, 10000, 15000],
          tariff: 8.2, minKw: 1, costPerKw: 55000,
          meterTiers: { low: 3, medium: 6, max: 12 },
        };
      case 'COMMERCIAL':
        return {
          min: 10000, max: 500000, step: 5000, defaultBill: 45000,
          presets: [20000, 45000, 80000, 150000, 300000],
          tariff: 11.5, minKw: 5, costPerKw: 46000,
          meterTiers: { low: 25, medium: 60, max: 120 },
        };
      case 'INDUSTRIAL':
        return {
          min: 50000, max: 5000000, step: 25000, defaultBill: 350000,
          presets: [150000, 350000, 800000, 1500000, 3000000],
          tariff: 8.8, minKw: 50, costPerKw: 39000,
          meterTiers: { low: 200, medium: 500, max: 1000 },
        };
    }
  }, [customerType]);

  /* ── Handlers ─────────────────────────────────────────────────────── */
  const handleTypeChange = (type: CustomerType) => {
    setCustomerType(type);
    let d = 6000;
    if (type === 'COMMERCIAL') d = 45000;
    if (type === 'INDUSTRIAL') d = 350000;
    setMonthlyBill(d);
    setBillString(d.toString());
  };

  const handleKeypadPress = (key: string) => {
    if (key === 'C') { setBillString('0'); setMonthlyBill(0); return; }
    if (key === 'BACK') {
      const u = billString.length > 1 ? billString.slice(0, -1) : '0';
      setBillString(u); setMonthlyBill(parseInt(u, 10) || 0); return;
    }
    let u = billString === '0' ? key : billString + key;
    if (u.length > 7) return;
    const n = parseInt(u, 10) || 0;
    if (n > config.max) u = config.max.toString();
    setBillString(u); setMonthlyBill(parseInt(u, 10) || 0);
  };

  const handleDirectInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (!raw) { setBillString('0'); setMonthlyBill(0); return; }
    const num = Math.min(config.max, parseInt(raw, 10));
    setBillString(num.toString()); setMonthlyBill(num);
  };

  const handleIncrement = () => {
    const next = Math.min(config.max, monthlyBill + config.step);
    setMonthlyBill(next); setBillString(next.toString());
  };
  const handleDecrement = () => {
    const next = Math.max(config.min, monthlyBill - config.step);
    setMonthlyBill(next); setBillString(next.toString());
  };
  const handleSelectPreset = (amount: number) => {
    setMonthlyBill(amount); setBillString(amount.toString());
  };

  /* ── Calculation (unchanged logic) ────────────────────────────────── */
  const calculation = useMemo(() => {
    const effectiveBill = Math.max(config.min, monthlyBill);
    const tariff = config.tariff;
    const monthlyUnits = effectiveBill / tariff;
    const annualUnitsNeeded = monthlyUnits * 12;
    const rawCapacity = annualUnitsNeeded / 1450;
    let capacityKw = Math.max(config.minKw, Math.round(rawCapacity * 10) / 10);

    const parsedRoof = parseFloat(optionalDetails.roofArea);
    if (!isNaN(parsedRoof) && parsedRoof > 0) {
      const maxKwFromRoof = Math.floor(parsedRoof / 60);
      if (maxKwFromRoof > 0 && maxKwFromRoof < capacityKw)
        capacityKw = Math.max(config.minKw, maxKwFromRoof);
    }

    const annualGenerationKwh = Math.round(capacityKw * 1450);
    const annualSaving = Math.round(annualGenerationKwh * tariff);
    const grossCost = capacityKw * config.costPerKw;

    let subsidyAmount = 0;
    if (customerType === 'RESIDENTIAL') {
      if (capacityKw <= 2) subsidyAmount = capacityKw * 30000;
      else if (capacityKw <= 3) subsidyAmount = 2 * 30000 + (capacityKw - 2) * 18000;
      else subsidyAmount = 78000;
      subsidyAmount = Math.round(subsidyAmount);
    }

    const netInvestment = Math.max(0, grossCost - subsidyAmount);
    const paybackYears = Number((netInvestment / (annualSaving || 1)).toFixed(1));

    let tier: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (capacityKw > config.meterTiers.medium) tier = 'HIGH';
    else if (capacityKw > config.meterTiers.low) tier = 'MEDIUM';

    const meterPercent = Math.min(100, Math.max(8, (capacityKw / config.meterTiers.max) * 100));

    return {
      capacityKw, annualGenerationKwh, annualSaving, subsidyAmount,
      paybackYears: Math.min(paybackYears, 8.5),
      monthlyUnits: Math.round(monthlyUnits), tier, meterPercent,
    };
  }, [customerType, monthlyBill, optionalDetails.roofArea, config]);

  /* ── Calculate trigger ────────────────────────────────────────────── */
  const handleCalculate = () => {
    if (monthlyBill < config.min) {
      setMonthlyBill(config.min); setBillString(config.min.toString());
    }
    setScreenState('CALCULATING'); setCalcStepIndex(0);
    const si = 180;
    setTimeout(() => setCalcStepIndex(1), si);
    setTimeout(() => setCalcStepIndex(2), si * 2);
    setTimeout(() => setCalcStepIndex(3), si * 3);
    setTimeout(() => setScreenState('RESULT'), 780);
  };

  const handleEditBill = () => setScreenState('INPUT');

  const handleScheduleAudit = () => {
    onScheduleAudit({
      customerType, monthlyBill, calculation, optionalDetails,
      inputs: { monthlyBill, customerType },
    });
  };

  /* ═══════════════════════════════════════════════════════════════════
     JSX
     ═══════════════════════════════════════════════════════════════════ */
  return (
    <section
      id="calculator"
      className="relative py-14 sm:py-18 md:py-24 px-3 sm:px-6 md:px-10 lg:px-12 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)' }}
    >
      {/* Subtle ambient shapes */}
      <div className="absolute top-20 -left-40 w-96 h-96 bg-emerald-100/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-100/30 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">

        {/* ── Section Title ─────────────────────────────────────── */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            SOLAR CALCULATOR
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-1.5 max-w-lg mx-auto">
            Enter your electricity bill. Get your solar requirement.
          </p>
        </div>

        {/* ════════════════════════════════════════════════════════
            STATE 1 — INPUT
           ════════════════════════════════════════════════════════ */}
        {screenState === 'INPUT' && (
          <div
            className="rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden"
            style={{ background: '#FFFFFF' }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12">

              {/* ─── LEFT: Calculator Chassis ─────────────────────── */}
              <div className="lg:col-span-7 p-5 sm:p-7 md:p-8 space-y-5 border-b lg:border-b-0 lg:border-r border-slate-100">

                {/* 1 ── Customer Type Selector ──────────────────────── */}
                <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-lg">
                  {(
                    [
                      { id: 'RESIDENTIAL', icon: Home },
                      { id: 'COMMERCIAL', icon: Building2 },
                      { id: 'INDUSTRIAL', icon: Factory },
                    ] as const
                  ).map(({ id, icon: Icon }) => {
                    const active = customerType === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => handleTypeChange(id)}
                        className={`flex items-center justify-center gap-1.5 py-2.5 rounded-md text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          active
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${active ? 'text-emerald-600' : 'text-slate-400'}`} />
                        {id}
                      </button>
                    );
                  })}
                </div>

                {/* 2 ── Bill Display (Central Focus) ────────────────── */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">
                    MONTHLY ELECTRICITY BILL
                  </span>

                  <div className="relative rounded-xl border-2 border-slate-200 focus-within:border-emerald-500 bg-slate-50 p-4 sm:p-5 flex items-center gap-3 transition-colors">
                    {/* ₹ prefix */}
                    <span className="text-3xl sm:text-4xl font-black text-emerald-600 select-none leading-none">₹</span>

                    {/* Number input */}
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={formatIndianNumber(monthlyBill)}
                      onChange={handleDirectInputChange}
                      aria-label="Monthly Electricity Bill"
                      className="flex-1 text-right text-4xl sm:text-5xl font-black font-telemetry tracking-tight text-slate-900 bg-transparent border-none outline-none p-0 min-w-0"
                    />

                    {/* Steppers */}
                    <div className="flex flex-col gap-1 pl-3 border-l border-slate-200">
                      <button type="button" onClick={handleIncrement} disabled={monthlyBill >= config.max}
                        className="w-9 h-9 rounded-lg bg-white hover:bg-emerald-50 active:scale-90 disabled:opacity-30 flex items-center justify-center border border-slate-200 text-slate-700 transition-all cursor-pointer">
                        <Plus className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={handleDecrement} disabled={monthlyBill <= config.min}
                        className="w-9 h-9 rounded-lg bg-white hover:bg-emerald-50 active:scale-90 disabled:opacity-30 flex items-center justify-center border border-slate-200 text-slate-700 transition-all cursor-pointer">
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3 ── Numeric Keypad (Instrument-grade) ───────────── */}
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                  {['1','2','3','4','5','6','7','8','9'].map((d) => (
                    <button key={d} type="button" onClick={() => handleKeypadPress(d)}
                      className="h-12 sm:h-13 bg-white hover:bg-slate-50 active:bg-emerald-50 border border-slate-200 rounded-lg text-lg font-bold text-slate-800 active:scale-95 transition-all cursor-pointer select-none">
                      {d}
                    </button>
                  ))}
                  <button type="button" onClick={() => handleKeypadPress('C')}
                    className="h-12 sm:h-13 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 border border-rose-200/80 rounded-lg text-xs font-bold text-rose-600 active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer select-none">
                    <RotateCcw className="w-3 h-3" /> C
                  </button>
                  <button type="button" onClick={() => handleKeypadPress('0')}
                    className="h-12 sm:h-13 bg-white hover:bg-slate-50 active:bg-emerald-50 border border-slate-200 rounded-lg text-lg font-bold text-slate-800 active:scale-95 transition-all cursor-pointer select-none">
                    0
                  </button>
                  <button type="button" onClick={() => handleKeypadPress('BACK')}
                    className="h-12 sm:h-13 bg-amber-50 hover:bg-amber-100 active:bg-amber-200 border border-amber-200/80 rounded-lg text-xs font-bold text-amber-700 active:scale-95 transition-all flex items-center justify-center cursor-pointer select-none">
                    <Delete className="w-4 h-4" />
                  </button>
                </div>

                {/* 4 ── Quick Presets (secondary) ───────────────────── */}
                <div className="flex flex-wrap gap-1.5">
                  {config.presets.map((amt) => (
                    <button key={amt} type="button" onClick={() => handleSelectPreset(amt)}
                      className={`text-[11px] sm:text-xs py-1 px-2.5 rounded-md border transition-all cursor-pointer ${
                        monthlyBill === amt
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                          : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-300 font-medium'
                      }`}>
                      {formatINR(amt)}
                    </button>
                  ))}
                </div>

                {/* 5 ── Optional Details (collapsed) ───────────────── */}
                <div className="pt-1 border-t border-slate-100">
                  <button type="button" onClick={() => setShowOptional(!showOptional)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-emerald-700 transition-colors cursor-pointer py-1">
                    {showOptional ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    {showOptional ? 'HIDE DETAILS' : '+ ADD ROOF AREA & CONSUMER NUMBER'}
                  </button>
                  {showOptional && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2.5 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Roof Area</label>
                        <div className="relative">
                          <input type="number" placeholder="e.g. 800" value={optionalDetails.roofArea}
                            onChange={(e) => setOptionalDetails({ ...optionalDetails, roofArea: e.target.value })}
                            className="w-full text-sm font-semibold text-slate-900 bg-white border border-slate-200 rounded-md px-3 py-2 pr-14 outline-none focus:border-emerald-500" />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none">sq.ft.</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Consumer No.</label>
                        <input type="text" maxLength={12} placeholder="12-digit MSEDCL" value={optionalDetails.consumerNumber}
                          onChange={(e) => setOptionalDetails({ ...optionalDetails, consumerNumber: e.target.value.replace(/\D/g, '') })}
                          className="w-full text-sm font-semibold text-slate-900 bg-white border border-slate-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500 font-telemetry" />
                      </div>
                    </div>
                  )}
                </div>

                {/* 6 ── CALCULATE BUTTON (instrument-style) ─────────── */}
                <button type="button" onClick={handleCalculate}
                  className="w-full py-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-extrabold text-sm sm:text-base tracking-widest uppercase flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all duration-150 cursor-pointer border-b-4 border-emerald-800"
                >
                  <Zap className="w-4 h-4 fill-white text-white" />
                  CALCULATE SOLAR
                </button>
              </div>

              {/* ─── RIGHT: Solar Ring Instrument ─────────────────── */}
              <div className="lg:col-span-5 p-5 sm:p-7 md:p-8 flex flex-col items-center justify-center space-y-5 bg-slate-50/50">

                {/* Solar Capacity Ring */}
                <SolarRing percent={calculation.meterPercent} capacityKw={calculation.capacityKw} tier={calculation.tier} />

                {/* Tier Indicators */}
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest">
                  <span className={calculation.tier === 'LOW' ? 'text-emerald-600' : 'text-slate-300'}>LOW</span>
                  <span className="text-slate-200">·</span>
                  <span className={calculation.tier === 'MEDIUM' ? 'text-amber-500' : 'text-slate-300'}>MED</span>
                  <span className="text-slate-200">·</span>
                  <span className={calculation.tier === 'HIGH' ? 'text-amber-600' : 'text-slate-300'}>HIGH</span>
                </div>

                {/* Live Preview Stats */}
                <div className="w-full space-y-2 pt-3 border-t border-slate-200/80">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Monthly Consumption</span>
                    <span className="font-bold text-slate-800 font-telemetry">~{formatIndianNumber(calculation.monthlyUnits)} units</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Annual Solar Yield</span>
                    <span className="font-bold text-emerald-700 font-telemetry">~{formatIndianNumber(calculation.annualGenerationKwh)} kWh</span>
                  </div>
                  {customerType === 'RESIDENTIAL' && (
                    <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-100">
                      <span className="text-emerald-700 font-medium">PM Surya Ghar Subsidy</span>
                      <span className="font-bold text-emerald-700 font-telemetry">Up to {formatINR(calculation.subsidyAmount)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            CALCULATING — Brief Animated Transition
           ════════════════════════════════════════════════════════ */}
        {screenState === 'CALCULATING' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 shadow-xl text-center space-y-6 max-w-md mx-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="relative w-14 h-14 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-[3px] border-slate-100 border-t-amber-500 animate-spin" />
              <Zap className="w-6 h-6 text-amber-500 fill-amber-500" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight uppercase">
                Calculating Solar Requirement…
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">Processing Maharashtra solar yield data</p>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {['BILL', 'ENERGY', 'CAPACITY', 'SAVING'].map((label, idx) => (
                <div key={label}
                  className={`py-2 rounded-md text-center text-[9px] font-bold uppercase tracking-wider border transition-all duration-200 ${
                    calcStepIndex >= idx
                      ? 'bg-amber-50 border-amber-300 text-amber-800'
                      : 'bg-slate-50 border-slate-100 text-slate-300'
                  }`}>
                  {label}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            STATE 2 — RESULT
           ════════════════════════════════════════════════════════ */}
        {screenState === 'RESULT' && (
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-300 space-y-5">

            {/* Back / Context bar */}
            <div className="flex items-center justify-between">
              <button type="button" onClick={handleEditBill}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold active:scale-95 transition-all cursor-pointer">
                <ArrowLeft className="w-3.5 h-3.5" /> EDIT BILL
              </button>
              <span className="text-[11px] text-slate-400">
                {customerType.charAt(0) + customerType.slice(1).toLowerCase()} · {formatINR(monthlyBill)}/mo
              </span>
            </div>

            {/* ─── Primary Output Panel (Amber/Orange Solar Output) ─ */}
            <div className="rounded-2xl overflow-hidden border border-amber-200/80 shadow-xl" style={{ background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 50%, #FDE68A 100%)' }}>
              <div className="p-6 sm:p-8 md:p-10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700/70 block mb-5">
                  YOUR SOLAR ESTIMATE
                </span>

                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-10">

                  {/* Solar Ring (warm amber version) */}
                  <div className="shrink-0">
                    <div className="relative flex items-center justify-center">
                      <svg width="160" height="160" viewBox="0 0 160 160" className="transform -rotate-90">
                        <circle cx="80" cy="80" r="64" fill="none" stroke="#F59E0B" strokeWidth="9" opacity="0.15" />
                        <circle cx="80" cy="80" r="64" fill="none" stroke="#D97706" strokeWidth="9" strokeLinecap="round"
                          strokeDasharray={2 * Math.PI * 64}
                          strokeDashoffset={(2 * Math.PI * 64) - (2 * Math.PI * 64 * calculation.meterPercent) / 100}
                          className="transition-all duration-700 ease-out" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-4xl sm:text-5xl font-black font-telemetry text-slate-900 leading-none tracking-tight">
                          <CountUpNumber value={`${calculation.capacityKw}`} />
                        </div>
                        <span className="text-base font-extrabold text-amber-700 mt-0.5">kW</span>
                        <span className="text-[8px] font-bold text-amber-600/60 uppercase tracking-widest mt-1">Recommended</span>
                      </div>
                    </div>
                  </div>

                  {/* Result Metrics (Right side on desktop, below on mobile) */}
                  <div className="flex-1 w-full space-y-4">
                    {/* Main Metric Label */}
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
                      RECOMMENDED SOLAR CAPACITY
                    </h3>

                    {/* Generation */}
                    <div className="flex items-baseline justify-between py-2.5 border-b border-amber-300/40">
                      <span className="text-xs sm:text-sm font-semibold text-slate-700">Annual Generation</span>
                      <span className="text-xl sm:text-2xl font-black font-telemetry text-slate-900 tracking-tight">
                        <CountUpNumber value={`${formatIndianNumber(calculation.annualGenerationKwh)} kWh/yr`} />
                      </span>
                    </div>

                    {/* Saving */}
                    <div className="flex items-baseline justify-between py-2.5 border-b border-amber-300/40">
                      <span className="text-xs sm:text-sm font-semibold text-slate-700">Annual Saving</span>
                      <span className="text-xl sm:text-2xl font-black font-telemetry text-emerald-700 tracking-tight">
                        <CountUpNumber value={formatINR(calculation.annualSaving)} />
                      </span>
                    </div>

                    {/* Payback */}
                    <div className="flex items-baseline justify-between py-2.5">
                      <span className="text-xs sm:text-sm font-semibold text-slate-700">Est. Payback</span>
                      <span className="text-xl sm:text-2xl font-black font-telemetry text-amber-700 tracking-tight">
                        <CountUpNumber value={`${calculation.paybackYears} Years`} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subsidy / Contextual Info Strip */}
              {customerType === 'RESIDENTIAL' && calculation.subsidyAmount > 0 && (
                <div className="bg-emerald-700 px-5 sm:px-8 py-3 flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-200 shrink-0" />
                  <span className="text-[11px] sm:text-xs font-semibold text-white">
                    PM Surya Ghar Muft Bijli Yojana: Up to <strong>{formatINR(calculation.subsidyAmount)}</strong> direct subsidy eligible
                  </span>
                </div>
              )}
            </div>

            {/* Supplementary Info Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-slate-200 rounded-xl p-3.5 text-xs flex items-center justify-between">
                <span className="text-slate-500">Shadow-Free Roof</span>
                <strong className="text-slate-800 font-telemetry">~{Math.round(calculation.capacityKw * 60)} sq.ft.</strong>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-3.5 text-xs flex items-center justify-between">
                <span className="text-slate-500">CO₂ Offset</span>
                <strong className="text-emerald-700 font-telemetry">~{((calculation.annualGenerationKwh * 0.82) / 1000).toFixed(1)} Tons/yr</strong>
              </div>
            </div>

            {/* CTA Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-4 sm:p-5">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Verify with a site audit?</h4>
                <p className="text-[11px] text-slate-500">On-site assessment &amp; official solar proposal by Invisible Energy, Sangli.</p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button type="button" onClick={handleEditBill}
                  className="py-2.5 px-4 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all cursor-pointer whitespace-nowrap">
                  ← Edit Bill
                </button>
                <button type="button" onClick={handleScheduleAudit}
                  className="flex-1 sm:flex-none py-2.5 px-5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer whitespace-nowrap">
                  Schedule Site Audit →
                </button>
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-[9px] text-slate-400 text-center">
              * Preliminary estimates calibrated for Maharashtra solar insolation (~1,450 kWh/kW/yr) and MSEDCL tariffs. Actual capacity confirmed during site engineering audit.
            </p>
          </div>
        )}

      </div>
    </section>
  );
};
