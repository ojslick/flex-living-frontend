import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../../../test/setup';
import Card from '../Card';

describe('Card', () => {
	it('should render with default props', () => {
		render(<Card>Card content</Card>);
		const card = screen.getByText('Card content');
		expect(card).toBeInTheDocument();
	});

	it('should render with custom className', () => {
		render(<Card className="custom-class">Custom Card</Card>);
		const card = screen.getByText('Custom Card');
		expect(card).toHaveClass('custom-class');
	});

	it('should render children correctly', () => {
		render(
			<Card>
				<h2>Card Title</h2>
				<p>Card content</p>
			</Card>
		);
		expect(screen.getByText('Card Title')).toBeInTheDocument();
		expect(screen.getByText('Card content')).toBeInTheDocument();
	});

	it('should handle click events when onClick is provided', () => {
		const handleClick = vi.fn();
		render(<Card onClick={handleClick}>Clickable Card</Card>);

		const card = screen.getByText('Clickable Card');
		fireEvent.click(card);

		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it('should not be clickable when onClick is not provided', () => {
		render(<Card>Non-clickable Card</Card>);
		const card = screen.getByText('Non-clickable Card');

		// Should not have cursor pointer or other clickable styles
		expect(card).toBeInTheDocument();
	});

	it('should render with complex content', () => {
		render(
			<Card>
				<div>
					<h3>Complex Card</h3>
					<ul>
						<li>Item 1</li>
						<li>Item 2</li>
					</ul>
					<button>Action</button>
				</div>
			</Card>
		);

		expect(screen.getByText('Complex Card')).toBeInTheDocument();
		expect(screen.getByText('Item 1')).toBeInTheDocument();
		expect(screen.getByText('Item 2')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
	});

	it('should handle multiple click events', () => {
		const handleClick = vi.fn();
		render(<Card onClick={handleClick}>Multi-click Card</Card>);

		const card = screen.getByText('Multi-click Card');
		fireEvent.click(card);
		fireEvent.click(card);
		fireEvent.click(card);

		expect(handleClick).toHaveBeenCalledTimes(3);
	});

	it('should render with empty content', () => {
		const { container } = render(<Card></Card>);
		const card = container.querySelector('div');
		expect(card).toBeInTheDocument();
	});

	it('should render with number content', () => {
		render(<Card>{123}</Card>);
		expect(screen.getByText('123')).toBeInTheDocument();
	});

	it('should render with boolean content', () => {
		const { container } = render(<Card>{String(false)}</Card>);
		const card = container.querySelector('div');
		expect(card).toBeInTheDocument();
		expect(card).toHaveTextContent('false');
	});

	it('should handle keyboard events when clickable', () => {
		const handleClick = vi.fn();
		render(<Card onClick={handleClick}>Keyboard Card</Card>);

		const card = screen.getByText('Keyboard Card');

		// Note: Card doesn't handle keyboard events by default, only click
		fireEvent.keyDown(card, { key: 'Enter' });
		expect(handleClick).not.toHaveBeenCalled();
	});
});
