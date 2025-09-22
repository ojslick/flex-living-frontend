import React from 'react';
import styled from 'styled-components';
import type { MonthlyTrend } from '../../lib/filters';

const Timeline = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	gap: ${({ theme }) => theme.spacing[4]};
	width: 100%;
	height: 100%;
`;

const TimelineHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const TimelineTitle = styled.h3`
	font-size: ${({ theme }) => theme.fontSizes.xl};
	font-weight: ${({ theme }) => theme.fontWeights.semibold};
	color: ${({ theme }) => theme.colors.text};
	margin: 0;
`;

const EmptyState = styled.div`
	text-align: center;
	padding: ${({ theme }) => theme.spacing[6]};
	color: ${({ theme }) => theme.colors.textLight};
	font-style: italic;
`;

const ChartContainer = styled.div`
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
`;

const ChartSVG = styled.svg`
	width: 100%;
	height: 100%;
	overflow: visible;
	filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
`;

const GridLine = styled.line`
	stroke: ${({ theme }) => theme.colors.border};
	stroke-width: 1;
	opacity: 0.5;
	stroke-dasharray: 2, 2;
`;

const DataLine = styled.polyline`
	fill: none;
	stroke: ${({ theme }) => theme.colors.primary};
	stroke-width: 3;
	stroke-linecap: round;
	stroke-linejoin: round;
`;

const DataPoint = styled.circle`
	fill: ${({ theme }) => theme.colors.primary};
	stroke: white;
	stroke-width: 2;
	transition: fill 0.2s ease;
	cursor: pointer;

	&:hover {
		fill: ${({ theme }) => theme.colors.primaryDark || theme.colors.primary};
	}
`;

const AreaFill = styled.polygon`
	fill: ${({ theme }) => theme.colors.primary};
	opacity: 0.1;
	transition: opacity 0.3s ease;

	&:hover {
		opacity: 0.2;
	}
`;

const YAxisLabel = styled.text`
	font-size: 12px;
	font-weight: 500;
	fill: ${({ theme }) => theme.colors.textLight};
	text-anchor: end;
`;

const XAxisLabel = styled.text`
	font-size: 12px;
	font-weight: 500;
	fill: ${({ theme }) => theme.colors.textLight};
	text-anchor: middle;
`;

const ChartTitle = styled.h4`
	font-size: 24px;
	font-weight: 600;
	color: ${({ theme }) => theme.colors.text};
	margin: 0 0 16px 0;
	text-align: center;
	letter-spacing: 0.5px;
`;

const ChartSubtitle = styled.p`
	font-size: 14px;
	color: ${({ theme }) => theme.colors.textLight};
	text-align: center;
	margin: 0 0 6px 0;
	font-style: italic;
`;

const Tooltip = styled.div<{ $x: number; $y: number }>`
	position: fixed;
	left: ${({ $x }) => $x}px;
	top: ${({ $y }) => $y}px;
	background: ${({ theme }) => theme.colors.surface};
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: 8px;
	padding: 12px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	z-index: 1000;
	pointer-events: none;
	transform: translate(-50%, -100%);
	margin-top: -12px;
	min-width: 200px;
	opacity: 0.95;
	backdrop-filter: blur(4px);
`;

const TooltipTitle = styled.div`
	font-size: 14px;
	font-weight: 600;
	color: ${({ theme }) => theme.colors.text};
	margin-bottom: 4px;
`;

const TooltipContent = styled.div`
	font-size: 12px;
	color: ${({ theme }) => theme.colors.textLight};
	line-height: 1.4;
