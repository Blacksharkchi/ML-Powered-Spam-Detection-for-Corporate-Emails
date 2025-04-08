import { useTheme } from '../../contexts/ThemeContext';

export default function FeatureCard({ icon, title, description }) {
  const { darkMode } = useTheme();

  return (
    <div className={`p-8 rounded-2xl transition-all duration-300 ${
      darkMode 
        ? 'bg-gray-800 hover:bg-gray-700' 
        : 'bg-white hover:bg-gray-50 shadow-lg'
    }`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
        darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'
      }`}>
        {icon}
      </div>
      <h3 className={`mt-6 text-xl font-semibold ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>
        {title}
      </h3>
      <p className={`mt-3 text-lg ${
        darkMode ? 'text-gray-300' : 'text-gray-600'
      }`}>
        {description}
      </p>
    </div>
  );
}