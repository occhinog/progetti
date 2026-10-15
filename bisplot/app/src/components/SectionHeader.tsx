type SectionHeaderProps = {
  /** Mono eyebrow above the title. */
  label: string;
  title: string;
  /** id applied to the <h2>, referenced by the section's aria-labelledby. */
  titleId: string;
  subtitle?: string;
  className?: string;
};

/** Shared eyebrow + H2 + optional subtitle used by the content sections. */
export default function SectionHeader({ label, title, titleId, subtitle, className = '' }: SectionHeaderProps) {
  return (
    <div className={`max-w-3xl ${className}`}>
      <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-wider text-ink-500">
        <span aria-hidden="true" className="h-px w-6 bg-border-focus" />
        {label}
      </p>
      <h2
        id={titleId}
        className="mt-5 text-balance font-sans text-3xl font-semibold leading-[1.2] tracking-tight text-ink-900 sm:text-4xl"
      >
        {title}
      </h2>
      {subtitle && <p className="mt-5 max-w-2xl font-body text-lg leading-relaxed text-ink-500">{subtitle}</p>}
    </div>
  );
}
