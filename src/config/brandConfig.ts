/**
 * Brand Configuration for Invisible Energy
 *
 * Location: 138/1/A/9, Magdum Park, Sangliwadi Toll Naka, Sangli - 416416, Maharashtra, India
 * Established: 2017 (7+ Years of Excellence)
 * Category: Solar EPC, Rooftop Solar, On-Grid/Off-Grid, Street Lights, Solar Water Heaters
 * Website: https://www.invisibleenergy.in
 */

export interface BrandConfig {
  /** The official company / brand name displayed across the website */
  name: string;
  legalName?: string;
  tagline: string;
  sinceYear: number;
  phonePrimary: string;
  phoneSecondary: string;
  email: string;
  address: string;
  workingHours: string;
  socials: {
    youtube: string;
    whatsapp: string;
    instagram: string;
  };
  metrics: {
    projectsDone: string;
    totalClients: string;
    expertStaff: string;
    awardsWon: string;
    billSavings: string;
    warrantyYears: string;
  };
}

export interface NavItemConfig {
  id: string;
  label: string;
  href: string;
  action?: 'calculator' | 'quote' | 'link';
}

/**
 * Default Brand Settings for Invisible Energy (Sangli, Maharashtra)
 */
export const DEFAULT_BRAND_CONFIG: BrandConfig = {
  name: 'Invisible Energy',
  legalName: 'Invisible Energy Solar Power Systems',
  tagline: "Maharashtra's Trusted Solar Energy Partner Since 2017",
  sinceYear: 2017,
  phonePrimary: '+91 8888208099',
  phoneSecondary: '+91 7020205273',
  email: 'contact@invisibleenergy.in',
  address: '138/1/A/9, Magdum Park, Sangliwadi Toll Naka, Sangli - 416416, Maharashtra',
  workingHours: 'Mon - Sat (09:00 AM - 06:00 PM)',
  socials: {
    youtube: 'https://www.youtube.com/@invisibleenergy-t9k',
    whatsapp: 'https://wa.me/+918888208099',
    instagram: 'https://www.instagram.com/invisible_energy_',
  },
  metrics: {
    projectsDone: '500+',
    totalClients: '400+',
    expertStaff: '25+',
    awardsWon: '15+',
    billSavings: 'Up to 80%',
    warrantyYears: '25+ Years',
  },
};

/**
 * Default Navigation Links matching invisibleenergy.in
 */
export const DEFAULT_NAV_LINKS: NavItemConfig[] = [
  { id: 'about', label: 'About Us', href: '#about', action: 'link' },
  { id: 'services', label: 'Services', href: '#services', action: 'link' },
  { id: 'workflow', label: 'Work Stages', href: '#workflow', action: 'link' },
  { id: 'portfolio', label: 'Portfolio', href: '#portfolio', action: 'link' },
  { id: 'calculator', label: 'Solar Calculator', href: '#calculator', action: 'calculator' },
  { id: 'faq', label: 'FAQ', href: '#faq', action: 'link' },
  { id: 'contact', label: 'Contact Us', href: '#contact', action: 'link' },
];
