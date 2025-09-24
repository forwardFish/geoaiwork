import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';
import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        aurora: 'aurora 60s linear infinite',
      },
      keyframes: {
        aurora: {
          from: {
            backgroundPosition: '50% 50%, 50% 50%',
          },
          to: {
            backgroundPosition: '350% 50%, 350% 50%',
          },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            'maxWidth': 'none',
            'color': '#374151',
            'lineHeight': '1.75',
            'h1': {
              fontSize: '2.5rem',
              fontWeight: '800',
              lineHeight: '1.2',
              marginTop: '3rem',
              marginBottom: '1.5rem',
              color: '#111827',
              letterSpacing: '-0.025em',
            },
            'h2': {
              fontSize: '2rem',
              fontWeight: '700',
              lineHeight: '1.3',
              marginTop: '2.5rem',
              marginBottom: '1.25rem',
              color: '#1f2937',
              letterSpacing: '-0.025em',
            },
            'h3': {
              fontSize: '1.5rem',
              fontWeight: '600',
              lineHeight: '1.4',
              marginTop: '2rem',
              marginBottom: '1rem',
              color: '#374151',
            },
            'h4': {
              fontSize: '1.25rem',
              fontWeight: '600',
              lineHeight: '1.4',
              marginTop: '1.5rem',
              marginBottom: '0.75rem',
              color: '#4b5563',
            },
            'h5': {
              fontSize: '1.125rem',
              fontWeight: '600',
              lineHeight: '1.4',
              marginTop: '1.25rem',
              marginBottom: '0.5rem',
              color: '#6b7280',
            },
            'h6': {
              fontSize: '1rem',
              fontWeight: '600',
              lineHeight: '1.4',
              marginTop: '1rem',
              marginBottom: '0.5rem',
              color: '#9ca3af',
            },
            'p': {
              marginTop: '1.25rem',
              marginBottom: '1.25rem',
              fontSize: '1.125rem',
              lineHeight: '1.75',
            },
            'a': {
              'color': '#2563eb',
              'textDecoration': 'underline',
              'fontWeight': '500',
              'transition': 'color 0.2s ease',
              '&:hover': {
                color: '#1d4ed8',
              },
            },
            'blockquote': {
              borderLeftColor: '#e5e7eb',
              borderLeftWidth: '4px',
              paddingLeft: '1.5rem',
              fontStyle: 'italic',
              fontSize: '1.125rem',
              color: '#6b7280',
              marginTop: '2rem',
              marginBottom: '2rem',
            },
            'code': {
              color: '#dc2626',
              backgroundColor: '#f3f4f6',
              paddingLeft: '0.25rem',
              paddingRight: '0.25rem',
              paddingTop: '0.125rem',
              paddingBottom: '0.125rem',
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
              fontWeight: '600',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            'pre': {
              backgroundColor: '#1f2937',
              color: '#f9fafb',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              marginTop: '2rem',
              marginBottom: '2rem',
              overflow: 'auto',
            },
            'pre code': {
              color: 'inherit',
              backgroundColor: 'transparent',
              padding: '0',
            },
            'ul': {
              listStyleType: 'disc',
              paddingLeft: '1.5rem',
              marginTop: '1.25rem',
              marginBottom: '1.25rem',
            },
            'ol': {
              listStyleType: 'decimal',
              paddingLeft: '1.5rem',
              marginTop: '1.25rem',
              marginBottom: '1.25rem',
            },
            'li': {
              marginTop: '0.5rem',
              marginBottom: '0.5rem',
              fontSize: '1.125rem',
              lineHeight: '1.75',
            },
            'table': {
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: '2rem',
              marginBottom: '2rem',
            },
            'th': {
              backgroundColor: '#f9fafb',
              padding: '0.75rem',
              textAlign: 'left',
              fontWeight: '600',
              borderBottom: '2px solid #e5e7eb',
            },
            'td': {
              padding: '0.75rem',
              borderBottom: '1px solid #e5e7eb',
            },
          },
        },
        lg: {
          css: {
            h1: {
              fontSize: '3rem',
              marginTop: '3.5rem',
              marginBottom: '2rem',
            },
            h2: {
              fontSize: '2.25rem',
              marginTop: '3rem',
              marginBottom: '1.5rem',
            },
            h3: {
              fontSize: '1.75rem',
              marginTop: '2.5rem',
              marginBottom: '1.25rem',
            },
            p: {
              fontSize: '1.25rem',
              lineHeight: '1.8',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
            },
            li: {
              fontSize: '1.25rem',
              lineHeight: '1.8',
            },
          },
        },
      },
    },
  },
  plugins: [
    typography,
    addVariablesForColors,
  ],
};

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }: any) {
  const allColors = flattenColorPalette(theme('colors'));
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val]),
  );

  addBase({
    ':root': newVars,
  });
}

export default config;
