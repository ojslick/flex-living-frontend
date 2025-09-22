import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { getReviews } from '../../lib/api';
import type { ReviewsResponse } from '../../lib/types';
import {
	getPropertyDetails,
	type PropertyDetails,
} from '../../lib/propertyData';
import {
	PropertyImageGrid,
	PropertyTitleSection,
	PropertyDescription,
	PropertyAmenities,
	PropertyStayPolicies,
	PropertyReviews,
	PropertyBooking,
} from '../../components/property';

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

const PropertyContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${FlexLivingTheme.spacing[8]};
	max-width: 100%;
	margin: 0 auto;
	background-color: ${FlexLivingTheme.colors.background};
	min-height: 100vh;
	padding-top: 10px;
`;

const PropertyInfo = styled.div`
	display: grid;
	grid-template-columns: 2fr 1fr;
	gap: ${FlexLivingTheme.spacing[8]};
	max-width: 1400px;
	margin: 0 auto;

	@media (max-width: 1024px) {
		grid-template-columns: 1fr;
		gap: ${FlexLivingTheme.spacing[6]};
	}
`;

const MainContent = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${FlexLivingTheme.spacing[6]};
`;

const Sidebar = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${FlexLivingTheme.spacing[6]};
`;

const LoadingSpinner = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: ${FlexLivingTheme.spacing[8]};
	color: ${FlexLivingTheme.colors.textLight};
`;

const ErrorMessage = styled.div`
	background: #fef2f2;
	color: #dc2626;
	padding: ${FlexLivingTheme.spacing[4]};
	border-radius: ${FlexLivingTheme.radii.md};
	text-align: center;
`;

const PropertyDetail: React.FC = () => {
	const { listingId } = useParams<{ listingId: string }>();
	const location = useLocation();
	const reviewsSectionRef = useRef<HTMLDivElement>(null);
	const [data, setData] = useState<ReviewsResponse | null>(null);
	const [propertyDetails, setPropertyDetails] =
		useState<PropertyDetails | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		loadReviews();
		if (listingId) {
			setPropertyDetails(getPropertyDetails(listingId));
		}
	}, [listingId]);

	// Scroll to reviews section when navigating from dashboard
	useEffect(() => {
		if (location.state?.scrollToReviews && reviewsSectionRef.current) {
			setTimeout(() => {
				reviewsSectionRef.current?.scrollIntoView({
					behavior: 'smooth',
					block: 'start',
				});
			}, 100);
		}
	}, [location.state, data]);

	const loadReviews = async () => {
		try {
			setLoading(true);
			setError(null);
			const response = await getReviews();
			setData(response);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to load reviews');
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<PropertyContainer>
				<LoadingSpinner>Loading property details...</LoadingSpinner>
			</PropertyContainer>
		);
	}

	if (error) {
		return (
			<PropertyContainer>
				<ErrorMessage>
					{error}
					<button
						onClick={loadReviews}
						style={{
							marginTop: '16px',
							padding: '8px 16px',
							backgroundColor: FlexLivingTheme.colors.primary,
							color: 'white',
							border: 'none',
							borderRadius: FlexLivingTheme.radii.md,
							cursor: 'pointer',
						}}
					>
						Retry
					</button>
				</ErrorMessage>
			</PropertyContainer>
		);
	}

	if (!data || !propertyDetails) {
		return <ErrorMessage>No data available</ErrorMessage>;
	}

	// Get approved reviews for this property
	const approvedReviews = data.reviews.filter(
		(review) =>
			review.managerApproved && (!listingId || review.propertyId === listingId)
	);

	return (
		<PropertyContainer>
			<PropertyImageGrid />

			<PropertyTitleSection propertyDetails={propertyDetails} />

			<div>
				<PropertyInfo>
					<MainContent>
						<PropertyDescription propertyDetails={propertyDetails} />
						<PropertyAmenities />
						<PropertyStayPolicies propertyDetails={propertyDetails} />
						<PropertyReviews
							ref={reviewsSectionRef}
							reviews={approvedReviews}
						/>
					</MainContent>

					<Sidebar>
						<PropertyBooking />
					</Sidebar>
				</PropertyInfo>
			</div>
		</PropertyContainer>
	);
};

export default PropertyDetail;
