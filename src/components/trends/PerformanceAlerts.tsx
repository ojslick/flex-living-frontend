import React from 'react';
import styled from 'styled-components';
import type { PerformanceAlert } from '../../lib/filters';
import Badge from '../ui/Badge';

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

const AlertPanel = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing[3]};
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

const AlertItem = styled.div<{ $severity: 'critical' | 'warning' | 'info' }>`
	display: flex;
	align-items: flex-start;
	gap: ${({ theme }) => theme.spacing[3]};
	padding: ${({ theme }) => theme.spacing[4]};
	border-radius: ${({ theme }) => theme.radii.xl};
	border-left: 6px solid;
	position: relative;
	overflow: hidden;
	transition: all 0.3s ease;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		opacity: 0.1;
		background: linear-gradient(
			45deg,
			transparent 30%,
			rgba(255, 255, 255, 0.3) 50%,
			transparent 70%
		);
		transform: translateX(-100%);
		transition: transform 0.6s ease;
	}

	&:hover::before {
		transform: translateX(100%);
	}

	${({ $severity, theme }) => {
		switch ($severity) {
			case 'critical':
				return `
					background: linear-gradient(135deg, ${theme.colors.errorLight} 0%, rgba(220, 38, 38, 0.05) 100%);
					border-left-color: ${theme.colors.error};
					color: ${theme.colors.error};
					box-shadow: 0 4px 20px rgba(220, 38, 38, 0.2);
					
					&:hover {
						transform: translateY(-2px);
						box-shadow: 0 8px 30px rgba(220, 38, 38, 0.3);
					}
				`;
			case 'warning':
				return `
					background: linear-gradient(135deg, ${theme.colors.warningLight} 0%, rgba(214, 158, 46, 0.05) 100%);
					border-left-color: ${theme.colors.warning};
					color: ${theme.colors.warning};
					box-shadow: 0 4px 20px rgba(214, 158, 46, 0.2);
					
					&:hover {
						transform: translateY(-2px);
						box-shadow: 0 8px 30px rgba(214, 158, 46, 0.3);
					}
				`;
			default:
				return `
					background: linear-gradient(135deg, ${theme.colors.infoLight} 0%, rgba(59, 130, 246, 0.05) 100%);
					border-left-color: ${theme.colors.info};
					color: ${theme.colors.info};
					box-shadow: 0 4px 20px rgba(59, 130, 246, 0.2);
					
					&:hover {
						transform: translateY(-2px);
						box-shadow: 0 8px 30px rgba(59, 130, 246, 0.3);
					}
				`;
		}
	}}
`;

const AlertIcon = styled.div`
	font-size: ${({ theme }) => theme.fontSizes.xl};
	flex-shrink: 0;
`;

const AlertContent = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing[2]};
`;

const AlertTitle = styled.h4`
	font-size: ${({ theme }) => theme.fontSizes.lg};
	font-weight: ${({ theme }) => theme.fontWeights.semibold};
	margin: 0;
`;

const AlertDescription = styled.p`
	font-size: ${({ theme }) => theme.fontSizes.sm};
	margin: 0;
	opacity: 0.9;
`;

const AlertAction = styled.div`
	font-size: ${({ theme }) => theme.fontSizes.sm};
	font-weight: ${({ theme }) => theme.fontWeights.medium};
	font-style: italic;
`;

const AlertBadge = styled(Badge)<{
	$severity: 'critical' | 'warning' | 'info';
}>`
	${({ $severity }) => {
		switch ($severity) {
			case 'critical':
				return 'variant="error"';
			case 'warning':
				return 'variant="warning"';
			default:
				return 'variant="info"';
		}
	}}
`;

interface PerformanceAlertsProps {
	alerts: PerformanceAlert[];
}

const PerformanceAlerts: React.FC<PerformanceAlertsProps> = ({ alerts }) => {
	if (alerts.length === 0) {
		return (
			<Container>
				<Title>🚨 Performance Alerts</Title>
				<AlertPanel>
					<AlertItem $severity="info">
						<AlertIcon>✅</AlertIcon>
						<AlertContent>
							<AlertTitle>All Good!</AlertTitle>
							<AlertDescription>
								No critical issues detected. Your property performance is on
								track.
							</AlertDescription>
						</AlertContent>
						<AlertBadge $severity="info">Good</AlertBadge>
					</AlertItem>
				</AlertPanel>
			</Container>
		);
	}

	return (
		<Container>
			<Title>🚨 Performance Alerts</Title>
			<AlertPanel>
				{alerts.map((alert, index) => (
					<AlertItem key={index} $severity={alert.type}>
						<AlertIcon>
							{alert.type === 'critical'
								? '⚠️'
								: alert.type === 'warning'
									? '📊'
									: 'ℹ️'}
						</AlertIcon>
						<AlertContent>
							<AlertTitle>{alert.title}</AlertTitle>
							<AlertDescription>{alert.description}</AlertDescription>
							<AlertAction>{alert.action}</AlertAction>
						</AlertContent>
						<AlertBadge $severity={alert.type}>
							{alert.type === 'critical'
								? 'Critical'
								: alert.type === 'warning'
									? 'Warning'
									: 'Info'}
						</AlertBadge>
					</AlertItem>
				))}
			</AlertPanel>
		</Container>
	);
};

export default PerformanceAlerts;