`;

interface TrendTimelineProps {
	trends: MonthlyTrend[];
}

const TrendTimeline: React.FC<TrendTimelineProps> = ({ trends }) => {
	const [hoveredPoint, setHoveredPoint] = React.useState<{
		trend: MonthlyTrend;
		x: number;
		y: number;
	} | null>(null);
	const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

	const formatMonth = (month: string) => {
		const date = new globalThis.Date(month + '-01');
		return date.toLocaleDateString('en-US', {
			month: 'short',
			year: 'numeric',
		});
	};

	React.useEffect(() => {
		return () => {
			if (hoverTimeoutRef.current) {
				clearTimeout(hoverTimeoutRef.current);
			}
		};
	}, []);

	const renderChart = () => {
		if (trends.length < 2) return null;

		const chartWidth = 600;
		const chartHeight = 300;
		const padding = 60;
		const innerWidth = chartWidth - padding * 2;
		const innerHeight = chartHeight - padding * 2;

		// Calculate data bounds
		const minRating = 0; // Always start from 0
		const maxRating = 5; // Always go up to 10 (max possible rating)
		const ratingRange = maxRating - minRating;

		// Calculate points
		const chartPoints = trends.map((trend, index) => {
			const x = padding + (index / (trends.length - 1)) * innerWidth;
			const y =
				padding +
				innerHeight -
				((trend.avgRating - minRating) / ratingRange) * innerHeight;
			return { x, y, rating: trend.avgRating, month: trend.month };
		});

		const points = chartPoints.map((p) => `${p.x},${p.y}`).join(' ');

		// Create area fill points
		const areaPoints = [
			`${padding},${padding + innerHeight}`,
			...chartPoints.map((p) => `${p.x},${p.y}`),
			`${padding + innerWidth},${padding + innerHeight}`,
		].join(' ');

		// Generate grid lines
		const gridLines: React.ReactNode[] = [];
		for (let i = 0; i <= 4; i++) {
			const y = padding + (i / 4) * innerHeight;
			gridLines.push(
				<GridLine
					key={`grid-${i}`}
					x1={padding}
					y1={y}
					x2={padding + innerWidth}
					y2={y}
				/>
			);
		}

		// Generate Y-axis labels
		const yLabels: React.ReactNode[] = [];
		for (let i = 0; i <= 4; i++) {
			const value = minRating + (ratingRange * (4 - i)) / 4;
			const y = padding + (i / 4) * innerHeight;
			yLabels.push(
				<YAxisLabel key={`y-label-${i}`} x={padding - 10} y={y + 4}>
					{value.toFixed(1)}
				</YAxisLabel>
			);
		}

		// Generate X-axis labels (show only 5 evenly distributed months)
		const xLabels: React.ReactNode[] = [];
		const labelCount = 5;
		for (let i = 0; i < labelCount; i++) {
			const index = Math.round((i / (labelCount - 1)) * (trends.length - 1));
			const trend = trends[index];
			const x = padding + (index / (trends.length - 1)) * innerWidth;
			xLabels.push(
				<XAxisLabel key={`x-label-${i}`} x={x} y={chartHeight - 10}>
					{formatMonth(trend.month)}
				</XAxisLabel>
			);
		}

		// Generate data points
		const dataPoints = chartPoints.map((point, index) => (
			<DataPoint
				key={`point-${index}`}
				cx={point.x}
				cy={point.y}
				r={5}
				onMouseEnter={(e) => {
					if (hoverTimeoutRef.current) {
						clearTimeout(hoverTimeoutRef.current);
					}
					const rect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
					if (rect) {
						setHoveredPoint({
							trend: trends[index],
							x: rect.left + point.x,
							y: rect.top + point.y,
						});
					}
				}}
				onMouseLeave={() => {
					hoverTimeoutRef.current = setTimeout(() => {
						setHoveredPoint(null);
					}, 100);
				}}
			/>
		));

		return (
			<ChartContainer>
				<ChartTitle>📊 Rating Trend Over Time</ChartTitle>
				<ChartSubtitle>
					Monthly average ratings from {formatMonth(trends[0].month)} to{' '}
					{formatMonth(trends[trends.length - 1].month)}
				</ChartSubtitle>
				<ChartSVG viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
					{gridLines}
					<AreaFill points={areaPoints} />
					{yLabels}
					{xLabels}
					<DataLine points={points} />
					{dataPoints}
				</ChartSVG>
				{hoveredPoint && (
					<Tooltip $x={hoveredPoint.x} $y={hoveredPoint.y}>
						<TooltipTitle>{formatMonth(hoveredPoint.trend.month)}</TooltipTitle>
						<TooltipContent>
							<div>Average Rating: {hoveredPoint.trend.avgRating}/10</div>
							<div>Issues: {hoveredPoint.trend.issues}</div>
							<div>Issue Rate: {hoveredPoint.trend.issueRate}%</div>
							<div>Trend: {hoveredPoint.trend.trend}</div>
						</TooltipContent>
					</Tooltip>
				)}
			</ChartContainer>
		);
	};

	if (trends.length === 0) {
		return (
			<Timeline>
				<TimelineHeader>
					<TimelineTitle>📈 Performance Trends</TimelineTitle>
				</TimelineHeader>
				<EmptyState>
					Not enough data to show trends yet. Check back after more reviews are
					collected.
				</EmptyState>
			</Timeline>
		);
	}

	return <Timeline>{renderChart()}</Timeline>;
};

export default TrendTimeline;
