import { forwardRef } from 'react';
import styled from 'styled-components';
import type { NormalizedReview } from '../../lib/types';
import { formatDate, formatRating, formatCategoryName } from '../../lib/format';
import Badge from '../ui/Badge';

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

const ReviewsSection = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${FlexLivingTheme.spacing[4]};
	padding: ${FlexLivingTheme.spacing[6]};
	background: ${FlexLivingTheme.colors.surface};
	border: 1px solid ${FlexLivingTheme.colors.border};
	border-radius: ${FlexLivingTheme.radii.lg};
`;

const ReviewsHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const SectionTitle = styled.h3`
	font-size: ${FlexLivingTheme.fontSizes.xl};
	font-weight: ${FlexLivingTheme.fontWeights.semibold};
	color: ${FlexLivingTheme.colors.text};
	margin: 0;
`;

const ReviewsList = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${FlexLivingTheme.spacing[4]};
`;

const ReviewItem = styled.div`
	padding: ${FlexLivingTheme.spacing[4]} 0;
	border-bottom: 1px solid ${FlexLivingTheme.colors.border};

	&:last-child {
		border-bottom: none;
	}
`;

const ReviewHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: start;
	margin-bottom: ${FlexLivingTheme.spacing[3]};
`;

const ReviewMeta = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${FlexLivingTheme.spacing[1]};
`;

const ReviewGuest = styled.div`
	font-weight: ${FlexLivingTheme.fontWeights.semibold};
	color: ${FlexLivingTheme.colors.text};
`;

const ReviewDate = styled.div`
	color: ${FlexLivingTheme.colors.textLight};
	font-size: ${FlexLivingTheme.fontSizes.sm};
`;

const ReviewRating = styled.div`
	font-size: ${FlexLivingTheme.fontSizes.lg};
	font-weight: ${FlexLivingTheme.fontWeights.semibold};
	color: ${FlexLivingTheme.colors.primary};
`;

const ReviewText = styled.div`
	color: ${FlexLivingTheme.colors.text};
	line-height: 1.5;
	margin-bottom: ${FlexLivingTheme.spacing[3]};
`;

const ReviewCategories = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: ${FlexLivingTheme.spacing[2]};
`;

interface PropertyReviewsProps {
	reviews: NormalizedReview[];
}

const PropertyReviews = forwardRef<HTMLDivElement, PropertyReviewsProps>(
	({ reviews }, ref) => {
		return (
			<ReviewsSection ref={ref}>
				<ReviewsHeader>
					<SectionTitle>What guests are saying</SectionTitle>
					<Badge variant="success">
						{reviews.length} review{reviews.length !== 1 ? 's' : ''}
					</Badge>
				</ReviewsHeader>

				{reviews.length > 0 ? (
					<>
						<ReviewsList>
							{reviews.map((review) => (
								<ReviewItem key={review.id}>
									<ReviewHeader>
										<ReviewMeta>
											<ReviewGuest>
												{review.guestName || 'Anonymous'}
											</ReviewGuest>
											<ReviewDate>{formatDate(review.submittedAt)}</ReviewDate>
										</ReviewMeta>
										<ReviewRating>
											{review.rating
												? `${formatRating(review.rating)} ⭐`
												: 'No rating'}
										</ReviewRating>
									</ReviewHeader>

									{review.text && <ReviewText>{review.text}</ReviewText>}

									{review.categories.length > 0 && (
										<ReviewCategories>
											{review.categories.map((category) => (
												<Badge key={category.category} size="sm">
													{formatCategoryName(category.category)}:{' '}
													{category.rating}/5
												</Badge>
											))}
										</ReviewCategories>
									)}
								</ReviewItem>
							))}
						</ReviewsList>
					</>
				) : (
					<div
						style={{
							textAlign: 'center',
							color: '#718096',
							padding: '2rem 0',
						}}
					>
						No reviews yet. Be the first to share your experience!
					</div>
				)}
			</ReviewsSection>
		);
	}
);

PropertyReviews.displayName = 'PropertyReviews';

export default PropertyReviews;
