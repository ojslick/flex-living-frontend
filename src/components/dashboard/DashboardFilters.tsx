import React from 'react';
import styled from 'styled-components';
import type { FilterOptions, SortOptions } from '../../lib/types';

const FiltersSection = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: ${({ theme }) => theme.spacing[4]};
	align-items: end;
	justify-content: center;
	max-width: 100%;
	background: ${({ theme }) => theme.colors.surface};
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: ${({ theme }) => theme.radii.lg};
	padding: ${({ theme }) => theme.spacing[4]};
	box-shadow: ${({ theme }) => theme.shadows.sm};
	position: relative;
	z-index: 1;
`;

const FilterGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing[2]};
	min-width: 150px;
`;

const FilterLabel = styled.label`
	font-size: ${({ theme }) => theme.fontSizes.sm};
	font-weight: ${({ theme }) => theme.fontWeights.medium};
	color: ${({ theme }) => theme.colors.text};
`;

const Select = styled.select`
	padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: ${({ theme }) => theme.radii.md};
	background: ${({ theme }) => theme.colors.surface};
	color: ${({ theme }) => theme.colors.text};
	font-size: ${({ theme }) => theme.fontSizes.sm};

	&:focus {
		outline: none;
		border-color: ${({ theme }) => theme.colors.accent};
	}
`;

const ClearFiltersButton = styled.button`
	padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
	background: ${({ theme }) => theme.colors.accent};
	color: ${({ theme }) => theme.colors.text};
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: ${({ theme }) => theme.radii.md};
	font-size: ${({ theme }) => theme.fontSizes.sm};
	font-weight: ${({ theme }) => theme.fontWeights.medium};
	cursor: pointer;
	transition: all 0.2s ease;
	height: fit-content;

	&:hover {
		background: ${({ theme }) => theme.colors.primary};
		color: white;
		border-color: ${({ theme }) => theme.colors.primary};
	}
`;

interface DashboardFiltersProps {
	filters: FilterOptions;
	sort: SortOptions;
	onFiltersChange: (filters: FilterOptions) => void;
	onSortChange: (sort: SortOptions) => void;
	onClearFilters: () => void;
	uniqueListings: Array<{ id: string; name: string }>;
}

const DashboardFilters: React.FC<DashboardFiltersProps> = ({
	filters,
	sort,
	onFiltersChange,
	onSortChange,
	onClearFilters,
	uniqueListings,
}) => {
	return (
		<FiltersSection>
			<FilterGroup>
				<FilterLabel htmlFor="listing-filter">Listing</FilterLabel>
				<Select
					id="listing-filter"
					value={filters.listingId || ''}
					onChange={(e) =>
						onFiltersChange({
							...filters,
							listingId: e.target.value || undefined,
						})
					}
				>
					<option value="">All Listings</option>
					{uniqueListings.map((listing) => (
						<option key={listing.id} value={listing.id}>
							{listing.name}
						</option>
					))}
				</Select>
			</FilterGroup>

			<FilterGroup>
				<FilterLabel htmlFor="channel-filter">Channel</FilterLabel>
				<Select
					id="channel-filter"
					value={filters.channel?.[0] || 'hostaway'}
					onChange={(e) =>
						onFiltersChange({
							...filters,
							channel: e.target.value ? [e.target.value] : undefined,
						})
					}
				>
					<option value="hostaway">Hostaway</option>
					<option value="google">Google</option>
				</Select>
			</FilterGroup>

			<FilterGroup>
				<FilterLabel htmlFor="rating-filter">Min Rating</FilterLabel>
				<Select
					id="rating-filter"
					value={filters.rating?.min || ''}
					onChange={(e) =>
						onFiltersChange({
							...filters,
							rating: e.target.value
								? { min: Number(e.target.value), max: 5 }
								: undefined,
						})
					}
				>
					<option value="">Any Rating</option>
					<option value="1">1+ Stars</option>
					<option value="2">2+ Stars</option>
					<option value="3">3+ Stars</option>
					<option value="4">4+ Stars</option>
					<option value="5">5 Stars</option>
				</Select>
			</FilterGroup>

			<FilterGroup>
				<FilterLabel htmlFor="approval-filter">Status</FilterLabel>
				<Select
					id="approval-filter"
					value={
						filters.approved === undefined ? '' : filters.approved.toString()
					}
					onChange={(e) =>
						onFiltersChange({
							...filters,
							approved:
								e.target.value === '' ? undefined : e.target.value === 'true',
						})
					}
				>
					<option value="">All Reviews</option>
					<option value="true">Approved Only</option>
					<option value="false">Pending Only</option>
				</Select>
			</FilterGroup>

			<FilterGroup>
				<FilterLabel htmlFor="sort-field">Sort By</FilterLabel>
				<Select
					id="sort-field"
					value={sort.field}
					onChange={(e) =>
						onSortChange({
							...sort,
							field: e.target.value as SortOptions['field'],
						})
					}
				>
					<option value="date">Date</option>
					<option value="rating">Rating</option>
					<option value="guestName">Guest Name</option>
					<option value="listingName">Listing Name</option>
				</Select>
			</FilterGroup>

			<FilterGroup>
				<FilterLabel htmlFor="sort-order">Order</FilterLabel>
				<Select
					id="sort-order"
					value={sort.direction}
					onChange={(e) =>
						onSortChange({
							...sort,
							direction: e.target.value as SortOptions['direction'],
						})
					}
				>
					<option value="desc">Newest First</option>
					<option value="asc">Oldest First</option>
				</Select>
			</FilterGroup>

			<ClearFiltersButton onClick={onClearFilters}>
				Clear Filters
			</ClearFiltersButton>
		</FiltersSection>
	);
};

export default DashboardFilters;
