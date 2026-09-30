import React, { useState, useMemo, useEffect } from 'react';
import {
  Home,
  Building2,
  Factory,
  Zap,
  ArrowRight,
  ArrowLeft,
  Minus,
  Plus,
  Delete,
  Sun,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
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

export const SolarCalculator: React.FC<SolarCalculatorProps> = ({ onScheduleAudit }) => {
  // Navigation & Screen States
  const [screenState, setScreenState] = useState<'INPUT' | 'CALCULATING' | 'RESULT'>('INPUT');
  const [calcStepIndex, setCalcStepIndex] = useState<number>(0);

  // Customer Type
  const [customerType, setCustomerType] = useState<CustomerType>('RESIDENTIAL');

  // Monthly Bill (Number and String representation for keypad typing)
  const [monthlyBill, setMonthlyBill] = useState<number>(6000);
  const [billString, setBillString] = useState<string>('6000');

  // Collapsible Optional Details
  const [showOptional, setShowOptional] = useState<boolean>(false);
  const [optionalDetails, setOptionalDetails] = useState<OptionalDetails>({
    roofArea: '',
    consumerNumber: '',
  });

  // Range and Step configuration per customer category
  const config = useMemo(() => {
    switch (customerType) {
      case 'RESIDENTIAL':
        return {
          min: 1000,
          max: 50000,
          step: 500,
          defaultBill: 6000,
          presets: [2500, 5000, 7500, 10000, 15000],
          tariff: 8.2, // Avg Maharashtra residential tariff (₹/unit)
          minKw: 1,
          costPerKw: 55000,
          meterTiers: { low: 3, medium: 6, max: 12 },
        };
      case 'COMMERCIAL':
        return {
          min: 10000,
          max: 500000,
          step: 5000,
          defaultBill: 45000,
          presets: [20000, 45000, 80000, 150000, 300000],
          tariff: 11.5, // Commercial tariff (₹/unit)
          minKw: 5,
          costPerKw: 46000,
          meterTiers: { low: 25, medium: 60, max: 120 },
        };
      case 'INDUSTRIAL':
        return {
          min: 50000,
          max: 5000000,
          step: 25000,
          defaultBill: 350000,
          presets: [150000, 350000, 800000, 1500000, 3000000],
          tariff: 8.8, // HT Industrial tariff (₹/unit)
          minKw: 50,
          costPerKw: 39000,
          meterTiers: { low: 200, medium: 500, max: 1000 },
        };
    }
  }, [customerType]);

  // Sync bill string when customer type switches
  const handleTypeChange = (type: CustomerType) => {
    setCustomerType(type);
    let newDefault = 6000;
    if (type === 'COMMERCIAL') newDefault = 45000;
    if (type === 'INDUSTRIAL') newDefault = 350000;
    setMonthlyBill(newDefault);
    setBillString(newDefault.toString());
  };

  // Direct keypad number entry
  const handleKeypadPress = (key: string) => {
    if (key === 'C') {
      setBillString('0');
      setMonthlyBill(0);
      return;
    }

    if (key === 'BACK') {
      const updated = billString.length > 1 ? billString.slice(0, -1) : '0';
      setBillString(updated);
      setMonthlyBill(parseInt(updated, 10) || 0);
      return;
    }

    // Number digit
    let updated = billString === '0' ? key : billString + key;
    // Limit to 7 digits
    if (updated.length > 7) return;

    const numVal = parseInt(updated, 10) || 0;
    // Max cap
    if (numVal > config.max) {
      updated = config.max.toString();
    }
    setBillString(updated);
    setMonthlyBill(parseInt(updated, 10) || 0);
  };

  // Direct manual input change
  const handleDirectInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (!raw) {
      setBillString('0');
      setMonthlyBill(0);
      return;
    }
    const num = Math.min(config.max, parseInt(raw, 10));
    setBillString(num.toString());
    setMonthlyBill(num);
  };

  // Increment / Decrement
  const handleIncrement = () => {
    const next = Math.min(config.max, monthlyBill + config.step);
    setMonthlyBill(next);
    setBillString(next.toString());
  };

  const handleDecrement = () => {
    const next = Math.max(config.min, monthlyBill - config.step);
    setMonthlyBill(next);
    setBillString(next.toString());
  };

  // Preset pill selection
  const handleSelectPreset = (amount: number) => {
    setMonthlyBill(amount);
    setBillString(amount.toString());
  };

  // Maharashtra Solar EPC Calculation Logic (Consistent & Calibrated)
  const calculation = useMemo(() => {
    const effectiveBill = Math.max(config.min, monthlyBill);
    const tariff = config.tariff;
    const monthlyUnits = effectiveBill / tariff;
    const annualUnitsNeeded = monthlyUnits * 12;

    // 1 kW solar generates ~1,450 kWh per year in Maharashtra
    const rawCapacity = annualUnitsNeeded / 1450;
    let capacityKw = Math.max(config.minKw, Math.round(rawCapacity * 10) / 10);

    // Apply roof constraint if specified
    const parsedRoof = parseFloat(optionalDetails.roofArea);
    if (!isNaN(parsedRoof) && parsedRoof > 0) {
      const maxKwFromRoof = Math.floor(parsedRoof / 60); // ~60 sq ft per kW
      if (maxKwFromRoof > 0 && maxKwFromRoof < capacityKw) {
        capacityKw = Math.max(config.minKw, maxKwFromRoof);
      }
    }

    const annualGenerationKwh = Math.round(capacityKw * 1450);
    const annualSaving = Math.round(annualGenerationKwh * tariff);
    const grossCost = capacityKw * config.costPerKw;

    // Subsidy logic: PM Surya Ghar Muft Bijli Yojana ONLY for Residential
    let subsidyAmount = 0;
    if (customerType === 'RESIDENTIAL') {
      if (capacityKw <= 2) {
        subsidyAmount = capacityKw * 30000;
      } else if (capacityKw <= 3) {
        subsidyAmount = 2 * 30000 + (capacityKw - 2) * 18000;
      } else {
        subsidyAmount = 78000; // Capped at ₹78,000 for >= 3 kW
      }
      subsidyAmount = Math.round(subsidyAmount);
    }

    const netInvestment = Math.max(0, grossCost - subsidyAmount);
    const paybackYears = Number((netInvestment / (annualSaving || 1)).toFixed(1));

    // Meter Tier (Low, Medium, High)
    let tier: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (capacityKw > config.meterTiers.medium) {
      tier = 'HIGH';
    } else if (capacityKw > config.meterTiers.low) {
      tier = 'MEDIUM';
    }

    // Gauge angle progress (0 to 180 degrees)
    const meterPercent = Math.min(
      100,
      Math.max(8, (capacityKw / config.meterTiers.max) * 100)
    );

    return {
      capacityKw,
      annualGenerationKwh,
      annualSaving,
      subsidyAmount,
      paybackYears: Math.min(paybackYears, 8.5),
      monthlyUnits: Math.round(monthlyUnits),
      tier,
      meterPercent,
    };
  }, [customerType, monthlyBill, optionalDetails.roofArea, config]);

  // Handle Calculate Trigger with short 750ms animated sequence
  const handleCalculate = () => {
    // Clamp bill to minimum if user typed a tiny number
    if (monthlyBill < config.min) {
      setMonthlyBill(config.min);
      setBillString(config.min.toString());
    }

    setScreenState('CALCULATING');
    setCalcStepIndex(0);

    // Subtle 4-step sequence across 750ms
    const stepInterval = 180;
    const timer1 = setTimeout(() => setCalcStepIndex(1), stepInterval * 1);
    const timer2 = setTimeout(() => setCalcStepIndex(2), stepInterval * 2);
    const timer3 = setTimeout(() => setCalcStepIndex(3), stepInterval * 3);
    const finishTimer = setTimeout(() => {
      setScreenState('RESULT');
    }, 780);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(finishTimer);
    };
  };

  // Back to input (preserves amount)
  const handleEditBill = () => {
    setScreenState('INPUT');
  };

  // Forward to Quote / Audit Modal
  const handleScheduleAudit = () => {
    const payload = {
      customerType,
      monthlyBill,
      calculation,
      optionalDetails,
      inputs: {
        monthlyBill,
        customerType,
      },
    };
    onScheduleAudit(payload);
  };

  return (
    <section
      id="calculator"
      className="relative py-12 sm:py-16 md:py-20 px-3 sm:px-6 md:px-10 lg:px-12 bg-white text-slate-900 border-t border-slate-200/80 overflow-hidden"
    >
      {/* Subtle Ambient Background Gradients */}
      <div className="absolute top-1/4 -left-32 w-80 h-80 bg-emerald-50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-slate-100 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 space-y-6 sm:space-y-8">

        {/* ========================================================
            HEADER & SUBHEADING (Always visible and clean)
           ======================================================== */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold tracking-wide uppercase">
            <Sun className="w-3.5 h-3.5 text-emerald-600 animate-spin-slow" />
            <span>SOLAR EPC SIZING INSTRUMENT</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            SOLAR CALCULATOR
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 max-w-lg mx-auto">
            Calculate your estimated solar requirement from your electricity bill.
          </p>
        </div>

        {/* ========================================================
            STATE 1: CALCULATOR INPUT SCREEN
           ======================================================== */}
        {screenState === 'INPUT' && (
          <div className="bg-slate-50/70 border border-slate-200/90 rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl shadow-slate-200/40 transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

              {/* LEFT COLUMN: THE REAL DIGITAL CALCULATOR CHASSIS */}
              <div className="lg:col-span-7 space-y-5">

                {/* 1. Customer Type Selector (Compact) */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                    CUSTOMER TYPE
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2 bg-slate-200/70 p-1 rounded-xl">
                    {(
                      [
                        { id: 'RESIDENTIAL', label: 'RESIDENTIAL', icon: Home },
                        { id: 'COMMERCIAL', label: 'COMMERCIAL', icon: Building2 },
                        { id: 'INDUSTRIAL', label: 'INDUSTRIAL', icon: Factory },
                      ] as const
                    ).map((item) => {
                      const Icon = item.icon;
                      const active = customerType === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleTypeChange(item.id)}
                          className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                            active
                              ? 'bg-white text-emerald-800 shadow-sm font-bold border border-slate-200'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${active ? 'text-emerald-600' : 'text-slate-400'}`} />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Main Bill Digital Display */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      MONTHLY ELECTRICITY BILL
                    </label>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Maharashtra MSEDCL Tariff (~₹{config.tariff}/unit)
                    </span>
                  </div>

                  {/* Large Premium Numeric Display */}
                  <div className="relative bg-white border-2 border-slate-200 focus-within:border-emerald-500 rounded-2xl p-3 sm:p-4 shadow-inner flex items-center justify-between gap-3 transition-colors">
                    <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-emerald-700 select-none">
                      ₹
                    </span>

                    {/* Numeric Input / Display */}
                    <div className="flex-1 flex items-baseline justify-end">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={formatIndianNumber(monthlyBill)}
                        onChange={handleDirectInputChange}
                        aria-label="Monthly Electricity Bill"
                        className="w-full text-right text-3xl sm:text-4xl md:text-5xl font-extrabold font-telemetry tracking-tight text-slate-900 bg-transparent border-none outline-none focus:ring-0 p-0"
                      />
                    </div>

                    {/* Quick Stepper Buttons [-] and [+] */}
                    <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                      <button
                        type="button"
                        onClick={handleDecrement}
                        disabled={monthlyBill <= config.min}
                        title={`Decrease by ${formatINR(config.step)}`}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-700 transition-all cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={handleIncrement}
                        disabled={monthlyBill >= config.max}
                        title={`Increase by ${formatINR(config.step)}`}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-700 transition-all cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Compact Digital Calculator Keypad */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      NUMERIC KEYPAD
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Tap or type directly
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-slate-200/50 p-2 sm:p-2.5 rounded-2xl border border-slate-200/80">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                      <button
                        key={digit}
                        type="button"
                        onClick={() => handleKeypadPress(digit)}
                        className="py-3 sm:py-3.5 bg-white hover:bg-emerald-50 active:bg-emerald-100 border border-slate-200/80 rounded-xl text-lg sm:text-xl font-bold text-slate-800 shadow-sm active:scale-95 transition-all flex items-center justify-center cursor-pointer select-none"
                      >
                        {digit}
                      </button>
                    ))}

                    {/* Row 4: [ C ]  [ 0 ]  [ ⌫ ] */}
                    <button
                      type="button"
                      onClick={() => handleKeypadPress('C')}
                      className="py-3 sm:py-3.5 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 border border-rose-200 rounded-xl text-sm sm:text-base font-bold text-rose-700 shadow-sm active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer select-none"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>C</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleKeypadPress('0')}
                      className="py-3 sm:py-3.5 bg-white hover:bg-emerald-50 active:bg-emerald-100 border border-slate-200/80 rounded-xl text-lg sm:text-xl font-bold text-slate-800 shadow-sm active:scale-95 transition-all flex items-center justify-center cursor-pointer select-none"
                    >
                      0
                    </button>

                    <button
                      type="button"
                      onClick={() => handleKeypadPress('BACK')}
                      className="py-3 sm:py-3.5 bg-amber-50 hover:bg-amber-100 active:bg-amber-200 border border-amber-200 rounded-xl text-sm sm:text-base font-bold text-amber-800 shadow-sm active:scale-95 transition-all flex items-center justify-center cursor-pointer select-none"
                    >
                      <Delete className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 4. Quick Amount Presets */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    QUICK PRESETS
                  </span>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {config.presets.map((amt) => {
                      const active = monthlyBill === amt;
                      return (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => handleSelectPreset(amt)}
                          className={`text-xs sm:text-sm py-1.5 px-3 rounded-full border transition-all cursor-pointer ${
                            active
                              ? 'bg-emerald-700 text-white border-emerald-700 font-bold shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 font-medium'
                          }`}
                        >
                          {formatINR(amt)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Collapsible Optional Details (Roof Area & Consumer No) */}
                <div className="pt-1 border-t border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => setShowOptional(!showOptional)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer py-1"
                  >
                    {showOptional ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    <span>
                      {showOptional
                        ? 'HIDE OPTIONAL SITE DETAILS'
                        : '+ ADD ROOF AREA & CONSUMER NUMBER (OPTIONAL)'}
                    </span>
                  </button>

                  {showOptional && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 p-3.5 bg-white border border-slate-200 rounded-xl">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                          Roof Area (Optional)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            placeholder="e.g. 800"
                            value={optionalDetails.roofArea}
                            onChange={(e) =>
                              setOptionalDetails({ ...optionalDetails, roofArea: e.target.value })
                            }
                            className="w-full text-sm font-semibold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 pr-14 outline-none focus:border-emerald-500"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium pointer-events-none">
                            sq.ft.
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                          Consumer Number (Optional)
                        </label>
                        <input
                          type="text"
                          maxLength={12}
                          placeholder="12-digit MSEDCL"
                          value={optionalDetails.consumerNumber}
                          onChange={(e) =>
                            setOptionalDetails({
                              ...optionalDetails,
                              consumerNumber: e.target.value.replace(/\D/g, ''),
                            })
                          }
                          className="w-full text-sm font-semibold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-emerald-500 font-telemetry"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 6. Primary Large Calculate Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleCalculate}
                    className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/35 transition-all duration-200 cursor-pointer"
                  >
                    <span>CALCULATE MY SOLAR REQUIREMENT</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <p className="text-[11px] text-slate-400 text-center mt-2">
                    Instant Maharashtra solar EPC sizing • No login required
                  </p>
                </div>
              </div>

              {/* RIGHT COLUMN: DIGITAL SOLAR ENERGY METER (Live Instrument Concept) */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-6">
                
                {/* Meter Title & Status */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      LIVE SOLAR SIZING INSTRUMENT
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      ACTIVE SIZING
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                    Digital Solar Energy Meter
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live system capacity estimate calibrated to current bill
                  </p>
                </div>

                {/* Circular / Semi-circular Gauge Meter Indicator */}
                <div className="relative flex flex-col items-center justify-center py-2">
                  <svg className="w-52 h-32 overflow-visible" viewBox="0 0 200 120">
                    {/* Background Arc */}
                    <path
                      d="M 20 110 A 80 80 0 0 1 180 110"
                      fill="none"
                      stroke="#E2E8F0"
                      strokeWidth="16"
                      strokeLinecap="round"
                    />
                    {/* Active Solar Energy Arc */}
                    <path
                      d="M 20 110 A 80 80 0 0 1 180 110"
                      fill="none"
                      stroke="url(#solarMeterGradient)"
                      strokeWidth="16"
                      strokeLinecap="round"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * calculation.meterPercent) / 100}
                      className="transition-all duration-300 ease-out"
                    />
                    <defs>
                      <linearGradient id="solarMeterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="50%" stopColor="#EAB308" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Central Meter Reading */}
                  <div className="absolute bottom-2 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      ESTIMATED CAPACITY
                    </span>
                    <span className="text-3xl sm:text-4xl font-extrabold font-telemetry text-slate-900 leading-none">
                      {calculation.capacityKw}
                      <span className="text-lg font-bold text-emerald-600 ml-1">kW</span>
                    </span>
                  </div>
                </div>

                {/* Meter Tiers: LOW | MEDIUM | HIGH */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                  <div
                    className={`p-2 rounded-xl border transition-all ${
                      calculation.tier === 'LOW'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold shadow-xs'
                        : 'bg-slate-50 border-slate-100 text-slate-400'
                    }`}
                  >
                    <span className="text-[10px] uppercase tracking-wider block">LOW</span>
                    <span className="text-xs font-semibold mt-0.5 block">
                      1–{config.meterTiers.low} kW
                    </span>
                  </div>

                  <div
                    className={`p-2 rounded-xl border transition-all ${
                      calculation.tier === 'MEDIUM'
                        ? 'bg-amber-50 border-amber-300 text-amber-800 font-bold shadow-xs'
                        : 'bg-slate-50 border-slate-100 text-slate-400'
                    }`}
                  >
                    <span className="text-[10px] uppercase tracking-wider block">MEDIUM</span>
                    <span className="text-xs font-semibold mt-0.5 block">
                      {config.meterTiers.low}–{config.meterTiers.medium} kW
                    </span>
                  </div>

                  <div
                    className={`p-2 rounded-xl border transition-all ${
                      calculation.tier === 'HIGH'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold shadow-xs'
                        : 'bg-slate-50 border-slate-100 text-slate-400'
                    }`}
                  >
                    <span className="text-[10px] uppercase tracking-wider block">HIGH</span>
                    <span className="text-xs font-semibold mt-0.5 block">
                      {config.meterTiers.medium}+ kW
                    </span>
                  </div>
                </div>

                {/* Preliminary Energy Yield Preview */}
                <div className="bg-slate-50 rounded-xl p-3.5 space-y-2 border border-slate-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Est. Monthly Consumption</span>
                    <span className="font-bold text-slate-800 font-telemetry">
                      ~{formatIndianNumber(calculation.monthlyUnits)} units/mo
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Est. Annual Solar Harvest</span>
                    <span className="font-bold text-emerald-700 font-telemetry">
                      ~{formatIndianNumber(calculation.annualGenerationKwh)} kWh/yr
                    </span>
                  </div>
                  {customerType === 'RESIDENTIAL' && (
                    <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-200">
                      <span className="text-emerald-700 font-medium">PM Surya Ghar Subsidy</span>
                      <span className="font-bold text-emerald-700 font-telemetry">
                        Up to {formatINR(calculation.subsidyAmount)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            INTERMEDIATE STATE: CALCULATION ANIMATION (0.6–0.9s)
           ======================================================== */}
        {screenState === 'CALCULATING' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-xl text-center space-y-6 max-w-xl mx-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-slate-100 border-t-emerald-600 animate-spin" />
              <Zap className="w-7 h-7 text-emerald-600 fill-emerald-600" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                CALCULATING YOUR SOLAR REQUIREMENT...
              </h3>
              <p className="text-xs text-slate-500">
                Processing Maharashtra solar yield & MSEDCL tariff models
              </p>
            </div>

            {/* Subtle Step Progression Flow */}
            <div className="grid grid-cols-4 gap-2 pt-2">
              {[
                { label: 'BILL', val: formatINR(monthlyBill) },
                { label: 'ENERGY USE', val: `~${calculation.monthlyUnits} U` },
                { label: 'CAPACITY', val: `${calculation.capacityKw} kW` },
                { label: 'SAVING', val: `~${formatINR(calculation.annualSaving)}` },
              ].map((step, idx) => {
                const isPassed = calcStepIndex >= idx;
                return (
                  <div
                    key={step.label}
                    className={`p-2 rounded-xl text-center border transition-all duration-200 ${
                      isPassed
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-slate-50 border-slate-100 text-slate-300 opacity-60'
                    }`}
                  >
                    <span className="text-[9px] font-bold block uppercase tracking-wider">
                      {step.label}
                    </span>
                    <span className="text-[11px] font-extrabold mt-0.5 block truncate font-telemetry">
                      {step.val}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            STATE 2: CALCULATION RESULT SCREEN
           ======================================================== */}
        {screenState === 'RESULT' && (
          <div className="bg-slate-50/80 border border-slate-200/90 rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl shadow-slate-200/40 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className="space-y-6">

              {/* Result Header & Action Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>CALCULATION COMPLETE</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                    YOUR ESTIMATED SOLAR REQUIREMENT
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Based on <strong className="text-slate-800 font-semibold">{formatINR(monthlyBill)}/month</strong> ({customerType.toLowerCase()} tariff in Maharashtra)
                  </p>
                </div>

                {/* Edit Bill Button (Preserves Amount) */}
                <button
                  type="button"
                  onClick={handleEditBill}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs sm:text-sm font-bold shadow-xs active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>EDIT BILL</span>
                </button>
              </div>

              {/* 4 Main Numerical Results with CountUpNumber (~2.5s duration) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
                
                {/* Result 1: Solar Capacity */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    SOLAR CAPACITY
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold font-telemetry text-emerald-700 tracking-tight">
                    <CountUpNumber value={`${calculation.capacityKw} kW`} />
                  </div>
                  <span className="text-[11px] text-slate-500 block leading-tight">
                    Recommended rooftop plant rating
                  </span>
                </div>

                {/* Result 2: Annual Generation */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    EST. ANNUAL GENERATION
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold font-telemetry text-slate-900 tracking-tight">
                    <CountUpNumber
                      value={`${formatIndianNumber(calculation.annualGenerationKwh)} kWh/year`}
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 block leading-tight">
                    Clean electricity yield per year
                  </span>
                </div>

                {/* Result 3: Annual Saving */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    EST. ANNUAL SAVING
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold font-telemetry text-emerald-700 tracking-tight">
                    <CountUpNumber value={formatINR(calculation.annualSaving)} />
                  </div>
                  <span className="text-[11px] text-slate-500 block leading-tight">
                    Reduction in utility bill expense
                  </span>
                </div>

                {/* Result 4: Payback Period */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    EST. PAYBACK
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold font-telemetry text-slate-900 tracking-tight">
                    <CountUpNumber value={`${calculation.paybackYears} Years`} />
                  </div>
                  <span className="text-[11px] text-slate-500 block leading-tight">
                    ROI recovery period via savings
                  </span>
                </div>
              </div>

              {/* Additional Context & Subsidy Banner */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {customerType === 'RESIDENTIAL' && calculation.subsidyAmount > 0 ? (
                  <div className="md:col-span-2 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-emerald-900">
                        Eligible for PM Surya Ghar Muft Bijli Yojana Central Subsidy
                      </h4>
                      <p className="text-xs text-emerald-700 mt-0.5 leading-relaxed">
                        Direct DBT subsidy of up to <strong>{formatINR(calculation.subsidyAmount)}</strong> directly credited by Ministry of New & Renewable Energy (MNRE).
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="md:col-span-2 bg-slate-100 border border-slate-200 rounded-2xl p-4 flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        Commercial & Industrial EPC Sizing
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        Includes turnkey engineering, MSEDCL CEIG statutory liaisoning, net-metering synchronization, and Tier-1 bifacial modules.
                      </p>
                    </div>
                  </div>
                )}

                {/* Site Estimate Specs */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 text-xs space-y-1.5 flex flex-col justify-center">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Est. Shadow-Free Roof:</span>
                    <strong className="text-slate-900 font-telemetry">
                      ~{Math.round(calculation.capacityKw * 60)} sq.ft.
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Est. CO₂ Offset:</span>
                    <strong className="text-emerald-700 font-telemetry">
                      ~{((calculation.annualGenerationKwh * 0.82) / 1000).toFixed(1)} Tons/yr
                    </strong>
                  </div>
                </div>
              </div>

              {/* Conversion CTA Row */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900">
                    Ready to verify this sizing on your actual rooftop?
                  </h4>
                  <p className="text-xs text-slate-500">
                    Solar Technologies engineers conduct on-site shade analysis & provide an official engineering quote.
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleEditBill}
                    className="py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap"
                  >
                    ← Edit Bill
                  </button>
                  <button
                    type="button"
                    onClick={handleScheduleAudit}
                    className="flex-1 sm:flex-none py-3 px-5 sm:px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer whitespace-nowrap"
                  >
                    Schedule Site Audit →
                  </button>
                </div>
              </div>

              {/* Disclaimer */}
              <p className="text-[10px] text-slate-400 text-center">
                * All values are preliminary technical estimates calibrated for Maharashtra solar insolation (~1,450 kWh/kW/year) and standard MSEDCL utility tariffs. Actual system capacity determined during detailed site engineering audit.
              </p>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
