import { describe, it, expect } from 'vitest';
import {
	formatDate,
	formatRating,
	formatCategoryName,
	formatChannelName,
} from '../format';

describe('format utilities', () => {
	describe('formatDate', () => {
		it('should format ISO date string correctly', () => {
			const dateString = '2024-01-15T10:30:00Z';
			const result = formatDate(dateString);
			expect(result).toMatch(/January 15, 2024/);
		});

		it('should handle invalid date strings', () => {
			const result = formatDate('invalid-date');
			expect(result).toBe('Invalid Date');
		});

		it('should handle empty string', () => {
			const result = formatDate('');
			expect(result).toBe('Invalid Date');
		});
	});

	describe('formatRating', () => {
		it('should format rating with one decimal place', () => {
			expect(formatRating(4.567)).toBe('4.6');
			expect(formatRating(3.0)).toBe('3.0');
			expect(formatRating(5.0)).toBe('5.0');
		});

		it('should handle null rating', () => {
			expect(formatRating(null)).toBe('No rating');
		});

		it('should handle undefined rating', () => {
			expect(formatRating(undefined as any)).toBe('No rating');
		});

		it('should handle zero rating', () => {
			expect(formatRating(0)).toBe('0.0');
		});
	});

	describe('formatCategoryName', () => {
		it('should format category names correctly', () => {
			expect(formatCategoryName('cleanliness')).toBe('Cleanliness');
			expect(formatCategoryName('communication')).toBe('Communication');
			expect(formatCategoryName('check-in')).toBe('Check-in');
			expect(formatCategoryName('accuracy')).toBe('Accuracy');
			expect(formatCategoryName('location')).toBe('Location');
			expect(formatCategoryName('value')).toBe('Value');
		});

		it('should handle unknown categories', () => {
			expect(formatCategoryName('unknown-category')).toBe('Unknown-category');
		});

		it('should handle empty string', () => {
			expect(formatCategoryName('')).toBe('');
		});

		it('should handle single word categories', () => {
			expect(formatCategoryName('noise')).toBe('Noise');
		});
	});

	describe('formatChannelName', () => {
		it('should format channel names correctly', () => {
			expect(formatChannelName('hostaway')).toBe('Hostaway');
			expect(formatChannelName('airbnb')).toBe('Airbnb');
			expect(formatChannelName('booking')).toBe('Booking.com');
			expect(formatChannelName('google')).toBe('Google');
		});

		it('should handle unknown channels', () => {
			expect(formatChannelName('unknown-channel')).toBe('Unknown-channel');
		});

		it('should handle empty string', () => {
			expect(formatChannelName('')).toBe('');
		});

		it('should handle uppercase input', () => {
			expect(formatChannelName('HOSTAWAY')).toBe('Hostaway');
		});
	});
});
