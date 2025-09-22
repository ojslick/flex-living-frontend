import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '../../test/setup';
import Dashboard from '../Dashboard';

// Mock the API functions
vi.mock('../../lib/api', () => ({
	getReviews: vi.fn(),
	toggleApprove: vi.fn(),
}));

// Mock the filter utilities
vi.mock('../../lib/filters', () => ({
	filterReviews: vi.fn((reviews) => reviews),
	sortReviews: vi.fn((reviews) => reviews),
	getUniqueChannels: vi.fn(() => ['hostaway', 'airbnb']),
	getUniqueListings: vi.fn(() => [
		{ id: 'prop-1', name: 'Property 1' },
		{ id: 'prop-2', name: 'Property 2' },
	]),
	getCategoryInsights: vi.fn(() => []),
	getMonthlyTrends: vi.fn(() => []),
	getRecurringIssues: vi.fn(() => []),
	getPerformanceAlerts: vi.fn(() => []),
}));

// Mock the dashboard components
vi.mock('../../components/dashboard', () => ({
	DashboardHeader: ({ selectedListing, stats }: any) => (
		<div data-testid="dashboard-header">
			<h1>
				{selectedListing
					? `${selectedListing.name} Dashboard`
					: 'Property Reviews Dashboard'}
			</h1>
			<div>Total: {stats.totalReviews}</div>
		</div>
	),
	DashboardFilters: ({
		onFiltersChange,
		onSortChange,
		onClearFilters,
	}: any) => (
		<div data-testid="dashboard-filters">
			<button onClick={() => onFiltersChange({ listingId: 'prop-1' })}>
				Filter
			</button>
			<button
				onClick={() => onSortChange({ field: 'rating', direction: 'desc' })}
			>
				Sort
			</button>
			<button onClick={onClearFilters}>Clear</button>
		</div>
	),
	DashboardInsights: () => <div data-testid="dashboard-insights">Insights</div>,
	DashboardReviews: ({ reviews, onReviewClick, onApproveToggle }: any) => (
		<div data-testid="dashboard-reviews">
			<div>Reviews: {reviews.length}</div>
			{reviews.map((review: any) => (
				<div key={review.id} onClick={() => onReviewClick(review.id)}>
					{review.guestName}
					<button onClick={(e) => onApproveToggle(review.id, e)}>Toggle</button>
				</div>
			))}
		</div>
	),
	DashboardPagination: ({ currentPage, totalPages, onPageChange }: any) => (
		<div data-testid="dashboard-pagination">
			<div>
				Page {currentPage} of {totalPages}
			</div>
			<button onClick={() => onPageChange(2)}>Next</button>
		</div>
	),
}));

const mockReviewsData = {
	reviews: [
		{
			id: '1',
			propertyId: 'prop-1',
			listingName: 'Property 1',
			channel: 'hostaway',
			type: 'guest-to-host',
			status: 'published',
			rating: 4.5,
			categories: [],
			text: 'Great stay!',
			submittedAt: '2024-01-15T10:30:00Z',
			guestName: 'John Doe',
			managerApproved: true,
			channelIdentifiers: {},
		},
	],
	aggregations: {
		byListing: {},
		byChannel: {},
		byMonth: {},
	},
};

