/** @type {import('tailwindcss').Config} */

import animatePlugin from "tailwindcss-animate"

export default {
	content: [
		"./index.html",
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	darkMode: ["class"],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			fontFamily: {
				sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
				mono: ['JetBrains Mono', 'Consolas', 'Monaco', 'Courier New', 'monospace'],
			},
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"fade-in": {
					from: { opacity: "0" },
					to: { opacity: "1" },
				},
				"fade-out": {
					from: { opacity: "1" },
					to: { opacity: "0" },
				},
				"slide-in": {
					from: { transform: "translateY(-10px)" },
					to: { transform: "translateY(0)" },
				},
				"glow-pulse": {
					"0%, 100%": { 
						opacity: "0.4", 
						boxShadow: "0 0 5px rgba(26,255,0,0.2)" 
					},
					"50%": { 
						opacity: "0.6", 
						boxShadow: "0 0 15px rgba(26,255,0,0.6)" 
					},
				},
				"subtle-bounce": {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-2px)" },
					"blur-in": {
						"0%": { backdropFilter: "blur(0px)" },
						"100%": { backdropFilter: "blur(8px)" },
					},
					"opacity-pulse": {
						"0%, 100%": { opacity: "0.8" },
						"50%": { opacity: "0.5" },
					},
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"fade-in": "fade-in 0.3s ease-out",
				"fade-out": "fade-out 0.3s ease-out",
				"slide-in": "slide-in 0.3s ease-out",
				"glow-pulse": "glow-pulse 3s ease-in-out infinite",
				"subtle-bounce": "subtle-bounce 3s ease-in-out infinite",
				"blur-in": "blur-in 0.4s ease-in-out forwards",
				"opacity-pulse": "opacity-pulse 3s ease-in-out infinite",
			},
			backdropBlur: {
				xs: '2px',
			}
		},
	},
	plugins: [animatePlugin],
}
