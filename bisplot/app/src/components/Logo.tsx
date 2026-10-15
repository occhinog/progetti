import type { SVGProps } from 'react';

type LogoProps = {
  /** `md` for the navbar, `sm` for the footer. */
  size?: 'md' | 'sm';
  /** Render the monogram only, without the "Bisplot" wordmark. */
  symbolOnly?: boolean;
  className?: string;
};

/*
 * Bisplot monogram, redrawn from the master artwork as exact geometry
 * (331 × 424 units): straight edges on a whole-unit grid, two parallel 45°
 * cuts, elliptical bowls, and a constant 13.5-unit gap between the ink
 * structure and the terracotta lower bowl.
 */
const STRUCTURE =
  'M0 0H192.76A116.35 120.34 0 0 1 309.11 120.34A133.38 129.66 0 0 1 175.73 250H90V299.5L0 389.5Z' +
  'M90 82H183.2A45.62 49.18 0 0 1 228.83 131.18A52.98 53.82 0 0 1 175.85 185H90Z';
const ACCENT =
  'M0 424V408.59L90 318.59V357H182.86A54.49 50.12 0 0 0 237.35 306.88A54.49 53.64 0 0 0 208.94 259.79' +
  'A146.88 143.16 0 0 0 278.97 222.17A116.66 103.94 0 0 1 330.57 308.44A116.66 115.56 0 0 1 213.91 424Z';

type LogoMarkProps = Omit<SVGProps<SVGSVGElement>, 'viewBox'> & {
  /** `inverse` draws the structure in white, for dark backgrounds. */
  tone?: 'default' | 'inverse';
};

export function LogoMark({ className = '', tone = 'default', ...rest }: LogoMarkProps) {
  return (
    <svg
      {...rest}
      viewBox="0 0 331 424"
      className={className}
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={STRUCTURE} fillRule="evenodd" className={tone === 'inverse' ? 'fill-white' : 'fill-ink-900'} />
      <path d={ACCENT} className="fill-terracotta" />
    </svg>
  );
}

export default function Logo({ size = 'md', symbolOnly = false, className = '' }: LogoProps) {
  // Width follows the mark's 331:424 aspect ratio.
  const markSize = size === 'md' ? 'h-8 w-[25px]' : 'h-6 w-[19px]';
  const wordSize = size === 'md' ? 'text-xl' : 'text-base';

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className={`${markSize} shrink-0`} />
      {!symbolOnly && (
        <span className={`font-sans font-bold tracking-tight text-ink-900 ${wordSize}`}>Bisplot</span>
      )}
    </span>
  );
}
