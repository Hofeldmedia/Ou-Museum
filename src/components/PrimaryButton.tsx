import type { ButtonHTMLAttributes, ReactNode } from 'react';

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
};

export function PrimaryButton({ children, variant = 'primary', className = '', ...props }: PrimaryButtonProps) {
  const variants = {
    primary: 'bg-crimson text-white shadow-lg shadow-crimson/20 hover:bg-oxblood',
    secondary: 'border border-charcoal/20 bg-white/80 text-charcoal hover:border-crimson hover:text-crimson hover:bg-white',
    ghost: 'bg-transparent text-charcoal hover:bg-crimson/5 hover:text-crimson',
  };

  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-bold uppercase tracking-[0.12em] transition duration-200 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-crimson/20 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
