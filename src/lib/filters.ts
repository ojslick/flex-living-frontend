import type { NormalizedReview, FilterOptions, SortOptions } from './types';

export function filterReviews(
	reviews: NormalizedReview[],
	filters: FilterOptions
): NormalizedReview[] {
	return reviews.filter((review) => {
		// Rating filter
		if (filters.rating && review.rating !== null) {
			if (
				review.rating < filters.rating.min ||
				review.rating > filters.rating.max
			) {
				return false;
			}
		}

		// Category filter
		if (filters.category && filters.category.length > 0) {
			const reviewCategories = review.categories.map((c) => c.category);
			const hasMatchingCategory = filters.category.some((cat) =>
				reviewCategories.includes(cat)
			);
			if (!hasMatchingCategory) {
				return false;
			}
		}

		// Channel filter
		if (filters.channel && filters.channel.length > 0) {
			if (!filters.channel.includes(review.channel)) {
				return false;
			}
		}

		// Date range filter
		if (filters.dateRange) {
			const reviewDate = new Date(review.submittedAt);
			const startDate = new Date(filters.dateRange.start);
			const endDate = new Date(filters.dateRange.end);

			if (reviewDate < startDate || reviewDate > endDate) {
				return false;
			}
		}

		// Listing filter
		if (filters.listingId && review.propertyId !== filters.listingId) {
			return false;
		}

		// Approval filter
		if (
			filters.approved !== undefined &&
			review.managerApproved !== filters.approved
		) {
			return false;
		}

		return true;
	});
}

export function sortReviews(
	reviews: NormalizedReview[],
	sort: SortOptions
): NormalizedReview[] {
	return [...reviews].sort((a, b) => {
		let aValue: number | string | Date;
		let bValue: number | string | Date;

		switch (sort.field) {
			case 'rating':
				aValue = a.rating ?? 0;
				bValue = b.rating ?? 0;
				break;
			case 'date':
				aValue = new Date(a.submittedAt).getTime();
				bValue = new Date(b.submittedAt).getTime();
				break;
			case 'guestName':
				aValue = a.guestName ?? '';
				bValue = b.guestName ?? '';
				break;
			case 'listingName':
				aValue = a.listingName;
				bValue = b.listingName;
				break;
			default:
				return 0;
		}

		if (aValue < bValue) {
			return sort.direction === 'asc' ? -1 : 1;
		}
		if (aValue > bValue) {
			return sort.direction === 'asc' ? 1 : -1;
		}
		return 0;
	});
}

export function getUniqueCategories(reviews: NormalizedReview[]): string[] {
	const categories = new Set<string>();
	reviews.forEach((review) => {
		review.categories.forEach((cat) => {
			categories.add(cat.category);
		});
	});
	return Array.from(categories).sort();
}

export function getUniqueChannels(reviews: NormalizedReview[]): string[] {
	const channels = new Set<string>();
	reviews.forEach((review) => {
		channels.add(review.channel);
	});
	return Array.from(channels).sort();
}

export function getUniqueListings(
	reviews: NormalizedReview[]
): Array<{ id: string; name: string }> {
	const listings = new Map<string, string>();
	reviews.forEach((review) => {
		// Use propertyId as the key to avoid duplicates
		listings.set(review.propertyId, review.listingName);
	});
	return Array.from(listings.entries()).map(([key, value]) => ({
		id: key,
		name: value,
	}));
}

export function getRatingDistribution(
	reviews: NormalizedReview[]
): Record<number, number> {
	const distribution: Record<number, number> = {};

	for (let i = 1; i <= 5; i++) {
		distribution[i] = 0;
	}

	reviews.forEach((review) => {
		if (review.rating !== null) {
			const roundedRating = Math.round(review.rating);
			if (roundedRating >= 1 && roundedRating <= 5) {
				distribution[roundedRating]++;
			}
		}
	});

	return distribution;
}

export function getCategoryStats(reviews: NormalizedReview[]): Array<{
	category: string;
	averageRating: number;
	count: number;
	totalReviews: number;
}> {
	const categoryMap = new Map<
		string,
		{ sum: number; count: number; totalReviews: number }
	>();

	reviews.forEach((review) => {
		review.categories.forEach((cat) => {
			const existing = categoryMap.get(cat.category) || {
				sum: 0,
				count: 0,
				totalReviews: 0,
			};
			existing.sum += cat.rating;
			existing.count++;
			existing.totalReviews++;
			categoryMap.set(cat.category, existing);
		});
	});

	return Array.from(categoryMap.entries())
		.map(([category, stats]) => ({
			category,
			averageRating:
				stats.count > 0 ? Number((stats.sum / stats.count).toFixed(2)) : 0,
			count: stats.count,
			totalReviews: stats.totalReviews,
		}))
		.sort((a, b) => b.averageRating - a.averageRating);
}

