import { describe, it, expect } from 'vitest';
import { getPropertyDetails } from '../propertyData';

describe('propertyData utilities', () => {
	describe('getPropertyDetails', () => {
		it('should return property details for valid listing ID', () => {
			const result = getPropertyDetails('550e8400-e29b-41d4-a716-446655440001');
			expect(result).toBeDefined();
			expect(result?.id).toBe('550e8400-e29b-41d4-a716-446655440001');
			expect(result?.name).toBe(
				'DoubleTree by Hilton London - Tower of London'
			);
			expect(result?.location).toBe('Tower Hill, London, UK');
			expect(result?.bedrooms).toBe(1);
			expect(result?.bathrooms).toBe(1);
			expect(result?.guests).toBe(2);
		});

		it('should return property details for canad-inns listing', () => {
			const result = getPropertyDetails(
				'canad-inns-destination-centre-transcona'
			);
			expect(result).toBeDefined();
			expect(result?.id).toBe('550e8400-e29b-41d4-a716-446655440002');
			expect(result?.name).toBe('Canad Inns Destination Centre Transcona');
			expect(result?.location).toBe('Transcona, Winnipeg, MB, Canada');
		});

		it('should return property details for leeds-marriott listing', () => {
			const result = getPropertyDetails('leeds-marriott-hotel');
			expect(result).toBeDefined();
			expect(result?.id).toBe('550e8400-e29b-41d4-a716-446655440003');
			expect(result?.name).toBe('Leeds Marriott Hotel');
			expect(result?.location).toBe('Leeds City Centre, Leeds, UK');
		});

		it('should return property details for unknown listing', () => {
			const result = getPropertyDetails('unknown-listing');
			expect(result).toBeDefined();
			expect(result?.id).toBe('unknown');
			expect(result?.name).toBe('Property Not Found');
			expect(result?.location).toBe('Unknown Location');
		});

		it('should return default property for non-existent listing ID', () => {
			const result = getPropertyDetails('non-existent-listing');
			expect(result).toBeDefined();
			expect(result?.id).toBe('unknown');
			expect(result?.name).toBe('Property Not Found');
		});

		it('should return default property for empty string', () => {
			const result = getPropertyDetails('');
			expect(result).toBeDefined();
			expect(result?.id).toBe('550e8400-e29b-41d4-a716-446655440001');
			expect(result?.name).toBe(
				'DoubleTree by Hilton London - Tower of London'
			);
		});

		it('should have all required properties', () => {
			const result = getPropertyDetails('550e8400-e29b-41d4-a716-446655440001');
			expect(result).toHaveProperty('id');
			expect(result).toHaveProperty('name');
			expect(result).toHaveProperty('location');
			expect(result).toHaveProperty('address');
			expect(result).toHaveProperty('price');
			expect(result).toHaveProperty('currency');
			expect(result).toHaveProperty('amenities');
			expect(result).toHaveProperty('description');
			expect(result).toHaveProperty('checkInTime');
			expect(result).toHaveProperty('checkOutTime');
			expect(result).toHaveProperty('minStay');
			expect(result).toHaveProperty('images');
			expect(result).toHaveProperty('propertyType');
			expect(result).toHaveProperty('bedrooms');
			expect(result).toHaveProperty('bathrooms');
			expect(result).toHaveProperty('guests');
		});

		it('should have correct data types', () => {
			const result = getPropertyDetails('550e8400-e29b-41d4-a716-446655440001');
			expect(typeof result?.id).toBe('string');
			expect(typeof result?.name).toBe('string');
			expect(typeof result?.location).toBe('string');
			expect(typeof result?.address).toBe('string');
			expect(typeof result?.price).toBe('number');
			expect(typeof result?.currency).toBe('string');
			expect(Array.isArray(result?.amenities)).toBe(true);
			expect(Array.isArray(result?.description)).toBe(true);
			expect(typeof result?.checkInTime).toBe('string');
			expect(typeof result?.checkOutTime).toBe('string');
			expect(typeof result?.minStay).toBe('number');
			expect(Array.isArray(result?.images)).toBe(true);
			expect(typeof result?.propertyType).toBe('string');
			expect(typeof result?.bedrooms).toBe('number');
			expect(typeof result?.bathrooms).toBe('number');
			expect(typeof result?.guests).toBe('number');
		});
	});
});
