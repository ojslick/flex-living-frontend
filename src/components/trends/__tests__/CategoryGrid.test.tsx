import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../../test/setup';
import CategoryGrid from '../CategoryGrid';

describe('CategoryGrid', () => {
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
		{
			category: 'Check-in',
			rating: 3.5,
			issues: 3,
			trend: 'declining' as const,
			issueRate: 30,
		},
		{
			category: 'Accuracy',
			rating: 4.0,
			issues: 1,
			trend: 'stable' as const,
			issueRate: 10,
		},
		{
			category: 'Location',
			rating: 4.9,
			issues: 0,
			trend: 'improving' as const,
			issueRate: 0,
		},
		{
			category: 'Value',
			rating: 3.8,
			issues: 2,
			trend: 'stable' as const,
			issueRate: 20,
		},
	];

	it('should render category grid title', () => {
		render(<CategoryGrid categories={mockCategoryInsights} />);

		expect(screen.getByText('📊 Category Performance')).toBeInTheDocument();
	});

	it('should render all category cards', () => {
		render(<CategoryGrid categories={mockCategoryInsights} />);

		expect(screen.getByText('Cleanliness')).toBeInTheDocument();
		expect(screen.getByText('Communication')).toBeInTheDocument();
		expect(screen.getByText('Check-in')).toBeInTheDocument();
		expect(screen.getByText('Accuracy')).toBeInTheDocument();
		expect(screen.getByText('Location')).toBeInTheDocument();
		expect(screen.getByText('Value')).toBeInTheDocument();
	});

	it('should render category ratings', () => {
		render(<CategoryGrid categories={mockCategoryInsights} />);

		expect(screen.getByText('4.2/5')).toBeInTheDocument();
		expect(screen.getByText('4.8/5')).toBeInTheDocument();
		expect(screen.getByText('3.5/5')).toBeInTheDocument();
		expect(screen.getByText('4/5')).toBeInTheDocument();
		expect(screen.getByText('4.9/5')).toBeInTheDocument();
		expect(screen.getByText('3.8/5')).toBeInTheDocument();
	});

	it('should render issue counts', () => {
		render(<CategoryGrid categories={mockCategoryInsights} />);

		expect(screen.getAllByText('2 issues')).toHaveLength(2);
		expect(screen.getAllByText('0 issues')).toHaveLength(2);
		expect(screen.getByText('3 issues')).toBeInTheDocument();
		expect(screen.getByText('1 issues')).toBeInTheDocument();
	});

	it('should render trend indicators', () => {
		render(<CategoryGrid categories={mockCategoryInsights} />);

		expect(screen.getAllByText('→')).toHaveLength(3); // stable
		expect(screen.getAllByText('↗️')).toHaveLength(2); // improving
		expect(screen.getByText('↘️')).toBeInTheDocument(); // declining
	});

	it('should render issue rates', () => {
		render(<CategoryGrid categories={mockCategoryInsights} />);

		expect(screen.getAllByText('20% issue rate')).toHaveLength(2);
		expect(screen.getAllByText('0% issue rate')).toHaveLength(2);
		expect(screen.getByText('30% issue rate')).toBeInTheDocument();
		expect(screen.getByText('10% issue rate')).toBeInTheDocument();
	});

	it('should handle empty category insights', () => {
		render(<CategoryGrid categories={[]} />);

		expect(screen.getByText('📊 Category Performance')).toBeInTheDocument();
		expect(screen.getByText('No Category Data Available')).toBeInTheDocument();
		expect(
			screen.getByText(
				'Category performance data will appear here once reviews with category ratings are available.'
			)
		).toBeInTheDocument();
		expect(screen.queryByText('Cleanliness')).not.toBeInTheDocument();
	});

	it('should handle single category insight', () => {
		const singleCategory = [mockCategoryInsights[0]];
		render(<CategoryGrid categories={singleCategory} />);

		expect(screen.getByText('Cleanliness')).toBeInTheDocument();
		expect(screen.getByText('4.2/5')).toBeInTheDocument();
		expect(screen.getByText('2 issues')).toBeInTheDocument();
	});

	it('should handle categories with zero rating', () => {
		const zeroRatingCategory = [
			{
				category: 'Test Category',
				rating: 0,
				issues: 5,
				trend: 'declining' as const,
				issueRate: 100,
			},
		];

		render(<CategoryGrid categories={zeroRatingCategory} />);

		expect(screen.getByText('Test Category')).toBeInTheDocument();
		expect(screen.getByText('0/5')).toBeInTheDocument();
		expect(screen.getByText('5 issues')).toBeInTheDocument();
		expect(screen.getByText('100% issue rate')).toBeInTheDocument();
	});

	it('should handle categories with perfect rating', () => {
		const perfectRatingCategory = [
			{
				category: 'Perfect Category',
				rating: 5.0,
				issues: 0,
				trend: 'improving' as const,
				issueRate: 0,
			},
		];

		render(<CategoryGrid categories={perfectRatingCategory} />);

		expect(screen.getByText('Perfect Category')).toBeInTheDocument();
		expect(screen.getByText('5/5')).toBeInTheDocument();
		expect(screen.getByText('0 issues')).toBeInTheDocument();
		expect(screen.getByText('0% issue rate')).toBeInTheDocument();
	});

	it('should handle categories with decimal ratings', () => {
		const decimalRatingCategory = [
			{
				category: 'Decimal Category',
				rating: 4.567,
				issues: 1,
				trend: 'stable' as const,
				issueRate: 12.5,
			},
		];

		render(<CategoryGrid categories={decimalRatingCategory} />);

		expect(screen.getByText('Decimal Category')).toBeInTheDocument();
		expect(screen.getByText('4.567/5')).toBeInTheDocument(); // Should show full decimal
		expect(screen.getByText('1 issues')).toBeInTheDocument();
		expect(screen.getByText('12.5% issue rate')).toBeInTheDocument();
	});

	it('should handle categories with high issue rates', () => {
		const highIssueRateCategory = [
			{
				category: 'High Issue Category',
				rating: 2.0,
				issues: 10,
				trend: 'declining' as const,
				issueRate: 90,
			},
		];

		render(<CategoryGrid categories={highIssueRateCategory} />);

		expect(screen.getByText('High Issue Category')).toBeInTheDocument();
		expect(screen.getByText('2/5')).toBeInTheDocument();
		expect(screen.getByText('10 issues')).toBeInTheDocument();
		expect(screen.getByText('90% issue rate')).toBeInTheDocument();
	});

	it('should handle categories with special characters in names', () => {
		const specialCharCategory = [
			{
				category: 'Category & Name "Special"',
				rating: 4.0,
				issues: 1,
				trend: 'stable' as const,
				issueRate: 10,
			},
		];

		render(<CategoryGrid categories={specialCharCategory} />);

		expect(screen.getByText('Category & Name "Special"')).toBeInTheDocument();
	});

	it('should handle large number of categories', () => {
		const manyCategories = Array.from({ length: 20 }, (_, i) => ({
			category: `Category ${i + 1}`,
			rating: 4.0 + i * 0.1,
			issues: i,
			trend: 'stable' as const,
			issueRate: i * 5,
		}));

		render(<CategoryGrid categories={manyCategories} />);

		expect(screen.getByText('Category 1')).toBeInTheDocument();
		// Only first 6 categories are shown due to slice(0, 6)
		expect(screen.getByText('Category 6')).toBeInTheDocument();
		expect(screen.queryByText('Category 20')).not.toBeInTheDocument();
	});

	it('should handle categories with all trend types', () => {
		const allTrends = [
			{
				category: 'Stable',
				rating: 4.0,
				issues: 1,
				trend: 'stable' as const,
				issueRate: 10,
			},
			{
				category: 'Improving',
				rating: 4.5,
				issues: 0,
				trend: 'improving' as const,
				issueRate: 0,
			},
			{
				category: 'Declining',
				rating: 3.0,
				issues: 3,
				trend: 'declining' as const,
				issueRate: 30,
			},
		];

		render(<CategoryGrid categories={allTrends} />);

		expect(screen.getByText('Stable')).toBeInTheDocument();
		expect(screen.getByText('Improving')).toBeInTheDocument();
		expect(screen.getByText('Declining')).toBeInTheDocument();

		expect(screen.getByText('→')).toBeInTheDocument(); // stable
		expect(screen.getByText('↗️')).toBeInTheDocument(); // improving
		expect(screen.getByText('↘️')).toBeInTheDocument(); // declining
	});
});
