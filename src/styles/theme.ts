export const theme = {
	colors: {
		// Primary brand colors - dark navy and teal
		primary: '#1a365d',
		primaryLight: '#2d4a6b',
		primaryDark: '#0f2438',

		// Accent colors
		accent: '#00b4a6',
		accentLight: '#00d4c4',
		accentDark: '#009688',

		// Neutral colors
		text: '#1a202c',
		textLight: '#4a5568',
		textMuted: '#718096',
		bg: '#FFFDF6',
		bgLight: '#f7fafc',
		bgDark: '#edf2f7',

		// Surface colors
		surface: '#ffffff',
		surfaceLight: '#f8f9fa',
		surfaceDark: '#e2e8f0',

		// Status colors
		success: '#38a169',
		successLight: '#68d391',
		warning: '#d69e2e',
		warningLight: '#f6e05e',
		error: '#e53e3e',
		errorLight: '#fc8181',
		info: '#3182ce',
		infoLight: '#63b3ed',

		// Border and divider colors
		border: '#e2e8f0',
		borderLight: '#f1f5f9',
		borderDark: '#cbd5e0',

		// Rating colors
		rating: '#ffd700',
		ratingEmpty: '#e2e8f0',

		// Overlay colors
		overlay: 'rgba(0, 0, 0, 0.5)',
		overlayLight: 'rgba(0, 0, 0, 0.1)',
	},

	// Border radius values
	radii: {
		none: '0',
		sm: '4px',
		md: '8px',
		lg: '12px',
		xl: '16px',
		'2xl': '20px',
		'3xl': '24px',
		full: '9999px',
	},

	// Shadow values
	shadows: {
		none: 'none',
		sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
		md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
		lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
		xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
		'2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
		inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
	},

	// Spacing scale (4px base unit)
	spacing: {
		0: '0',
		1: '4px',
		2: '8px',
		3: '12px',
		4: '16px',
		5: '20px',
		6: '24px',
		8: '32px',
		10: '40px',
		12: '48px',
		16: '64px',
		20: '80px',
		24: '96px',
		32: '128px',
		40: '160px',
		48: '192px',
		56: '224px',
		64: '256px',
	},

	// Typography
	fonts: {
		sans: [
			'-apple-system',
			'BlinkMacSystemFont',
			'"Segoe UI"',
			'Roboto',
			'"Helvetica Neue"',
			'Arial',
			'"Noto Sans"',
			'sans-serif',
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"',
			'"Noto Color Emoji"',
		].join(', '),
		serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'].join(
			', '
		),
		mono: [
			'Menlo',
			'Monaco',
			'Consolas',
			'"Liberation Mono"',
			'"Courier New"',
			'monospace',
		].join(', '),
	},

	fontSizes: {
		xs: '12px',
		sm: '14px',
		base: '16px',
		lg: '18px',
		xl: '20px',
		'2xl': '24px',
		'3xl': '30px',
		'4xl': '36px',
		'5xl': '48px',
		'6xl': '60px',
	},

	fontWeights: {
		hairline: 100,
		thin: 200,
		light: 300,
		normal: 400,
		medium: 500,
		semibold: 600,
		bold: 700,
		extrabold: 800,
		black: 900,
	},

	lineHeights: {
		none: 1,
		tight: 1.25,
		snug: 1.375,
		normal: 1.5,
		relaxed: 1.625,
		loose: 2,
	},

	letterSpacings: {
		tighter: '-0.05em',
		tight: '-0.025em',
		normal: '0',
		wide: '0.025em',
		wider: '0.05em',
		widest: '0.1em',
	},

	// Breakpoints
	breakpoints: {
		sm: '640px',
		md: '768px',
		lg: '1024px',
		xl: '1280px',
		'2xl': '1536px',
	},

	// Z-index scale
	zIndices: {
		hide: -1,
		auto: 'auto',
		base: 0,
		docked: 10,
		dropdown: 1000,
		sticky: 1100,
		banner: 1200,
		overlay: 1300,
		modal: 1400,
		popover: 1500,
		skipLink: 1600,
		toast: 1700,
		tooltip: 1800,
	},
} as const;

export type Theme = typeof theme;
