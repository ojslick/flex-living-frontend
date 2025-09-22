import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../../test/setup';
import DashboardInsights from '../DashboardInsights';

describe('DashboardInsights', () => {
	const mockCategoryInsights = [
		{
			category: 'Cleanliness',
			rating: 4.2,
			issues: 2,
			trend: 'stable' as const,
			issueRate: 20,
		},
		{
			category: 'Communication',
			rating: 4.8,
			issues: 0,
			trend: 'improving' as const,
			issueRate: 0,
		},
	];

	const mockMonthlyTrends = [
		{
			month: '2024-01',
			avgRating: 4.5,
			issues: 3,
			trend: '↗️' as const,
			issueRate: 15,
		},
		{
			month: '2024-02',
			avgRating: 4.7,
			issues: 2,
			trend: '↗️' as const,
			issueRate: 10,
		},
	];

	const mockRecurringIssues = [
		{
			issue: 'Noise complaints',
			frequency: 5,
			severity: 'high' as const,
			category: 'Noise',
		},
		{
			issue: 'WiFi connectivity',
			frequency: 3,
			severity: 'medium' as const,
			category: 'Internet',
		},
	];

	const mockPerformanceAlerts = [
		{
			type: 'warning' as const,
			title: 'Category Performance Issues',
			description: 'Issues detected in: Cleanliness',
			action: 'Address recurring problems',
			category: 'Cleanliness',
		},
	];

	const defaultProps = {
		categoryInsights: mockCategoryInsights,
		monthlyTrends: mockMonthlyTrends,
		recurringIssues: mockRecurringIssues,
		performanceAlerts: mockPerformanceAlerts,
	};

	it('should render without selected listing', () => {
		render(<DashboardInsights {...defaultProps} />);

		// Should not show per-listing performance analysis
		expect(screen.queryByText(/Performance Analysis/)).not.toBeInTheDocument();
	});

	it('should render per-listing performance analysis when listing is selected', () => {
		const selectedListing = { id: 'prop-1', name: 'Test Property' };
		render(
			<DashboardInsights {...defaultProps} selectedListing={selectedListing} />
		);

		expect(
			screen.getByText('📊 Test Property Performance Analysis')
		).toBeInTheDocument();
	});

	it('should render performance alerts and recurring issues when alerts exist', () => {
		render(<DashboardInsights {...defaultProps} />);

		// These components should be rendered by the DashboardInsights component
		// The actual content will be tested in their individual component tests
		expect(screen.getByText('Category Performance Issues')).toBeInTheDocument();
	});

	it('should not render performance alerts section when no alerts exist', () => {
		render(<DashboardInsights {...defaultProps} performanceAlerts={[]} />);

		// Should not show the alerts section
		expect(
			screen.queryByText('Category Performance Issues')
		).not.toBeInTheDocument();
	});

	it('should render category grid and trend timeline', () => {
		render(<DashboardInsights {...defaultProps} />);

		// These components should be rendered by the DashboardInsights component
		// The actual content will be tested in their individual component tests
		expect(screen.getByText('Cleanliness')).toBeInTheDocument();
	});

	it('should handle empty category insights', () => {
		render(<DashboardInsights {...defaultProps} categoryInsights={[]} />);

		// Should still render the component structure
		expect(screen.getByText('Cleanliness')).not.toBeInTheDocument();
	});

	it('should handle empty monthly trends', () => {
		render(<DashboardInsights {...defaultProps} monthlyTrends={[]} />);

		// Should still render the component structure
		expect(screen.getByText('Cleanliness')).toBeInTheDocument();
	});

	it('should handle empty recurring issues', () => {
		render(<DashboardInsights {...defaultProps} recurringIssues={[]} />);

		// Should still render the component structure
		expect(screen.getByText('Cleanliness')).toBeInTheDocument();
	});

	it('should handle null selected listing', () => {
		render(<DashboardInsights {...defaultProps} selectedListing={null} />);

		expect(screen.queryByText(/Performance Analysis/)).not.toBeInTheDocument();
	});

	it('should handle undefined selected listing', () => {
		render(<DashboardInsights {...defaultProps} selectedListing={undefined} />);

		expect(screen.queryByText(/Performance Analysis/)).not.toBeInTheDocument();
	});

	it('should render with listing name containing special characters', () => {
		const selectedListing = {
			id: 'prop-1',
			name: 'Test & Property "Special" Name',
		};
		render(
			<DashboardInsights {...defaultProps} selectedListing={selectedListing} />
		);

		expect(
			screen.getByText('📊 Test & Property "Special" Name Performance Analysis')
		).toBeInTheDocument();
	});

	it('should render with very long listing name', () => {
		const selectedListing = {
			id: 'prop-1',
			name: 'Very Long Property Name That Might Cause Layout Issues In The Dashboard Header Component',
		};
		render(
			<DashboardInsights {...defaultProps} selectedListing={selectedListing} />
		);

		expect(
			screen.getByText(
				'📊 Very Long Property Name That Might Cause Layout Issues In The Dashboard Header Component Performance Analysis'
			)
		).toBeInTheDocument();
	});

	it('should handle multiple performance alerts', () => {
		const multipleAlerts = [
			{
				type: 'warning' as const,
				title: 'Category Performance Issues',
				description: 'Issues detected in: Cleanliness',
				action: 'Address recurring problems',
				category: 'Cleanliness',
			},
			{
				type: 'critical' as const,
				title: 'Low Rating Alert',
				description: 'Average rating below 3.0',
				action: 'Immediate attention required',
			},
		];

		render(
			<DashboardInsights {...defaultProps} performanceAlerts={multipleAlerts} />
		);

		expect(screen.getByText('Category Performance Issues')).toBeInTheDocument();
		expect(screen.getByText('Low Rating Alert')).toBeInTheDocument();
	});

	it('should handle large datasets', () => {
		const largeCategoryInsights = Array.from({ length: 20 }, (_, i) => ({
			category: `Category ${i + 1}`,
			rating: 4.0 + i * 0.1,
			issues: i,
			trend: 'stable' as const,
			issueRate: i * 5,
		}));

		const largeMonthlyTrends = Array.from({ length: 12 }, (_, i) => ({
			month: `2024-${String(i + 1).padStart(2, '0')}`,
			avgRating: 4.0 + i * 0.05,
			issues: i,
			trend: '↗️' as const,
			issueRate: i * 2,
		}));

		render(
			<DashboardInsights
				{...defaultProps}
				categoryInsights={largeCategoryInsights}
				monthlyTrends={largeMonthlyTrends}
			/>
		);

		expect(screen.getByText('Category 1')).toBeInTheDocument();
		expect(screen.getByText('Category 20')).toBeInTheDocument();
	});
});
