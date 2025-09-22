import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getReviews, toggleApprove } from '../api';

// Mock fetch globally (works in browser and node environments)
globalThis.fetch = vi.fn() as unknown as typeof fetch;
const fetchMock = vi.mocked(globalThis.fetch);

describe('API utilities', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	describe('getReviews', () => {
		it('should fetch reviews successfully', async () => {
			const mockResponse = {
				reviews: [
					{
						id: '1',
						propertyId: 'prop-1',
						listingName: 'Test Property',
						channel: 'hostaway',
						type: 'guest-to-host',
						status: 'published',
						rating: 4.5,
						categories: [],
						text: 'Great stay!',
						submittedAt: '2024-01-15T10:30:00Z',
						guestName: 'John Doe',
						managerApproved: true,
						channelIdentifiers: {},
					},
				],
				aggregations: {
					byListing: {},
					byChannel: {},
					byMonth: {},
				},
			};

			fetchMock.mockResolvedValueOnce(
				new Response(JSON.stringify(mockResponse), {
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				})
			);

			const result = await getReviews();
			expect(result).toEqual(mockResponse);
			expect(fetchMock).toHaveBeenCalledWith('/api/reviews');
		});

		it('should handle fetch errors', async () => {
			fetchMock.mockRejectedValueOnce(new Error('Network error'));

			await expect(getReviews()).rejects.toThrow('Network error');
		});

		it('should handle non-ok responses', async () => {
			fetchMock.mockResolvedValueOnce(
				new Response('', { status: 500, statusText: 'Internal Server Error' })
			);

			await expect(getReviews()).rejects.toThrow(
				'HTTP 500: Internal Server Error'
			);
		});
	});

	describe('toggleApprove', () => {
		it('should toggle review approval successfully', async () => {
			const mockResponse = { success: true };
			fetchMock.mockResolvedValueOnce(
				new Response(JSON.stringify(mockResponse), {
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				})
			);

			const result = await toggleApprove('review-1');
			expect(result).toEqual(mockResponse);
			expect(fetchMock).toHaveBeenCalledWith('/api/reviews/review-1/approve', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			});
		});

		it('should handle fetch errors', async () => {
			fetchMock.mockRejectedValueOnce(new Error('Network error'));

			await expect(toggleApprove('review-1')).rejects.toThrow('Network error');
		});

		it('should handle non-ok responses', async () => {
			fetchMock.mockResolvedValueOnce(
				new Response('', { status: 404, statusText: 'Not Found' })
			);

			await expect(toggleApprove('review-1')).rejects.toThrow(
				'HTTP 404: Not Found'
			);
		});
	});
});
