/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#007AFF',
        muted: '#5E5E65',
        body: '#383838',
        border: '#EAECF0',
        borderInput: '#DDE1EB',
        icon: '#8E8E99',

        background: '#F7F7FC',
        'background-subtle': '#F9FAFB',
        'background-blue': '#F0F6FF',
        'background-green': '#E9F8E5',

        'status-live': '#FF0000',
        'status-live-light': '#fee2e2',
        'status-live-text': '#FF0000',

        'status-scheduled': '#007AFF',
        'status-scheduled-light': '#F0F6FF',
        'status-scheduled-text': '#007AFF',

        'status-completed': '#383838',
        'status-completed-light': '#F9FAFB',
        'status-completed-text': '#383838',

        'status-success': '#2C742F',
        'status-success-light': '#E9F8E5',
        'status-success-text': '#2C742F',
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        full: '9999px',
      },
      boxShadow: {
        card: '0 2px 8px 0 rgba(16, 30, 54, 0.06)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
