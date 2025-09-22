import React from 'react';
import styled, { css } from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
	size?: 'sm' | 'md' | 'lg';
	fullWidth?: boolean;
	loading?: boolean;
}

const ButtonBase = styled.button<ButtonProps>`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: ${({ theme }) => theme.spacing[2]};
	border: none;
	border-radius: ${({ theme }) => theme.radii.md};
	font-weight: ${({ theme }) => theme.fontWeights.medium};
	font-family: inherit;
	cursor: pointer;
	transition: all 0.2s ease;
	text-decoration: none;
	position: relative;
	overflow: hidden;

	&:disabled {
		cursor: not-allowed;
		opacity: 0.6;
	}

	${({ fullWidth }) =>
		fullWidth &&
		css`
			width: 100%;
		`}

	${({ size }) => {
		switch (size) {
			case 'sm':
				return css`
					padding: ${({ theme }) => theme.spacing[2]}
						${({ theme }) => theme.spacing[3]};
					font-size: ${({ theme }) => theme.fontSizes.sm};
					min-height: 32px;
				`;
			case 'lg':
				return css`
					padding: ${({ theme }) => theme.spacing[4]}
						${({ theme }) => theme.spacing[6]};
					font-size: ${({ theme }) => theme.fontSizes.lg};
					min-height: 48px;
				`;
			default:
				return css`
					padding: ${({ theme }) => theme.spacing[3]}
						${({ theme }) => theme.spacing[4]};
					font-size: ${({ theme }) => theme.fontSizes.base};
					min-height: 40px;
				`;
		}
	}}

  ${({ variant }) => {
		switch (variant) {
			case 'secondary':
				return css`
					background: ${({ theme }) => theme.colors.surfaceDark};
					color: ${({ theme }) => theme.colors.text};

					&:hover:not(:disabled) {
						background: ${({ theme }) => theme.colors.borderDark};
					}
				`;
			case 'outline':
				return css`
					background: transparent;
					color: ${({ theme }) => theme.colors.primary};
					border: 1px solid ${({ theme }) => theme.colors.border};

					&:hover:not(:disabled) {
						background: ${({ theme }) => theme.colors.bgLight};
						border-color: ${({ theme }) => theme.colors.primary};
					}
				`;
			case 'ghost':
				return css`
					background: transparent;
					color: ${({ theme }) => theme.colors.textLight};

					&:hover:not(:disabled) {
						background: ${({ theme }) => theme.colors.bgLight};
						color: ${({ theme }) => theme.colors.text};
					}
				`;
			default:
				return css`
					background: ${({ theme }) => theme.colors.primary};
					color: white;

					&:hover:not(:disabled) {
						background: ${({ theme }) => theme.colors.primaryDark};
					}
				`;
		}
	}}

  ${({ loading }) =>
		loading &&
		css`
			&::after {
				content: '';
				position: absolute;
				width: 16px;
				height: 16px;
				border: 2px solid transparent;
				border-top: 2px solid currentColor;
				border-radius: 50%;
				animation: spin 1s linear infinite;
			}

			@keyframes spin {
				0% {
					transform: rotate(0deg);
				}
				100% {
					transform: rotate(360deg);
				}
			}
		`}
`;

const Button: React.FC<ButtonProps> = ({
	children,
	loading,
	disabled,
	...props
}) => {
	return (
		<ButtonBase disabled={disabled || loading} loading={loading} {...props}>
			{!loading && children}
		</ButtonBase>
	);
};

export default Button;
