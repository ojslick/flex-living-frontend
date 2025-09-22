import React from 'react';
import styled from 'styled-components';

// Flex Living color theme - extracted from the cloned website
const FlexLivingTheme = {
	colors: {
		background: '#FFFDF6', // Warm cream background from Flex Living
		primary: '#284E4C', // Dark teal primary color
		secondary: '#5C5C5A', // Muted gray
		accent: '#FFF9E9', // Light cream accent
		border: 'rgba(92, 92, 90, 0.2)', // 20% opacity border
		surface: '#FFFFFF',
		text: '#284E4C',
		textLight: '#5C5C5A',
	},
	spacing: {
		1: '0.25rem',
		2: '0.5rem',
		3: '0.75rem',
		4: '1rem',
		5: '1.25rem',
		6: '1.5rem',
		8: '2rem',
		10: '2.5rem',
		12: '3rem',
		16: '4rem',
	},
	radii: {
		sm: '0.25rem',
		md: '0.5rem',
		lg: '0.75rem',
		xl: '1rem',
	},
	fontSizes: {
		xs: '0.75rem',
		sm: '0.875rem',
		base: '1rem',
		lg: '1.125rem',
		xl: '1.25rem',
		'2xl': '1.5rem',
		'3xl': '1.875rem',
		'4xl': '2.25rem',
	},
	fontWeights: {
		normal: '400',
		medium: '500',
		semibold: '600',
		bold: '700',
	},
};

const ImageGrid = styled.div`
	display: flex;
	gap: ${FlexLivingTheme.spacing[3]};
`;

const LargeImageSquare = styled.div`
	width: 616px;
	height: 600px;
	background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
	border-radius: ${FlexLivingTheme.radii.lg};
	border: 2px solid ${FlexLivingTheme.colors.border};
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: ${FlexLivingTheme.fontSizes['2xl']};
	color: ${FlexLivingTheme.colors.textLight};
	transition: all 0.2s ease;

	&:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		border-color: ${FlexLivingTheme.colors.primary};
	}
`;

const SmallImageGrid = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: ${FlexLivingTheme.spacing[3]};
	width: 300px;
	height: 600px;
`;

const SmallImageSquare = styled.div`
	aspect-ratio: 1;
	background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
	border-radius: ${FlexLivingTheme.radii.lg};
	border: 2px solid ${FlexLivingTheme.colors.border};
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: ${FlexLivingTheme.fontSizes.xl};
	color: ${FlexLivingTheme.colors.textLight};
	transition: all 0.2s ease;

	&:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		border-color: ${FlexLivingTheme.colors.primary};
	}
`;

const PropertyImageGrid: React.FC = () => {
	return (
		<ImageGrid>
			<LargeImageSquare></LargeImageSquare>
			<SmallImageGrid>
				<SmallImageSquare></SmallImageSquare>
				<SmallImageSquare></SmallImageSquare>
				<SmallImageSquare></SmallImageSquare>
				<SmallImageSquare></SmallImageSquare>
			</SmallImageGrid>
		</ImageGrid>
	);
};

export default PropertyImageGrid;

