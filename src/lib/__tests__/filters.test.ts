import { describe, it, expect } from 'vitest';
import {
	filterReviews,
	sortReviews,
	getUniqueChannels,
	getUniqueListings,
	getRatingDistribution,
	getCategoryInsights,
	getMonthlyTrends,
	getRecurringIssues,
	getPerformanceAlerts,
} from '../filters';
import type { NormalizedReview, FilterOptions, SortOptions } from '../../types';

const mockReviews: NormalizedReview[] = [
	{
		id: '1',
		propertyId: 'prop-1',
		listingName: 'Test Property 1',
		channel: 'hostaway',
		type: 'guest-to-host',
		status: 'published',
		rating: 4.5,
		categories: [
			{ category: 'cleanliness', rating: 5 },
			{ category: 'communication', rating: 4 },
		],
		text: 'Great stay!',
		submittedAt: '2024-01-15T10:30:00Z',
		guestName: 'John Doe',
		managerApproved: true,
		channelIdentifiers: {
			hostaway: {
				propertyId: 'prop-1',
				listingName: 'Test Property 1',
				reviewId: '1',
			},
		},
	},
	{
		id: '2',
		propertyId: 'prop-1',
		listingName: 'Test Property 1',
		channel: 'airbnb',
		type: 'guest-to-host',
		status: 'published',
		rating: 3.0,
		categories: [
			{ category: 'cleanliness', rating: 2 },
			{ category: 'noise', rating: 1 },
		],
		text: 'Could be better',
		submittedAt: '2024-01-10T10:30:00Z',
		guestName: 'Jane Smith',
		managerApproved: false,
		channelIdentifiers: {
			airbnb: {
				listingId: 'prop-1',
				reviewId: '2',
			},
		},
	},
	{
		id: '3',
		propertyId: 'prop-2',
		listingName: 'Test Property 2',
		channel: 'google',
		type: 'guest-to-host',
		status: 'published',
		rating: 5.0,
		categories: [
			{ category: 'location', rating: 5 },
			{ category: 'value', rating: 5 },
		],
		text: 'Perfect location!',
		submittedAt: '2024-01-20T10:30:00Z',
		guestName: 'Bob Wilson',
		managerApproved: true,
		channelIdentifiers: {
			google: {
				placeId: 'prop-2',
				placeName: 'Test Property 2',
				reviewId: '3',
			},
		},
	},
];

