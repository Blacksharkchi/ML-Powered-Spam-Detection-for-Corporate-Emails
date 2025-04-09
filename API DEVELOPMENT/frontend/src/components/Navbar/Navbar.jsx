import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import NavLink from './NavLink';
import ThemeToggle from '../ThemeToggle.jsx';

export default function Navbar() {
  const { darkMode } = useTheme();

  return (
    <nav className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg fixed w-full z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex-shrink-0 flex items-center">
            <img 
              src="/university-logo.png" 
              alt="University Logo" 
              className="h-12 w-auto"
            />
            <div className="ml-4 hidden md:block">
              <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Zetech University
              </h1>
              <p className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                Security Systems
              </p>
            </div>
          </Link>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <NavLink to="/" text="Home" />
              <NavLink to="/detect" text="Detection" />
              <NavLink to="/analytics" text="Analytics" />
              <NavLink to="/docs" text="Documentation" />
              <NavLink to="/pricing" text="Pricing" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}