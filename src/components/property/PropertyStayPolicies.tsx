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

const StayPoliciesSection = styled.div`
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

const PolicySection = styled.div`
	margin-bottom: ${FlexLivingTheme.spacing[4]};
	background: rgb(241, 243, 238);
	padding: ${FlexLivingTheme.spacing[4]};
	border-radius: ${FlexLivingTheme.radii.md};

	&:last-child {
		margin-bottom: 0;
	}
`;

const PolicyGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: ${FlexLivingTheme.spacing[2]};
`;

const PolicySubtitle = styled.h4`
	font-size: ${FlexLivingTheme.fontSizes.lg};
	font-weight: ${FlexLivingTheme.fontWeights.semibold};
	color: ${FlexLivingTheme.colors.text};
	margin-bottom: ${FlexLivingTheme.spacing[3]};
	display: flex;
	align-items: center;
	gap: ${FlexLivingTheme.spacing[2]};
`;

const PolicyItem = styled.div`
	display: flex;
	flex-direction: column;
	padding: ${FlexLivingTheme.spacing[3]};
	background: #fff;
	border-radius: ${FlexLivingTheme.radii.sm};
	margin-bottom: ${FlexLivingTheme.spacing[2]};
`;

const PolicyLabel = styled.span`
	font-size: ${FlexLivingTheme.fontSizes.sm};
	font-weight: ${FlexLivingTheme.fontWeights.medium};
	color: ${FlexLivingTheme.colors.textLight};
	margin-bottom: ${FlexLivingTheme.spacing[1]};
`;

const PolicyValue = styled.span`
	font-size: ${FlexLivingTheme.fontSizes.base};
	font-weight: ${FlexLivingTheme.fontWeights.medium};
	color: ${FlexLivingTheme.colors.text};
`;

interface PropertyStayPoliciesProps {
	propertyDetails: PropertyDetails;
}

const PropertyStayPolicies: React.FC<PropertyStayPoliciesProps> = ({
	propertyDetails,
}) => {
	return (
		<StayPoliciesSection>
			<SectionTitle>Stay Policies</SectionTitle>

			<PolicySection>
				<PolicySubtitle>🕐 Check-in & Check-out</PolicySubtitle>
				<PolicyGrid>
					<PolicyItem>
						<PolicyLabel>Check-in Time</PolicyLabel>
						<PolicyValue>{propertyDetails.checkInTime}</PolicyValue>
					</PolicyItem>
					<PolicyItem>
						<PolicyLabel>Check-out Time</PolicyLabel>
						<PolicyValue>{propertyDetails.checkOutTime}</PolicyValue>
					</PolicyItem>
				</PolicyGrid>
			</PolicySection>

			<PolicySection>
				<PolicySubtitle>🛡️ House Rules</PolicySubtitle>
				<PolicyGrid>
					<PolicyItem>
						<PolicyLabel>No smoking</PolicyLabel>
					</PolicyItem>
					<PolicyItem>
						<PolicyLabel>No pets</PolicyLabel>
					</PolicyItem>
					<PolicyItem>
						<PolicyLabel>No parties or events</PolicyLabel>
					</PolicyItem>
					<PolicyItem>
						<PolicyLabel>Security deposit required</PolicyLabel>
					</PolicyItem>
				</PolicyGrid>
			</PolicySection>

			<PolicySection>
				<PolicySubtitle>📅 Cancellation Policy</PolicySubtitle>
				<PolicyItem>
					<PolicyLabel>For stays less than 28 days:</PolicyLabel>
					<PolicyValue>• Full refund up to 14 days before check-in</PolicyValue>
					<PolicyValue>
						• No refund for bookings less than 14 days before check-in
					</PolicyValue>
				</PolicyItem>
				<PolicyItem>
					<PolicyLabel>For stays of 28 days or more:</PolicyLabel>
					<PolicyValue>• Full refund up to 30 days before check-in</PolicyValue>
					<PolicyValue>
						• No refund for bookings less than 30 days before check-in
					</PolicyValue>
				</PolicyItem>
			</PolicySection>
		</StayPoliciesSection>
	);
};

export default PropertyStayPolicies;

