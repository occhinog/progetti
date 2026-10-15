import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const borderLight = 'rgba(10, 17, 24, 0.08)';
const borderFocus = 'rgba(10, 17, 24, 0.2)';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ---- Brief tokens ----
        canvas: {
          white: '#FFFFFF',
          subtle: '#F0F5FA', // light-contrast section backgrounds
          muted: '#DFEBF6', // functional: input focus ring
        },
        ink: {
          900: '#0A1118', // primary text, strong headings, logo structure
          500: '#5D7185', // paragraphs, explanations, secondary labels
        },
        'border-light': borderLight, // 1px hairlines
        // Accent: logo detail and primary contact buttons ONLY.
        terracotta: {
          DEFAULT: '#D96B43',
          hover: '#C35B34',
        },
        // ---- Functional additions ----
        'border-focus': borderFocus, // hover/focus borders on inputs
        signal: {
          error: '#B42318', // form validation messages
        },
      },
      // Lets `border-light` / `border-focus` work as well as `border-border-light`.
      borderColor: {
        light: borderLight,
        focus: borderFocus,
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', ...defaultTheme.fontFamily.sans], // headings
        body: ['Inter', ...defaultTheme.fontFamily.sans], // text
        mono: ['"JetBrains Mono"', ...defaultTheme.fontFamily.mono], // tags, phases, metrics
      },
      borderRadius: {
        sm: '4px', // badges, tags
        md: '8px', // inputs, buttons
        lg: '12px', // cards and containers
      },
    },
  },
  plugins: [],
} satisfies Config;
