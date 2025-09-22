import React, { useState } from 'react';
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

const DescriptionSection = styled.div`
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

const DescriptionText = styled.p<{ $isExpanded?: boolean }>`
	color: ${FlexLivingTheme.colors.text};
	line-height: 1.6;
	margin: 0;
	display: inline;
	${({ $isExpanded }) =>
		!$isExpanded &&
		`
		display: -webkit-box;
		-webkit-line-clamp: 4;
		-webkit-box-orient: vertical;
		overflow: hidden;
	`}
`;

const InlineContainer = styled.div`
	display: inline;
`;

const ReadMoreButton = styled.button`
	background: none;
	border: none;
	color: ${FlexLivingTheme.colors.primary};
	font-size: ${FlexLivingTheme.fontSizes.sm};
	font-weight: ${FlexLivingTheme.fontWeights.medium};
	cursor: pointer;
	display: inline;
	padding: 0;
	margin: 0;
`;

const ShowLessButton = styled.button`
	background: none;
	border: none;
	color: ${FlexLivingTheme.colors.primary};
	font-size: ${FlexLivingTheme.fontSizes.sm};
	font-weight: ${FlexLivingTheme.fontWeights.medium};
	cursor: pointer;
	display: inline-block;
	padding: 0;
	margin: 0;
	width: auto;
	text-align: left;
`;

interface PropertyDescriptionProps {
	propertyDetails: PropertyDetails;
}

const PropertyDescription: React.FC<PropertyDescriptionProps> = ({
	propertyDetails,
}) => {
	const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

	return (
		<DescriptionSection>
			<SectionTitle>About this property</SectionTitle>
			<InlineContainer>
				<DescriptionText $isExpanded={isDescriptionExpanded}>
					{propertyDetails.description?.join(' ') || ''}
				</DescriptionText>
				{!isDescriptionExpanded && (
					<>
						{'... '}
						<ReadMoreButton onClick={() => setIsDescriptionExpanded(true)}>
							Read more
						</ReadMoreButton>
					</>
				)}
			</InlineContainer>
			{isDescriptionExpanded && (
				<ShowLessButton onClick={() => setIsDescriptionExpanded(false)}>
					Show less
				</ShowLessButton>
			)}
		</DescriptionSection>
	);
};

export default PropertyDescription;

