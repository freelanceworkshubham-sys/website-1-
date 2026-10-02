import React, { useState } from 'react';
import { X, CheckCircle2, ArrowRight, ShieldCheck, Sun, Zap } from 'lucide-react';

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
    propertyType: 'residential',
    electricBill: initialData?.inputs?.monthlyBill || 3000,
    preferredTimeline: '1-3 months',
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
      errs.address = 'Property address is required for LIDAR satellite scan';
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
              Solar Assessment &amp; Feasibility Scheduled
            </h3>

            <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
              Thank you, <strong className="text-slate-900">{formData.fullName}</strong>. Our solar engineering team has queued your customized system proposal for:
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-md mx-auto text-left text-xs space-y-1.5 font-mono">
              <p className="text-slate-500">LOCATION: <span className="text-slate-900 font-semibold">{formData.address}</span></p>
              <p className="text-slate-500">CONTACT: <span className="text-slate-900 font-semibold">{formData.email} · {formData.phone}</span></p>
              <p className="text-slate-500">EST. CURRENT BILL: <span className="text-emerald-700 font-bold">₹{new Intl.NumberFormat('en-IN').format(formData.electricBill)}/mo</span></p>
              <p className="text-slate-500">RESPONSE TIME: <span className="text-emerald-700 font-bold">Within 24 Hours</span></p>
            </div>

            <p className="text-xs text-slate-500">
              A Green Infra representative will contact you to discuss your solar or EV requirement and provide a complete solution proposal.
            </p>

            <button
              onClick={onClose}
              className="mt-4 bg-[#C6F500] hover:bg-[#b8e500] text-black font-bold px-8 py-3 rounded-full text-sm shadow-md transition-all cursor-pointer"
            >
              Return to Website
            </button>
          </div>
        ) : (
          /* Form Content */
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                Zero-Obligation Proposal
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Request Your Site Assessment &amp; Solar Quote
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm">
                Get a customised solar panel solution (from 1kW) or EV enquiry response from Green Infra Solar & Electrical Vehicle, Jaysingpur.
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
                    placeholder="e.g. Ramesh Patil"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all"
                  />
                  {errors.fullName && <p className="text-[11px] text-rose-500">{errors.fullName}</p>}
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. ramesh@example.com"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all"
                  />
                  {errors.email && <p className="text-[11px] text-rose-500">{errors.email}</p>}
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 98230 12345"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all"
                  />
                  {errors.phone && <p className="text-[11px] text-rose-500">{errors.phone}</p>}
                </div>

                {/* Property Type */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Property Type</label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 outline-none"
                  >
                    <option value="residential">Bungalow / Villa</option>
                    <option value="apartment">Housing Society / Apartment</option>
                    <option value="commercial">Commercial / Hospital / Complex</option>
                    <option value="industrial">Industrial / Textile / Factory</option>
                  </select>
                </div>
              </div>

              {/* Property Address */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Property Address, City / District *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. Station Road, Ichalkaranji / Tarabai Park, Kolhapur"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all"
                />
                {errors.address && <p className="text-[11px] text-rose-500">{errors.address}</p>}
              </div>

              {/* Estimated Monthly Electric Bill */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 font-semibold">Average Monthly Electricity Cost</span>
                  <span className="text-emerald-700 font-telemetry font-bold">₹{new Intl.NumberFormat('en-IN').format(formData.electricBill)} / mo</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="100000"
                  step="500"
                  value={formData.electricBill}
                  onChange={(e) => setFormData({ ...formData, electricBill: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              {/* Privacy and Verification notice */}
              <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Strict privacy guarantee. Your contact details are used solely for your engineering feasibility report.</span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#C6F500] hover:bg-[#b8e500] active:scale-98 disabled:opacity-50 text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm shadow-md transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Preparing Solar Feasibility Report...</span>
                ) : (
                  <>
                    <span>Submit Quote Request</span>
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
