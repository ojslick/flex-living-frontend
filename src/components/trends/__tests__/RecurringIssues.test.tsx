import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../../test/setup';
import RecurringIssues from '../RecurringIssues';

describe('RecurringIssues', () => {
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
		{
			issue: 'Cleanliness issues',
			frequency: 2,
			severity: 'low' as const,
			category: 'Cleanliness',
		},
	];

	it('should render recurring issues title', () => {
		render(<RecurringIssues issues={mockRecurringIssues} />);

		expect(screen.getByText('🔍 Recurring Issues')).toBeInTheDocument();
	});

	it('should render all recurring issues', () => {
		render(<RecurringIssues issues={mockRecurringIssues} />);

		expect(screen.getByText('Noise complaints')).toBeInTheDocument();
		expect(screen.getByText('WiFi connectivity')).toBeInTheDocument();
		expect(screen.getByText('Cleanliness issues')).toBeInTheDocument();
	});

	it('should render issue frequencies', () => {
		render(<RecurringIssues issues={mockRecurringIssues} />);

		expect(screen.getByText('5 times')).toBeInTheDocument();
		expect(screen.getByText('3 times')).toBeInTheDocument();
		expect(screen.getByText('2 times')).toBeInTheDocument();
	});

	it('should render issue severities', () => {
		render(<RecurringIssues issues={mockRecurringIssues} />);

		expect(screen.getByText('high')).toBeInTheDocument();
		expect(screen.getByText('medium')).toBeInTheDocument();
		expect(screen.getByText('low')).toBeInTheDocument();
	});

	it('should render issue categories', () => {
		render(<RecurringIssues issues={mockRecurringIssues} />);

		expect(screen.getByText('Noise')).toBeInTheDocument();
		expect(screen.getByText('Internet')).toBeInTheDocument();
		expect(screen.getByText('Cleanliness')).toBeInTheDocument();
	});

	it('should handle empty recurring issues', () => {
		render(<RecurringIssues issues={[]} />);

		expect(screen.getByText('🔍 Recurring Issues')).toBeInTheDocument();
		expect(screen.queryByText('Noise complaints')).not.toBeInTheDocument();
	});

	it('should handle single recurring issue', () => {
		const singleIssue = [mockRecurringIssues[0]];
		render(<RecurringIssues issues={singleIssue} />);

		expect(screen.getByText('Noise complaints')).toBeInTheDocument();
		expect(screen.getByText('5 times')).toBeInTheDocument();
		expect(screen.getByText('high')).toBeInTheDocument();
		expect(screen.getByText('Noise')).toBeInTheDocument();
	});

	it('should handle issues with zero frequency', () => {
		const zeroFrequencyIssue = [
			{
				issue: 'Zero frequency issue',
				frequency: 0,
				severity: 'low' as const,
				category: 'Test',
			},
		];

		render(<RecurringIssues issues={zeroFrequencyIssue} />);

		expect(screen.getByText('Zero frequency issue')).toBeInTheDocument();
		expect(screen.getByText('0 times')).toBeInTheDocument();
		expect(screen.getByText('low')).toBeInTheDocument();
		expect(screen.getByText('Test')).toBeInTheDocument();
	});

	it('should handle issues with high frequency', () => {
		const highFrequencyIssue = [
			{
				issue: 'High frequency issue',
				frequency: 100,
				severity: 'high' as const,
				category: 'Test',
			},
		];

		render(<RecurringIssues issues={highFrequencyIssue} />);

		expect(screen.getByText('High frequency issue')).toBeInTheDocument();
		expect(screen.getByText('100 times')).toBeInTheDocument();
		expect(screen.getByText('high')).toBeInTheDocument();
		expect(screen.getByText('Test')).toBeInTheDocument();
	});

	it('should handle issues with all severity levels', () => {
		const allSeverities = [
			{
				issue: 'High severity',
				frequency: 5,
				severity: 'high' as const,
				category: 'Test',
			},
			{
				issue: 'Medium severity',
				frequency: 3,
				severity: 'medium' as const,
				category: 'Test',
			},
			{
				issue: 'Low severity',
				frequency: 1,
				severity: 'low' as const,
				category: 'Test',
			},
		];

		render(<RecurringIssues issues={allSeverities} />);

		expect(screen.getByText('High severity')).toBeInTheDocument();
		expect(screen.getByText('Medium severity')).toBeInTheDocument();
		expect(screen.getByText('Low severity')).toBeInTheDocument();

		expect(screen.getByText('high')).toBeInTheDocument();
		expect(screen.getByText('medium')).toBeInTheDocument();
		expect(screen.getByText('low')).toBeInTheDocument();
	});

	it('should handle issues with special characters in names', () => {
		const specialCharIssue = [
			{
				issue: 'Issue & Name "Special"',
				frequency: 1,
				severity: 'low' as const,
				category: 'Test',
			},
		];

		render(<RecurringIssues issues={specialCharIssue} />);

		expect(screen.getByText('Issue & Name "Special"')).toBeInTheDocument();
	});

	it('should handle issues with long names', () => {
		const longNameIssue = [
			{
				issue:
					'This is a very long issue name that might cause layout issues in the recurring issues component',
				frequency: 1,
				severity: 'low' as const,
				category: 'Test',
			},
		];

		render(<RecurringIssues issues={longNameIssue} />);

		expect(
			screen.getByText(
				'This is a very long issue name that might cause layout issues in the recurring issues component'
			)
		).toBeInTheDocument();
	});

	it('should handle issues with special characters in categories', () => {
		const specialCharCategory = [
			{
				issue: 'Test issue',
				frequency: 1,
				severity: 'low' as const,
				category: 'Category & Name "Special"',
			},
		];

		render(<RecurringIssues issues={specialCharCategory} />);

		expect(screen.getByText('Category & Name "Special"')).toBeInTheDocument();
	});

	it('should handle issues with empty strings', () => {
		const emptyStringIssue = [
			{
				issue: '',
				frequency: 1,
				severity: 'low' as const,
				category: '',
			},
		];

		render(<RecurringIssues issues={emptyStringIssue} />);

		// Should still render the component structure
		expect(screen.getByText('🔍 Recurring Issues')).toBeInTheDocument();
	});

	it('should handle issues with null values', () => {
		const nullValueIssue = [
			{
				issue: 'Null value issue',
				frequency: 1,
				severity: 'low' as const,
				category: null as any,
			},
		];

		render(<RecurringIssues issues={nullValueIssue} />);

		expect(screen.getByText('Null value issue')).toBeInTheDocument();
	});

	it('should handle issues with undefined values', () => {
		const undefinedValueIssue = [
			{
				issue: 'Undefined value issue',
				frequency: 1,
				severity: 'low' as const,
				category: undefined as any,
			},
		];

		render(<RecurringIssues issues={undefinedValueIssue} />);

		expect(screen.getByText('Undefined value issue')).toBeInTheDocument();
	});

	it('should handle many recurring issues', () => {
		const manyIssues = Array.from({ length: 20 }, (_, i) => ({
			issue: `Issue ${i + 1}`,
			frequency: i + 1,
			severity: 'low' as const,
			category: `Category ${i + 1}`,
		}));

		render(<RecurringIssues issues={manyIssues} />);

		expect(screen.getByText('Issue 1')).toBeInTheDocument();
		expect(screen.getByText('Issue 20')).toBeInTheDocument();
	});

	it('should handle issues with numeric values in names', () => {
		const numericIssue = [
			{
				issue: 'Issue 123 with numbers',
				frequency: 1,
				severity: 'low' as const,
				category: 'Category 456',
			},
		];

		render(<RecurringIssues issues={numericIssue} />);

		expect(screen.getByText('Issue 123 with numbers')).toBeInTheDocument();
		expect(screen.getByText('Category 456')).toBeInTheDocument();
	});

	it('should handle issues with boolean values in names', () => {
		const booleanIssue = [
			{
				issue: 'Issue with true/false',
				frequency: 1,
				severity: 'low' as const,
				category: 'Boolean category',
			},
		];

		render(<RecurringIssues issues={booleanIssue} />);

		expect(screen.getByText('Issue with true/false')).toBeInTheDocument();
		expect(screen.getByText('Boolean category')).toBeInTheDocument();
	});

	it('should handle issues with mixed severity levels', () => {
		const mixedSeverities = [
			{
				issue: 'Issue 1',
				frequency: 1,
				severity: 'high' as const,
				category: 'Test',
			},
			{
				issue: 'Issue 2',
				frequency: 2,
				severity: 'medium' as const,
				category: 'Test',
			},
			{
				issue: 'Issue 3',
				frequency: 3,
				severity: 'low' as const,
				category: 'Test',
			},
			{
				issue: 'Issue 4',
				frequency: 4,
				severity: 'high' as const,
				category: 'Test',
			},
		];

		render(<RecurringIssues issues={mixedSeverities} />);

		expect(screen.getByText('Issue 1')).toBeInTheDocument();
		expect(screen.getByText('Issue 2')).toBeInTheDocument();
		expect(screen.getByText('Issue 3')).toBeInTheDocument();
		expect(screen.getByText('Issue 4')).toBeInTheDocument();

		// Should show all severity levels
		expect(screen.getAllByText('high')).toHaveLength(2);
		expect(screen.getByText('medium')).toBeInTheDocument();
		expect(screen.getByText('low')).toBeInTheDocument();
	});
});
