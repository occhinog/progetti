type LogoProps = {
  /** `md` for the navbar, `sm` for the footer. */
  size?: 'md' | 'sm';
  /** Hide the "Bisplot" wordmark and render the symbol only. */
  symbolOnly?: boolean;
  className?: string;
};

/**
 * Bisplot symbol: a geometric "B". Spine, upper bowl and middle bar in ink-900;
 * the lower bowl — the anchoring stroke that closes the letter back onto the
 * spine — in terracotta. 32×32 grid, uniform 4-unit stroke, butt caps.
 */
export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Lower bowl (terracotta) — drawn first so the spine sits on top of it. */}
      <path d="M17.5 15a6 6 0 0 1 0 12H8.5" fill="none" strokeWidth={4} className="stroke-terracotta" />
      {/* Spine */}
      <rect x="6.5" y="3" width="4" height="26" className="fill-ink-900" />
      {/* Upper bowl + middle bar */}
      <path d="M8.5 5h7a5 5 0 0 1 0 10M8.5 15h9" fill="none" strokeWidth={4} className="stroke-ink-900" />
    </svg>
  );
}

export default function Logo({ size = 'md', symbolOnly = false, className = '' }: LogoProps) {
  const markSize = size === 'md' ? 'h-8 w-8' : 'h-6 w-6';
  const wordSize = size === 'md' ? 'text-xl' : 'text-base';

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark className={`${markSize} shrink-0`} />
      {!symbolOnly && (
        <span className={`font-sans font-semibold tracking-tight text-ink-900 ${wordSize}`}>Bisplot</span>
      )}
    </span>
  );
}