// Trend Analysis Functions
export interface CategoryInsight {
	category: string;
	rating: number;
	issues: number;
	trend: 'improving' | 'stable' | 'declining' | 'concerning';
	issueRate: number;
}

export interface MonthlyTrend {
	month: string;
	avgRating: number;
	issues: number;
	trend: '↗️' | '↘️' | '→';
	issueRate: number;
}

export interface RecurringIssue {
	issue: string;
	frequency: number;
	severity: 'high' | 'medium' | 'low';
	category: string;
}

export interface PerformanceAlert {
	type: 'critical' | 'warning' | 'info';
	title: string;
	description: string;
	action: string;
	category?: string;
}

/**
 * Get category performance insights with trend analysis
 */
export function getCategoryInsights(
	reviews: NormalizedReview[]
): CategoryInsight[] {
	const categoryStats = new Map<
		string,
		{
			total: number;
			sum: number;
			count: number;
			lowRatings: number;
			recentLowRatings: number;
		}
	>();

	reviews.forEach((review) => {
		const reviewDate = new Date(review.submittedAt);
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
		const isRecent = reviewDate >= thirtyDaysAgo;

		review.categories.forEach((cat) => {
			const existing = categoryStats.get(cat.category) || {
				total: 0,
				sum: 0,
				count: 0,
				lowRatings: 0,
				recentLowRatings: 0,
			};

			existing.total++;
			existing.sum += cat.rating;
			existing.count++;
			if (cat.rating <= 3) existing.lowRatings++;
			if (cat.rating <= 3 && isRecent) existing.recentLowRatings++;

			categoryStats.set(cat.category, existing);
		});
	});

	return Array.from(categoryStats.entries())
		.map(([category, stats]) => {
			const avgRating =
				stats.count > 0 ? Number((stats.sum / stats.count).toFixed(1)) : 0;
			const issueRate =
				stats.total > 0
					? Number(((stats.lowRatings / stats.total) * 100).toFixed(1))
					: 0;
			const recentIssueRate =
				stats.total > 0
					? Number(((stats.recentLowRatings / stats.total) * 100).toFixed(1))
					: 0;

			// Determine trend based on recent vs overall performance
			let trend: CategoryInsight['trend'] = 'stable';
			if (recentIssueRate > issueRate + 10) {
				trend = 'concerning';
			} else if (recentIssueRate < issueRate - 10) {
				trend = 'improving';
			} else if (issueRate > 40) {
				trend = 'declining';
			}

			return {
				category,
				rating: avgRating,
				issues: stats.lowRatings,
				trend,
				issueRate,
			};
		})
		.sort((a, b) => b.issueRate - a.issueRate);
}

/**
 * Get monthly performance trends
 */
export function getMonthlyTrends(reviews: NormalizedReview[]): MonthlyTrend[] {
	const monthlyData = new Map<
		string,
		{
			ratings: number[];
			count: number;
			lowRatings: number;
		}
	>();

	reviews.forEach((review) => {
		if (!review.rating) return;

		const month = review.submittedAt.slice(0, 7); // YYYY-MM
		const existing = monthlyData.get(month) || {
			ratings: [],
			count: 0,
			lowRatings: 0,
		};

		existing.ratings.push(review.rating);
		existing.count++;
		if (review.rating <= 3) existing.lowRatings++;
		monthlyData.set(month, existing);
	});

	const trends = Array.from(monthlyData.entries())
		.map(([month, data]) => {
			const avgRating =
				data.ratings.length > 0
					? Number(
							(
								data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length
							).toFixed(1)
						)
					: 0;
			const issueRate =
				data.count > 0
					? Number(((data.lowRatings / data.count) * 100).toFixed(1))
					: 0;

			return {
				month,
				avgRating,
				issues: data.lowRatings,
				trend: '→' as '↗️' | '↘️' | '→', // Will be calculated below
				issueRate,
			};
		})
		.sort((a, b) => a.month.localeCompare(b.month));

	// Calculate trend arrows
	for (let i = 1; i < trends.length; i++) {
		const current = trends[i];
		const previous = trends[i - 1];

		if (current.avgRating > previous.avgRating + 0.2) {
			current.trend = '↗️';
		} else if (current.avgRating < previous.avgRating - 0.2) {
			current.trend = '↘️';
		} else {
			current.trend = '→';
		}
	}

	return trends; // Return all months
}

/**
 * Detect recurring issues from review text
 */
