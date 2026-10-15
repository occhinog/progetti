import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const borderLight = 'rgba(10, 17, 24, 0.08)';
const borderFocus = 'rgba(10, 17, 24, 0.2)';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: {
          white: '#FFFFFF', // main background
          subtle: '#F0F5FA', // alternate sections, cards
          muted: '#DFEBF6', // highlighted elements, focus rings
        },
        ink: {
          900: '#0A1118', // headings, primary text, header
          800: '#131F2B', // dark borders, badges
          500: '#5D7185', // secondary text, captions
        },
        'border-light': borderLight,
        'border-focus': borderFocus,
        // Accent: logo detail and primary actions ONLY.
        terracotta: {
          DEFAULT: '#D96B43',
          hover: '#C35B34',
        },
        // Functional colour for form validation messages.
        signal: {
          error: '#B42318',
        },
      },
      // Lets `border-light` / `border-focus` work as well as `border-border-light`.
      borderColor: {
        light: borderLight,
        focus: borderFocus,
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', ...defaultTheme.fontFamily.sans],
        body: ['Inter', ...defaultTheme.fontFamily.sans],
        mono: ['"JetBrains Mono"', ...defaultTheme.fontFamily.mono],
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
