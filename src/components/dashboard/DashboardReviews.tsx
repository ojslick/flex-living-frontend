import React from 'react';
import styled from 'styled-components';
import type { NormalizedReview } from '../../lib/types';
import { formatDate, formatRating, formatCategoryName } from '../../lib/format';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const ReviewsSection = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing[4]};
`;

const ReviewsHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
	gap: ${({ theme }) => theme.spacing[4]};
`;

const Title = styled.h2`
	font-size: ${({ theme }) => theme.fontSizes['2xl']};
	font-weight: ${({ theme }) => theme.fontWeights.bold};
	color: ${({ theme }) => theme.colors.text};
	margin: 0;
`;

const ReviewsCount = styled.div`
	color: ${({ theme }) => theme.colors.textLight};
	font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const ReviewsList = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing[3]};
`;

const ReviewCard = styled(Card).attrs<{ onClick?: () => void }>(
	({ onClick }) => ({
		onClick,
	})
)<{ onClick?: () => void }>`
	cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
	transition: all 0.2s ease;

	&:hover {
		transform: ${({ onClick }) => (onClick ? 'translateY(-2px)' : 'none')};
		box-shadow: ${({ onClick, theme }) =>
			onClick ? theme.shadows.lg : theme.shadows.sm};
	}
`;

const ReviewContent = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing[3]};
`;

const ReviewHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: start;
	flex-wrap: wrap;
	gap: ${({ theme }) => theme.spacing[2]};
`;

const ReviewMeta = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing[1]};
`;

const ReviewGuest = styled.div`
	font-weight: ${({ theme }) => theme.fontWeights.semibold};
	color: ${({ theme }) => theme.colors.text};
`;

const ReviewDate = styled.div`
	color: ${({ theme }) => theme.colors.textLight};
	font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const ReviewRating = styled.div`
	font-size: ${({ theme }) => theme.fontSizes.lg};
	font-weight: ${({ theme }) => theme.fontWeights.semibold};
	color: ${({ theme }) => theme.colors.primary};
`;

const ReviewText = styled.div`
	color: ${({ theme }) => theme.colors.text};
	line-height: 1.5;
	margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const ReviewCategories = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: ${({ theme }) => theme.spacing[2]};
`;

const ReviewActions = styled.div`
	display: flex;
	gap: ${({ theme }) => theme.spacing[2]};
	justify-content: flex-end;
	margin-top: ${({ theme }) => theme.spacing[3]};
	padding-top: ${({ theme }) => theme.spacing[3]};
	border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const ReadMoreButton = styled.button`
	background: none;
	border: none;
	color: ${({ theme }) => theme.colors.primary};
	font-size: ${({ theme }) => theme.fontSizes.sm};
	font-weight: ${({ theme }) => theme.fontWeights.medium};
	cursor: pointer;
	display: inline;
	padding: 0;
	margin: 0;
`;

const ShowLessButton = styled.button`
	background: none;
	border: none;
	color: ${({ theme }) => theme.colors.primary};
	font-size: ${({ theme }) => theme.fontSizes.sm};
	font-weight: ${({ theme }) => theme.fontWeights.medium};
	cursor: pointer;
	display: inline-block;
	padding: 0;
	margin: 0;
	width: auto;
	text-align: left;
`;

const InlineContainer = styled.div`
	display: inline;
`;

interface DashboardReviewsProps {
	reviews: NormalizedReview[];
	onReviewClick: (reviewId: string) => void;
	onApproveToggle: (reviewId: string, event: React.MouseEvent) => void;
	approvingReviews: Set<string>;
}

const DashboardReviews: React.FC<DashboardReviewsProps> = ({
	reviews,
	onReviewClick,
	onApproveToggle,
	approvingReviews,
}) => {
	const [expandedReviews, setExpandedReviews] = React.useState<Set<string>>(
		new Set()
	);

	const toggleExpanded = (reviewId: string, event: React.MouseEvent) => {
		event.stopPropagation();
		setExpandedReviews((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(reviewId)) {
				newSet.delete(reviewId);
			} else {
				newSet.add(reviewId);
			}
			return newSet;
		});
	};

	const isExpanded = (reviewId: string) => expandedReviews.has(reviewId);

	const shouldTruncate = (text: string) => {
		// Simple heuristic: if text is longer than 200 characters, it likely needs truncation
		return text.length > 200;
	};

	return (
		<ReviewsSection>
			<ReviewsHeader>
				<Title>Reviews ({reviews.length})</Title>
				<ReviewsCount>
					Showing {reviews.length} review{reviews.length !== 1 ? 's' : ''}
				</ReviewsCount>
			</ReviewsHeader>

			<ReviewsList>
				{reviews.map((review) => {
					const expanded = isExpanded(review.id);
					const needsTruncation = review.text && shouldTruncate(review.text);
					const displayText =
						expanded || !needsTruncation
							? review.text
							: review.text?.substring(0, 200) + '...';

					return (
						<ReviewCard
							key={review.id}
							onClick={() => onReviewClick(review.id)}
						>
							<ReviewContent>
								<ReviewHeader>
									<ReviewMeta>
										<ReviewGuest>{review.guestName || 'Anonymous'}</ReviewGuest>
										<ReviewDate>
											{formatDate(review.submittedAt)} • {review.listingName}
										</ReviewDate>
									</ReviewMeta>
									<ReviewRating>
										{review.rating
											? `${formatRating(review.rating)} ⭐`
											: 'No rating'}
									</ReviewRating>
								</ReviewHeader>

								{review.text && (
									<ReviewText>
										<InlineContainer>
											{displayText}
											{needsTruncation && !expanded && (
												<>
													{' '}
													<ReadMoreButton
														onClick={(e) => toggleExpanded(review.id, e)}
													>
														Read more
													</ReadMoreButton>
												</>
											)}
										</InlineContainer>
										{needsTruncation && expanded && (
											<ShowLessButton
												onClick={(e) => toggleExpanded(review.id, e)}
											>
												Show less
											</ShowLessButton>
										)}
									</ReviewText>
								)}

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

								<ReviewActions>
									<Button
										variant="ghost"
										size="sm"
										onClick={(e) => {
											e.stopPropagation();
											onReviewClick(review.id);
										}}
									>
										View Property
									</Button>
									<Button
										variant={review.managerApproved ? 'secondary' : 'primary'}
										size="sm"
										onClick={(e) => onApproveToggle(review.id, e)}
										disabled={approvingReviews.has(review.id)}
									>
										{approvingReviews.has(review.id)
											? 'Updating...'
											: review.managerApproved
												? 'Unapprove'
												: 'Approve'}
									</Button>
								</ReviewActions>
							</ReviewContent>
						</ReviewCard>
					);
				})}
			</ReviewsList>
		</ReviewsSection>
	);
};

export default DashboardReviews;

