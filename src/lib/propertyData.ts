export interface PropertyDetails {
	id: string;
	name: string;
	location: string;
	address: string;
	price: number;
	currency: string;
	amenities: string[];
	description: string[] | null;
	checkInTime: string | null;
	checkOutTime: string | null;
	minStay: number;
	images: string[];
	propertyType: string;
	bedrooms: number;
	bathrooms: number;
	guests: number;
}

// Mock property data that matches our listings (using UUIDs)
export const propertyDetails: Record<string, PropertyDetails> = {
	'550e8400-e29b-41d4-a716-446655440001': {
		id: '550e8400-e29b-41d4-a716-446655440001',
		name: 'DoubleTree by Hilton London - Tower of London',
		location: 'Tower Hill, London, UK',
		address: '7 Pepys St, London EC3N 4AF, UK',
		price: 180,
		currency: '£',
		amenities: [
			'WiFi',
			'Restaurant',
			'Fitness Center',
			'Business Center',
			'Room Service',
			'Concierge',
			'Laundry Service',
			'Air Conditioning',
			'Flat-screen TV',
			'Minibar',
			'Coffee Machine',
			'Safe',
		],
		description: [
			'Experience luxury in the heart of London at DoubleTree by Hilton London - Tower of London. This elegant hotel offers stunning views of the historic Tower of London and the River Thames.',
			"Our modern rooms feature contemporary furnishings, premium amenities, and exceptional service. Located in the vibrant Tower Hill area, you'll be within walking distance of major attractions including Tower Bridge, the Tower of London, and St. Katharine Docks.",
			'Enjoy our on-site restaurant, fitness center, and business facilities. Our concierge team is available to help you make the most of your London experience.',
		],
		checkInTime: '3:00 PM',
		checkOutTime: '12:00 PM',
		minStay: 1,
		images: [
			'/api/placeholder/800/600',
			'/api/placeholder/800/600',
			'/api/placeholder/800/600',
		],
		propertyType: 'Hotel',
		bedrooms: 1,
		bathrooms: 1,
		guests: 2,
	},
	'550e8400-e29b-41d4-a716-446655440002': {
		id: '550e8400-e29b-41d4-a716-446655440002',
		name: 'Canad Inns Destination Centre Transcona',
		location: 'Transcona, Winnipeg, MB, Canada',
		address: '826 Regent Ave W, Winnipeg, MB R2C 1A8, Canada',
		price: 120,
		currency: 'CAD',
		amenities: [
			'WiFi',
			'Indoor Pool',
			'Hot Tub',
			'Restaurant & Bar',
			'Fitness Center',
			'Conference Rooms',
			'Laundry Service',
			'Air Conditioning',
			'Flat-screen TV',
			'Mini Fridge',
			'Coffee Maker',
			'Free Parking',
		],
		description: [
			"Welcome to Canad Inns Destination Centre Transcona, your gateway to Winnipeg's vibrant culture and entertainment. This full-service hotel combines comfort with convenience in the heart of Transcona.",
			'Our spacious rooms are designed for both business and leisure travelers, featuring modern amenities and comfortable furnishings. The hotel boasts an impressive indoor pool, hot tub, and fitness center.',
			"Located near major highways and attractions, you'll have easy access to Winnipeg's best shopping, dining, and entertainment options. Our friendly staff is committed to making your stay memorable.",
		],
		checkInTime: '3:00 PM',
		checkOutTime: '11:00 AM',
		minStay: 1,
		images: [
			'/api/placeholder/800/600',
			'/api/placeholder/800/600',
			'/api/placeholder/800/600',
		],
		propertyType: 'Hotel',
		bedrooms: 1,
		bathrooms: 1,
		guests: 2,
	},
	'550e8400-e29b-41d4-a716-446655440003': {
		id: '550e8400-e29b-41d4-a716-446655440003',
		name: 'Leeds Marriott Hotel',
		location: 'Leeds City Centre, Leeds, UK',
		address: '4 Trevelyan Square, Leeds LS1 6ET, UK',
		price: 160,
		currency: '£',
		amenities: [
			'WiFi',
			'Spa & Wellness Center',
			'Restaurant',
			'Bar & Lounge',
			'Fitness Center',
			'Business Center',
			'Room Service',
			'Concierge',
			'Air Conditioning',
			'Flat-screen TV',
			'Minibar',
			'Coffee Machine',
			'Safe',
			'Valet Parking',
		],
		description: [
			'Discover the perfect blend of luxury and convenience at Leeds Marriott Hotel, located in the heart of Leeds city center. This sophisticated hotel offers elegant accommodations with stunning views of the city.',
			"Our well-appointed rooms feature premium bedding, modern technology, and thoughtful amenities. The hotel's spa and wellness center provides a sanctuary for relaxation, while our restaurant serves exceptional cuisine.",
			'With its prime location near shopping districts, cultural attractions, and business centers, Leeds Marriott Hotel is the ideal choice for both leisure and business travelers seeking comfort and style.',
		],
		checkInTime: '3:00 PM',
		checkOutTime: '12:00 PM',
		minStay: 2,
		images: [
			'/api/placeholder/800/600',
			'/api/placeholder/800/600',
			'/api/placeholder/800/600',
		],
		propertyType: 'Hotel',
		bedrooms: 1,
		bathrooms: 1,
		guests: 2,
	},
};

// Fallback property data for unknown listings
export const defaultPropertyDetails: PropertyDetails = {
	id: 'unknown',
	name: 'Property Not Found',
	location: 'Unknown Location',
	address: 'Address not available',
	price: 100,
	currency: '£',
	amenities: [
		'WiFi',
		'Kitchen',
		'Washing Machine',
		'Air Conditioning',
		'Heating',
		'TV',
		'Hair Dryer',
		'Iron',
		'Parking',
	],
	description: [
		'Property details are not available at this time.',
		'Please contact support for more information.',
	],
	checkInTime: '3:00 PM',
	checkOutTime: '11:00 AM',
	minStay: 1,
	images: ['/api/placeholder/800/600'],
	propertyType: 'Unknown',
	bedrooms: 1,
	bathrooms: 1,
	guests: 2,
};

/**
 * Get property details by listing UUID
 */
export function getPropertyDetails(listingId: string): PropertyDetails | null {
	// Try to find exact UUID match first
	if (propertyDetails[listingId]) {
		return propertyDetails[listingId];
	}

	// Fallback: try to match by listing name (for backward compatibility)
	const normalizedId = listingId.toLowerCase().replace(/[^a-z0-9-]/g, '-');
	for (const [, details] of Object.entries(propertyDetails)) {
		const detailsName = details.name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
		if (
			detailsName.includes(normalizedId) ||
			normalizedId.includes(detailsName)
		) {
			return details;
		}
	}

	return defaultPropertyDetails;
}
