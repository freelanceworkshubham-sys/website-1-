import React, { useState, useMemo } from 'react';
import {
  Home,
  Building2,
  Factory,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  X,
  FileText,
  Phone,
  User,
  MapPin,
  Minus,
  Plus,
  Gauge,
  SunMedium,
  TrendingUp,
} from 'lucide-react';
import { CountUpNumber } from './CountUpNumber';

interface SolarCalculatorProps {
  onScheduleAudit: (estimateDetails: any) => void;
}

type CustomerType = 'HOME' | 'BUSINESS' | 'INDUSTRIAL';

interface OptionalDetails {
  roofArea: string;
  msedclNumber: string;
  backupRequirement: 'none' | 'essential' | 'full';
}

/** Formatter for Indian Rupees */
const formatINR = (val: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);
};

/** Formatter for plain numbers in Indian convention */
const formatIndianNumber = (val: number): string => {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(val);
};

export const SolarCalculator: React.FC<SolarCalculatorProps> = ({ onScheduleAudit }) => {
  // Step 1: Customer Type
  const [customerType, setCustomerType] = useState<CustomerType>('HOME');

  // Step 2: Average Monthly Bill
  const [monthlyBill, setMonthlyBill] = useState<number>(4000);

  // Optional Advanced Info Toggle & Fields
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [optionalDetails, setOptionalDetails] = useState<OptionalDetails>({
    roofArea: '',
    msedclNumber: '',
    backupRequirement: 'none',
  });

  // Lead Modal State
  const [isLeadModalOpen, setIsLeadModalOpen] = useState<boolean>(false);
  const [leadForm, setLeadForm] = useState({
    name: '',
    phone: '',
    location: '',
    msedclNumber: '',
  });
  const [leadErrors, setLeadErrors] = useState<Record<string, string>>({});
  const [leadSubmitted, setLeadSubmitted] = useState<boolean>(false);

  // When customer type changes, set calibrated default bills & ranges
  const handleTypeChange = (type: CustomerType) => {
    setCustomerType(type);
    if (type === 'HOME') {
      setMonthlyBill(4000);
    } else if (type === 'BUSINESS') {
      setMonthlyBill(45000);
    } else {
      setMonthlyBill(350000);
    }
  };

  // Slider bounds and step calibration based on customer type
  const billRange = useMemo(() => {
    switch (customerType) {
      case 'HOME':
        return {
          min: 1000,
          max: 30000,
          step: 500,
          labelMin: '₹1,000',
          labelMax: '₹30,000',
          maxCapacityRef: 12,
        };
      case 'BUSINESS':
        return {
          min: 10000,
          max: 400000,
          step: 5000,
          labelMin: '₹10,000',
          labelMax: '₹4,00,000',
          maxCapacityRef: 100,
        };
      case 'INDUSTRIAL':
        return {
          min: 50000,
          max: 3000000,
          step: 25000,
          labelMin: '₹50,000',
          labelMax: '₹30,00,000',
          maxCapacityRef: 800,
        };
    }
  }, [customerType]);

  // Stepped increment/decrement controls
  const handleDecrement = () => {
    setMonthlyBill((prev) => Math.max(billRange.min, prev - billRange.step));
  };

  const handleIncrement = () => {
    setMonthlyBill((prev) => Math.min(billRange.max, prev + billRange.step));
  };

  // Real-world calculations calibrated for Maharashtra solar irradiance (~1450 kWh/kW/yr)
  const calculation = useMemo(() => {
    let tariffPerUnit = 8.2; // Residential avg in Maharashtra
    let minCapacity = 1;
    let costPerKw = 55000;

    if (customerType === 'BUSINESS') {
      tariffPerUnit = 11.5; // Commercial tariff
      minCapacity = 5;
      costPerKw = 46000;
    } else if (customerType === 'INDUSTRIAL') {
      tariffPerUnit = 8.8; // HT Industrial tariff
      minCapacity = 50;
      costPerKw = 39000;
    }

    // Monthly units consumed = Monthly Bill / Tariff
    const monthlyUnits = monthlyBill / tariffPerUnit;
    const annualUnitsNeeded = monthlyUnits * 12;

    // 1 kW solar generates ~1,450 units/year in Maharashtra
    const rawCapacity = annualUnitsNeeded / 1450;
    let capacityKw = Math.max(minCapacity, Math.round(rawCapacity * 10) / 10);

    // Apply roof area constraint if optionally provided
    const parsedRoof = parseFloat(optionalDetails.roofArea);
    if (!isNaN(parsedRoof) && parsedRoof > 0) {
      const maxKwFromRoof = Math.floor(parsedRoof / 60); // approx 60 sq ft per kW
      if (maxKwFromRoof > 0 && maxKwFromRoof < capacityKw) {
        capacityKw = Math.max(minCapacity, maxKwFromRoof);
      }
    }

    const annualGenerationKwh = Math.round(capacityKw * 1450);
    const annualSaving = Math.round(annualGenerationKwh * tariffPerUnit);
    const grossCost = capacityKw * costPerKw;

    // Subsidy logic: PM Surya Ghar Muft Bijli Yojana ONLY for eligible residential users (HOME)
    let subsidyAmount = 0;
    if (customerType === 'HOME') {
      if (capacityKw <= 2) {
        subsidyAmount = capacityKw * 30000;
      } else if (capacityKw <= 3) {
        subsidyAmount = 2 * 30000 + (capacityKw - 2) * 18000;
      } else {
        subsidyAmount = 78000; // Capped at ₹78,000 for residential systems >= 3 kW
      }
      subsidyAmount = Math.round(subsidyAmount);
    }

    const netInvestment = Math.max(0, grossCost - subsidyAmount);
    const paybackYears = Number((netInvestment / (annualSaving || 1)).toFixed(1));

    return {
      capacityKw,
      annualGenerationKwh,
      annualSaving,
      subsidyAmount,
      paybackYears: Math.min(paybackYears, 8.5),
    };
  }, [customerType, monthlyBill, optionalDetails.roofArea]);

  // Meter gauge percentage (relative to range)
  const meterProgress = useMemo(() => {
    const minKw = customerType === 'HOME' ? 1 : customerType === 'BUSINESS' ? 5 : 50;
    const maxKw = billRange.maxCapacityRef;
    const pct = Math.min(100, Math.max(4, ((calculation.capacityKw - minKw) / (maxKw - minKw)) * 100));
    return Math.round(pct);
  }, [calculation.capacityKw, billRange.maxCapacityRef, customerType]);

  // System scale classification badge
  const systemScaleBadge = useMemo(() => {
    if (customerType === 'HOME') {
      if (calculation.capacityKw <= 3) return { label: 'Compact Residential (1–3 kW)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
      if (calculation.capacityKw <= 6) return { label: 'Standard Home (3–6 kW)', color: 'text-blue-700 bg-blue-50 border-blue-200' };
      return { label: 'High-Harvest Villa (6–10+ kW)', color: 'text-amber-800 bg-amber-50 border-amber-200' };
    }
    if (customerType === 'BUSINESS') {
      if (calculation.capacityKw <= 25) return { label: 'Commercial Rooftop (5–25 kW)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
      if (calculation.capacityKw <= 60) return { label: 'Medium Enterprise (25–60 kW)', color: 'text-blue-700 bg-blue-50 border-blue-200' };
      return { label: 'Commercial Hub (60–100+ kW)', color: 'text-amber-800 bg-amber-50 border-amber-200' };
    }
    if (calculation.capacityKw <= 200) return { label: 'Industrial Captive (50–200 kW)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    return { label: 'Heavy Manufacturing HT (200–800+ kW)', color: 'text-amber-800 bg-amber-50 border-amber-200' };
  }, [customerType, calculation.capacityKw]);

  // Quick preset options per customer category
  const quickPresets = useMemo(() => {
    if (customerType === 'HOME') return [2500, 4000, 7500, 15000];
    if (customerType === 'BUSINESS') return [25000, 45000, 100000, 250000];
    return [150000, 350000, 800000, 1500000];
  }, [customerType]);

  // Lead form validation
  const validateLead = () => {
    const errs: Record<string, string> = {};
    if (!leadForm.name.trim()) errs.name = 'Please provide your name';

    const cleanPhone = leadForm.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.phone = 'Please provide a valid 10-digit mobile number';
    }

    if (!leadForm.location.trim()) {
      errs.location = 'Please provide your city or district';
    }

    const msedclToCheck = leadForm.msedclNumber.trim() || optionalDetails.msedclNumber.trim();
    if (msedclToCheck && !/^\d{12}$/.test(msedclToCheck)) {
      errs.msedcl = 'MSEDCL consumer number must be 12 digits (or leave blank)';
    }

    setLeadErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleOpenLeadModal = () => {
    if (optionalDetails.msedclNumber && !leadForm.msedclNumber) {
      setLeadForm((prev) => ({ ...prev, msedclNumber: optionalDetails.msedclNumber }));
    }
    setLeadSubmitted(false);
    setIsLeadModalOpen(true);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLead()) return;

    const payload = {
      customerType,
      monthlyBill,
      calculation,
      optionalDetails,
      lead: {
        name: leadForm.name.trim(),
        phone: leadForm.phone.trim(),
        location: leadForm.location.trim(),
        msedclNumber: leadForm.msedclNumber.trim() || optionalDetails.msedclNumber.trim() || null,
      },
    };

    onScheduleAudit(payload);
    setLeadSubmitted(true);
  };

  const handleSkipLead = () => {
    const payload = {
      customerType,
      monthlyBill,
      calculation,
      optionalDetails,
      lead: null,
    };
    onScheduleAudit(payload);
    setIsLeadModalOpen(false);
  };

  return (
    <section
      id="calculator"
      className="relative py-12 sm:py-16 md:py-20 px-3 sm:px-6 md:px-12 lg:px-16 bg-white text-slate-900 border-t border-slate-200/80 overflow-hidden"
    >
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/4 -left-32 w-80 h-80 bg-emerald-50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-slate-100 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 space-y-6 sm:space-y-8">
        
        {/* Instrument Header: "YOUR SOLAR POWER METER" */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200/80 shadow-2xs">
            <Gauge className="w-3.5 h-3.5 text-emerald-600" />
            <span>YOUR SOLAR POWER METER</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
            Build Your Solar Estimate
          </h2>

          <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
            See what your electricity bill looks like with clean solar power. Real-time sizing calibrated for Maharashtra.
          </p>
        </div>

        {/* Central Instrument Chassis (Clean Technical Card) */}
        <div className="bg-slate-50/80 rounded-2xl sm:rounded-3xl p-4 sm:p-7 md:p-8 border border-slate-200/90 shadow-sm space-y-5 sm:space-y-7">
          
          {/* 1. Category Switcher: [ RESIDENTIAL ] [ COMMERCIAL ] [ INDUSTRIAL ] */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
              <span>Application Profile</span>
              <span className="text-emerald-700 font-mono text-[10px] sm:text-xs">
                {customerType === 'HOME' ? 'MSEDCL LT-1' : customerType === 'BUSINESS' ? 'LT-2 Commercial' : 'HT Industrial'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 bg-slate-200/70 p-1 rounded-xl sm:rounded-2xl">
              {/* Residential */}
              <button
                type="button"
                onClick={() => handleTypeChange('HOME')}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  customerType === 'HOME'
                    ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-900/5'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                }`}
              >
                <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
                <span className="truncate">RESIDENTIAL</span>
              </button>

              {/* Commercial */}
              <button
                type="button"
                onClick={() => handleTypeChange('BUSINESS')}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  customerType === 'BUSINESS'
                    ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-900/5'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0" />
                <span className="truncate">COMMERCIAL</span>
              </button>

              {/* Industrial */}
              <button
                type="button"
                onClick={() => handleTypeChange('INDUSTRIAL')}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  customerType === 'INDUSTRIAL'
                    ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-900/5'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                }`}
              >
                <Factory className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
                <span className="truncate">INDUSTRIAL</span>
              </button>
            </div>
          </div>

          {/* 2. Central Sizing Instrument: Monthly Electricity Bill Dial & Slider */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                  Monthly Electricity Bill
                </span>
                <span className="text-[11px] text-slate-500">
                  Adjust using precision buttons, slider, or quick presets
                </span>
              </div>

              {/* Stepped Precision Controls: [ - ]  ₹ Amount  [ + ] */}
              <div className="inline-flex items-center gap-2 self-start sm:self-auto bg-slate-50 border border-slate-200 rounded-xl p-1">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={monthlyBill <= billRange.min}
                  className="p-1.5 sm:p-2 rounded-lg hover:bg-white text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  aria-label="Decrease bill amount"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <div className="px-2 sm:px-3 text-center min-w-[120px] sm:min-w-[140px]">
                  <span className="font-telemetry text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight block">
                    {formatINR(monthlyBill)}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 block font-mono -mt-0.5">
                    PER MONTH
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={monthlyBill >= billRange.max}
                  className="p-1.5 sm:p-2 rounded-lg hover:bg-white text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  aria-label="Increase bill amount"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Continuous Calibrated Range Slider */}
            <div className="space-y-1.5 pt-1">
              <div className="relative flex items-center">
                <input
                  type="range"
                  min={billRange.min}
                  max={billRange.max}
                  step={billRange.step}
                  value={monthlyBill}
                  onChange={(e) => setMonthlyBill(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-700 focus:outline-none"
                />
              </div>

              <div className="flex justify-between text-[10px] sm:text-[11px] text-slate-500 font-mono">
                <span>{billRange.labelMin}</span>
                <span className="hidden sm:inline font-sans text-slate-400">Drag to adjust sizing</span>
                <span>{billRange.labelMax}</span>
              </div>
            </div>

            {/* Quick Pick Presets */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1">
              <span className="text-slate-500 font-medium text-[11px] mr-1">Quick Sizing:</span>
              {quickPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setMonthlyBill(preset)}
                  className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer min-h-[32px] ${
                    monthlyBill === preset
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  {formatINR(preset)}
                </button>
              ))}
            </div>

            {/* Dynamic Solar Power Gauge Scale (Live visual feedback indicator) */}
            <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 font-medium text-slate-700">
                  <SunMedium className="w-3.5 h-3.5 text-amber-500" />
                  <span>Sizing Meter:</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${systemScaleBadge.color}`}>
                    {systemScaleBadge.label}
                  </span>
                </div>
                <span className="font-mono text-xs font-bold text-emerald-800">
                  {calculation.capacityKw} kW
                </span>
              </div>

              {/* Progress gauge bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-0.5 border border-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-amber-500 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${meterProgress}%` }}
                />
              </div>
            </div>

          </div>

          {/* 3. Optional Info Drawer (Roof Area & MSEDCL Consumer Number) */}
          <div className="border border-slate-200 rounded-xl bg-white/70 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer text-left"
            >
              <span>Optional: Add Roof Area, Consumer Number or Backup</span>
              {showAdvanced ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {showAdvanced && (
              <div className="p-4 pt-1 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white">
                {/* Roof Area */}
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-600 font-medium block">Roof Area (sq ft)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1000"
                    value={optionalDetails.roofArea}
                    onChange={(e) => setOptionalDetails({ ...optionalDetails, roofArea: e.target.value })}
                    className="w-full min-h-[40px] bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                {/* MSEDCL Number */}
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-600 font-medium block">MSEDCL No. (12 digits)</label>
                  <input
                    type="text"
                    maxLength={12}
                    placeholder="e.g. 012345678901"
                    value={optionalDetails.msedclNumber}
                    onChange={(e) => setOptionalDetails({ ...optionalDetails, msedclNumber: e.target.value.replace(/\D/g, '') })}
                    className="w-full min-h-[40px] bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                {/* Backup */}
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-600 font-medium block">Backup Preference</label>
                  <select
                    value={optionalDetails.backupRequirement}
                    onChange={(e) => setOptionalDetails({ ...optionalDetails, backupRequirement: e.target.value as any })}
                    className="w-full min-h-[40px] bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-emerald-600 focus:bg-white"
                  >
                    <option value="none">Grid-Tied (Standard net-metered)</option>
                    <option value="essential">Essential Load Backup</option>
                    <option value="full">Complete Battery Storage</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* 4. Live Calculation Area: The 4 Key Estimated Outputs with Smooth Count-Up Transition */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-700">
                Live Calculation Output
              </span>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ESTIMATED
              </span>
            </div>

            {/* The 4 Outputs: Solar Capacity, Annual Generation, Annual Saving, Payback */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
              
              {/* Output 1: Estimated Solar Capacity */}
              <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between min-w-0">
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Solar Capacity
                </span>
                <div className="my-1.5 sm:my-2">
                  <CountUpNumber
                    value={
                      calculation.capacityKw >= 1000
                        ? `${(calculation.capacityKw / 1000).toFixed(2)} MW`
                        : `${calculation.capacityKw} kW`
                    }
                    className="font-telemetry text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-none block truncate"
                  />
                </div>
                <span className="text-[10px] sm:text-[11px] text-slate-500 leading-tight">
                  Recommended PV array
                </span>
              </div>

              {/* Output 2: Estimated Annual Generation */}
              <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between min-w-0">
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Est. Generation
                </span>
                <div className="my-1.5 sm:my-2">
                  <CountUpNumber
                    value={`${formatIndianNumber(calculation.annualGenerationKwh)} kWh/yr`}
                    className="font-telemetry text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-none block truncate"
                  />
                </div>
                <span className="text-[10px] sm:text-[11px] text-slate-500 leading-tight">
                  Units generated / year
                </span>
              </div>

              {/* Output 3: Estimated Annual Saving */}
              <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between min-w-0">
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Est. Annual Saving
                </span>
                <div className="my-1.5 sm:my-2">
                  <CountUpNumber
                    value={formatINR(calculation.annualSaving)}
                    className="font-telemetry text-xl sm:text-2xl lg:text-3xl font-extrabold text-emerald-700 tracking-tight leading-none block truncate"
                  />
                </div>
                <span className="text-[10px] sm:text-[11px] text-slate-500 leading-tight">
                  ~{formatINR(Math.round(calculation.annualSaving / 12))} / month
                </span>
              </div>

              {/* Output 4: Estimated Payback */}
              <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between min-w-0">
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Est. Payback
                </span>
                <div className="my-1.5 sm:my-2">
                  <CountUpNumber
                    value={`${calculation.paybackYears} Years`}
                    className="font-telemetry text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight leading-none block truncate"
                  />
                </div>
                <span className="text-[10px] sm:text-[11px] text-slate-500 leading-tight">
                  Capital recovery timeline
                </span>
              </div>

            </div>
          </div>

          {/* 5. Primary Action CTA */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleOpenLeadModal}
              className="group w-full bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-bold py-3.5 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-base shadow-md transition-all cursor-pointer min-h-[44px]"
            >
              <span>GET MY DETAILED SOLAR ESTIMATE</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#C6F500] group-hover:translate-x-1.5 transition-transform shrink-0" />
            </button>

            <p className="text-center text-[10px] sm:text-[11px] text-slate-500 mt-2.5">
              *Calculated using ~1,450 kWh/kW/year Maharashtra irradiance standards &amp; MSEDCL tariff slabs. Clean engineering estimates without sales pressure.
            </p>
          </div>

        </div>

      </div>

      {/* LEAD CAPTURE MODAL */}
      {isLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900">
            
            {/* Close Button */}
            <button
              onClick={() => setIsLeadModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {leadSubmitted ? (
              /* Success confirmation */
              <div className="py-6 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Estimate Request Received
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong className="text-slate-900">{leadForm.name}</strong>. Our engineering team is preparing your custom {calculation.capacityKw} kW solar feasibility report.
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700">
                  We'll contact you on <span className="text-emerald-700 font-bold">{leadForm.phone}</span> within 24 hours.
                </div>
                <button
                  type="button"
                  onClick={() => setIsLeadModalOpen(false)}
                  className="mt-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-all cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            ) : (
              /* Lead form */
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block border border-emerald-200">
                    Custom Solar Proposal
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Get Your Detailed Solar Estimate
                  </h3>
                  <p className="text-slate-600 text-xs">
                    Tailored for: <strong className="text-slate-900">{customerType}</strong> · Est. Capacity: <strong className="text-emerald-700">{calculation.capacityKw} kW</strong>
                  </p>
                </div>

                <form onSubmit={handleLeadSubmit} className="space-y-3.5">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-xs text-slate-700 font-medium">Your Name *</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        placeholder="e.g. Ramesh Patil"
                        value={leadForm.name}
                        onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                        className="w-full min-h-[44px] bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all box-border"
                      />
                    </div>
                    {leadErrors.name && <p className="text-[11px] text-rose-500">{leadErrors.name}</p>}
                  </div>

                  {/* Mobile */}
                  <div className="space-y-1">
                    <label className="text-xs text-slate-700 font-medium">Mobile Number (WhatsApp) *</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      <input
                        type="tel"
                        placeholder="e.g. 9822012345"
                        maxLength={10}
                        value={leadForm.phone}
                        onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value.replace(/\D/g, '') })}
                        className="w-full min-h-[44px] bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all box-border"
                      />
                    </div>
                    {leadErrors.phone && <p className="text-[11px] text-rose-500">{leadErrors.phone}</p>}
                  </div>

                  {/* Location */}
                  <div className="space-y-1">
                    <label className="text-xs text-slate-700 font-medium">City / District in Maharashtra *</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        placeholder="e.g. Ichalkaranji / Kolhapur / Pune"
                        value={leadForm.location}
                        onChange={(e) => setLeadForm({ ...leadForm, location: e.target.value })}
                        className="w-full min-h-[44px] bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all box-border"
                      />
                    </div>
                    {leadErrors.location && <p className="text-[11px] text-rose-500">{leadErrors.location}</p>}
                  </div>

                  {/* MSEDCL Consumer Number (Optional) */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-slate-700 font-medium">
                        MSEDCL Consumer Number <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <span className="text-[10px] text-slate-400">12 digits</span>
                    </div>
                    <div className="relative">
                      <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        maxLength={12}
                        placeholder="e.g. 012345678901 (from your bill)"
                        value={leadForm.msedclNumber}
                        onChange={(e) => setLeadForm({ ...leadForm, msedclNumber: e.target.value.replace(/\D/g, '') })}
                        className="w-full min-h-[44px] bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all box-border"
                      />
                    </div>
                    {leadErrors.msedcl && <p className="text-[11px] text-rose-500">{leadErrors.msedcl}</p>}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 space-y-2">
                    <button
                      type="submit"
                      className="w-full bg-[#C6F500] hover:bg-[#b8e500] text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm shadow-md transition-all cursor-pointer min-h-[44px]"
                    >
                      <span>Submit &amp; Get Detailed Report</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handleSkipLead}
                        className="text-xs text-slate-500 hover:text-slate-800 underline transition-colors cursor-pointer py-2 min-h-[36px]"
                      >
                        Skip for now &amp; view quick estimate
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>
      )}

    </section>
  );
};