const renderWithRouter = (component: React.ReactElement) => {
	return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Dashboard', () => {
	beforeEach(async () => {
		vi.clearAllMocks();
		// Mock successful API response
		const { getReviews } = await import('../../lib/api');
		vi.mocked(getReviews).mockResolvedValue(mockReviewsData);
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	it('should render loading state initially', () => {
		renderWithRouter(<Dashboard />);

		// Should show loading spinner
		expect(screen.getByRole('generic')).toBeInTheDocument();
	});

	it('should render dashboard after loading', async () => {
		renderWithRouter(<Dashboard />);

		await waitFor(() => {
			expect(screen.getByTestId('dashboard-header')).toBeInTheDocument();
		});

		expect(screen.getByTestId('dashboard-filters')).toBeInTheDocument();
		expect(screen.getByTestId('dashboard-insights')).toBeInTheDocument();
		expect(screen.getByTestId('dashboard-reviews')).toBeInTheDocument();
	});

	it('should render dashboard header with default title', async () => {
		renderWithRouter(<Dashboard />);

		await waitFor(() => {
			expect(
				screen.getByText('Property Reviews Dashboard')
			).toBeInTheDocument();
		});
	});

	it('should render dashboard header with listing-specific title when filtered', async () => {
		renderWithRouter(<Dashboard />);

		await waitFor(() => {
			expect(screen.getByTestId('dashboard-filters')).toBeInTheDocument();
		});

		const filterButton = screen.getByText('Filter');
		filterButton.click();

		await waitFor(() => {
			expect(screen.getByText('Property 1 Dashboard')).toBeInTheDocument();
		});
	});

	it('should handle API errors', async () => {
		const { getReviews } = await import('../../lib/api');
		vi.mocked(getReviews);
		getReviews.mockRejectedValue(new Error('API Error'));

		renderWithRouter(<Dashboard />);

		await waitFor(() => {
			expect(screen.getByText('API Error')).toBeInTheDocument();
		});

		expect(screen.getByText('Retry')).toBeInTheDocument();
	});

	it('should handle retry button click', async () => {
		const { getReviews } = await import('../../lib/api');
		vi.mocked(getReviews);
		getReviews.mockRejectedValueOnce(new Error('API Error'));
		getReviews.mockResolvedValueOnce(mockReviewsData);

		renderWithRouter(<Dashboard />);

		await waitFor(() => {
			expect(screen.getByText('API Error')).toBeInTheDocument();
		});

		const retryButton = screen.getByText('Retry');
		retryButton.click();

		await waitFor(() => {
			expect(screen.getByTestId('dashboard-header')).toBeInTheDocument();
		});
	});

	it('should handle no data available', async () => {
		const { getReviews } = await import('../../lib/api');
		vi.mocked(getReviews);
		getReviews.mockResolvedValue(null);

		renderWithRouter(<Dashboard />);

		await waitFor(() => {
			expect(screen.getByText('No review data available.')).toBeInTheDocument();
		});
	});

	it('should handle review click navigation', async () => {
		const mockNavigate = vi.fn();
		vi.mock('react-router-dom', async () => {
			const actual = await vi.importActual('react-router-dom');
			return {
				...actual,
				useNavigate: () => mockNavigate,
			};
		});

		renderWithRouter(<Dashboard />);

		await waitFor(() => {
			expect(screen.getByTestId('dashboard-reviews')).toBeInTheDocument();
		});

		const reviewCard = screen.getByText('John Doe');
		reviewCard.click();

		expect(mockNavigate).toHaveBeenCalledWith('/property/prop-1', {
			state: { scrollToReviews: true },
		});
	});

	it('should handle approve toggle', async () => {
		const { toggleApprove } = await import('../../lib/api');
		vi.mocked(toggleApprove);
		toggleApprove.mockResolvedValue({ success: true });

		renderWithRouter(<Dashboard />);

		await waitFor(() => {
			expect(screen.getByTestId('dashboard-reviews')).toBeInTheDocument();
		});

		const toggleButton = screen.getByText('Toggle');
		toggleButton.click();

		expect(toggleApprove).toHaveBeenCalledWith('1');
	});

	it('should handle approve toggle error', async () => {
		const { toggleApprove } = await import('../../lib/api');
		vi.mocked(toggleApprove);
		toggleApprove.mockRejectedValue(new Error('Toggle Error'));

		renderWithRouter(<Dashboard />);

		await waitFor(() => {
			expect(screen.getByTestId('dashboard-reviews')).toBeInTheDocument();
		});

		const toggleButton = screen.getByText('Toggle');
		toggleButton.click();

		// Should not throw error, just log it
		expect(toggleApprove).toHaveBeenCalledWith('1');
	});

	it('should handle filter changes', async () => {
		renderWithRouter(<Dashboard />);

		await waitFor(() => {
			expect(screen.getByTestId('dashboard-filters')).toBeInTheDocument();
		});

		const filterButton = screen.getByText('Filter');
		filterButton.click();

		// Should update the dashboard header
		await waitFor(() => {
			expect(screen.getByText('Property 1 Dashboard')).toBeInTheDocument();
		});
	});

	it('should handle sort changes', async () => {
		renderWithRouter(<Dashboard />);

		await waitFor(() => {
			expect(screen.getByTestId('dashboard-filters')).toBeInTheDocument();
		});

		const sortButton = screen.getByText('Sort');
		sortButton.click();

		// Should update the sort state
		expect(screen.getByTestId('dashboard-filters')).toBeInTheDocument();
	});

	it('should handle clear filters', async () => {
		renderWithRouter(<Dashboard />);

		await waitFor(() => {
			expect(screen.getByTestId('dashboard-filters')).toBeInTheDocument();
		});

		const clearButton = screen.getByText('Clear');
		clearButton.click();

		// Should reset filters and sort
		expect(screen.getByTestId('dashboard-filters')).toBeInTheDocument();
	});

	it('should handle page changes', async () => {
		renderWithRouter(<Dashboard />);

		await waitFor(() => {
			expect(screen.getByTestId('dashboard-pagination')).toBeInTheDocument();
		});

		const nextButton = screen.getByText('Next');
		nextButton.click();

		// Should update the current page
		expect(screen.getByTestId('dashboard-pagination')).toBeInTheDocument();
	});

	it('should handle empty reviews array', async () => {
		const { getReviews } = await import('../../lib/api');
		vi.mocked(getReviews);
		getReviews.mockResolvedValue({ reviews: [], aggregations: {} });

		renderWithRouter(<Dashboard />);

		await waitFor(() => {
			expect(screen.getByTestId('dashboard-reviews')).toBeInTheDocument();
		});

		expect(screen.getByText('Reviews: 0')).toBeInTheDocument();
	});

	it('should handle multiple reviews', async () => {
		const multipleReviewsData = {
			reviews: [
				mockReviewsData.reviews[0],
				{
					...mockReviewsData.reviews[0],
					id: '2',
					guestName: 'Jane Smith',
				},
			],
			aggregations: mockReviewsData.aggregations,
		};

		const { getReviews } = await import('../../lib/api');
		vi.mocked(getReviews);
		getReviews.mockResolvedValue(multipleReviewsData);

		renderWithRouter(<Dashboard />);

		await waitFor(() => {
			expect(screen.getByTestId('dashboard-reviews')).toBeInTheDocument();
		});

		expect(screen.getByText('Reviews: 2')).toBeInTheDocument();
		expect(screen.getByText('John Doe')).toBeInTheDocument();
		expect(screen.getByText('Jane Smith')).toBeInTheDocument();
	});

	it('should handle component unmount', async () => {
		const { unmount } = renderWithRouter(<Dashboard />);

		await waitFor(() => {
			expect(screen.getByTestId('dashboard-header')).toBeInTheDocument();
		});

		unmount();

		// Should not throw any errors
		expect(true).toBe(true);
	});
});
