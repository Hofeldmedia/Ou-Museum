/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#841617',
        'brand-dark': '#4E0002',
        surface: '#FFFFFF',
        'surface-muted': '#F0F0F0',
        'text-primary': '#000000',
        'text-secondary': '#323232',
        'border-subtle': 'rgba(50, 50, 50, 0.14)',
        'accent-sky': '#BCDCEB',
        'accent-leaf': '#8CA57D',
        'accent-stone': '#BEB4A5',
        cream: '#F0F0F0',
        parchment: '#FFFFFF',
        crimson: '#841617',
        oxblood: '#4E0002',
        charcoal: '#323232',
        gold: '#BEB4A5',
        brass: '#841617',
        black: '#000000',
      },
      boxShadow: {
        exhibit: '0 24px 70px rgba(0, 0, 0, 0.2)',
      },
      fontFamily: {
        display: ['var(--font-headline)'],
        sans: ['var(--font-body)'],
        accent: ['var(--font-accent)'],
        editorial: ['var(--font-editorial)'],
      },
      borderRadius: {
        museum: '0.375rem',
      },
    },
  },
  plugins: [],
};
