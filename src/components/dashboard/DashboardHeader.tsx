import React from 'react';
import styled from 'styled-components';
import Card from '../ui/Card';

const Header = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing[4]};
`;

const Title = styled.h1`
	font-size: ${({ theme }) => theme.fontSizes['3xl']};
	font-weight: ${({ theme }) => theme.fontWeights.bold};
	color: ${({ theme }) => theme.colors.text};
	margin: 0;
	text-align: center;
`;

const StatsGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: ${({ theme }) => theme.spacing[4]};
`;

const StatCard = styled(Card)`
	text-align: center;
`;

const StatValue = styled.div`
	font-size: ${({ theme }) => theme.fontSizes['2xl']};
	font-weight: ${({ theme }) => theme.fontWeights.bold};
	color: ${({ theme }) => theme.colors.primary};
	margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const StatLabel = styled.div`
	color: ${({ theme }) => theme.colors.textLight};
	font-size: ${({ theme }) => theme.fontSizes.sm};
`;

interface DashboardStats {
	totalReviews: number;
	avgRating: number;
	approvedReviews: number;
	recentReviews: number;
}

interface DashboardHeaderProps {
	selectedListing?: { id: string; name: string } | null;
	stats: DashboardStats;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
	selectedListing,
	stats,
}) => {
	return (
		<Header>
			<Title>
				{selectedListing
					? `${selectedListing.name} Dashboard`
					: 'Property Reviews Dashboard'}
			</Title>
			<StatsGrid>
				<StatCard>
					<StatValue>{stats.totalReviews}</StatValue>
					<StatLabel>Total Reviews</StatLabel>
				</StatCard>
				<StatCard>
					<StatValue>{stats.avgRating.toFixed(1)}</StatValue>
					<StatLabel>Average Rating</StatLabel>
				</StatCard>
				<StatCard>
					<StatValue>{stats.approvedReviews}</StatValue>
					<StatLabel>Approved Reviews</StatLabel>
				</StatCard>
				<StatCard>
					<StatValue>{stats.recentReviews}</StatValue>
					<StatLabel>Recent Reviews (30 days)</StatLabel>
				</StatCard>
			</StatsGrid>
		</Header>
	);
};

export default DashboardHeader;

