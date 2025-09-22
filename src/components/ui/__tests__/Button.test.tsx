import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../../../test/setup';
import Button from '../Button';

describe('Button', () => {
	it('should render with default props', () => {
		render(<Button>Click me</Button>);
		const button = screen.getByRole('button', { name: /click me/i });
		expect(button).toBeInTheDocument();
	});

	it('should render with different variants', () => {
		const { rerender } = render(<Button variant="primary">Primary</Button>);
		expect(screen.getByRole('button')).toBeInTheDocument();

		rerender(<Button variant="secondary">Secondary</Button>);
		expect(screen.getByRole('button')).toBeInTheDocument();

		rerender(<Button variant="ghost">Ghost</Button>);
		expect(screen.getByRole('button')).toBeInTheDocument();
	});

	it('should render with different sizes', () => {
		const { rerender } = render(<Button size="sm">Small</Button>);
		expect(screen.getByRole('button')).toBeInTheDocument();

		rerender(<Button size="md">Medium</Button>);
		expect(screen.getByRole('button')).toBeInTheDocument();

		rerender(<Button size="lg">Large</Button>);
		expect(screen.getByRole('button')).toBeInTheDocument();
	});

	it('should handle click events', () => {
		const handleClick = vi.fn();
		render(<Button onClick={handleClick}>Click me</Button>);

		const button = screen.getByRole('button');
		fireEvent.click(button);

		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it('should be disabled when disabled prop is true', () => {
		render(<Button disabled>Disabled</Button>);
		const button = screen.getByRole('button');
		expect(button).toBeDisabled();
	});

	it('should not call onClick when disabled', () => {
		const handleClick = vi.fn();
		render(
			<Button disabled onClick={handleClick}>
				Disabled
			</Button>
		);

		const button = screen.getByRole('button');
		fireEvent.click(button);

		expect(handleClick).not.toHaveBeenCalled();
	});

	it('should render with custom className', () => {
		render(<Button className="custom-class">Custom</Button>);
		const button = screen.getByRole('button');
		expect(button).toHaveClass('custom-class');
	});

	it('should render with type attribute', () => {
		render(<Button type="submit">Submit</Button>);
		const button = screen.getByRole('button');
		expect(button).toHaveAttribute('type', 'submit');
	});

	it('should render children correctly', () => {
		render(
			<Button>
				<span>Icon</span> Text
			</Button>
		);
		expect(screen.getByText('Icon')).toBeInTheDocument();
		expect(screen.getByText('Text')).toBeInTheDocument();
	});

	it('should handle keyboard events', () => {
		const handleClick = vi.fn();
		render(<Button onClick={handleClick}>Click me</Button>);

		const button = screen.getByRole('button');
		fireEvent.keyDown(button, { key: 'Enter' });
		fireEvent.keyDown(button, { key: ' ' });

		// Note: Button doesn't handle keyboard events by default, only click
		expect(handleClick).not.toHaveBeenCalled();
	});
});
