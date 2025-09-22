import React from 'react';
import styled from 'styled-components';
import type { PropertyDetails } from '../../lib/propertyData';

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

const PropertyTitleSection = styled.div`
	width: 100%;
	margin-bottom: ${FlexLivingTheme.spacing[6]};
`;

const PropertyMainTitle = styled.h1`
	font-size: ${FlexLivingTheme.fontSizes['3xl']};
	font-weight: ${FlexLivingTheme.fontWeights.bold};
	color: ${FlexLivingTheme.colors.text};
	margin: 0 0 ${FlexLivingTheme.spacing[4]} 0;
`;

const PropertyDetailsRow = styled.div`
	display: flex;
	align-items: center;
	gap: ${FlexLivingTheme.spacing[6]};
	padding-bottom: ${FlexLivingTheme.spacing[4]};
	border-bottom: 1px solid ${FlexLivingTheme.colors.border};
`;

const PropertyDetailInfoItem = styled.div`
	display: flex;
	align-items: center;
	gap: ${FlexLivingTheme.spacing[2]};
	font-size: ${FlexLivingTheme.fontSizes.base};
	color: ${FlexLivingTheme.colors.text};
`;

const DetailIcon = styled.span`
	font-size: ${FlexLivingTheme.fontSizes.lg};
	color: ${FlexLivingTheme.colors.textLight};
`;

interface PropertyTitleSectionProps {
	propertyDetails: PropertyDetails;
}

const PropertyTitleSectionComponent: React.FC<PropertyTitleSectionProps> = ({
	propertyDetails,
}) => {
	return (
		<PropertyTitleSection>
			<PropertyMainTitle>{propertyDetails.name}</PropertyMainTitle>
			<PropertyDetailsRow>
				<PropertyDetailInfoItem>
					<DetailIcon>👥</DetailIcon>
					<span>
						{propertyDetails.guests} Guest
						{propertyDetails.guests !== 1 ? 's' : ''}
					</span>
				</PropertyDetailInfoItem>
				<PropertyDetailInfoItem>
					<DetailIcon>🛏️</DetailIcon>
					<span>
						{propertyDetails.bedrooms} Bedroom
						{propertyDetails.bedrooms !== 1 ? 's' : ''}
					</span>
				</PropertyDetailInfoItem>
				<PropertyDetailInfoItem>
					<DetailIcon>🛁</DetailIcon>
					<span>
						{propertyDetails.bathrooms} Bathroom
						{propertyDetails.bathrooms !== 1 ? 's' : ''}
					</span>
				</PropertyDetailInfoItem>
				<PropertyDetailInfoItem>
					<DetailIcon>🏠</DetailIcon>
					<span>{propertyDetails.bedrooms + 1} beds</span>
				</PropertyDetailInfoItem>
			</PropertyDetailsRow>
		</PropertyTitleSection>
	);
};

export default PropertyTitleSectionComponent;

