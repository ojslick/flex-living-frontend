export interface NormalizedReview {
	id: string; // Unique UUID for each review
	propertyId: string; // UUID for property identification across channels
	listingName: string;
	channel: 'hostaway' | 'airbnb' | 'booking' | 'google' | string;
	type: 'guest-to-host' | 'host-to-guest';
	status: 'published' | 'pending' | 'hidden' | string;
	rating: number | null;
	categories: { category: string; rating: number }[];
	text: string | null;
	submittedAt: string; // ISO
	guestName?: string;
	managerApproved: boolean;
	// Channel-specific identifiers
	channelIdentifiers: {
		hostaway?: {
			propertyId?: string;
			listingName?: string;
			reviewId?: string;
		};
		google?: {
			placeId?: string;
			placeName?: string;
			reviewId?: string;
		};
		airbnb?: {
			listingId?: string;
			reviewId?: string;
		};
		booking?: {
			hotelId?: string;
			reviewId?: string;
		};
	};
}

export interface ReviewsResponse {
	reviews: NormalizedReview[];
	aggregations: {
		byListing: Record<string, { count: number; avgRating: number | null }>;
		byChannel: Record<string, { count: number; avgRating: number | null }>;
		byMonth: Record<string, { count: number; avgRating: number | null }>; // YYYY-MM
	};
}

export interface PropertyDetails {
	id: string;
	name: string;
	location: string;
	description: string;
	amenities: string[];
	images: string[];
	rating: number | null;
	reviewCount: number;
	price: {
		amount: number;
		currency: string;
		period: string;
	};
	availability: {
		checkIn: string;
		checkOut: string;
		minNights: number;
	};
	coordinates?: {
		lat: number;
		lng: number;
	};
}

export interface FilterOptions {
	rating?: {
		min: number;
		max: number;
	};
	category?: string[];
	channel?: string[];
	dateRange?: {
		start: string;
		end: string;
	};
	listingId?: string;
	approved?: boolean;
}

export interface SortOptions {
	field: 'rating' | 'date' | 'guestName' | 'listingName';
	direction: 'asc' | 'desc';
}

export interface DashboardStats {
	totalReviews: number;
	averageRating: number;
	approvedReviews: number;
	pendingReviews: number;
	topCategories: Array<{
		category: string;
		averageRating: number;
		count: number;
	}>;
	recentTrends: Array<{
		month: string;
		count: number;
		averageRating: number;
	}>;
}
