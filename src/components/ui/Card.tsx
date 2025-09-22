import React from 'react';
import styled, { css } from 'styled-components';

interface CardProps {
	children: React.ReactNode;
	padding?: 'sm' | 'md' | 'lg';
	shadow?: 'sm' | 'md' | 'lg' | 'none';
	hover?: boolean;
	className?: string;
}

const CardContainer = styled.div<CardProps>`
	background: ${({ theme }) => theme.colors.surface};
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: ${({ theme }) => theme.radii.lg};
	overflow: hidden;
	transition: all 0.2s ease;

	${({ padding }) => {
		switch (padding) {
			case 'sm':
				return css`
					padding: ${({ theme }) => theme.spacing[3]};
				`;
			case 'lg':
				return css`
					padding: ${({ theme }) => theme.spacing[6]};
				`;
			default:
				return css`
					padding: ${({ theme }) => theme.spacing[4]};
				`;
		}
	}}

	${({ shadow }) => {
		switch (shadow) {
			case 'sm':
				return css`
					box-shadow: ${({ theme }) => theme.shadows.sm};
				`;
			case 'md':
				return css`
					box-shadow: ${({ theme }) => theme.shadows.md};
				`;
			case 'lg':
				return css`
					box-shadow: ${({ theme }) => theme.shadows.lg};
				`;
			default:
				return css`
					box-shadow: none;
				`;
		}
	}}

  ${({ hover }) =>
		hover &&
		css`
			&:hover {
				box-shadow: ${({ theme }) => theme.shadows.md};
				transform: translateY(-2px);
			}
		`}
`;

const Card: React.FC<CardProps> = ({
	children,
	padding = 'md',
	shadow = 'sm',
	hover = false,
	className,
	...props
}) => {
	return (
		<CardContainer
			padding={padding}
			shadow={shadow}
			hover={hover}
			className={className}
			{...props}
		>
			{children}
		</CardContainer>
	);
};

export default Card;
