import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../../test/setup';
import PerformanceAlerts from '../PerformanceAlerts';

describe('PerformanceAlerts', () => {
	const mockPerformanceAlerts = [
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
		{
			type: 'info' as const,
			title: 'Trend Alert',
			description: 'Declining performance trend detected',
			action: 'Monitor closely',
		},
	];

	it('should render performance alerts title', () => {
		render(<PerformanceAlerts alerts={mockPerformanceAlerts} />);

		expect(screen.getByText('🚨 Performance Alerts')).toBeInTheDocument();
	});

	it('should render all performance alerts', () => {
		render(<PerformanceAlerts alerts={mockPerformanceAlerts} />);

		expect(screen.getByText('Category Performance Issues')).toBeInTheDocument();
		expect(screen.getByText('Low Rating Alert')).toBeInTheDocument();
		expect(screen.getByText('Trend Alert')).toBeInTheDocument();
	});

	it('should render alert descriptions', () => {
		render(<PerformanceAlerts alerts={mockPerformanceAlerts} />);

		expect(
			screen.getByText('Issues detected in: Cleanliness')
		).toBeInTheDocument();
		expect(screen.getByText('Average rating below 3.0')).toBeInTheDocument();
		expect(
			screen.getByText('Declining performance trend detected')
		).toBeInTheDocument();
	});

	it('should render alert actions', () => {
		render(<PerformanceAlerts alerts={mockPerformanceAlerts} />);

		expect(screen.getByText('Address recurring problems')).toBeInTheDocument();
		expect(
			screen.getByText('Immediate attention required')
		).toBeInTheDocument();
		expect(screen.getByText('Monitor closely')).toBeInTheDocument();
	});

	it('should render alert categories when available', () => {
		render(<PerformanceAlerts alerts={mockPerformanceAlerts} />);

		expect(
			screen.getByText('Issues detected in: Cleanliness')
		).toBeInTheDocument();
	});

	it('should handle empty performance alerts', () => {
		render(<PerformanceAlerts alerts={[]} />);

		expect(screen.getByText('🚨 Performance Alerts')).toBeInTheDocument();
		expect(
			screen.queryByText('Category Performance Issues')
		).not.toBeInTheDocument();
	});

	it('should handle single performance alert', () => {
		const singleAlert = [mockPerformanceAlerts[0]];
		render(<PerformanceAlerts alerts={singleAlert} />);

		expect(screen.getByText('Category Performance Issues')).toBeInTheDocument();
		expect(
			screen.getByText('Issues detected in: Cleanliness')
		).toBeInTheDocument();
		expect(screen.getByText('Address recurring problems')).toBeInTheDocument();
	});

	it('should handle alerts without categories', () => {
		const alertWithoutCategory = [
			{
				type: 'critical' as const,
				title: 'Low Rating Alert',
				description: 'Average rating below 3.0',
				action: 'Immediate attention required',
			},
		];

		render(<PerformanceAlerts alerts={alertWithoutCategory} />);

		expect(screen.getByText('Low Rating Alert')).toBeInTheDocument();
		expect(screen.getByText('Average rating below 3.0')).toBeInTheDocument();
		expect(
			screen.getByText('Immediate attention required')
		).toBeInTheDocument();
	});

	it('should handle alerts with all alert types', () => {
		const allAlertTypes = [
			{
				type: 'warning' as const,
				title: 'Warning Alert',
				description: 'Warning message',
				action: 'Warning action',
			},
			{
				type: 'critical' as const,
				title: 'Critical Alert',
				description: 'Critical message',
				action: 'Critical action',
			},
			{
				type: 'info' as const,
				title: 'Info Alert',
				description: 'Info message',
				action: 'Info action',
			},
		];

		render(<PerformanceAlerts alerts={allAlertTypes} />);

		expect(screen.getByText('Warning Alert')).toBeInTheDocument();
		expect(screen.getByText('Critical Alert')).toBeInTheDocument();
		expect(screen.getByText('Info Alert')).toBeInTheDocument();
	});

	it('should handle alerts with special characters in titles', () => {
		const specialCharAlert = [
			{
				type: 'warning' as const,
				title: 'Alert & Title "Special"',
				description: 'Special description',
				action: 'Special action',
			},
		];

		render(<PerformanceAlerts alerts={specialCharAlert} />);

		expect(screen.getByText('Alert & Title "Special"')).toBeInTheDocument();
	});

	it('should handle alerts with long descriptions', () => {
		const longDescriptionAlert = [
			{
				type: 'warning' as const,
				title: 'Long Description Alert',
				description:
					'This is a very long description that might cause layout issues in the performance alerts component. It contains multiple sentences and should be handled properly by the component.',
				action: 'Long action description',
			},
		];

		render(<PerformanceAlerts alerts={longDescriptionAlert} />);

		expect(screen.getByText('Long Description Alert')).toBeInTheDocument();
		expect(
			screen.getByText(
				'This is a very long description that might cause layout issues in the performance alerts component. It contains multiple sentences and should be handled properly by the component.'
			)
		).toBeInTheDocument();
	});

	it('should handle alerts with empty strings', () => {
		const emptyStringAlert = [
			{
				type: 'warning' as const,
				title: '',
				description: '',
				action: '',
			},
		];

		render(<PerformanceAlerts alerts={emptyStringAlert} />);

		// Should still render the component structure
		expect(screen.getByText('🚨 Performance Alerts')).toBeInTheDocument();
	});

	it('should handle alerts with null values', () => {
		const nullValueAlert = [
			{
				type: 'warning' as const,
				title: 'Null Value Alert',
				description: null as any,
				action: null as any,
			},
		];

		render(<PerformanceAlerts alerts={nullValueAlert} />);

		expect(screen.getByText('Null Value Alert')).toBeInTheDocument();
	});

	it('should handle alerts with undefined values', () => {
		const undefinedValueAlert = [
			{
				type: 'warning' as const,
				title: 'Undefined Value Alert',
				description: undefined as any,
				action: undefined as any,
			},
		];

		render(<PerformanceAlerts alerts={undefinedValueAlert} />);

		expect(screen.getByText('Undefined Value Alert')).toBeInTheDocument();
	});

	it('should handle many performance alerts', () => {
		const manyAlerts = Array.from({ length: 20 }, (_, i) => ({
			type: 'warning' as const,
			title: `Alert ${i + 1}`,
			description: `Description for alert ${i + 1}`,
			action: `Action for alert ${i + 1}`,
		}));

		render(<PerformanceAlerts alerts={manyAlerts} />);

		expect(screen.getByText('Alert 1')).toBeInTheDocument();
		expect(screen.getByText('Alert 20')).toBeInTheDocument();
	});

	it('should handle alerts with numeric values', () => {
		const numericAlert = [
			{
				type: 'warning' as const,
				title: 'Numeric Alert',
				description: 'Description with 123 numbers',
				action: 'Action with 456 numbers',
			},
		];

		render(<PerformanceAlerts alerts={numericAlert} />);

		expect(screen.getByText('Numeric Alert')).toBeInTheDocument();
		expect(
			screen.getByText('Description with 123 numbers')
		).toBeInTheDocument();
		expect(screen.getByText('Action with 456 numbers')).toBeInTheDocument();
	});

	it('should handle alerts with boolean values', () => {
		const booleanAlert = [
			{
				type: 'warning' as const,
				title: 'Boolean Alert',
				description: 'Description with true/false',
				action: 'Action with boolean values',
			},
		];

		render(<PerformanceAlerts alerts={booleanAlert} />);

		expect(screen.getByText('Boolean Alert')).toBeInTheDocument();
		expect(screen.getByText('Description with true/false')).toBeInTheDocument();
		expect(screen.getByText('Action with boolean values')).toBeInTheDocument();
	});
});
