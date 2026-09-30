import React from 'react';
import { Zap, ShieldCheck, Sun, Layers, Sparkles, Activity, CheckCircle2 } from 'lucide-react';

export const CoreInnovations: React.FC = () => {
  return (
    <section id="innovations" className="relative py-24 px-6 md:px-12 lg:px-16 bg-slate-50 text-slate-900 border-t border-slate-200">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-100/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-full border border-emerald-200 inline-block">
              Photovoltaic Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
              Engineered for Extreme Yield &amp; <span className="font-editorial-italic font-normal text-emerald-800">Zero Degradation</span>
            </h2>
            <p className="text-slate-600 text-base">
              Every Sonar installation combines aerospace-grade N-type silicon, solid-state energy storage, and sub-second grid telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-700 bg-white border border-slate-200 px-4 py-2 rounded-full self-start md:self-end shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-medium">25-Year Linear Power Warranty (92% Guaranteed)</span>
          </div>
        </div>

        {/* Asymmetric Bento Grid (4 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Bento Card 1: Bifacial N-Type TOPCon Photovoltaic Cells (Col span 7 - Marquee) */}
          <div className="md:col-span-7 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-emerald-500/50 hover:shadow-md transition-all duration-300">
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-700 font-bold tracking-wider">
                  01. MODULE PHYSICS
                </span>
                <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full font-bold">
                  24.8% Cell Efficiency
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Bifacial N-Type TOPCon Silicon Architecture
                </h3>
                <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                  Unlike traditional single-sided P-type panels that degrade rapidly under high thermal stress, our dual-glass bifacial modules absorb solar radiation from both sky irradiance and ground reflection (albedo), delivering up to 32% more energy throughout cloudy mornings and late twilights.
                </p>
              </div>

              {/* Technical Feature Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[11px] block font-medium">Degradation Rate</span>
                  <span className="text-slate-900 font-telemetry font-bold text-sm">&lt; 0.4% / year</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[11px] block font-medium">Temperature Coeff.</span>
                  <span className="text-slate-900 font-telemetry font-bold text-sm">-0.29% / °C</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
                  <span className="text-slate-500 text-[11px] block font-medium">Anti-Reflective</span>
                  <span className="text-slate-900 font-telemetry font-bold text-sm">Nano-Etched Glass</span>
                </div>
              </div>
            </div>

            {/* Micro Graphic Simulation of Solar Cell Layers */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <Sun className="w-3.5 h-3.5 text-amber-500" /> Dual-Sided Light Capture
              </span>
              <span className="text-emerald-700 font-telemetry font-semibold">Zero Light-Induced Degradation (LID)</span>
            </div>
          </div>

          {/* Bento Card 2: Solid-State Modular Battery Pack (Col span 5) */}
          <div className="md:col-span-5 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-emerald-500/50 hover:shadow-md transition-all duration-300">
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-700 font-bold tracking-wider">
                  02. ENERGY STORAGE
                </span>
                <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full font-bold">
                  Solid-State Chemistry
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Modular High-Density Battery Storage
                </h3>
                <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                  Eliminates liquid electrolyte fire risks while achieving 100% usable depth of discharge. Powers high-surge inductive loads like geothermal heat pumps, air conditioners, and EV fast chargers without grid interruption.
                </p>
              </div>

              <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-sm space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Automatic Blackout Switchover</span>
                  <span className="text-[#C6F500] font-telemetry font-bold">&lt; 8 milliseconds</span>
                </div>
                <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#C6F500] h-full w-[94%]" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Continuous Output: 11.5 kW</span>
                  <span>Peak Surge: 22.0 kW</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>Stackable 10 kWh to 80 kWh</span>
              <span className="text-emerald-700 font-bold">10,000+ Cycle Life</span>
            </div>
          </div>

          {/* Bento Card 3: Sonar Smart Inverter & Arc-Fault Protection (Col span 5) */}
          <div className="md:col-span-5 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-emerald-500/50 hover:shadow-md transition-all duration-300">
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-700 font-bold tracking-wider">
                  03. SMART CONVERSION
                </span>
                <span className="text-xs bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-full font-bold">
                  99.4% CEC Rating
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Per-Panel Distributed MPPT Inverters
                </h3>
                <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                  Traditional string inverters drag down the entire array if even one panel is shadowed by a chimney or tree. Sonar’s distributed micro-converters optimize every module independently for maximum harvesting.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>NEC 2023 Rapid Shutdown compliant (&lt; 30V in 30 sec)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>AI Arc-Fault Circuit Interruption (AFCI) built-in</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Bidirectional EV Vehicle-to-Home (V2H) ready</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Dynamic Frequency Regulation</span>
              <span className="text-blue-700 font-telemetry font-bold">UL 1741-SB Certified</span>
            </div>
          </div>

          {/* Bento Card 4: Precision LIDAR Topographical Roof Mapping (Col span 7) */}
          <div className="md:col-span-7 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-emerald-500/50 hover:shadow-md transition-all duration-300">
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-700 font-bold tracking-wider">
                  04. TOPOGRAPHY &amp; SITING
                </span>
                <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full font-bold">
                  Sub-Centimeter LIDAR
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  High-Precision Ray-Tracing &amp; Shading Engine
                </h3>
                <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                  Before a single mount touches your property, our geospatial satellite modeling software constructs a full 3D digital twin of your roof geometry, dormers, nearby tree canopies, and hourly solar azimuth angles to place panels at the mathematical peak of solar generation.
                </p>
              </div>

              {/* Graphic Shading Indicator */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[11px] block font-medium">Direct Beam Yield</span>
                  <span className="text-emerald-700 font-telemetry font-bold text-lg">96.8%</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[11px] block font-medium">Diffuse Sky Ratio</span>
                  <span className="text-amber-600 font-telemetry font-bold text-lg">22.4%</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 text-[11px] block font-medium">Shade Avoidance</span>
                  <span className="text-emerald-700 font-telemetry font-bold text-lg">99.1%</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Automatic Structural Rafter Load Verification</span>
              <span className="text-emerald-700 font-bold">Zero Roof Leaks Guarantee</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
