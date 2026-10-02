/**
 * Brand Configuration for Green Infra Solar & Electrical Vehicle
 *
 * Location: Sangli-Kolhapur Bypass, Miraj-Jaysingpur Railway Station, Jaysingpur
 * Category: Automobile (Dealerships) / Solar / EV
 */

export interface BrandConfig {
  /** The official company / brand name displayed in the navigation bar */
  name: string;
  /** Optional custom uploaded logo image URL (e.g., '/logo.png') */
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
 * Green Infra Solar & Electrical Vehicle (Jaysingpur, Sangli, Maharashtra)
 */
export const DEFAULT_BRAND_CONFIG: BrandConfig = {
  name: 'Green Infra Solar & EV',
  tagline: 'Solar Panels from 1kW | EV Vehicles',
};

/**
 * Default Navigation Links
 */
export const DEFAULT_NAV_LINKS: NavItemConfig[] = [
  { id: 'about', label: 'About', href: '#about', action: 'link' },
  { id: 'services', label: 'Services', href: '#services', action: 'link' },
  { id: 'how-it-works', label: 'How It Works', href: '#how-it-works', action: 'link' },
  { id: 'projects', label: 'Projects', href: '#projects', action: 'link' },
  { id: 'calculator', label: 'Calculator', href: '#calculator', action: 'calculator' },
  { id: 'contact', label: 'Contact', href: '#contact', action: 'link' },
];
