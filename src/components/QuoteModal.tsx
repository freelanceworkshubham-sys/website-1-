import React, { useState } from 'react';
import { X, CheckCircle2, ArrowRight, ShieldCheck, Sun, Zap, Phone, MessageCircle } from 'lucide-react';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose, initialData }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    serviceInterest: initialData?.systemName || 'On Grid Solar System',
    propertyType: 'residential',
    electricBill: initialData?.inputs?.monthlyBill || 3000,
    preferredTimeline: 'Immediate (1-2 weeks)',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please provide a valid email format';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required for engineering contact';
    }
    if (!formData.address.trim()) {
      errs.address = 'Property address or city in Maharashtra is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          /* Success Screen */
          <div className="py-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Solar Assessment Scheduled!
            </h3>

            <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
              Thank you, <strong className="text-slate-900">{formData.fullName}</strong>. An Invisible Energy solar specialist has queued your customized system proposal for:
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-md mx-auto text-left text-xs space-y-1.5 font-mono">
              <p className="text-slate-500">LOCATION: <span className="text-slate-900 font-semibold">{formData.address}</span></p>
              <p className="text-slate-500">SERVICE: <span className="text-emerald-700 font-bold">{formData.serviceInterest}</span></p>
              <p className="text-slate-500">CONTACT: <span className="text-slate-900 font-semibold">{formData.phone}</span></p>
              <p className="text-slate-500">EST. CURRENT BILL: <span className="text-emerald-700 font-bold">₹{new Intl.NumberFormat('en-IN').format(formData.electricBill)}/mo</span></p>
              <p className="text-slate-500">RESPONSE TIME: <span className="text-emerald-700 font-bold">Within 24 Hours</span></p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="https://wa.me/+918888208099"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-full text-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Instant WhatsApp Connect</span>
              </a>

              <button
                onClick={onClose}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-full text-xs transition-colors cursor-pointer"
              >
                Return to Website
              </button>
            </div>
          </div>
        ) : (
          /* Form Content */
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                Free Site Survey &amp; Subsidy Assistance
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Request Solar Quote &amp; Feasibility Study
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm">
                Get a customized solar proposal from Invisible Energy — Sangli's leading solar installer since 2017.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Rajesh Patil"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all"
                  />
                  {errors.fullName && <p className="text-[11px] text-rose-500">{errors.fullName}</p>}
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 88882 08099"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all"
                  />
                  {errors.phone && <p className="text-[11px] text-rose-500">{errors.phone}</p>}
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. contact@example.com"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all"
                  />
                  {errors.email && <p className="text-[11px] text-rose-500">{errors.email}</p>}
                </div>

                {/* Service Interest */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Solar Solution Needed</label>
                  <select
                    value={formData.serviceInterest}
                    onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 outline-none"
                  >
                    <option value="On Grid Solar System">On Grid Solar System (Net Metered)</option>
                    <option value="Off Grid Solar System">Off Grid Solar System (Battery Backup)</option>
                    <option value="Rooftop Solar System">Rooftop Solar System (Residential/Commercial)</option>
                    <option value="Tier-1 Solar Panels">Tier-1 Solar Panels Wholesale/Retail</option>
                    <option value="Solar Water Heater">Solar Water Heater / Geyser</option>
                    <option value="Solar Street Lights">Solar Street Lights / Highmast</option>
                    <option value="Solar Maintenance">Solar Plant Maintenance &amp; Repair</option>
                  </select>
                </div>
              </div>

              {/* Property Address */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Property Address, City / District in Maharashtra *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. Sangliwadi, Sangli / Pune / Kolhapur / Mumbai"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all"
                />
                {errors.address && <p className="text-[11px] text-rose-500">{errors.address}</p>}
              </div>

              {/* Monthly Electricity Bill Range */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-semibold text-slate-700">Current Monthly Electricity Bill</label>
                  <span className="font-bold text-emerald-700 font-mono">
                    ₹{new Intl.NumberFormat('en-IN').format(formData.electricBill)} / month
                  </span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="100000"
                  step="500"
                  value={formData.electricBill}
                  onChange={(e) => setFormData({ ...formData, electricBill: Number(e.target.value) })}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* Trust Badge */}
              <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Your information is private. Invisible Energy Sangli guarantees zero unsolicited spam.
                </span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#C6F500] hover:bg-[#b8e500] text-black font-bold py-3.5 rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
              >
                {isSubmitting ? (
                  <span>Submitting to Invisible Energy...</span>
                ) : (
                  <>
                    <span>Submit &amp; Schedule Site Feasibility</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
