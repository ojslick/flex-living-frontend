import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../../test/setup';
import DashboardHeader from '../DashboardHeader';

describe('DashboardHeader', () => {
	const mockStats = {
		totalReviews: 150,
		avgRating: 4.2,
		approvedReviews: 120,
		recentReviews: 25,
	};

	it('should render with default title when no listing selected', () => {
		render(<DashboardHeader stats={mockStats} />);

		expect(screen.getByText('Property Reviews Dashboard')).toBeInTheDocument();
	});

	it('should render with listing-specific title when listing is selected', () => {
		const selectedListing = { id: 'prop-1', name: 'Test Property' };
		render(
			<DashboardHeader selectedListing={selectedListing} stats={mockStats} />
		);

		expect(screen.getByText('Test Property Dashboard')).toBeInTheDocument();
	});

	it('should render all stat cards', () => {
		render(<DashboardHeader stats={mockStats} />);

		expect(screen.getByText('150')).toBeInTheDocument();
		expect(screen.getByText('4.2')).toBeInTheDocument();
		expect(screen.getByText('120')).toBeInTheDocument();
		expect(screen.getByText('25')).toBeInTheDocument();
	});

	it('should render all stat labels', () => {
		render(<DashboardHeader stats={mockStats} />);

		expect(screen.getByText('Total Reviews')).toBeInTheDocument();
		expect(screen.getByText('Average Rating')).toBeInTheDocument();
		expect(screen.getByText('Approved Reviews')).toBeInTheDocument();
		expect(screen.getByText('Recent Reviews (30 days)')).toBeInTheDocument();
	});

	it('should handle zero values', () => {
		const zeroStats = {
			totalReviews: 0,
			avgRating: 0,
			approvedReviews: 0,
			recentReviews: 0,
		};

		render(<DashboardHeader stats={zeroStats} />);

		// Check that all stat values are displayed correctly
		expect(screen.getByText('Total Reviews')).toBeInTheDocument();
		expect(screen.getByText('Average Rating')).toBeInTheDocument();
		expect(screen.getByText('Approved Reviews')).toBeInTheDocument();
		expect(screen.getByText('Recent Reviews (30 days)')).toBeInTheDocument();

		// Check that the values are displayed (there will be multiple "0" values)
		const zeroElements = screen.getAllByText('0');
		expect(zeroElements.length).toBeGreaterThan(0);
		expect(screen.getByText('0.0')).toBeInTheDocument();
	});

	it('should handle decimal ratings correctly', () => {
		const decimalStats = {
			totalReviews: 100,
			avgRating: 4.567,
			approvedReviews: 80,
			recentReviews: 15,
		};

		render(<DashboardHeader stats={decimalStats} />);

		expect(screen.getByText('4.6')).toBeInTheDocument(); // Should round to 1 decimal
	});

	it('should handle large numbers', () => {
		const largeStats = {
			totalReviews: 9999,
			avgRating: 4.9,
			approvedReviews: 8500,
			recentReviews: 500,
		};

		render(<DashboardHeader stats={largeStats} />);

		expect(screen.getByText('9999')).toBeInTheDocument();
		expect(screen.getByText('4.9')).toBeInTheDocument();
		expect(screen.getByText('8500')).toBeInTheDocument();
		expect(screen.getByText('500')).toBeInTheDocument();
	});

	it('should render with null selectedListing', () => {
		render(<DashboardHeader selectedListing={null} stats={mockStats} />);

		expect(screen.getByText('Property Reviews Dashboard')).toBeInTheDocument();
	});

	it('should render with undefined selectedListing', () => {
		render(<DashboardHeader selectedListing={undefined} stats={mockStats} />);

		expect(screen.getByText('Property Reviews Dashboard')).toBeInTheDocument();
	});

	it('should handle listing with special characters in name', () => {
		const specialListing = {
			id: 'prop-1',
			name: 'Test & Property "Special" Name',
		};
		render(
			<DashboardHeader selectedListing={specialListing} stats={mockStats} />
		);

		expect(
			screen.getByText('Test & Property "Special" Name Dashboard')
		).toBeInTheDocument();
	});

	it('should handle very long listing names', () => {
		const longListing = {
			id: 'prop-1',
			name: 'Very Long Property Name That Might Cause Layout Issues In The Dashboard Header Component',
		};
		render(<DashboardHeader selectedListing={longListing} stats={mockStats} />);

		expect(
			screen.getByText(
				'Very Long Property Name That Might Cause Layout Issues In The Dashboard Header Component Dashboard'
			)
		).toBeInTheDocument();
	});
});
