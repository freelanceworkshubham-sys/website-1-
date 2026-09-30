/**
 * Brand Configuration for Solar Technologies
 * 
 * Location: Ichalkaranji, Kolhapur, Maharashtra
 * Official Reference: https://solartechnologies.in/
 */

export interface BrandConfig {
  /** The official company / brand name displayed in the navigation bar */
  name: string;
  /** Optional custom uploaded logo image URL (e.g., '/solar-tech-logo.png') */
  logoUrl?: string;
  /** Optional secondary subtitle */
  tagline?: string;
}

export interface NavItemConfig {
  id: string;
  label: string;
  href: string;
  action?: 'calculator' | 'quote' | 'link';
}

/**
 * Default Brand Settings:
 * Official Solar Technologies branding (Ichalkaranji / Kolhapur).
 */
export const DEFAULT_BRAND_CONFIG: BrandConfig = {
  name: 'Solar Technologies',
  logoUrl: '/solar-tech-logo.png',
  tagline: '25+ Years of Solar Experience',
};

/**
 * Default Navigation Links:
 * Connected directly to existing sections on the page.
 */
export const DEFAULT_NAV_LINKS: NavItemConfig[] = [
  { id: 'about', label: 'About', href: '#about', action: 'link' },
  { id: 'services', label: 'Services', href: '#services', action: 'link' },
  { id: 'solar-journey', label: 'Solar Journey', href: '#solar-journey', action: 'link' },
  { id: 'projects', label: 'Projects', href: '#projects', action: 'link' },
  { id: 'calculator', label: 'Calculator', href: '#calculator', action: 'calculator' },
  { id: 'contact', label: 'Contact', href: '#contact', action: 'link' },
];