describe('filter utilities', () => {
	describe('filterReviews', () => {
		it('should filter by listing ID', () => {
			const filters: FilterOptions = { listingId: 'prop-1' };
			const result = filterReviews(mockReviews, filters);
			expect(result).toHaveLength(2);
			expect(result.every((review) => review.propertyId === 'prop-1')).toBe(
				true
			);
		});

		it('should filter by channel', () => {
			const filters: FilterOptions = { channel: ['hostaway'] };
			const result = filterReviews(mockReviews, filters);
			expect(result).toHaveLength(1);
			expect(result[0].channel).toBe('hostaway');
		});

		it('should filter by rating range', () => {
			const filters: FilterOptions = { rating: { min: 4, max: 5 } };
			const result = filterReviews(mockReviews, filters);
			expect(result).toHaveLength(2);
			expect(
				result.every((review) => review.rating && review.rating >= 4)
			).toBe(true);
		});

		it('should filter by approval status', () => {
			const filters: FilterOptions = { approved: true };
			const result = filterReviews(mockReviews, filters);
			expect(result).toHaveLength(2);
			expect(result.every((review) => review.managerApproved)).toBe(true);
		});

		it('should filter by date range', () => {
			const filters: FilterOptions = {
				dateRange: {
					start: new Date('2024-01-12'),
					end: new Date('2024-01-18'),
				},
			};
			const result = filterReviews(mockReviews, filters);
			expect(result).toHaveLength(1);
			expect(result[0].id).toBe('1');
		});

		it('should return all reviews when no filters applied', () => {
			const filters: FilterOptions = {};
			const result = filterReviews(mockReviews, filters);
			expect(result).toHaveLength(3);
		});
	});

	describe('sortReviews', () => {
		it('should sort by rating ascending', () => {
			const sort: SortOptions = { field: 'rating', direction: 'asc' };
			const result = sortReviews(mockReviews, sort);
			expect(result[0].rating).toBe(3.0);
			expect(result[2].rating).toBe(5.0);
		});

		it('should sort by rating descending', () => {
			const sort: SortOptions = { field: 'rating', direction: 'desc' };
			const result = sortReviews(mockReviews, sort);
			expect(result[0].rating).toBe(5.0);
			expect(result[2].rating).toBe(3.0);
		});

		it('should sort by date ascending', () => {
			const sort: SortOptions = { field: 'date', direction: 'asc' };
			const result = sortReviews(mockReviews, sort);
			expect(result[0].id).toBe('2');
			expect(result[2].id).toBe('3');
		});

		it('should sort by date descending', () => {
			const sort: SortOptions = { field: 'date', direction: 'desc' };
			const result = sortReviews(mockReviews, sort);
			expect(result[0].id).toBe('3');
			expect(result[2].id).toBe('2');
		});

		it('should sort by guest name', () => {
			const sort: SortOptions = { field: 'guestName', direction: 'asc' };
			const result = sortReviews(mockReviews, sort);
			expect(result[0].guestName).toBe('Bob Wilson');
			expect(result[2].guestName).toBe('John Doe');
		});

		it('should sort by listing name', () => {
			const sort: SortOptions = { field: 'listingName', direction: 'asc' };
			const result = sortReviews(mockReviews, sort);
			expect(result[0].listingName).toBe('Test Property 1');
			expect(result[2].listingName).toBe('Test Property 2');
		});
	});

	describe('getUniqueChannels', () => {
		it('should return unique channels', () => {
			const result = getUniqueChannels(mockReviews);
			expect(result).toEqual(['airbnb', 'google', 'hostaway']); // Sorted alphabetically
		});

		it('should handle empty array', () => {
			const result = getUniqueChannels([]);
			expect(result).toEqual([]);
		});
	});

	describe('getUniqueListings', () => {
		it('should return unique listings', () => {
			const result = getUniqueListings(mockReviews);
			expect(result).toEqual([
				{ id: 'prop-1', name: 'Test Property 1' },
				{ id: 'prop-2', name: 'Test Property 2' },
			]);
		});

		it('should handle empty array', () => {
			const result = getUniqueListings([]);
			expect(result).toEqual([]);
		});
	});

	describe('getRatingDistribution', () => {
		it('should calculate rating distribution', () => {
			const result = getRatingDistribution(mockReviews);
			expect(result).toEqual({
				1: 0,
				2: 0,
				3: 1,
				4: 0,
				5: 2,
			});
		});

		it('should handle empty array', () => {
			const result = getRatingDistribution([]);
			expect(result).toEqual({
				1: 0,
				2: 0,
				3: 0,
				4: 0,
				5: 0,
			});
		});
	});

	describe('getCategoryInsights', () => {
		it('should calculate category insights', () => {
			const result = getCategoryInsights(mockReviews);
			const cleanlinessInsight = result.find(
				(c) => c.category === 'cleanliness'
			);
			expect(cleanlinessInsight).toBeDefined();
			expect(cleanlinessInsight?.rating).toBe(3.5); // (5 + 2) / 2
			expect(cleanlinessInsight?.issues).toBe(1); // 1 review with rating < 3
		});

		it('should handle empty array', () => {
			const result = getCategoryInsights([]);
			expect(result).toEqual([]);
		});
	});

	describe('getMonthlyTrends', () => {
		it('should calculate monthly trends', () => {
			const result = getMonthlyTrends(mockReviews);
			const jan2024 = result.find((t) => t.month === '2024-01');
			expect(jan2024).toBeDefined();
			expect(jan2024?.avgRating).toBe(4.2); // (4.5 + 3.0 + 5.0) / 3
		});

		it('should handle empty array', () => {
			const result = getMonthlyTrends([]);
			expect(result).toEqual([]);
		});
	});

	describe('getRecurringIssues', () => {
		it('should identify recurring issues', () => {
			const reviewsWithIssues = [
				{
					...mockReviews[0],
					text: 'Great stay but there was some noise from the street',
				},
				{
					...mockReviews[1],
					text: 'The place was very noisy and the wifi connection was poor',
				},
				{
					...mockReviews[2],
					text: 'Noise issues and wifi problems throughout the stay',
				},
			];
			const result = getRecurringIssues(reviewsWithIssues);
			expect(result.length).toBeGreaterThan(0);
		});

		it('should handle empty array', () => {
			const result = getRecurringIssues([]);
			expect(result).toEqual([]);
		});
	});

	describe('getPerformanceAlerts', () => {
		it('should generate performance alerts', () => {
			const result = getPerformanceAlerts(mockReviews);
			expect(Array.isArray(result)).toBe(true);
		});

		it('should handle empty array', () => {
			const result = getPerformanceAlerts([]);
			expect(result).toEqual([]);
		});
	});
});