export function getRecurringIssues(
	reviews: NormalizedReview[]
): RecurringIssue[] {
	const issueKeywords = {
		WiFi: ['wifi', 'internet', 'connection', 'network', 'signal'],
		Noise: ['noise', 'loud', 'noisy', 'sound', 'disturbance'],
		Cleanliness: ['dirty', 'clean', 'messy', 'stain', 'dust'],
		Heating: ['heat', 'heating', 'cold', 'temperature', 'warm'],
		'Check-in': ['check-in', 'checkin', 'key', 'access', 'entry'],
		Communication: ['response', 'reply', 'contact', 'message', 'host'],
		Parking: ['parking', 'park', 'car', 'vehicle', 'space'],
		Kitchen: ['kitchen', 'cook', 'stove', 'refrigerator', 'fridge'],
	};

	const categoryCounts = new Map<string, number>();
	const keywordCounts = new Map<string, number>();

	reviews.forEach((review) => {
		if (!review.text) return;

		const text = review.text.toLowerCase();

		Object.entries(issueKeywords).forEach(([category, keywords]) => {
			let categoryMatched = false;
			keywords.forEach((keyword) => {
				if (text.includes(keyword)) {
					const key = `${category}-${keyword}`;
					keywordCounts.set(key, (keywordCounts.get(key) || 0) + 1);
					if (!categoryMatched) {
						categoryCounts.set(
							category,
							(categoryCounts.get(category) || 0) + 1
						);
						categoryMatched = true;
					}
				}
			});
		});
	});

	// Get the most frequent keyword for each category
	const categoryToKeyword = new Map<string, string>();
	Array.from(keywordCounts.entries()).forEach(([key, frequency]) => {
		const [category, keyword] = key.split('-');
		const currentMax = categoryToKeyword.get(category);
		if (
			!currentMax ||
			(keywordCounts.get(`${category}-${currentMax}`) || 0) < frequency
		) {
			categoryToKeyword.set(category, keyword);
		}
	});

	return Array.from(categoryCounts.entries())
		.map(([category, frequency]) => {
			const keyword = categoryToKeyword.get(category) || 'general';
			let severity: 'high' | 'medium' | 'low' = 'low';
			if (frequency >= 5) severity = 'high';
			else if (frequency >= 3) severity = 'medium';

			return {
				issue: `${category} issues (${keyword})`,
				frequency,
				severity,
				category,
			};
		})
		.filter((issue) => issue.frequency >= 2)
		.sort((a, b) => b.frequency - a.frequency)
		.slice(0, 8); // Top 8 recurring issues
}

/**
 * Generate performance alerts based on trends and issues
 */
export function getPerformanceAlerts(
	reviews: NormalizedReview[]
): PerformanceAlert[] {
	const alerts: PerformanceAlert[] = [];
	const recentReviews = reviews.filter((r) => {
		const reviewDate = new Date(r.submittedAt);
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
		return reviewDate >= thirtyDaysAgo;
	});

	// Low rating alert
	const lowRatingCount = recentReviews.filter(
		(r) => r.rating && r.rating <= 3
	).length;
	if (lowRatingCount > recentReviews.length * 0.3) {
		alerts.push({
			type: 'critical',
			title: 'High Number of Low Ratings',
			description: `${lowRatingCount} low ratings in the last 30 days (${((lowRatingCount / recentReviews.length) * 100).toFixed(1)}%)`,
			action:
				'Review recent feedback for common issues and take immediate action',
		});
	}

	// Category performance alerts - use all reviews for category insights
	const categoryInsights = getCategoryInsights(reviews);
	const problemCategories = categoryInsights.filter((c) => c.issueRate > 40);
	if (problemCategories.length > 0) {
		alerts.push({
			type: 'warning',
			title: 'Category Performance Issues',
			description: `Issues detected in: ${problemCategories.map((c) => c.category).join(', ')}`,
			action:
				'Address recurring problems in these areas with targeted improvements',
			category: problemCategories[0].category,
		});
	}

	// Declining trend alert
	const monthlyTrends = getMonthlyTrends(reviews);
	if (monthlyTrends.length >= 2) {
		const recent = monthlyTrends[monthlyTrends.length - 1];
		const previous = monthlyTrends[monthlyTrends.length - 2];
		if (recent.avgRating < previous.avgRating - 0.5) {
			alerts.push({
				type: 'warning',
				title: 'Declining Performance Trend',
				description: `Average rating dropped from ${previous.avgRating} to ${recent.avgRating}`,
				action: 'Investigate recent changes and implement improvement measures',
			});
		}
	}

	// Recurring issues alert
	const recurringIssues = getRecurringIssues(recentReviews);
	const highSeverityIssues = recurringIssues.filter(
		(i) => i.severity === 'high'
	);
	if (highSeverityIssues.length > 0) {
		const issueCount = highSeverityIssues.length;
		const issueText = issueCount === 1 ? 'issue' : 'issues';
		alerts.push({
			type: 'critical',
			title: 'Recurring High-Severity Issues',
			description: `${issueCount} ${issueText} reported frequently: ${highSeverityIssues.map((i) => i.issue).join(', ')}`,
			action: 'Prioritize fixing these recurring problems immediately',
		});
	}

	return alerts.sort((a, b) => {
		const severityOrder = { critical: 0, warning: 1, info: 2 };
		return severityOrder[a.type] - severityOrder[b.type];
	});
}
