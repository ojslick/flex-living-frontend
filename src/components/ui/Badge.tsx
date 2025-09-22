import React from 'react';
import styled, { css } from 'styled-components';

interface BadgeProps {
	children: React.ReactNode;
	variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
	size?: 'sm' | 'md';
	className?: string;
}

const BadgeContainer = styled.span<BadgeProps>`
	display: inline-flex;
	align-items: center;
	font-weight: ${({ theme }) => theme.fontWeights.medium};
	border-radius: ${({ theme }) => theme.radii.full};
	white-space: nowrap;

	${({ size }) => {
		switch (size) {
			case 'sm':
				return css`
					padding: ${({ theme }) => theme.spacing[1]}
						${({ theme }) => theme.spacing[2]};
					font-size: ${({ theme }) => theme.fontSizes.xs};
				`;
			default:
				return css`
					padding: ${({ theme }) => theme.spacing[1]}
						${({ theme }) => theme.spacing[3]};
					font-size: ${({ theme }) => theme.fontSizes.sm};
				`;
		}
	}}

	${({ variant }) => {
		switch (variant) {
			case 'success':
				return css`
					background: ${({ theme }) => theme.colors.successLight};
					color: ${({ theme }) => theme.colors.success};
				`;
			case 'warning':
				return css`
					background: ${({ theme }) => theme.colors.warningLight};
					color: ${({ theme }) => theme.colors.warning};
				`;
			case 'error':
				return css`
					background: ${({ theme }) => theme.colors.errorLight};
					color: ${({ theme }) => theme.colors.error};
				`;
			case 'info':
				return css`
					background: ${({ theme }) => theme.colors.infoLight};
					color: ${({ theme }) => theme.colors.info};
				`;
			default:
				return css`
					background: ${({ theme }) => theme.colors.bgDark};
					color: ${({ theme }) => theme.colors.textLight};
				`;
		}
	}}
`;

const Badge: React.FC<BadgeProps> = ({
	children,
	variant = 'default',
	size = 'md',
	className,
	...props
}) => {
	return (
		<BadgeContainer
			variant={variant}
			size={size}
			className={className}
			{...props}
		>
			{children}
		</BadgeContainer>
	);
};

export default Badge;
