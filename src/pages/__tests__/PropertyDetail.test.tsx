import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '../../test/setup';
import PropertyDetail from '../PropertyDetail';

// Mock the API functions
vi.mock('../../lib/api', () => ({
	getReviews: vi.fn(),
}));

// Mock the property data utility
vi.mock('../../lib/propertyData', () => ({
	getPropertyDetails: vi.fn(),
}));

// Mock the property components
vi.mock('../../components/property', () => ({
	PropertyImageGrid: () => (
		<div data-testid="property-image-grid">Image Grid</div>
	),
	PropertyTitleSection: ({ propertyDetails }: any) => (
		<div data-testid="property-title-section">
			<h1>{propertyDetails?.name || 'Property Title'}</h1>
		</div>
	),
	PropertyDescription: ({
		description,
		isDescriptionExpanded,
		setIsDescriptionExpanded,
	}: any) => (
		<div data-testid="property-description">
			<div>Description: {description?.length || 0} items</div>
			<button onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}>
				{isDescriptionExpanded ? 'Show Less' : 'Read More'}
			</button>
		</div>
	),
	PropertyAmenities: () => (
		<div data-testid="property-amenities">Amenities</div>
	),
	PropertyStayPolicies: ({ checkInTime, checkOutTime }: any) => (
		<div data-testid="property-stay-policies">
			<div>Check-in: {checkInTime}</div>
			<div>Check-out: {checkOutTime}</div>
		</div>
	),
	PropertyReviews: ({ reviews, reviewsSectionRef }: any) => (
		<div data-testid="property-reviews" ref={reviewsSectionRef}>
			<div>Reviews: {reviews.length}</div>
		</div>
	),
	PropertyBooking: () => <div data-testid="property-booking">Booking</div>,
}));

