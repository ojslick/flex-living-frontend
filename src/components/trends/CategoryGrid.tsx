import React from 'react';
import styled from 'styled-components';
import type { CategoryInsight } from '../../lib/filters';
import { formatCategoryName } from '../../lib/format';

const Container = styled.div`
	width: 100%;
	height: 450px;
	background: ${({ theme }) => theme.colors.surface};
	border-radius: 16px;
	padding: 32px;
	margin: 0 0 24px 0;
	position: relative;
	overflow: hidden;
	border: 1px solid ${({ theme }) => theme.colors.border};
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	display: flex;
	flex-direction: column;
`;

const Title = styled.h3`
	font-size: 24px;
	font-weight: 600;
	color: ${({ theme }) => theme.colors.text};
	margin: 0 0 16px 0;
	text-align: center;
	letter-spacing: 0.5px;
`;

const Grid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: ${({ theme }) => theme.spacing[4]};
	align-content: start;
	flex: 1;
	overflow-y: auto;
	padding-right: 8px;

	&::-webkit-scrollbar {
		width: 6px;
	}

	&::-webkit-scrollbar-track {
		background: ${({ theme }) => theme.colors.bgLight};
		border-radius: 3px;
	}

	&::-webkit-scrollbar-thumb {
		background: ${({ theme }) => theme.colors.border};
		border-radius: 3px;

		&:hover {
			background: ${({ theme }) => theme.colors.textLight};
		}
	}
`;

const CategoryCard = styled.div<{ $status: 'good' | 'warning' | 'critical' }>`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: ${({ theme }) => theme.spacing[3]};
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	position: relative;
	overflow: hidden;
	border-radius: ${({ theme }) => theme.radii.lg};
	padding: ${({ theme }) => theme.spacing[4]};
	background: ${({ theme }) => theme.colors.bgLight};
	border: 1px solid ${({ theme }) => theme.colors.border};
	min-height: 120px;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: linear-gradient(
			90deg,
			transparent 0%,
			currentColor 50%,
			transparent 100%
		);
		opacity: 0.6;
	}

	${({ $status, theme }) => {
		switch ($status) {
			case 'critical':
				return `
					background: linear-gradient(135deg, ${theme.colors.bgLight} 0%, rgba(220, 38, 38, 0.05) 100%);
					border: 1px solid rgba(220, 38, 38, 0.3);
					color: ${theme.colors.error};
					
					&:hover {
						transform: translateY(-2px);
						box-shadow: 0 8px 25px rgba(220, 38, 38, 0.15);
						border-color: ${theme.colors.error};
					}
				`;
			case 'warning':
				return `
					background: linear-gradient(135deg, ${theme.colors.bgLight} 0%, rgba(214, 158, 46, 0.05) 100%);
					border: 1px solid rgba(214, 158, 46, 0.3);
					color: ${theme.colors.warning};
					
					&:hover {
						transform: translateY(-2px);
						box-shadow: 0 8px 25px rgba(214, 158, 46, 0.15);
						border-color: ${theme.colors.warning};
					}
				`;
			default:
				return `
					background: linear-gradient(135deg, ${theme.colors.bgLight} 0%, rgba(56, 161, 105, 0.05) 100%);
					border: 1px solid rgba(56, 161, 105, 0.3);
					color: ${theme.colors.success};
					
					&:hover {
						transform: translateY(-2px);
						box-shadow: 0 8px 25px rgba(56, 161, 105, 0.15);
						border-color: ${theme.colors.success};
					}
				`;
		}
	}}
`;

const CategoryHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const CategoryName = styled.h4`
	font-size: ${({ theme }) => theme.fontSizes.lg};
	font-weight: ${({ theme }) => theme.fontWeights.semibold};
	color: ${({ theme }) => theme.colors.text};
	margin: 0;
