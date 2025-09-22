import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../test/setup';
import DashboardFilters from '../DashboardFilters';

describe('DashboardFilters', () => {
	const mockFilters = {
		listingId: '',
		channel: undefined,
		rating: undefined,
		approved: undefined,
	};

	const mockSort = {
		field: 'date' as const,
		direction: 'desc' as const,
	};

	const mockUniqueListings = [
		{ id: 'prop-1', name: 'Property 1' },
		{ id: 'prop-2', name: 'Property 2' },
	];

	const mockUniqueChannels = ['hostaway', 'airbnb', 'google'];

	const defaultProps = {
		filters: mockFilters,
		sort: mockSort,
		onFiltersChange: vi.fn(),
		onSortChange: vi.fn(),
		onClearFilters: vi.fn(),
		uniqueListings: mockUniqueListings,
		uniqueChannels: mockUniqueChannels,
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should render all filter controls', () => {
		render(<DashboardFilters {...defaultProps} />);

		expect(screen.getByLabelText('Listing')).toBeInTheDocument();
		expect(screen.getByLabelText('Channel')).toBeInTheDocument();
		expect(screen.getByLabelText('Min Rating')).toBeInTheDocument();
		expect(screen.getByLabelText('Status')).toBeInTheDocument();
		expect(screen.getByLabelText('Sort By')).toBeInTheDocument();
		expect(screen.getByLabelText('Order')).toBeInTheDocument();
	});

	it('should render Clear Filters button', () => {
		render(<DashboardFilters {...defaultProps} />);

		expect(
			screen.getByRole('button', { name: 'Clear Filters' })
		).toBeInTheDocument();
	});

	it('should populate listing options', () => {
		render(<DashboardFilters {...defaultProps} />);

		const listingSelect = screen.getByLabelText('Listing');
		expect(listingSelect).toBeInTheDocument();

		fireEvent.click(listingSelect);
		expect(screen.getByText('All Listings')).toBeInTheDocument();
		expect(screen.getByText('Property 1')).toBeInTheDocument();
		expect(screen.getByText('Property 2')).toBeInTheDocument();
	});

	it('should populate channel options', () => {
		render(<DashboardFilters {...defaultProps} />);

		const channelSelect = screen.getByLabelText('Channel');
		expect(channelSelect).toBeInTheDocument();

		fireEvent.click(channelSelect);
		expect(screen.getByText('Hostaway')).toBeInTheDocument();
		expect(screen.getByText('Google')).toBeInTheDocument();
	});

	it('should populate rating options', () => {
		render(<DashboardFilters {...defaultProps} />);

		const ratingSelect = screen.getByLabelText('Min Rating');
		expect(ratingSelect).toBeInTheDocument();

		fireEvent.click(ratingSelect);
		expect(screen.getByText('Any Rating')).toBeInTheDocument();
		expect(screen.getByText('1+ Stars')).toBeInTheDocument();
		expect(screen.getByText('2+ Stars')).toBeInTheDocument();
		expect(screen.getByText('3+ Stars')).toBeInTheDocument();
		expect(screen.getByText('4+ Stars')).toBeInTheDocument();
		expect(screen.getByText('5 Stars')).toBeInTheDocument();
	});

	it('should populate status options', () => {
		render(<DashboardFilters {...defaultProps} />);

		const statusSelect = screen.getByLabelText('Status');
		expect(statusSelect).toBeInTheDocument();

		fireEvent.click(statusSelect);
		expect(screen.getByText('All Reviews')).toBeInTheDocument();
		expect(screen.getByText('Approved Only')).toBeInTheDocument();
		expect(screen.getByText('Pending Only')).toBeInTheDocument();
	});

	it('should populate sort field options', () => {
		render(<DashboardFilters {...defaultProps} />);

		const sortFieldSelect = screen.getByLabelText('Sort By');
		expect(sortFieldSelect).toBeInTheDocument();

		fireEvent.click(sortFieldSelect);
		expect(screen.getByText('Date')).toBeInTheDocument();
		expect(screen.getByText('Rating')).toBeInTheDocument();
		expect(screen.getByText('Guest Name')).toBeInTheDocument();
		expect(screen.getByText('Listing Name')).toBeInTheDocument();
	});

	it('should populate sort order options', () => {
		render(<DashboardFilters {...defaultProps} />);

		const sortOrderSelect = screen.getByLabelText('Order');
		expect(sortOrderSelect).toBeInTheDocument();

		fireEvent.click(sortOrderSelect);
		expect(screen.getByText('Newest First')).toBeInTheDocument();
		expect(screen.getByText('Oldest First')).toBeInTheDocument();
	});

	it('should call onFiltersChange when listing filter changes', async () => {
		const user = userEvent.setup();
		render(<DashboardFilters {...defaultProps} />);

		const listingSelect = screen.getByLabelText('Listing');
		await user.selectOptions(listingSelect, 'prop-1');

		expect(defaultProps.onFiltersChange).toHaveBeenCalledWith({
			...mockFilters,
			listingId: 'prop-1',
		});
	});

	it('should call onFiltersChange when channel filter changes', async () => {
		const user = userEvent.setup();
		render(<DashboardFilters {...defaultProps} />);

		const channelSelect = screen.getByLabelText('Channel');
		await user.selectOptions(channelSelect, 'hostaway');

		expect(defaultProps.onFiltersChange).toHaveBeenCalledWith({
			...mockFilters,
			channel: ['hostaway'],
		});
	});

	it('should call onFiltersChange when rating filter changes', async () => {
		const user = userEvent.setup();
		render(<DashboardFilters {...defaultProps} />);

		const ratingSelect = screen.getByLabelText('Min Rating');
		await user.selectOptions(ratingSelect, '4');

		expect(defaultProps.onFiltersChange).toHaveBeenCalledWith({
			...mockFilters,
			rating: { min: 4, max: 5 },
		});
	});

	it('should call onFiltersChange when status filter changes', async () => {
		const user = userEvent.setup();
		render(<DashboardFilters {...defaultProps} />);

		const statusSelect = screen.getByLabelText('Status');
		await user.selectOptions(statusSelect, 'true');

		expect(defaultProps.onFiltersChange).toHaveBeenCalledWith({
			...mockFilters,
			approved: true,
		});
	});

	it('should call onSortChange when sort field changes', async () => {
		const user = userEvent.setup();
		render(<DashboardFilters {...defaultProps} />);

		const sortFieldSelect = screen.getByLabelText('Sort By');
		await user.selectOptions(sortFieldSelect, 'rating');

		expect(defaultProps.onSortChange).toHaveBeenCalledWith({
			...mockSort,
			field: 'rating',
		});
	});

	it('should call onSortChange when sort order changes', async () => {
		const user = userEvent.setup();
		render(<DashboardFilters {...defaultProps} />);

		const sortOrderSelect = screen.getByLabelText('Order');
		await user.selectOptions(sortOrderSelect, 'asc');

		expect(defaultProps.onSortChange).toHaveBeenCalledWith({
			...mockSort,
			direction: 'asc',
		});
	});

	it('should call onClearFilters when Clear Filters button is clicked', async () => {
		const user = userEvent.setup();
		render(<DashboardFilters {...defaultProps} />);

		const clearButton = screen.getByRole('button', { name: 'Clear Filters' });
		await user.click(clearButton);

		expect(defaultProps.onClearFilters).toHaveBeenCalledTimes(1);
	});

	it('should handle empty listings array', () => {
		render(<DashboardFilters {...defaultProps} uniqueListings={[]} />);

		const listingSelect = screen.getByLabelText('Listing');
		expect(listingSelect).toBeInTheDocument();
	});

	it('should handle empty channels array', () => {
		render(<DashboardFilters {...defaultProps} />);

		const channelSelect = screen.getByLabelText('Channel');
		expect(channelSelect).toBeInTheDocument();
	});

	it('should show current filter values', () => {
		const filtersWithValues = {
			listingId: 'prop-1',
			channel: ['hostaway'],
			rating: { min: 4, max: 5 },
			approved: true,
		};

		render(<DashboardFilters {...defaultProps} filters={filtersWithValues} />);

		// Check that the select elements have the correct values
		const listingSelect = screen.getByLabelText('Listing') as HTMLSelectElement;
		const channelSelect = screen.getByLabelText('Channel') as HTMLSelectElement;
		const ratingSelect = screen.getByLabelText(
			'Min Rating'
		) as HTMLSelectElement;
		const statusSelect = screen.getByLabelText('Status') as HTMLSelectElement;

		expect(listingSelect.value).toBe('prop-1');
		expect(channelSelect.value).toBe('hostaway');
		expect(ratingSelect.value).toBe('4');
		expect(statusSelect.value).toBe('true');
	});

	it('should show current sort values', () => {
		const sortWithValues = {
			field: 'rating' as const,
			direction: 'asc' as const,
		};

		render(<DashboardFilters {...defaultProps} sort={sortWithValues} />);

		// Check that the sort select elements have the correct values
		const sortFieldSelect = screen.getByLabelText(
			'Sort By'
		) as HTMLSelectElement;
		const sortOrderSelect = screen.getByLabelText('Order') as HTMLSelectElement;

		expect(sortFieldSelect.value).toBe('rating');
		expect(sortOrderSelect.value).toBe('asc');
	});
});
