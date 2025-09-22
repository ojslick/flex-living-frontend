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

const AmenitiesSection = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${FlexLivingTheme.spacing[4]};
	padding: ${FlexLivingTheme.spacing[6]};
	background: ${FlexLivingTheme.colors.surface};
	border: 1px solid ${FlexLivingTheme.colors.border};
	border-radius: ${FlexLivingTheme.radii.lg};
`;

const SectionTitle = styled.h3`
	font-size: ${FlexLivingTheme.fontSizes.xl};
	font-weight: ${FlexLivingTheme.fontWeights.semibold};
	color: ${FlexLivingTheme.colors.text};
	margin: 0;
	margin-bottom: ${FlexLivingTheme.spacing[4]};
`;

const AmenitiesGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: ${FlexLivingTheme.spacing[4]};
`;

const AmenityItem = styled.div`
	display: flex;
	align-items: center;
	gap: ${FlexLivingTheme.spacing[2]};
	padding: ${FlexLivingTheme.spacing[3]};
	font-size: ${FlexLivingTheme.fontSizes.sm};
`;

const AmenityIcon = styled.span`
	font-size: ${FlexLivingTheme.fontSizes.sm};
`;

const AmenityText = styled.span`
	font-weight: ${FlexLivingTheme.fontWeights.medium};
`;

const AmenitiesHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: ${FlexLivingTheme.spacing[4]};
`;

const ViewAllButton = styled.button`
	background: none;
	border: none;
	color: ${FlexLivingTheme.colors.primary};
	font-size: ${FlexLivingTheme.fontSizes.sm};
	font-weight: ${FlexLivingTheme.fontWeights.medium};
	cursor: pointer;
	text-decoration: underline;
	transition: color 0.2s ease;

	&:hover {
		color: ${FlexLivingTheme.colors.accent};
	}
`;

const PropertyAmenities: React.FC = () => {
	return (
		<AmenitiesSection>
			<AmenitiesHeader>
				<SectionTitle>Amenities</SectionTitle>
				<ViewAllButton>View all amenities &gt;</ViewAllButton>
			</AmenitiesHeader>
			<AmenitiesGrid>
				<AmenityItem>
					<AmenityIcon>🛋️</AmenityIcon>
					<AmenityText>Cable TV</AmenityText>
				</AmenityItem>
				<AmenityItem>
					<AmenityIcon>🍴</AmenityIcon>
					<AmenityText>Kitchen</AmenityText>
				</AmenityItem>
				<AmenityItem>
					<AmenityIcon>💨</AmenityIcon>
					<AmenityText>Hair Dryer</AmenityText>
				</AmenityItem>
				<AmenityItem>
					<AmenityIcon>🌐</AmenityIcon>
					<AmenityText>Internet</AmenityText>
				</AmenityItem>
				<AmenityItem>
					<AmenityIcon>🌀</AmenityIcon>
					<AmenityText>Washing Machine</AmenityText>
				</AmenityItem>
				<AmenityItem>
					<AmenityIcon>🌡️</AmenityIcon>
					<AmenityText>Heating</AmenityText>
				</AmenityItem>
				<AmenityItem>
					<AmenityIcon>📶</AmenityIcon>
					<AmenityText>Wireless</AmenityText>
				</AmenityItem>
				<AmenityItem>
					<AmenityIcon>🔄</AmenityIcon>
					<AmenityText>Elevator</AmenityText>
				</AmenityItem>
				<AmenityItem>
					<AmenityIcon>🛡️</AmenityIcon>
					<AmenityText>Smoke Detector</AmenityText>
				</AmenityItem>
			</AmenitiesGrid>
		</AmenitiesSection>
	);
};

export default PropertyAmenities;