const mockReviewsData = {
	reviews: [
		{
			id: '1',
			propertyId: 'test-listing',
			listingName: 'Test Property',
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

const mockPropertyDetails = {
	id: 'test-listing',
	name: 'Test Property',
	location: 'Test Location',
	address: '123 Test St',
	price: 100,
	currency: 'USD',
	amenities: ['WiFi', 'Kitchen'],
	description: ['Great property', 'Perfect location'],
	checkInTime: '3:00 PM',
	checkOutTime: '11:00 AM',
	minStay: 2,
	images: ['image1.jpg', 'image2.jpg'],
	propertyType: 'Apartment',
	bedrooms: 2,
	bathrooms: 1,
	guests: 4,
};

const renderWithRouter = (
	component: React.ReactElement,
	initialEntries = ['/property/test-listing']
) => {
	return render(
		<MemoryRouter initialEntries={initialEntries}>{component}</MemoryRouter>
	);
};

describe('PropertyDetail', () => {
	beforeEach(async () => {
		vi.clearAllMocks();
		// Mock successful API response
		const { getReviews } = await import('../../lib/api');
		vi.mocked(getReviews).mockResolvedValue(mockReviewsData);

		// Mock property details
		const { getPropertyDetails } = await import('../../lib/propertyData');
		vi.mocked(getPropertyDetails).mockReturnValue(mockPropertyDetails);
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	it('should render loading state initially', () => {
		renderWithRouter(<PropertyDetail />);

		// Should show loading spinner
		expect(screen.getByText('Loading property details...')).toBeInTheDocument();
	});

	it('should render property detail after loading', async () => {
		renderWithRouter(<PropertyDetail />);

		await waitFor(() => {
			expect(screen.getByTestId('property-image-grid')).toBeInTheDocument();
		});

		expect(screen.getByTestId('property-title-section')).toBeInTheDocument();
		expect(screen.getByTestId('property-description')).toBeInTheDocument();
		expect(screen.getByTestId('property-amenities')).toBeInTheDocument();
		expect(screen.getByTestId('property-stay-policies')).toBeInTheDocument();
		expect(screen.getByTestId('property-reviews')).toBeInTheDocument();
		expect(screen.getByTestId('property-booking')).toBeInTheDocument();
	});

	it('should render property title section with correct data', async () => {
		renderWithRouter(<PropertyDetail />);

		await waitFor(() => {
			expect(screen.getByText('Test Property')).toBeInTheDocument();
		});
	});

	it('should render property description with correct data', async () => {
		renderWithRouter(<PropertyDetail />);

		await waitFor(() => {
			expect(screen.getByText('Description: 2 items')).toBeInTheDocument();
		});
	});

	it('should render stay policies with correct data', async () => {
		renderWithRouter(<PropertyDetail />);

		await waitFor(() => {
			expect(screen.getByText('Check-in: 3:00 PM')).toBeInTheDocument();
			expect(screen.getByText('Check-out: 11:00 AM')).toBeInTheDocument();
		});
	});

	it('should render reviews section with correct data', async () => {
		renderWithRouter(<PropertyDetail />);

		await waitFor(() => {
			expect(screen.getByText('Reviews: 1')).toBeInTheDocument();
		});
	});

	it('should handle API errors', async () => {
		const { getReviews } = await import('../../lib/api');
		vi.mocked(getReviews).mockRejectedValue(new Error('API Error'));

		renderWithRouter(<PropertyDetail />);

		await waitFor(() => {
			expect(screen.getByText('API Error')).toBeInTheDocument();
		});

		expect(screen.getByText('Retry')).toBeInTheDocument();
	});

	it('should handle retry button click', async () => {
		const { getReviews } = await import('../../lib/api');
		vi.mocked(getReviews).mockRejectedValueOnce(new Error('API Error'));
		vi.mocked(getReviews).mockResolvedValueOnce(mockReviewsData);

		renderWithRouter(<PropertyDetail />);

		await waitFor(() => {
			expect(screen.getByText('API Error')).toBeInTheDocument();
		});

		const retryButton = screen.getByText('Retry');
		retryButton.click();

		await waitFor(() => {
			expect(screen.getByTestId('property-image-grid')).toBeInTheDocument();
		});
	});

	it('should handle no data available', async () => {
		const { getReviews } = await import('../../lib/api');
		vi.mocked(getReviews).mockResolvedValue(null);

		renderWithRouter(<PropertyDetail />);

		await waitFor(() => {
			expect(screen.getByText('No data available')).toBeInTheDocument();
		});
	});

	it('should handle no property details available', async () => {
		const { getPropertyDetails } = await import('../../lib/propertyData');
		vi.mocked(getPropertyDetails).mockReturnValue(null);

		renderWithRouter(<PropertyDetail />);

		await waitFor(() => {
			expect(screen.getByText('No data available')).toBeInTheDocument();
		});
	});

	it('should handle description expansion', async () => {
		renderWithRouter(<PropertyDetail />);

		await waitFor(() => {
			expect(screen.getByTestId('property-description')).toBeInTheDocument();
		});

		const readMoreButton = screen.getByText('Read More');
		readMoreButton.click();

		expect(screen.getByText('Show Less')).toBeInTheDocument();
	});

	it('should handle description collapse', async () => {
		renderWithRouter(<PropertyDetail />);

		await waitFor(() => {
			expect(screen.getByTestId('property-description')).toBeInTheDocument();
		});

		const readMoreButton = screen.getByText('Read More');
		readMoreButton.click();

		const showLessButton = screen.getByText('Show Less');
		showLessButton.click();

		expect(screen.getByText('Read More')).toBeInTheDocument();
	});

	it('should handle scroll to reviews when navigating from dashboard', async () => {
		const mockScrollIntoView = vi.fn();
		Element.prototype.scrollIntoView = mockScrollIntoView;

		renderWithRouter(<PropertyDetail />, ['/property/test-listing']);

		await waitFor(() => {
			expect(screen.getByTestId('property-reviews')).toBeInTheDocument();
		});

		// Should not scroll by default
		expect(mockScrollIntoView).not.toHaveBeenCalled();
	});

	it('should handle different listing IDs', async () => {
		const { getPropertyDetails } = await import('../../lib/propertyData');
		vi.mocked(getPropertyDetails);
		getPropertyDetails.mockReturnValue({
			...mockPropertyDetails,
			id: 'different-listing',
			name: 'Different Property',
		});

		renderWithRouter(<PropertyDetail />, ['/property/different-listing']);

		await waitFor(() => {
			expect(screen.getByText('Different Property')).toBeInTheDocument();
		});
	});

	it('should handle empty reviews array', async () => {
		const { getReviews } = await import('../../lib/api');
		vi.mocked(getReviews);
		getReviews.mockResolvedValue({ reviews: [], aggregations: {} });

		renderWithRouter(<PropertyDetail />);

		await waitFor(() => {
			expect(screen.getByTestId('property-reviews')).toBeInTheDocument();
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

		renderWithRouter(<PropertyDetail />);

		await waitFor(() => {
			expect(screen.getByTestId('property-reviews')).toBeInTheDocument();
		});

		expect(screen.getByText('Reviews: 2')).toBeInTheDocument();
	});

	it('should handle property details with missing fields', async () => {
		const { getPropertyDetails } = await import('../../lib/propertyData');
		vi.mocked(getPropertyDetails);
		getPropertyDetails.mockReturnValue({
			...mockPropertyDetails,
			description: null,
			checkInTime: null,
			checkOutTime: null,
		});

		renderWithRouter(<PropertyDetail />);

		await waitFor(() => {
			expect(screen.getByTestId('property-description')).toBeInTheDocument();
		});

		expect(screen.getByText('Description: 0 items')).toBeInTheDocument();
	});

	it('should handle component unmount', async () => {
		const { unmount } = renderWithRouter(<PropertyDetail />);

		await waitFor(() => {
			expect(screen.getByTestId('property-image-grid')).toBeInTheDocument();
		});

		unmount();

		// Should not throw any errors
		expect(true).toBe(true);
	});

	it('should handle URL parameter changes', async () => {
		const { getPropertyDetails } = await import('../../lib/propertyData');
		vi.mocked(getPropertyDetails);
		getPropertyDetails.mockReturnValue(mockPropertyDetails);

		const { rerender } = renderWithRouter(<PropertyDetail />, [
			'/property/listing-1',
		]);

		await waitFor(() => {
			expect(screen.getByTestId('property-image-grid')).toBeInTheDocument();
		});

		// Change URL parameter
		rerender(
			<MemoryRouter initialEntries={['/property/listing-2']}>
				<PropertyDetail />
			</MemoryRouter>
		);

		// Should still render the component
		expect(screen.getByTestId('property-image-grid')).toBeInTheDocument();
	});
});
