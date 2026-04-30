import type { ReactNode } from 'react';

export function QuizContainer({ children }: { children: ReactNode }) {
  return <section className="space-y-5">{children}</section>;
}
