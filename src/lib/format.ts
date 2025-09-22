export function formatDate(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
}

export function formatDateShort(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});
}

export function formatRelativeDate(dateString: string): string {
	const date = new Date(dateString);
	const now = new Date();
	const diffInMs = now.getTime() - date.getTime();
	const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

	if (diffInDays === 0) {
		return 'Today';
	} else if (diffInDays === 1) {
		return 'Yesterday';
	} else if (diffInDays < 7) {
		return `${diffInDays} days ago`;
	} else if (diffInDays < 30) {
		const weeks = Math.floor(diffInDays / 7);
		return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
	} else if (diffInDays < 365) {
		const months = Math.floor(diffInDays / 30);
		return `${months} month${months > 1 ? 's' : ''} ago`;
	} else {
		const years = Math.floor(diffInDays / 365);
		return `${years} year${years > 1 ? 's' : ''} ago`;
	}
}

export function formatRating(rating: number | null | undefined): string {
	if (rating === null || rating === undefined) {
		return 'No rating';
	}
	return rating.toFixed(1);
}

export function formatRatingStars(rating: number | null): string {
	if (rating === null) {
		return '☆☆☆☆☆';
	}

	const fullStars = Math.floor(rating);
	const hasHalfStar = rating % 1 >= 0.5;
	const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

	return (
		'★'.repeat(fullStars) + (hasHalfStar ? '☆' : '') + '☆'.repeat(emptyStars)
	);
}

export function formatCategoryName(category: string): string {
	return category
		.split('_')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

export function formatChannelName(channel: string): string {
	switch (channel.toLowerCase()) {
		case 'hostaway':
			return 'Hostaway';
		case 'airbnb':
			return 'Airbnb';
		case 'booking':
			return 'Booking.com';
		case 'google':
			return 'Google';
		default:
			return channel.charAt(0).toUpperCase() + channel.slice(1);
	}
}

export function formatReviewType(type: string): string {
	switch (type) {
		case 'guest-to-host':
			return 'Guest Review';
		case 'host-to-guest':
			return 'Host Review';
		default:
			return type.charAt(0).toUpperCase() + type.slice(1);
	}
}

export function truncateText(text: string, maxLength: number): string {
	if (text.length <= maxLength) {
		return text;
	}
	return text.slice(0, maxLength) + '...';
}

export function formatNumber(num: number): string {
	if (num >= 1000000) {
		return (num / 1000000).toFixed(1) + 'M';
	} else if (num >= 1000) {
		return (num / 1000).toFixed(1) + 'K';
	}
	return num.toString();
}

export function formatCurrency(
	amount: number,
	currency: string = 'USD'
): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency,
	}).format(amount);
}

export function formatPercentage(value: number, total: number): string {
	if (total === 0) return '0%';
	return `${Math.round((value / total) * 100)}%`;
}

export function getInitials(name: string): string {
	return name
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase())
		.join('')
		.slice(0, 2);
}

export function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '');
}
