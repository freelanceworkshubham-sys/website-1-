import React, { useState, useEffect } from 'react';
import { Menu, X, Zap, Phone, Sun } from 'lucide-react';
import {
  BrandConfig,
  NavItemConfig,
  DEFAULT_BRAND_CONFIG,
  DEFAULT_NAV_LINKS,
} from '../config/brandConfig';

interface NavbarProps {
  onOpenCalculator: () => void;
  onOpenQuote: () => void;
  brand?: BrandConfig;
  navLinks?: NavItemConfig[];
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCalculator,
  onOpenQuote,
  brand = DEFAULT_BRAND_CONFIG,
  navLinks = DEFAULT_NAV_LINKS,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkVisibility = () => {
      const heroTrack = document.getElementById('experience-track');
      if (!heroTrack) {
        setIsVisible(true);
        return;
      }

      const rect = heroTrack.getBoundingClientRect();
      const totalScrollable = heroTrack.scrollHeight - window.innerHeight;

      if (totalScrollable <= 0) {
        setIsVisible(true);
        return;
      }

      // Progress within 3D Hero track:
      // 0.0 to 0.80 = 3D solar model animation slides
      // 0.80 to 1.0 = End frame Hero Section
      // > 1.0 = Subsequent sections
      const progress = -rect.top / totalScrollable;

      // Hide during 3D intro animation; reveal at End Frame Hero section and beyond
      setIsVisible(progress >= 0.78);
    };

    checkVisibility();
    window.addEventListener('scroll', checkVisibility, { passive: true });
    window.addEventListener('resize', checkVisibility, { passive: true });

    return () => {
      window.removeEventListener('scroll', checkVisibility);
      window.removeEventListener('resize', checkVisibility);
    };
  }, []);

  const handleLinkClick = (e: React.MouseEvent, item: NavItemConfig) => {
    if (item.action === 'calculator') {
      e.preventDefault();
      onOpenCalculator();
    } else if (item.action === 'quote') {
      e.preventDefault();
      onOpenQuote();
    }
  };

  return (
    <header
      className={`fixed top-3 md:top-4 left-0 right-0 z-50 flex flex-col items-center px-4 transition-opacity duration-300 ease-out ${
        isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Floating Glassmorphism Pill Navbar */}
      <nav className="glass-nav rounded-full px-3 sm:px-4 md:px-5 py-2 flex items-center justify-between gap-2 sm:gap-4 md:gap-6 max-w-4xl w-full md:w-auto text-white shadow-xl border border-white/20 bg-slate-950/70 backdrop-blur-xl">
        {/* Brand Lockup: Invisible Energy Logo + Company Name */}
        <a href="#" className="flex items-center gap-2 group shrink-0 min-w-0">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 via-[#C6F500] to-emerald-400 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
            <Sun className="w-4 h-4 text-slate-950" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-extrabold tracking-tight text-xs sm:text-sm md:text-[14px] text-white truncate leading-tight flex items-center gap-1">
              {brand.name}
              <span className="hidden sm:inline-block text-[10px] font-semibold text-[#C6F500] bg-white/10 px-1.5 py-0.2 rounded">
                Sangli
              </span>
            </span>
            <span className="text-[9px] text-slate-300 hidden md:block leading-none">
              Solar Energy Solutions • Est. 2017
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-5 text-xs lg:text-[13px] font-medium text-white/90">
          {navLinks.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => handleLinkClick(e, item)}
              className="hover:text-[#C6F500] transition-colors duration-150 py-1"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Primary Action Button & Phone Link */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="tel:+918888208099"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-white/90 hover:text-[#C6F500] transition-colors px-2 py-1.5"
            title="Call Invisible Energy Sangli"
          >
            <Phone className="w-3.5 h-3.5 text-[#C6F500]" />
            <span className="hidden lg:inline">+91 8888208099</span>
          </a>

          <button
            onClick={onOpenQuote}
            className="group flex items-center gap-1 sm:gap-1.5 bg-[#C6F500] hover:bg-[#b8e500] text-black text-[11px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 rounded-full transition-all duration-200 shadow-xs hover:scale-105 active:scale-95 whitespace-nowrap cursor-pointer min-h-[32px]"
          >
            <span>Get Free Quote</span>
            <Zap className="w-3 h-3 fill-black text-black group-hover:rotate-12 transition-transform" />
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1 text-white/90 hover:text-white transition-colors cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> : <Menu className="w-4 h-4 sm:w-4.5 sm:h-4.5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 w-full max-w-sm rounded-2xl p-4 bg-[#0A1610]/95 backdrop-blur-2xl border border-white/20 shadow-2xl text-white space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="pb-2 mb-2 border-b border-white/10 flex items-center justify-between">
            <span className="text-xs font-bold text-[#C6F500]">Invisible Energy</span>
            <span className="text-[10px] text-slate-400">Sangliwadi, Sangli</span>
          </div>

          {navLinks.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleLinkClick(e, item);
              }}
              className={`block text-xs font-semibold py-2 px-3 rounded-lg transition-colors ${
                item.action === 'calculator'
                  ? 'text-[#C6F500] bg-white/5'
                  : 'text-white/90 hover:bg-white/10'
              }`}
            >
              {item.label}
            </a>
          ))}

          <a
            href="tel:+918888208099"
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/10 text-white text-xs font-medium hover:bg-white/15 transition-colors mt-2"
          >
            <Phone className="w-3.5 h-3.5 text-[#C6F500]" />
            <span>Call +91 8888208099</span>
          </a>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenQuote();
            }}
            className="w-full bg-[#C6F500] text-black font-bold py-2 rounded-xl text-center text-xs shadow-sm mt-1 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Get Free Quote</span>
            <Zap className="w-3.5 h-3.5 fill-black" />
          </button>
        </div>
      )}
    </header>
  );
};
