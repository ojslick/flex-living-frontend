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

const BookingCard = styled.div`
	position: sticky;
	top: 90px;
	display: flex;
	flex-direction: column;
	background: ${FlexLivingTheme.colors.surface};
	border: 1px solid ${FlexLivingTheme.colors.border};
	border-radius: ${FlexLivingTheme.radii.lg};
	overflow: hidden;
	width: 100%;
	z-index: 100;
`;

const BookingHeader = styled.div`
	background: #284e4c;
	padding: ${FlexLivingTheme.spacing[6]};
	color: white;
`;

const BookingTitle = styled.h2`
	font-size: ${FlexLivingTheme.fontSizes['2xl']};
	font-weight: ${FlexLivingTheme.fontWeights.bold};
	margin: 0 0 ${FlexLivingTheme.spacing[2]} 0;
	color: white;
`;

const BookingSubtitle = styled.p`
	font-size: ${FlexLivingTheme.fontSizes.sm};
	margin: 0;
	color: rgba(255, 255, 255, 0.9);
`;

const BookingForm = styled.div`
	padding: ${FlexLivingTheme.spacing[6]};
	display: flex;
	flex-direction: column;
	gap: ${FlexLivingTheme.spacing[4]};
`;

const InputRow = styled.div`
	display: flex;
	gap: ${FlexLivingTheme.spacing[3]};
`;

const DateInput = styled.div`
	display: flex;
	align-items: center;
	gap: ${FlexLivingTheme.spacing[2]};
	padding: ${FlexLivingTheme.spacing[3]};
	background: #f7fafc;
	border: 1px solid #e2e8f0;
	border-radius: ${FlexLivingTheme.radii.md};
	flex: 1;
	min-width: 200px;
`;

const GuestInput = styled.div`
	display: flex;
	align-items: center;
	gap: ${FlexLivingTheme.spacing[2]};
	padding: ${FlexLivingTheme.spacing[3]};
	background: #f7fafc;
	border: 1px solid #e2e8f0;
	border-radius: ${FlexLivingTheme.radii.md};
	width: 120px;
	flex-shrink: 0;
	position: relative;
`;

const InputIcon = styled.span`
	font-size: ${FlexLivingTheme.fontSizes.sm};
	color: #718096;
`;

const InputField = styled.input`
	border: none;
	background: transparent;
	font-size: ${FlexLivingTheme.fontSizes.sm};
	color: ${FlexLivingTheme.colors.text};
	outline: none;
	flex: 1;

	&::placeholder {
		color: #718096;
	}
`;

const DropdownIcon = styled.span`
	font-size: ${FlexLivingTheme.fontSizes.xs};
	color: #718096;
	cursor: pointer;
`;

const ButtonRow = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${FlexLivingTheme.spacing[3]};
`;

const CheckAvailabilityButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: ${FlexLivingTheme.spacing[2]};
	height: 48px;
	background: #284e4c;
	color: white;
	border: none;
	border-radius: ${FlexLivingTheme.radii.md};
	font-size: ${FlexLivingTheme.fontSizes.base};
	font-weight: ${FlexLivingTheme.fontWeights.medium};
	cursor: not-allowed;
	opacity: 0.6;
	transition: opacity 0.2s ease;

	&:hover {
		opacity: 0.8;
	}
`;

const SendInquiryButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: ${FlexLivingTheme.spacing[2]};
	height: 48px;
	background: white;
	color: ${FlexLivingTheme.colors.text};
	border: 1px solid #e2e8f0;
	border-radius: ${FlexLivingTheme.radii.md};
	font-size: ${FlexLivingTheme.fontSizes.base};
	font-weight: ${FlexLivingTheme.fontWeights.medium};
	cursor: pointer;
	transition: all 0.2s ease;

	&:hover {
		background: #f7fafc;
		border-color: #cbd5e0;
	}
`;

const ButtonIcon = styled.span`
	font-size: ${FlexLivingTheme.fontSizes.sm};
`;

const InstantBooking = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: ${FlexLivingTheme.spacing[2]};
	font-size: ${FlexLivingTheme.fontSizes.sm};
	color: #718096;
	margin-top: ${FlexLivingTheme.spacing[2]};
`;

const ShieldIcon = styled.span`
	font-size: ${FlexLivingTheme.fontSizes.sm};
`;

const PropertyBooking: React.FC = () => {
	return (
		<BookingCard>
			<BookingHeader>
				<BookingTitle>Book Your Stay</BookingTitle>
				<BookingSubtitle>Select dates to see prices</BookingSubtitle>
			</BookingHeader>

			<BookingForm>
				<InputRow>
					<DateInput>
						<InputIcon>📅</InputIcon>
						<InputField placeholder="Select dates" />
					</DateInput>
					<GuestInput>
						<InputIcon>👥</InputIcon>
						<InputField value="1" readOnly />
						<DropdownIcon>▼</DropdownIcon>
					</GuestInput>
				</InputRow>

				<ButtonRow>
					<CheckAvailabilityButton disabled>
						<ButtonIcon>📅</ButtonIcon>
						Check availability
					</CheckAvailabilityButton>
					<SendInquiryButton>
						<ButtonIcon>💬</ButtonIcon>
						Send Inquiry
					</SendInquiryButton>
				</ButtonRow>

				<InstantBooking>
					<ShieldIcon>🛡️</ShieldIcon>
					Instant booking confirmation
				</InstantBooking>
			</BookingForm>
		</BookingCard>
	);
};

export default PropertyBooking;

