import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const LayoutContainer = styled.div`
	min-height: 100vh;
	display: flex;
	flex-direction: column;
`;

const Header = styled.header<{ $isScrolled: boolean }>`
	background: ${({ $isScrolled }) => ($isScrolled ? '#284E4C' : '#FFFDF6')};
	padding: 1.5rem 0;
	position: sticky;
	top: 0;
	z-index: 1100;
	transition: all 0.3s ease;
`;

const HeaderContent = styled.div`
	max-width: 1300px;
	margin: 0 auto;
	padding: 0 1.5rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

const Logo = styled(Link)<{ $isScrolled: boolean }>`
	font-size: 1.5rem;
	font-weight: 700;
	color: ${({ $isScrolled }) => ($isScrolled ? '#FFFFFF' : '#284E4C')};
	text-decoration: none;
	transition: color 0.3s ease;

	&:hover {
		color: ${({ $isScrolled }) => ($isScrolled ? '#FFF9E9' : '#00b4a6')};
	}
`;

const Nav = styled.nav`
	display: flex;
	gap: 1.5rem;
`;

const Main = styled.main`
	flex: 1;
	padding: 1.5rem 0;
	background-color: #fffdf6;
`;

const MainContent = styled.div`
	max-width: 1300px;
	margin: 0 auto;
	padding: 0 1.5rem;
	width: 100%;
`;

interface LayoutProps {
	children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const scrollTop = window.scrollY;
			setIsScrolled(scrollTop > 50); // Change color after scrolling 50px
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<LayoutContainer>
			<Header $isScrolled={isScrolled}>
				<HeaderContent>
					<Logo to="/" $isScrolled={isScrolled}>
						Flex Living
					</Logo>
					<Nav>{/* Navigation links removed */}</Nav>
				</HeaderContent>
			</Header>
			<Main>
				<MainContent>{children}</MainContent>
			</Main>
		</LayoutContainer>
	);
};

export default Layout;
