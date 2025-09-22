import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../test/setup';
import DashboardPagination from '../DashboardPagination';

describe('DashboardPagination', () => {
	const defaultProps = {
		currentPage: 1,
		totalPages: 5,
		onPageChange: vi.fn(),
		totalItems: 50,
		itemsPerPage: 10,
	} as const;

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should render pagination controls', () => {
		render(<DashboardPagination {...defaultProps} />);

		expect(screen.getByText('1')).toBeInTheDocument();
		expect(screen.getByText('2')).toBeInTheDocument();
		expect(screen.getByText('3')).toBeInTheDocument();
		expect(screen.getByText('4')).toBeInTheDocument();
		expect(screen.getByText('5')).toBeInTheDocument();
	});

	it('should highlight current page', () => {
		render(<DashboardPagination {...defaultProps} />);

		const currentPageButton = screen.getByText('1');
		expect(currentPageButton).toHaveClass('active');
	});

	it('should call onPageChange when page button is clicked', async () => {
		const user = userEvent.setup();
		render(<DashboardPagination {...defaultProps} />);

		const page2Button = screen.getByText('2');
		await user.click(page2Button);

		expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
	});

	it('should render previous button when not on first page', () => {
		render(<DashboardPagination {...defaultProps} currentPage={3} />);

		expect(screen.getByText('Previous')).toBeInTheDocument();
	});

	it('should not render previous button when on first page', () => {
		render(<DashboardPagination {...defaultProps} currentPage={1} />);

		expect(screen.queryByText('Previous')).not.toBeInTheDocument();
	});

	it('should render next button when not on last page', () => {
		render(<DashboardPagination {...defaultProps} currentPage={3} />);

		expect(screen.getByText('Next')).toBeInTheDocument();
	});

	it('should not render next button when on last page', () => {
		render(<DashboardPagination {...defaultProps} currentPage={5} />);

		expect(screen.queryByText('Next')).not.toBeInTheDocument();
	});

	it('should call onPageChange with previous page when previous button is clicked', async () => {
		const user = userEvent.setup();
		render(<DashboardPagination {...defaultProps} currentPage={3} />);

		const previousButton = screen.getByText('Previous');
		await user.click(previousButton);

		expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
	});

	it('should call onPageChange with next page when next button is clicked', async () => {
		const user = userEvent.setup();
		render(<DashboardPagination {...defaultProps} currentPage={3} />);

		const nextButton = screen.getByText('Next');
		await user.click(nextButton);

		expect(defaultProps.onPageChange).toHaveBeenCalledWith(4);
	});

	it('should handle single page', () => {
		render(<DashboardPagination {...defaultProps} totalPages={1} />);

		expect(screen.getByText('1')).toBeInTheDocument();
		expect(screen.queryByText('Previous')).not.toBeInTheDocument();
		expect(screen.queryByText('Next')).not.toBeInTheDocument();
	});

	it('should handle two pages', () => {
		render(<DashboardPagination {...defaultProps} totalPages={2} />);

		expect(screen.getByText('1')).toBeInTheDocument();
		expect(screen.getByText('2')).toBeInTheDocument();
		expect(screen.queryByText('Previous')).not.toBeInTheDocument();
		expect(screen.getByText('Next')).toBeInTheDocument();
	});

	it('should handle many pages', () => {
		render(<DashboardPagination {...defaultProps} totalPages={10} />);

		expect(screen.getByText('1')).toBeInTheDocument();
		expect(screen.getByText('2')).toBeInTheDocument();
		expect(screen.getByText('3')).toBeInTheDocument();
		expect(screen.getByText('4')).toBeInTheDocument();
		expect(screen.getByText('5')).toBeInTheDocument();
		expect(screen.getByText('6')).toBeInTheDocument();
		expect(screen.getByText('7')).toBeInTheDocument();
		expect(screen.getByText('8')).toBeInTheDocument();
		expect(screen.getByText('9')).toBeInTheDocument();
		expect(screen.getByText('10')).toBeInTheDocument();
	});

	it('should handle current page in the middle', () => {
		render(
			<DashboardPagination {...defaultProps} currentPage={3} totalPages={5} />
		);

		const page3Button = screen.getByText('3');
		expect(page3Button).toHaveClass('active');

		expect(screen.getByText('Previous')).toBeInTheDocument();
		expect(screen.getByText('Next')).toBeInTheDocument();
	});

	it('should handle current page at the end', () => {
		render(
			<DashboardPagination {...defaultProps} currentPage={5} totalPages={5} />
		);

		const page5Button = screen.getByText('5');
		expect(page5Button).toHaveClass('active');

		expect(screen.getByText('Previous')).toBeInTheDocument();
		expect(screen.queryByText('Next')).not.toBeInTheDocument();
	});

	it('should handle keyboard navigation', () => {
		render(<DashboardPagination {...defaultProps} currentPage={3} />);

		const page2Button = screen.getByText('2');
		fireEvent.keyDown(page2Button, { key: 'Enter' });

		expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
	});

	it('should handle space key navigation', () => {
		render(<DashboardPagination {...defaultProps} currentPage={3} />);

		const page4Button = screen.getByText('4');
		fireEvent.keyDown(page4Button, { key: ' ' });

		expect(defaultProps.onPageChange).toHaveBeenCalledWith(4);
	});

	it('should not call onPageChange when clicking current page', async () => {
		const user = userEvent.setup();
		render(<DashboardPagination {...defaultProps} currentPage={3} />);

		const currentPageButton = screen.getByText('3');
		await user.click(currentPageButton);

		expect(defaultProps.onPageChange).not.toHaveBeenCalled();
	});

	it('should handle zero total pages', () => {
		render(<DashboardPagination {...defaultProps} totalPages={0} />);

		expect(screen.queryByText('1')).not.toBeInTheDocument();
		expect(screen.queryByText('Previous')).not.toBeInTheDocument();
		expect(screen.queryByText('Next')).not.toBeInTheDocument();
	});

	it('should handle negative current page', () => {
		render(<DashboardPagination {...defaultProps} currentPage={-1} />);

		// Should still render the pagination structure
		expect(screen.getByText('1')).toBeInTheDocument();
	});

	it('should handle current page greater than total pages', () => {
		render(
			<DashboardPagination {...defaultProps} currentPage={10} totalPages={5} />
		);

		// Should still render the pagination structure
		expect(screen.getByText('1')).toBeInTheDocument();
		expect(screen.getByText('5')).toBeInTheDocument();
	});

	it('should handle rapid page changes', async () => {
		const user = userEvent.setup();
		render(<DashboardPagination {...defaultProps} />);

		const page2Button = screen.getByText('2');
		const page3Button = screen.getByText('3');

		await user.click(page2Button);
		await user.click(page3Button);

		expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
		expect(defaultProps.onPageChange).toHaveBeenCalledWith(3);
		expect(defaultProps.onPageChange).toHaveBeenCalledTimes(2);
	});
});
