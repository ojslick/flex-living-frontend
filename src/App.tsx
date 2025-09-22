import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyle } from './styles/global';
import Dashboard from './pages/Dashboard';
import PropertyDetail from './pages/PropertyDetail';
import Layout from './components/ui/Layout';

function App() {
	return (
		<ThemeProvider theme={theme}>
			<GlobalStyle />
			<Router>
				<Layout>
					<Routes>
						<Route path="/" element={<Navigate to="/dashboard" replace />} />
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/property/:listingId" element={<PropertyDetail />} />
						<Route path="*" element={<Navigate to="/dashboard" replace />} />
					</Routes>
				</Layout>
			</Router>
		</ThemeProvider>
	);
}

export default App;
