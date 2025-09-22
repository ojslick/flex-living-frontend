import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
	getHostawayReviews,
	getGoogleReviews,
	toggleApprove,
} from '../../lib/api';
import type {
	ReviewsResponse,
	FilterOptions,
	SortOptions,
} from '../../lib/types';
import {
	filterReviews,
	sortReviews,
	getUniqueListings,
	getCategoryInsights,
	getMonthlyTrends,
	getRecurringIssues,
	getPerformanceAlerts,
} from '../../lib/filters';
import {
	DashboardHeader,
	DashboardFilters,
	DashboardInsights,
	DashboardReviews,
	DashboardPagination,
} from '../../components/dashboard';

const DashboardContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing[6]};
	max-width: 100%;
	margin: 0 auto;
`;

const LoadingSpinner = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: ${({ theme }) => theme.spacing[8]};
	color: ${({ theme }) => theme.colors.textLight};
`;

const ErrorMessage = styled.div`
	background: #fef2f2;
	color: #dc2626;
	padding: ${({ theme }) => theme.spacing[4]};
	border-radius: ${({ theme }) => theme.radii.md};
	text-align: center;
`;

const Dashboard: React.FC = () => {
	const navigate = useNavigate();
	const [data, setData] = useState<ReviewsResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [filters, setFilters] = useState<FilterOptions>({
		channel: ['hostaway'], // Default to Hostaway
	});
	const [sort, setSort] = useState<SortOptions>({
		field: 'date',
		direction: 'desc',
	});
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(10);
	const [approvingReviews, setApprovingReviews] = useState<Set<string>>(
		new Set()
	);

	const loadReviews = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const selectedChannel = filters.channel?.[0] || 'hostaway';
			let response: ReviewsResponse;

			if (selectedChannel === 'hostaway') {
				response = await getHostawayReviews();
			} else if (selectedChannel === 'google') {
				response = await getGoogleReviews();
			} else {
				// Fallback to default (Hostaway)
				response = await getHostawayReviews();
			}

			setData(response);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to load reviews');
		} finally {
			setLoading(false);
		}
	}, [filters.channel]);

	useEffect(() => {
		loadReviews();
	}, [loadReviews]);

	// Reset to first page when filters change
	useEffect(() => {
		setCurrentPage(1);
	}, [filters, sort]);

	// Load reviews when channel filter changes
	useEffect(() => {
		if (filters.channel && filters.channel.length > 0) {
			loadReviews();
		}
	}, [filters.channel, loadReviews]);

	const handleApproveToggle = async (
		reviewId: string,
		event: React.MouseEvent
	) => {
		event.stopPropagation();
		setApprovingReviews((prev) => new Set(prev).add(reviewId));

		try {
			await toggleApprove(reviewId);
			// Optimistically update the review
			if (data) {
				setData({
					...data,
					reviews: data.reviews.map((review) =>
						review.id === reviewId
							? { ...review, managerApproved: !review.managerApproved }
							: review
					),
				});
			}
		} catch (err) {
			console.error('Failed to toggle approval:', err);
			// Could add a toast notification here
		} finally {
			setApprovingReviews((prev) => {
				const newSet = new Set(prev);
				newSet.delete(reviewId);
				return newSet;
			});
		}
	};

	const handleReviewClick = (reviewId: string) => {
		// Find the review to get its propertyId for navigation
		const review = data?.reviews.find((r) => r.id === reviewId);
		if (review) {
			navigate(`/property/${review.propertyId}`, {
				state: { scrollToReviews: true },
			});
		}
	};

    const handleClearFilters = () => {
			// Preserve current channel to avoid triggering a refetch
			setFilters((prev) => ({ channel: prev.channel }));
			setSort({ field: 'date', direction: 'desc' });
		};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	if (loading) {
		return (
			<DashboardContainer>
				<LoadingSpinner>Loading reviews...</LoadingSpinner>
			</DashboardContainer>
		);
	}

	if (error) {
		return (
			<DashboardContainer>
				<ErrorMessage>
					{error}
					<button
						onClick={loadReviews}
						style={{
							marginTop: '16px',
							padding: '8px 16px',
							backgroundColor: '#284E4C',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
						}}
					>
						Retry
					</button>
				</ErrorMessage>
			</DashboardContainer>
		);
	}

	if (!data) {
		return (
			<DashboardContainer>
				<ErrorMessage>No data available</ErrorMessage>
			</DashboardContainer>
		);
	}

	// Get unique listings for filters
	const uniqueListings = getUniqueListings(data.reviews);

	// Filter and sort reviews
	const filteredReviews = filterReviews(data.reviews, filters);
	const sortedReviews = sortReviews(filteredReviews, sort);

	// Pagination
	const totalPages = Math.ceil(sortedReviews.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const paginatedReviews = sortedReviews.slice(startIndex, endIndex);

	// Calculate statistics - use filtered reviews for per-listing stats
	const statsReviews = filters.listingId
		? data.reviews.filter((review) => review.propertyId === filters.listingId)
		: data.reviews;

	const stats = {
		totalReviews: statsReviews.length,
		avgRating:
			statsReviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
				statsReviews.length || 0,
		approvedReviews: statsReviews.filter((r) => r.managerApproved).length,
		recentReviews: statsReviews.filter((r) => {
			const reviewDate = new Date(r.submittedAt);
			const thirtyDaysAgo = new Date();
			thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
			return reviewDate >= thirtyDaysAgo;
		}).length,
	};

	// Trend Analysis Data - Use filtered reviews for per-listing analysis
	const trendAnalysisReviews = filters.listingId
		? data.reviews.filter((review) => review.propertyId === filters.listingId)
		: data.reviews;

	const categoryInsights = getCategoryInsights(trendAnalysisReviews);
	const monthlyTrends = getMonthlyTrends(trendAnalysisReviews);
	const recurringIssues = getRecurringIssues(trendAnalysisReviews);
	const performanceAlerts = getPerformanceAlerts(trendAnalysisReviews);

	// Get the selected listing name for display
	const selectedListing = filters.listingId
		? uniqueListings.find((listing) => listing.id === filters.listingId)
		: null;

	return (
		<DashboardContainer>
			<DashboardHeader selectedListing={selectedListing} stats={stats} />

			<DashboardInsights
				selectedListing={selectedListing}
				categoryInsights={categoryInsights}
				monthlyTrends={monthlyTrends}
				recurringIssues={recurringIssues}
				performanceAlerts={performanceAlerts}
			/>

			<DashboardFilters
				filters={filters}
				sort={sort}
				onFiltersChange={setFilters}
				onSortChange={setSort}
				onClearFilters={handleClearFilters}
				uniqueListings={uniqueListings}
			/>

			<DashboardReviews
				reviews={paginatedReviews}
				onReviewClick={handleReviewClick}
				onApproveToggle={handleApproveToggle}
				approvingReviews={approvingReviews}
			/>

			<DashboardPagination
				currentPage={currentPage}
				totalPages={totalPages}
				totalItems={sortedReviews.length}
				itemsPerPage={itemsPerPage}
				onPageChange={handlePageChange}
			/>
		</DashboardContainer>
	);
};

export default Dashboard;
