import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../../test/setup';
import Badge from '../Badge';

describe('Badge', () => {
	it('should render with default props', () => {
		render(<Badge>Default</Badge>);
		const badge = screen.getByText('Default');
		expect(badge).toBeInTheDocument();
	});

	it('should render with different variants', () => {
		const { rerender } = render(<Badge variant="primary">Primary</Badge>);
		expect(screen.getByText('Primary')).toBeInTheDocument();

		rerender(<Badge variant="secondary">Secondary</Badge>);
		expect(screen.getByText('Secondary')).toBeInTheDocument();

		rerender(<Badge variant="success">Success</Badge>);
		expect(screen.getByText('Success')).toBeInTheDocument();

		rerender(<Badge variant="warning">Warning</Badge>);
		expect(screen.getByText('Warning')).toBeInTheDocument();

		rerender(<Badge variant="error">Error</Badge>);
		expect(screen.getByText('Error')).toBeInTheDocument();

		rerender(<Badge variant="info">Info</Badge>);
		expect(screen.getByText('Info')).toBeInTheDocument();
	});

	it('should render with different sizes', () => {
		const { rerender } = render(<Badge size="sm">Small</Badge>);
		expect(screen.getByText('Small')).toBeInTheDocument();

		rerender(<Badge size="md">Medium</Badge>);
		expect(screen.getByText('Medium')).toBeInTheDocument();

		rerender(<Badge size="lg">Large</Badge>);
		expect(screen.getByText('Large')).toBeInTheDocument();
	});

	it('should render with custom className', () => {
		render(<Badge className="custom-class">Custom</Badge>);
		const badge = screen.getByText('Custom');
		expect(badge).toHaveClass('custom-class');
	});

	it('should render children correctly', () => {
		render(
			<Badge>
				<span>Icon</span> Text
			</Badge>
		);
		expect(screen.getByText('Icon')).toBeInTheDocument();
		expect(screen.getByText('Text')).toBeInTheDocument();
	});

	it('should handle multiple props together', () => {
		render(
			<Badge variant="success" size="lg" className="custom-class">
				Success Large
			</Badge>
		);
		const badge = screen.getByText('Success Large');
		expect(badge).toBeInTheDocument();
		expect(badge).toHaveClass('custom-class');
	});

	it('should render with empty content', () => {
		const { container } = render(<Badge></Badge>);
		const badge = container.querySelector('span');
		expect(badge).toBeInTheDocument();
	});

	it('should render with number content', () => {
		render(<Badge>{42}</Badge>);
		expect(screen.getByText('42')).toBeInTheDocument();
	});

	it('should render with boolean content', () => {
		const { container } = render(<Badge>{String(true)}</Badge>);
		const badge = container.querySelector('span');
		expect(badge).toBeInTheDocument();
		expect(badge).toHaveTextContent('true');
	});
});