`;

const TrendIndicator = styled.div<{
	$trend: 'improving' | 'stable' | 'declining' | 'concerning';
}>`
	display: flex;
	align-items: center;
	gap: ${({ theme }) => theme.spacing[1]};
	font-size: ${({ theme }) => theme.fontSizes.sm};
	font-weight: ${({ theme }) => theme.fontWeights.medium};

	${({ $trend, theme }) => {
		switch ($trend) {
			case 'improving':
				return `color: ${theme.colors.success};`;
			case 'concerning':
				return `color: ${theme.colors.error};`;
			case 'declining':
				return `color: ${theme.colors.warning};`;
			default:
				return `color: ${theme.colors.textLight};`;
		}
	}}
`;

const CategoryStats = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const Rating = styled.div`
	font-size: ${({ theme }) => theme.fontSizes.xl};
	font-weight: ${({ theme }) => theme.fontWeights.bold};
	color: ${({ theme }) => theme.colors.primary};
`;

const IssueCount = styled.div`
	font-size: ${({ theme }) => theme.fontSizes.sm};
	color: ${({ theme }) => theme.colors.textLight};
`;

const IssueRate = styled.div<{ $isHigh: boolean }>`
	font-size: ${({ theme }) => theme.fontSizes.sm};
	font-weight: ${({ theme }) => theme.fontWeights.medium};
	color: ${({ theme, $isHigh }) =>
		$isHigh ? theme.colors.error : theme.colors.success};
`;

const EmptyState = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;
	padding: ${({ theme }) => theme.spacing[8]};
	text-align: center;
	color: ${({ theme }) => theme.colors.textLight};
`;

const EmptyIcon = styled.div`
	font-size: 48px;
	margin-bottom: ${({ theme }) => theme.spacing[4]};
	opacity: 0.5;
`;

const EmptyTitle = styled.h3`
	font-size: ${({ theme }) => theme.fontSizes.lg};
	font-weight: ${({ theme }) => theme.fontWeights.medium};
	color: ${({ theme }) => theme.colors.text};
	margin: 0 0 ${({ theme }) => theme.spacing[2]} 0;
`;

const EmptyDescription = styled.p`
	font-size: ${({ theme }) => theme.fontSizes.sm};
	color: ${({ theme }) => theme.colors.textLight};
	margin: 0;
	line-height: 1.5;
`;

interface CategoryGridProps {
	categories: CategoryInsight[];
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
	const getStatus = (
		category: CategoryInsight
	): 'good' | 'warning' | 'critical' => {
		if (category.issueRate > 40) return 'critical';
		if (category.issueRate > 20) return 'warning';
		return 'good';
	};

	const getTrendIcon = (trend: CategoryInsight['trend']): string => {
		switch (trend) {
			case 'improving':
				return '↗️';
			case 'declining':
				return '↘️';
			case 'concerning':
				return '⚠️';
			default:
				return '→';
		}
	};

	return (
		<Container>
			<Title>📊 Category Performance</Title>
			{categories.length > 0 ? (
				<Grid>
					{categories.slice(0, 6).map((category) => {
						const status = getStatus(category);
						return (
							<CategoryCard key={category.category} $status={status}>
								<CategoryHeader>
									<CategoryName>
										{formatCategoryName(category.category)}
									</CategoryName>
									<TrendIndicator $trend={category.trend}>
										<span>{getTrendIcon(category.trend)}</span>
										<span>{category.trend}</span>
									</TrendIndicator>
								</CategoryHeader>

								<CategoryStats>
									<Rating>{category.rating}/5</Rating>
									<div
										style={{
											display: 'flex',
											flexDirection: 'column',
											alignItems: 'flex-end',
											gap: '4px',
										}}
									>
										<IssueCount>{category.issues} issues</IssueCount>
										<IssueRate $isHigh={category.issueRate > 20}>
											{category.issueRate}% issue rate
										</IssueRate>
									</div>
								</CategoryStats>
							</CategoryCard>
						);
					})}
				</Grid>
			) : (
				<EmptyState>
					<EmptyIcon>📊</EmptyIcon>
					<EmptyTitle>No Category Data Available</EmptyTitle>
					<EmptyDescription>
						Category performance data will appear here once reviews with
						category ratings are available.
					</EmptyDescription>
				</EmptyState>
			)}
		</Container>
	);
};

export default CategoryGrid;
