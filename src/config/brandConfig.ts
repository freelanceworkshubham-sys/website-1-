/**
 * Brand Configuration for GVP Solar Energy
 * 
 * Website owner / admin can edit this file to configure:
 * - Company/Brand Name
 * - Logo (upload custom image URL or use default official SVG)
 * - Navigation links
 */

export interface BrandConfig {
  /** The official company / brand name displayed in the navigation bar */
  name: string;
  /** Optional custom uploaded logo image URL (e.g., '/images/custom-logo.png') */
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
 * Retains the exact official GVP Solar branding.
 */
export const DEFAULT_BRAND_CONFIG: BrandConfig = {
  name: 'GVP Solar',
  tagline: 'Solar Energy Solutions',
};

/**
 * Default Navigation Links:
 * Connected directly to existing sections on the page.
 * If sections are added or removed, update this list accordingly.
 */
export const DEFAULT_NAV_LINKS: NavItemConfig[] = [
  { id: 'about', label: 'About GVP', href: '#about', action: 'link' },
  { id: 'solar-journey', label: 'Solar Journey', href: '#solar-journey', action: 'link' },
  { id: 'projects', label: 'Projects', href: '#projects', action: 'link' },
  { id: 'services', label: 'Services', href: '#services', action: 'link' },
  { id: 'calculator', label: 'Calculator', href: '#calculator', action: 'calculator' },
];
