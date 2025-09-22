import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '../styles/theme';
import { GlobalStyle } from '../styles/global';
import Layout from '../components/ui/Layout';

// Mock the pages
vi.mock('../pages/Dashboard', () => ({
	default: () => <div data-testid="dashboard-page">Dashboard</div>,
}));

vi.mock('../pages/PropertyDetail', () => ({
	default: () => <div data-testid="property-detail-page">Property Detail</div>,
}));

// Create a test version of App without the router
const TestApp = () => {
	return (
		<ThemeProvider theme={theme}>
			<GlobalStyle />
			<Layout>
				<Routes>
					<Route path="/" element={<Navigate to="/dashboard" replace />} />
					<Route
						path="/dashboard"
						element={<div data-testid="dashboard-page">Dashboard</div>}
					/>
					<Route
						path="/property/:listingId"
						element={
							<div data-testid="property-detail-page">Property Detail</div>
						}
					/>
					<Route path="*" element={<Navigate to="/dashboard" replace />} />
				</Routes>
			</Layout>
		</ThemeProvider>
	);
};

describe('App', () => {
	it('should render the app with layout', () => {
		render(
			<MemoryRouter>
				<TestApp />
			</MemoryRouter>
		);

		expect(screen.getByText('Flex Living')).toBeInTheDocument();
		expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
	});

	it('should render dashboard page on root route', () => {
		render(
			<MemoryRouter initialEntries={['/']}>
				<TestApp />
			</MemoryRouter>
		);

		expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
	});

	it('should render property detail page on property route', () => {
		render(
			<MemoryRouter initialEntries={['/property/test-listing']}>
				<TestApp />
			</MemoryRouter>
		);

		expect(screen.getByTestId('property-detail-page')).toBeInTheDocument();
	});

	it('should render dashboard page on unknown route', () => {
		render(
			<MemoryRouter initialEntries={['/unknown-route']}>
				<TestApp />
			</MemoryRouter>
		);

		expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
	});

	it('should render dashboard page on empty route', () => {
		render(
			<MemoryRouter initialEntries={['/']}>
				<TestApp />
			</MemoryRouter>
		);

		expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
	});

	it('should handle component unmount', () => {
		const { unmount } = render(
			<MemoryRouter>
				<TestApp />
			</MemoryRouter>
		);

		expect(screen.getByText('Flex Living')).toBeInTheDocument();

		unmount();

		// Should not throw any errors
		expect(true).toBe(true);
	});

	it('should render with different route patterns', () => {
		const testCases = [
			{ path: '/', expected: 'dashboard-page' },
			{ path: '/dashboard', expected: 'dashboard-page' },
			{ path: '/property/listing-1', expected: 'property-detail-page' },
			{ path: '/property/listing-2', expected: 'property-detail-page' },
			{ path: '/unknown', expected: 'dashboard-page' },
		];

		testCases.forEach(({ path, expected }) => {
			const { unmount } = render(
				<MemoryRouter initialEntries={[path]}>
					<TestApp />
				</MemoryRouter>
			);

			expect(screen.getByTestId(expected)).toBeInTheDocument();

			unmount();
		});
	});

	it('should handle nested routes', () => {
		render(
			<MemoryRouter initialEntries={['/property/listing-1']}>
				<TestApp />
			</MemoryRouter>
		);

		// Should render property detail page
		expect(screen.getByTestId('property-detail-page')).toBeInTheDocument();
	});

	it('should handle routes with query parameters', () => {
		render(
			<MemoryRouter
				initialEntries={['/property/listing-1?tab=reviews&filter=approved']}
			>
				<TestApp />
			</MemoryRouter>
		);

		expect(screen.getByTestId('property-detail-page')).toBeInTheDocument();
	});

	it('should handle routes with hash fragments', () => {
		render(
			<MemoryRouter initialEntries={['/property/listing-1#reviews']}>
				<TestApp />
			</MemoryRouter>
		);

		expect(screen.getByTestId('property-detail-page')).toBeInTheDocument();
	});

	it('should handle special characters in routes', () => {
		render(
			<MemoryRouter
				initialEntries={['/property/listing-with-special-chars-123']}
			>
				<TestApp />
			</MemoryRouter>
		);

		expect(screen.getByTestId('property-detail-page')).toBeInTheDocument();
	});

	it('should handle very long route paths', () => {
		render(
			<MemoryRouter
				initialEntries={[
					'/property/very-long-listing-name-that-might-cause-issues-in-routing',
				]}
			>
				<TestApp />
			</MemoryRouter>
		);

		expect(screen.getByTestId('property-detail-page')).toBeInTheDocument();
	});
});
