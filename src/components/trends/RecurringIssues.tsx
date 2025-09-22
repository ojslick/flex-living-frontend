import React from 'react';
import styled from 'styled-components';
import type { RecurringIssue } from '../../lib/filters';
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

const IssuesPanel = styled.div`
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

const IssueItem = styled.div<{ $severity: 'high' | 'medium' | 'low' }>`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: ${({ theme }) => theme.spacing[3]};
	border-radius: ${({ theme }) => theme.radii.lg};
	background: ${({ theme }) => theme.colors.bgLight};
	border: 1px solid ${({ theme }) => theme.colors.border};
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	position: relative;
	overflow: hidden;
	min-height: 80px;

	${({ $severity, theme }) => {
		switch ($severity) {
			case 'high':
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
			case 'medium':
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

const IssueInfo = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing[1]};
`;

const IssueText = styled.div`
	font-size: ${({ theme }) => theme.fontSizes.sm};
	font-weight: ${({ theme }) => theme.fontWeights.medium};
	color: ${({ theme }) => theme.colors.text};
`;

const IssueCategory = styled.div`
	font-size: ${({ theme }) => theme.fontSizes.xs};
	color: ${({ theme }) => theme.colors.textLight};
`;

const IssueStats = styled.div`
	display: flex;
	align-items: center;
	gap: ${({ theme }) => theme.spacing[2]};
`;

const Frequency = styled.div`
	font-size: ${({ theme }) => theme.fontSizes.sm};
	font-weight: ${({ theme }) => theme.fontWeights.semibold};
	color: ${({ theme }) => theme.colors.primary};
`;

const EmptyState = styled.div`
	text-align: center;
	padding: ${({ theme }) => theme.spacing[6]};
	color: ${({ theme }) => theme.colors.textLight};
	font-style: italic;
`;

interface RecurringIssuesProps {
	issues: RecurringIssue[];
}

const RecurringIssues: React.FC<RecurringIssuesProps> = ({ issues }) => {
	if (issues.length === 0) {
		return (
			<Container>
				<Title>🔍 Recurring Issues</Title>
				<IssuesPanel>
					<EmptyState>
						No recurring issues detected. Great job maintaining quality!
					</EmptyState>
				</IssuesPanel>
			</Container>
		);
	}

	return (
		<Container>
			<Title>🔍 Recurring Issues</Title>
			<IssuesPanel>
				{issues.map((issue, index) => (
					<IssueItem key={index} $severity={issue.severity}>
						<IssueInfo>
							<IssueText>{issue.issue}</IssueText>
							<IssueCategory>{issue.category}</IssueCategory>
						</IssueInfo>
						<IssueStats>
							<Frequency>{issue.frequency} times</Frequency>
							<Badge
								variant={
									issue.severity === 'high'
										? 'error'
										: issue.severity === 'medium'
											? 'warning'
											: 'info'
								}
								size="sm"
							>
								{issue.severity}
							</Badge>
						</IssueStats>
					</IssueItem>
				))}
			</IssuesPanel>
		</Container>
	);
};

export default RecurringIssues;
