import { useTheme } from '../../contexts/ThemeContext';

export const Loader = ({ size = 'md' }) => {
  const { darkMode } = useTheme();
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`animate-spin rounded-full border-2 ${
      darkMode ? 'border-gray-600' : 'border-gray-300'
    } border-t-blue-500 ${sizes[size]}`} />
  );
};