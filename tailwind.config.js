/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			body: '#383838',
  			border: 'hsl(var(--border))',
  			borderInput: '#DDE1EB',
  			icon: '#8E8E99',
  			background: 'hsl(var(--background))',
  			'background-subtle': '#F9FAFB',
  			'background-blue': '#F0F6FF',
  			'background-green': '#E9F8E5',
			'background-red': '#FFF5F5',
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
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			DEFAULT: '0.25rem',
  			lg: 'var(--radius)',
  			full: '9999px',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		boxShadow: {
  			card: '0 2px 8px 0 rgba(16, 30, 54, 0.06)'
  		},
  		fontFamily: {
  			sans: [
  				'Inter',
  				'ui-sans-serif',
  				'system-ui',
  				'sans-serif'
  			]
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
