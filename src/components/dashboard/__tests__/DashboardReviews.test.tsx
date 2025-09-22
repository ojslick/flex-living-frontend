import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../test/setup';
import DashboardReviews from '../DashboardReviews';
import type { NormalizedReview } from '../../../lib/types';

describe('DashboardReviews', () => {
    const mockReviews: NormalizedReview[] = [
			{
				id: '1',
				propertyId: 'prop-1',
				listingName: 'Test Property 1',
				channel: 'hostaway',
				type: 'guest-to-host',
				status: 'published',
				rating: 4.5,
				categories: [
					{ category: 'cleanliness', rating: 5 },
					{ category: 'communication', rating: 4 },
				],
				text: 'Great stay! The property was clean and the host was very responsive.',
				submittedAt: '2024-01-15T10:30:00Z',
				guestName: 'John Doe',
				managerApproved: true,
				channelIdentifiers: {
					hostaway: {
						propertyId: 'prop-1',
						listingName: 'Test Property 1',
						reviewId: '1',
					},
				},
			},
			{
				id: '2',
				propertyId: 'prop-1',
				listingName: 'Test Property 1',
				channel: 'airbnb',
				type: 'guest-to-host',
				status: 'published',
				rating: 3.0,
				categories: [
					{ category: 'cleanliness', rating: 2 },
					{ category: 'noise', rating: 1 },
				],
				text: 'Could be better. The place was not very clean and there was a lot of noise from the street.',
				submittedAt: '2024-01-10T10:30:00Z',
				guestName: 'Jane Smith',
				managerApproved: false,
				channelIdentifiers: {
					airbnb: {
						listingId: 'prop-1',
						reviewId: '2',
					},
				},
			},
		];

	const defaultProps = {
		reviews: mockReviews,
		onReviewClick: vi.fn(),
		onApproveToggle: vi.fn(),
		approvingReviews: new Set<string>(),
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should render reviews header with count', () => {
		render(<DashboardReviews {...defaultProps} />);

		expect(screen.getByText('Reviews (2)')).toBeInTheDocument();
		expect(screen.getByText('Showing 2 reviews')).toBeInTheDocument();
	});

	it('should render all reviews', () => {
		render(<DashboardReviews {...defaultProps} />);

		expect(screen.getByText('John Doe')).toBeInTheDocument();
		expect(screen.getByText('Jane Smith')).toBeInTheDocument();
	});

	it('should render review ratings', () => {
		render(<DashboardReviews {...defaultProps} />);

		expect(screen.getByText('4.5 ⭐')).toBeInTheDocument();
		expect(screen.getByText('3.0 ⭐')).toBeInTheDocument();
	});

	it('should render review text', () => {
		render(<DashboardReviews {...defaultProps} />);

		expect(
			screen.getByText(
				'Great stay! The property was clean and the host was very responsive.'
			)
		).toBeInTheDocument();
		expect(
			screen.getByText(
				'Could be better. The place was not very clean and there was a lot of noise from the street.'
			)
		).toBeInTheDocument();
	});

	it('should render review categories', () => {
		render(<DashboardReviews {...defaultProps} />);

		expect(screen.getByText('Cleanliness: 5/5')).toBeInTheDocument();
		expect(screen.getByText('Communication: 4/5')).toBeInTheDocument();
		expect(screen.getByText('Cleanliness: 2/5')).toBeInTheDocument();
		expect(screen.getByText('Noise: 1/5')).toBeInTheDocument();
	});

	it('should render action buttons', () => {
		render(<DashboardReviews {...defaultProps} />);

		expect(screen.getAllByText('View Property')).toHaveLength(2);
		expect(screen.getByText('Unapprove')).toBeInTheDocument(); // For approved review
		expect(screen.getByText('Approve')).toBeInTheDocument(); // For unapproved review
	});

	it('should call onReviewClick when review card is clicked', async () => {
		const user = userEvent.setup();
		render(<DashboardReviews {...defaultProps} />);

		const reviewCard =
			screen.getByText('John Doe').closest('[data-testid="review-card"]') ||
			screen.getByText('John Doe').closest('div');
		await user.click(reviewCard!);

		expect(defaultProps.onReviewClick).toHaveBeenCalledWith('1');
	});

	it('should call onReviewClick when View Property button is clicked', async () => {
		const user = userEvent.setup();
		render(<DashboardReviews {...defaultProps} />);

		const viewPropertyButtons = screen.getAllByText('View Property');
		await user.click(viewPropertyButtons[0]);

		expect(defaultProps.onReviewClick).toHaveBeenCalledWith('1');
	});

	it('should call onApproveToggle when approve button is clicked', async () => {
		const user = userEvent.setup();
		render(<DashboardReviews {...defaultProps} />);

		const approveButton = screen.getByText('Approve');
		await user.click(approveButton);

		expect(defaultProps.onApproveToggle).toHaveBeenCalledWith(
			'2',
			expect.any(Object)
		);
	});

	it('should call onApproveToggle when unapprove button is clicked', async () => {
		const user = userEvent.setup();
		render(<DashboardReviews {...defaultProps} />);

		const unapproveButton = screen.getByText('Unapprove');
		await user.click(unapproveButton);

		expect(defaultProps.onApproveToggle).toHaveBeenCalledWith(
			'1',
			expect.any(Object)
		);
	});

	it('should show loading state for approving reviews', () => {
		const approvingReviews = new Set(['1']);
		render(
			<DashboardReviews {...defaultProps} approvingReviews={approvingReviews} />
		);

		expect(screen.getByText('Updating...')).toBeInTheDocument();
	});

	it('should disable approve button when approving', () => {
		const approvingReviews = new Set(['1']);
		render(
			<DashboardReviews {...defaultProps} approvingReviews={approvingReviews} />
		);

		const updatingButton = screen.getByText('Updating...');
		expect(updatingButton).toBeDisabled();
	});

	it('should handle reviews without text', () => {
		const reviewsWithoutText = [
			{
				...mockReviews[0],
				text: null,
			},
		];

		render(<DashboardReviews {...defaultProps} reviews={reviewsWithoutText} />);

		expect(screen.getByText('John Doe')).toBeInTheDocument();
		expect(screen.queryByText('Great stay!')).not.toBeInTheDocument();
	});

	it('should handle reviews without categories', () => {
		const reviewsWithoutCategories = [
			{
				...mockReviews[0],
				categories: [],
			},
		];

		render(
			<DashboardReviews {...defaultProps} reviews={reviewsWithoutCategories} />
		);

		expect(screen.getByText('John Doe')).toBeInTheDocument();
		expect(screen.queryByText('Cleanliness: 5/5')).not.toBeInTheDocument();
	});

	it('should handle reviews without guest name', () => {
		const reviewsWithoutGuestName = [
			{
				...mockReviews[0],
				guestName: undefined,
			},
		];

		render(
			<DashboardReviews {...defaultProps} reviews={reviewsWithoutGuestName} />
		);

		expect(screen.getByText('Anonymous')).toBeInTheDocument();
	});

	it('should handle reviews without rating', () => {
		const reviewsWithoutRating = [
			{
				...mockReviews[0],
				rating: null,
			},
		];

		render(
			<DashboardReviews {...defaultProps} reviews={reviewsWithoutRating} />
		);

		expect(screen.getByText('No rating')).toBeInTheDocument();
	});

	it('should handle empty reviews array', () => {
		render(<DashboardReviews {...defaultProps} reviews={[]} />);

		expect(screen.getByText('Reviews (0)')).toBeInTheDocument();
		expect(screen.getByText('Showing 0 reviews')).toBeInTheDocument();
	});

	it('should truncate long review text and show read more', () => {
		const longTextReview = [
			{
				...mockReviews[0],
				text: 'This is a very long review text that should be truncated because it exceeds the character limit for display. It contains multiple sentences and should trigger the read more functionality when rendered in the component.',
			},
		];

		render(<DashboardReviews {...defaultProps} reviews={longTextReview} />);

		expect(screen.getByText('Read more')).toBeInTheDocument();
	});

	it('should expand review text when read more is clicked', async () => {
		const user = userEvent.setup();
		const longTextReview = [
			{
				...mockReviews[0],
				text: 'This is a very long review text that should be truncated because it exceeds the character limit for display. It contains multiple sentences and should trigger the read more functionality when rendered in the component.',
			},
		];

		render(<DashboardReviews {...defaultProps} reviews={longTextReview} />);

		const readMoreButton = screen.getByText('Read more');
		await user.click(readMoreButton);

		expect(screen.getByText('Show less')).toBeInTheDocument();
	});

	it('should collapse review text when show less is clicked', async () => {
		const user = userEvent.setup();
		const longTextReview = [
			{
				...mockReviews[0],
				text: 'This is a very long review text that should be truncated because it exceeds the character limit for display. It contains multiple sentences and should trigger the read more functionality when rendered in the component.',
			},
		];

		render(<DashboardReviews {...defaultProps} reviews={longTextReview} />);

		const readMoreButton = screen.getByText('Read more');
		await user.click(readMoreButton);

		const showLessButton = screen.getByText('Show less');
		await user.click(showLessButton);

		expect(screen.getByText('Read more')).toBeInTheDocument();
	});

	it('should handle multiple reviews with different approval states', () => {
		const mixedReviews = [
			{ ...mockReviews[0], managerApproved: true },
			{ ...mockReviews[1], managerApproved: false },
		];

		render(<DashboardReviews {...defaultProps} reviews={mixedReviews} />);

		expect(screen.getByText('Unapprove')).toBeInTheDocument();
		expect(screen.getByText('Approve')).toBeInTheDocument();
	});
});
