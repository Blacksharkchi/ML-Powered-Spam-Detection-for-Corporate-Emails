import { useTheme } from '../../contexts/ThemeContext';

export default function CtaButton({ children, variant = 'primary' }) {
  const { darkMode } = useTheme();

  const baseStyles = 'inline-flex items-center justify-center px-8 py-4 text-lg font-semibold transition-all rounded-lg';

  const variants = {
    primary: darkMode 
      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20' 
      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30',
    
    secondary: darkMode
      ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-600' 
      : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-sm'
  };

  return (
    <button className={`${baseStyles} ${variants[variant]}`}>
      {children}
    </button>
  );
}