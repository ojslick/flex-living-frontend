import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme as appTheme } from '../styles/theme';

export const TestThemeProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	return <ThemeProvider theme={appTheme}>{children}</ThemeProvider>;
};
