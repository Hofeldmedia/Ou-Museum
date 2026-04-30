import type { ReactNode } from 'react';

type ScreenHeaderProps = {
  eyebrow: string;
  title: string;
  children: ReactNode;
};

export function ScreenHeader({ eyebrow, title, children }: ScreenHeaderProps) {
  return (
    <header className="mb-6 max-w-3xl animate-[fadeIn_0.35s_ease-out]">
      <p className="mb-2 text-xs font-black uppercase tracking-[0.24em] text-crimson">{eyebrow}</p>
      <h1 className="font-display text-4xl font-bold leading-tight text-charcoal sm:text-5xl">{title}</h1>
      <p className="mt-3 text-base leading-7 text-charcoal/72 sm:text-lg">{children}</p>
    </header>
  );
}
