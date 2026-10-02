import React, { useState, useEffect } from 'react';
import { Menu, X, Zap } from 'lucide-react';
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
      // 0.80 to 1.0 = End frame Hero Section ("Next-Generation Solar Energy Solutions")
      // > 1.0 = Subsequent sections (About, Solar Journey, Projects, Services, etc.)
      const progress = -rect.top / totalScrollable;

      // Hide during 3D animation; reveal at End Frame Hero section and beyond
      setIsVisible(progress >= 0.80);
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
      {/* 30% Slimmer Floating Glassmorphism Pill Navbar */}
      <nav className="glass-nav rounded-full px-3 sm:px-4 md:px-5 py-1.5 flex items-center justify-between gap-2 sm:gap-4 md:gap-7 max-w-3xl w-full md:w-auto text-white">
        {/* Brand Lockup: Green Infra Logo + Company Name */}
        <a href="#" className="flex items-center gap-1.5 sm:gap-2 group shrink-0 min-w-0">
          <div className="w-6 h-6 rounded-full bg-[#C6F500] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
            {/* Green Infra: Leaf + Sun mark */}
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
              {/* Sun rays */}
              <circle cx="12" cy="10" r="3.5" fill="#1a3a1a" />
              <line x1="12" y1="4" x2="12" y2="2" stroke="#1a3a1a" strokeWidth="1.8" strokeLinecap="round"/>
              <line x1="17.5" y1="5.5" x2="19" y2="4" stroke="#1a3a1a" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="20" y1="10" x2="22" y2="10" stroke="#1a3a1a" strokeWidth="1.5" strokeLinecap="round"/>
              {/* EV bolt */}
              <path d="M10 16 L8 21 L14 15 L12 15 L14 10 L8 17 Z" fill="#1a3a1a"/>
            </svg>
          </div>
          <span className="font-bold tracking-tight text-xs sm:text-sm md:text-[14px] text-white truncate leading-tight">
            Green Infra Solar & EV
          </span>
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

        {/* Primary Action Button: Compact Neon Lime Pill */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={onOpenQuote}
            className="group flex items-center gap-1 sm:gap-1.5 bg-[#C6F500] hover:bg-[#b8e500] text-black text-[11px] sm:text-xs font-bold px-2.5 sm:px-3.5 py-1.5 rounded-full transition-all duration-200 shadow-xs hover:scale-105 active:scale-95 whitespace-nowrap cursor-pointer min-h-[32px]"
          >
            <span>Get Quote</span>
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
        <div className="md:hidden mt-2 w-full max-w-sm rounded-2xl p-4 bg-[#0A1610]/80 backdrop-blur-2xl border border-white/20 shadow-2xl text-white space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
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
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenQuote();
            }}
            className="w-full bg-[#C6F500] text-black font-bold py-2 rounded-xl text-center text-xs shadow-sm mt-2 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Contact Green Infra</span>
            <Zap className="w-3.5 h-3.5 fill-black" />
          </button>
        </div>
      )}
    </header>
  );
};
