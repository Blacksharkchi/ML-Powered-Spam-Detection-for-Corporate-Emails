import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/Home/HomePage';
import DetectionPage from './pages/DetectionPage';
import AnalyticsPage from './pages/AnalyticsPage';
import DocumentationPage from './pages/DocumentationPage';

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/detect" element={<DetectionPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/docs" element={<DocumentationPage />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}
