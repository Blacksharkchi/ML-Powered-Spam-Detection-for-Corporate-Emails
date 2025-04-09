import { NavLink as RouterNavLink } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

export default function NavLink({ to, text }) {
  const { darkMode } = useTheme();
  
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) => 
        `px-3 py-2 rounded-md text-sm font-medium transition-colors
        ${isActive 
          ? darkMode 
            ? 'bg-gray-900 text-white' 
            : 'bg-gray-100 text-gray-900'
          : darkMode 
            ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`
      }
    >
      {text}
    </RouterNavLink>
  );
}