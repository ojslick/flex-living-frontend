import React from 'react';
import styled from 'styled-components';

const PaginationContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: ${({ theme }) => theme.spacing[2]};
	margin-top: ${({ theme }) => theme.spacing[6]};
`;

const PaginationButton = styled.button<{
	$active?: boolean;
	$disabled?: boolean;
}>`
	padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: ${({ theme }) => theme.radii.md};
	background: ${({ $active, theme }) =>
		$active ? theme.colors.primary : theme.colors.surface};
	color: ${({ $active, theme }) => ($active ? 'white' : theme.colors.text)};
	font-size: ${({ theme }) => theme.fontSizes.sm};
	font-weight: ${({ theme }) => theme.fontWeights.medium};
	cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
	opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
	transition: all 0.2s ease;

	&:hover:not(:disabled) {
		background: ${({ $active, theme }) =>
			$active ? theme.colors.primary : theme.colors.accent};
		border-color: ${({ theme }) => theme.colors.primary};
	}

	&:disabled {
		cursor: not-allowed;
	}
`;

const PaginationInfo = styled.div`
	color: ${({ theme }) => theme.colors.textLight};
	font-size: ${({ theme }) => theme.fontSizes.sm};
	margin: 0 ${({ theme }) => theme.spacing[4]};
`;

interface DashboardPaginationProps {
	currentPage: number;
	totalPages: number;
	totalItems?: number;
	itemsPerPage?: number;
	onPageChange: (page: number) => void;
}

const DashboardPagination: React.FC<DashboardPaginationProps> = ({
	currentPage,
	totalPages,
	totalItems,
	itemsPerPage,
	onPageChange,
}) => {
    const startItem =
			itemsPerPage && totalItems
				? (currentPage - 1) * itemsPerPage + 1
				: undefined;
		const endItem =
			itemsPerPage && totalItems
				? Math.min(currentPage * itemsPerPage, totalItems)
				: undefined;

    const getVisiblePages = () => {
			const delta = 2;
			const range: number[] = [];
			const rangeWithDots: Array<number | '...'> = [];

			for (
				let i = Math.max(2, currentPage - delta);
				i <= Math.min(totalPages - 1, currentPage + delta);
				i++
			) {
				range.push(i);
			}

			if (currentPage - delta > 2) {
				rangeWithDots.push(1, '...');
			} else {
				rangeWithDots.push(1);
			}

			rangeWithDots.push(...range);

			if (currentPage + delta < totalPages - 1) {
				rangeWithDots.push('...', totalPages);
			} else if (totalPages > 1) {
				rangeWithDots.push(totalPages);
			}

			return rangeWithDots;
		};

	if (totalPages <= 1) {
		return null;
	}

	return (
		<PaginationContainer>
			<PaginationButton
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
			>
				Previous
			</PaginationButton>

			{getVisiblePages().map((page, index) => {
				if (page === '...') {
					return (
						<PaginationButton key={`dots-${index}`} disabled>
							...
						</PaginationButton>
					);
				}

				return (
					<PaginationButton
						key={page}
						$active={currentPage === page}
						onClick={() => onPageChange(page as number)}
					>
						{page}
					</PaginationButton>
				);
			})}

			<PaginationButton
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
			>
				Next
			</PaginationButton>

			{startItem !== undefined &&
				endItem !== undefined &&
				totalItems !== undefined && (
					<PaginationInfo>
						Showing {startItem}-{endItem} of {totalItems} reviews
					</PaginationInfo>
				)}
		</PaginationContainer>
	);
};

export default DashboardPagination;

