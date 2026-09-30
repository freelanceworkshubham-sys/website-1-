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
  Sparkles
} from 'lucide-react';

interface SolarCalculatorProps {
  onScheduleAudit: (estimateDetails: any) => void;
}

type CustomerType = 'HOME' | 'BUSINESS' | 'INDUSTRIAL';

interface OptionalDetails {
  roofArea: string;
  msedclNumber: string;
  backupRequirement: 'none' | 'essential' | 'full';
}

/** Formatter for Indian Rupees with Lakh / Crore conventions */
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

  // When customer type changes, set reasonable default bills & ranges
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

  // Slider bounds based on customer type
  const billRange = useMemo(() => {
    switch (customerType) {
      case 'HOME':
        return { min: 1000, max: 30000, step: 500, labelMin: '₹1,000', labelMax: '₹30,000+' };
      case 'BUSINESS':
        return { min: 10000, max: 400000, step: 5000, labelMin: '₹10,000', labelMax: '₹4,00,000+' };
      case 'INDUSTRIAL':
        return { min: 50000, max: 3000000, step: 25000, labelMin: '₹50,000', labelMax: '₹30,00,000+' };
    }
  }, [customerType]);

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

    // Optional 12-digit MSEDCL validation if entered
    const msedclToCheck = leadForm.msedclNumber.trim() || optionalDetails.msedclNumber.trim();
    if (msedclToCheck && !/^\d{12}$/.test(msedclToCheck)) {
      errs.msedcl = 'MSEDCL consumer number must be 12 digits (or leave blank)';
    }

    setLeadErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleOpenLeadModal = () => {
    // Pre-populate MSEDCL number if entered in optional accordion
    if (optionalDetails.msedclNumber && !leadForm.msedclNumber) {
      setLeadForm(prev => ({ ...prev, msedclNumber: optionalDetails.msedclNumber }));
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
    <section id="calculator" className="relative py-10 sm:py-16 md:py-24 px-3 sm:px-6 md:px-12 lg:px-16 bg-white text-[#0A1224] overflow-hidden">
      {/* Subtle brand ambient lighting */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#EAF6FB] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-[#7FD4F0]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Section Header - Compact 2-line max on mobile */}
        <div className="text-center max-w-2xl mx-auto mb-5 sm:mb-8 md:mb-12 space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#0F3D4C] bg-[#EAF6FB] px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-[#7FD4F0]/40 shadow-xs">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FFC94D]" />
            <span>Instant Solar Estimator</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0A1224] leading-tight">
            Calculate Your <span className="text-[#0F3D4C]">Solar Potential</span>
          </h2>

          <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed max-w-lg mx-auto">
            Fast, transparent estimates engineered for Maharashtra grid standards. No guesswork, no sales pressure.
          </p>
        </div>

        {/* Clean Unified Estimator Container (White Theme, Compact Mobile Spacing) */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-7 md:p-10 border border-slate-200/90 shadow-xl shadow-slate-100/70 space-y-4 sm:space-y-7 md:space-y-10">
          
          {/* STEP 1: What are you powering? */}
          <div className="space-y-2.5 sm:space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs uppercase font-bold tracking-widest text-[#0F3D4C]">
                Step 1 · What are you powering?
              </span>
              <span className="text-[11px] sm:text-xs text-slate-500 font-medium">Select application</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3.5">
              
              {/* HOME */}
              <button
                type="button"
                onClick={() => handleTypeChange('HOME')}
                className={`flex items-center gap-3 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all text-left cursor-pointer min-h-[44px] hover:-translate-y-0.5 ${
                  customerType === 'HOME'
                    ? 'bg-[#0F3D4C] border-[#0F3D4C] text-white shadow-md shadow-[#0F3D4C]/15 ring-2 ring-[#0F3D4C]/30'
                    : 'bg-[#EAF6FB]/40 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-transform shrink-0 ${customerType === 'HOME' ? 'bg-[#7FD4F0] text-[#0A1224]' : 'bg-white border border-slate-200 text-[#0F3D4C]'}`}>
                  <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <div className={`text-xs sm:text-sm font-bold truncate ${customerType === 'HOME' ? 'text-white' : 'text-[#0A1224]'}`}>HOME</div>
                  <div className={`text-[10px] sm:text-[11px] truncate ${customerType === 'HOME' ? 'text-slate-200' : 'text-slate-500'}`}>Rooftop 1–10 kW</div>
                </div>
              </button>

              {/* BUSINESS */}
              <button
                type="button"
                onClick={() => handleTypeChange('BUSINESS')}
                className={`flex items-center gap-3 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all text-left cursor-pointer min-h-[44px] hover:-translate-y-0.5 ${
                  customerType === 'BUSINESS'
                    ? 'bg-[#0F3D4C] border-[#0F3D4C] text-white shadow-md shadow-[#0F3D4C]/15 ring-2 ring-[#0F3D4C]/30'
                    : 'bg-[#EAF6FB]/40 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-transform shrink-0 ${customerType === 'BUSINESS' ? 'bg-[#7FD4F0] text-[#0A1224]' : 'bg-white border border-slate-200 text-[#0F3D4C]'}`}>
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <div className={`text-xs sm:text-sm font-bold truncate ${customerType === 'BUSINESS' ? 'text-white' : 'text-[#0A1224]'}`}>BUSINESS</div>
                  <div className={`text-[10px] sm:text-[11px] truncate ${customerType === 'BUSINESS' ? 'text-slate-200' : 'text-slate-500'}`}>Commercial 5–100 kW</div>
                </div>
              </button>

              {/* INDUSTRIAL */}
              <button
                type="button"
                onClick={() => handleTypeChange('INDUSTRIAL')}
                className={`flex items-center gap-3 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all text-left cursor-pointer min-h-[44px] hover:-translate-y-0.5 ${
                  customerType === 'INDUSTRIAL'
                    ? 'bg-[#0F3D4C] border-[#0F3D4C] text-white shadow-md shadow-[#0F3D4C]/15 ring-2 ring-[#0F3D4C]/30'
                    : 'bg-[#EAF6FB]/40 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-transform shrink-0 ${customerType === 'INDUSTRIAL' ? 'bg-[#7FD4F0] text-[#0A1224]' : 'bg-white border border-slate-200 text-[#0F3D4C]'}`}>
                  <Factory className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <div className={`text-xs sm:text-sm font-bold truncate ${customerType === 'INDUSTRIAL' ? 'text-white' : 'text-[#0A1224]'}`}>INDUSTRIAL</div>
                  <div className={`text-[10px] sm:text-[11px] truncate ${customerType === 'INDUSTRIAL' ? 'text-slate-200' : 'text-slate-500'}`}>HT / Factory 50 kW–1 MW+</div>
                </div>
              </button>

            </div>
          </div>

          {/* STEP 2: Average Monthly Electricity Bill */}
          <div className="space-y-3 sm:space-y-4 pt-1 sm:pt-2">
            <div className="flex flex-row items-center justify-between gap-2">
              <span className="text-[11px] sm:text-xs uppercase font-bold tracking-widest text-[#0F3D4C]">
                Step 2 · Average Monthly Bill
              </span>

              {/* Live Formatted Value */}
              <div className="flex items-center gap-1.5 sm:gap-2 bg-[#EAF6FB] px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-lg sm:rounded-xl border border-[#7FD4F0]/40 shrink-0">
                <span className="text-[10px] sm:text-xs text-slate-600 font-medium">Bill:</span>
                <span className="text-sm sm:text-xl font-extrabold text-[#0F3D4C] tracking-tight">
                  {formatINR(monthlyBill)}
                </span>
                <span className="text-[10px] sm:text-xs text-slate-500">/ mo</span>
              </div>
            </div>

            {/* Slider */}
            <div className="space-y-1.5 sm:space-y-2">
              <input
                type="range"
                min={billRange.min}
                max={billRange.max}
                step={billRange.step}
                value={monthlyBill}
                onChange={(e) => setMonthlyBill(Number(e.target.value))}
                className="w-full h-2 sm:h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0F3D4C]"
              />
              <div className="flex justify-between text-[10px] sm:text-xs text-slate-500 font-mono">
                <span>{billRange.labelMin}</span>
                <span className="hidden sm:inline font-sans">Adjust slider or pick quick preset below</span>
                <span>{billRange.labelMax}</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-0.5 text-xs">
              <span className="text-slate-500 font-medium text-[10px] sm:text-xs">Quick Pick:</span>
              {(customerType === 'HOME'
                ? [2500, 4000, 7500, 15000]
                : customerType === 'BUSINESS'
                ? [25000, 45000, 100000, 250000]
                : [150000, 350000, 800000, 1500000]
              ).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setMonthlyBill(preset)}
                  className={`px-2.5 py-1 sm:px-3 sm:py-1 rounded-lg border transition-all cursor-pointer font-medium text-[11px] sm:text-xs min-h-[36px] ${
                    monthlyBill === preset
                      ? 'bg-[#0F3D4C] border-[#0F3D4C] text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-[#EAF6FB] hover:border-slate-300'
                  }`}
                >
                  {formatINR(preset)}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Advanced Details Toggle */}
          <div className="border-t border-slate-200 pt-3 sm:pt-4">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#0F3D4C] hover:text-[#0A1224] transition-colors cursor-pointer py-1 min-h-[44px]"
            >
              <span>Optional: Add Roof Area, MSEDCL Consumer No. or Backup</span>
              {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showAdvanced && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-2 sm:pt-4 mt-1">
                {/* Roof Area */}
                <div className="space-y-1">
                  <label className="text-[11px] sm:text-xs text-slate-700 font-medium block">Roof Area (sq ft)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1200"
                    value={optionalDetails.roofArea}
                    onChange={(e) => setOptionalDetails({ ...optionalDetails, roofArea: e.target.value })}
                    className="w-full min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-[#0F3D4C] focus:bg-white box-border"
                  />
                </div>

                {/* MSEDCL Consumer No. */}
                <div className="space-y-1">
                  <label className="text-[11px] sm:text-xs text-slate-700 font-medium block">MSEDCL Consumer No. (12 digits)</label>
                  <input
                    type="text"
                    maxLength={12}
                    placeholder="e.g. 012345678901"
                    value={optionalDetails.msedclNumber}
                    onChange={(e) => setOptionalDetails({ ...optionalDetails, msedclNumber: e.target.value.replace(/\D/g, '') })}
                    className="w-full min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-[#0F3D4C] focus:bg-white box-border"
                  />
                </div>

                {/* Backup Requirement */}
                <div className="space-y-1">
                  <label className="text-[11px] sm:text-xs text-slate-700 font-medium block">Backup Requirement</label>
                  <select
                    value={optionalDetails.backupRequirement}
                    onChange={(e) => setOptionalDetails({ ...optionalDetails, backupRequirement: e.target.value as any })}
                    className="w-full min-h-[44px] bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#0F3D4C] focus:bg-white box-border"
                  >
                    <option value="none">Grid-Tied (No battery)</option>
                    <option value="essential">Essential Load Backup</option>
                    <option value="full">Whole Facility Storage</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Quick Mobile Action CTA: Jump to results */}
          <div className="block sm:hidden pt-0.5">
            <a
              href="#calculator-results"
              className="w-full bg-[#0F3D4C] hover:bg-[#0a2c38] text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs shadow-xs active:scale-[0.99] transition-all cursor-pointer min-h-[44px]"
            >
              <span>Calculate / View Solar Yield</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#7FD4F0]" />
            </a>
          </div>

          {/* STEP 3: Compact Result Cards & Primary CTA (Clean Light Surface) */}
          <div id="calculator-results" className="bg-[#EAF6FB]/50 rounded-2xl p-3.5 sm:p-6 md:p-8 border border-slate-200/90 shadow-xs space-y-3.5 sm:space-y-6 scroll-mt-20">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/90 pb-2.5 sm:pb-4">
              <span className="text-[11px] sm:text-xs uppercase font-bold tracking-wider text-slate-600">
                Step 3 · Estimated Solar Yield &amp; ROI
              </span>

              {/* Dynamic Context Tag */}
              {customerType === 'HOME' ? (
                <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full self-start sm:self-auto leading-tight">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>PM Surya Ghar subsidy eligible up to ₹78,000</span>
                </div>
              ) : customerType === 'BUSINESS' ? (
                <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-[#0F3D4C] bg-white border border-[#7FD4F0]/50 px-2.5 py-1 rounded-full self-start sm:self-auto leading-tight">
                  <span>40% Accelerated Depreciation tax benefits</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full self-start sm:self-auto leading-tight">
                  <span>HT industrial net-metering &amp; open access ready</span>
                </div>
              )}
            </div>

            {/* The 4 Compact Metrics: VALUE -> LABEL -> DESCRIPTION vertically stacked */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
              
              {/* Metric 1: Capacity */}
              <div className="bg-white p-2.5 sm:p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-start min-w-0 overflow-hidden">
                <div className="text-base sm:text-2xl md:text-3xl font-extrabold text-[#0A1224] tracking-tight leading-tight truncate">
                  {calculation.capacityKw >= 1000 
                    ? `${(calculation.capacityKw / 1000).toFixed(2)} MW` 
                    : `${calculation.capacityKw} kW`}
                </div>
                <div className="text-[11px] sm:text-xs font-semibold text-slate-800 mt-1 leading-tight break-words">
                  Estimated System Size
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 leading-tight break-words">
                  {customerType === 'HOME' ? 'Tier-1 Mono PERC' : 'Bifacial Glass-Glass'}
                </div>
              </div>

              {/* Metric 2: Generation */}
              <div className="bg-white p-2.5 sm:p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-start min-w-0 overflow-hidden">
                <div className="text-base sm:text-2xl md:text-3xl font-extrabold text-[#0F3D4C] tracking-tight leading-tight truncate">
                  {formatIndianNumber(calculation.annualGenerationKwh)}
                </div>
                <div className="text-[11px] sm:text-xs font-semibold text-slate-800 mt-1 leading-tight break-words">
                  Annual Generation
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 leading-tight break-words">
                  kWh / year clean harvest
                </div>
              </div>

              {/* Metric 3: Saving */}
              <div className="bg-white p-2.5 sm:p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-start min-w-0 overflow-hidden">
                <div className="text-base sm:text-2xl md:text-3xl font-extrabold text-emerald-700 tracking-tight leading-tight truncate">
                  {formatINR(calculation.annualSaving)}
                </div>
                <div className="text-[11px] sm:text-xs font-semibold text-slate-800 mt-1 leading-tight break-words">
                  Annual Saving
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 leading-tight break-words">
                  Direct bill reduction
                </div>
              </div>

              {/* Metric 4: Payback */}
              <div className="bg-white p-2.5 sm:p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-start min-w-0 overflow-hidden">
                <div className="text-base sm:text-2xl md:text-3xl font-extrabold text-[#0A1224] tracking-tight leading-tight truncate">
                  {calculation.paybackYears} Years
                </div>
                <div className="text-[11px] sm:text-xs font-semibold text-slate-800 mt-1 leading-tight break-words">
                  Estimated Payback
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 leading-tight break-words">
                  100% capital breakeven
                </div>
              </div>

            </div>

            {/* Single Primary CTA */}
            <div className="pt-1 sm:pt-2">
              <button
                type="button"
                onClick={handleOpenLeadModal}
                className="group w-full bg-[#FFC94D] hover:bg-[#eab33a] active:scale-[0.99] text-[#0A1224] font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-base shadow-md hover:shadow-lg transition-all cursor-pointer min-h-[44px]"
              >
                <span className="truncate">GET MY DETAILED SOLAR ESTIMATE</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#0A1224] group-hover:translate-x-1.5 transition-transform shrink-0" />
              </button>
              <p className="text-[10px] sm:text-[11px] text-slate-500 text-center mt-2 leading-tight">
                Free engineering consultation · Includes rooftop shadow simulation &amp; DISCOM net-metering check.
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* LEAD CAPTURE MODAL (White Theme) */}
      {isLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900">
            
            {/* Close Button */}
            <button
              onClick={() => setIsLeadModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors"
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
                  We'll contact you on <span className="text-[#0F3D4C] font-bold">{leadForm.phone}</span> within 24 hours.
                </div>
                <button
                  type="button"
                  onClick={() => setIsLeadModalOpen(false)}
                  className="mt-2 bg-[#0F3D4C] hover:bg-[#0a2c38] text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-all cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            ) : (
              /* Lead form */
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0F3D4C] bg-[#EAF6FB] px-2.5 py-0.5 rounded-full inline-block">
                    Custom Engineering Proposal
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Get Your Detailed Solar Estimate
                  </h3>
                  <p className="text-slate-600 text-xs">
                    Tailored for: <strong className="text-[#0F3D4C]">{customerType}</strong> · Est. Capacity: <strong className="text-slate-900">{calculation.capacityKw} kW</strong>
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
                        className="w-full min-h-[44px] bg-slate-50 border border-slate-200 focus:border-[#0F3D4C] focus:bg-white rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all box-border"
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
                        className="w-full min-h-[44px] bg-slate-50 border border-slate-200 focus:border-[#0F3D4C] focus:bg-white rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all box-border"
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
                        placeholder="e.g. Pune / Kolhapur / Mumbai"
                        value={leadForm.location}
                        onChange={(e) => setLeadForm({ ...leadForm, location: e.target.value })}
                        className="w-full min-h-[44px] bg-slate-50 border border-slate-200 focus:border-[#0F3D4C] focus:bg-white rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all box-border"
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
                        placeholder="e.g. 012345678901 (found on your bill)"
                        value={leadForm.msedclNumber}
                        onChange={(e) => setLeadForm({ ...leadForm, msedclNumber: e.target.value.replace(/\D/g, '') })}
                        className="w-full min-h-[44px] bg-slate-50 border border-slate-200 focus:border-[#0F3D4C] focus:bg-white rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all box-border"
                      />
                    </div>
                    {leadErrors.msedcl && <p className="text-[11px] text-rose-500">{leadErrors.msedcl}</p>}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 space-y-2">
                    <button
                      type="submit"
                      className="w-full bg-[#FFC94D] hover:bg-[#eab33a] active:scale-[0.99] text-[#0A1224] font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm shadow-md transition-all cursor-pointer min-h-[44px]"
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
