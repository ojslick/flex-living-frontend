import React from 'react';
import styled from 'styled-components';
import type {
	CategoryInsight,
	MonthlyTrend,
	RecurringIssue,
	PerformanceAlert,
} from '../../lib/types';
import PerformanceAlerts from '../trends/PerformanceAlerts';
import CategoryGrid from '../trends/CategoryGrid';
import TrendTimeline from '../trends/TrendTimeline';
import RecurringIssues from '../trends/RecurringIssues';

const InsightsSection = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: ${({ theme }) => theme.spacing[6]};
	margin-bottom: ${({ theme }) => theme.spacing[6]};

	@media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
		grid-template-columns: 1fr;
	}
`;

const InsightsGrid = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: ${({ theme }) => theme.spacing[6]};
`;

const SectionTitle = styled.h2`
	font-size: ${({ theme }) => theme.fontSizes.xl};
	font-weight: ${({ theme }) => theme.fontWeights.semibold};
	color: ${({ theme }) => theme.colors.text};
	margin: 0;
	text-align: center;
	grid-column: 1 / -1;
`;

interface DashboardInsightsProps {
	selectedListing?: { id: string; name: string } | null;
	categoryInsights: CategoryInsight[];
	monthlyTrends: MonthlyTrend[];
	recurringIssues: RecurringIssue[];
	performanceAlerts: PerformanceAlert[];
}

const DashboardInsights: React.FC<DashboardInsightsProps> = ({
	selectedListing,
	categoryInsights,
	monthlyTrends,
	recurringIssues,
	performanceAlerts,
}) => {
	return (
		<>
			{/* Per-listing Performance Analysis */}
			{selectedListing && (
				<InsightsSection>
					<SectionTitle>
						📊 {selectedListing.name} Performance Analysis
					</SectionTitle>
				</InsightsSection>
			)}

			{/* Performance Alerts and Recurring Issues */}
			{performanceAlerts.length > 0 && (
				<InsightsSection>
					<PerformanceAlerts alerts={performanceAlerts} />
					<RecurringIssues issues={recurringIssues} />
				</InsightsSection>
			)}

			{/* Category Performance and Trend Timeline */}
			<InsightsGrid>
				<CategoryGrid categories={categoryInsights} />
				<TrendTimeline trends={monthlyTrends} />
			</InsightsGrid>
		</>
	);
};

export default DashboardInsights;

