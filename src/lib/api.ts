import type { ReviewsResponse } from './types';

// Prefer env-provided API base (e.g., Railway) and fall back to dev proxy '/api'
const API_BASE_URL: string | undefined = (
	import.meta as unknown as {
		env?: { VITE_API_BASE_URL?: string };
	}
).env?.VITE_API_BASE_URL;

class ApiError extends Error {
	public status: number;
	public response?: unknown;

	constructor(message: string, status: number, response?: unknown) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
		this.response = response;
	}
}

async function handleResponse<T>(response: Response): Promise<T> {
	if (!response.ok) {
		let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
		try {
			const errorData = await response.json();
			errorMessage = errorData.message || errorData.error || errorMessage;
		} catch {
			throw new ApiError(errorMessage, response.status);
		}
	}

	return response.json();
}

export async function getReviews(
	channel?: 'hostaway' | 'google'
): Promise<ReviewsResponse> {
	const endpoint = `${API_BASE_URL}/api/reviews/${channel}`;
	const response = await fetch(endpoint);
	return handleResponse<ReviewsResponse>(response);
}

export async function getHostawayReviews(): Promise<ReviewsResponse> {
	const response = await fetch(`${API_BASE_URL}/api/reviews/hostaway`);
	return handleResponse<ReviewsResponse>(response);
}

export async function getGoogleReviews(): Promise<ReviewsResponse> {
	const response = await fetch(`${API_BASE_URL}/api/reviews/google`);
	return handleResponse<ReviewsResponse>(response);
}

export async function toggleApprove(
	id: string
): Promise<{ id: string; managerApproved: boolean }> {
	const response = await fetch(`${API_BASE_URL}/api/reviews/${id}/approve`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	});
	return handleResponse<{ id: string; managerApproved: boolean }>(response);
}

export async function getApprovals(): Promise<{
	approvals: Record<string, boolean>;
}> {
	const response = await fetch(`${API_BASE_URL}/api/reviews/approvals`);
	return handleResponse<{ approvals: Record<string, boolean> }>(response);
}
