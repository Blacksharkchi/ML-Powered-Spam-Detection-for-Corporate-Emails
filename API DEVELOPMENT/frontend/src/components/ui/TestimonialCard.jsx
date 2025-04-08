import { useTheme } from '../../contexts/ThemeContext';
import { FiStar } from 'react-icons/fi';

export default function TestimonialCard({ name, role, company, text, index }) {
  const { darkMode } = useTheme();

  return (
    <div className={`relative p-8 rounded-2xl transition-all duration-300 ${
      darkMode 
        ? 'bg-gray-800 hover:bg-gray-750' 
        : 'bg-white hover:bg-gray-50 shadow-lg'
    }`}>
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${
        index % 2 === 0 
          ? 'from-blue-500 to-purple-500' 
          : 'from-purple-500 to-pink-500'
      } opacity-5 -z-10`}></div>

      <div className="flex items-start mb-6">
        <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center ${
          darkMode ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <span className={`text-xl font-bold ${
            darkMode ? 'text-blue-400' : 'text-blue-600'
          }`}>
            {name.charAt(0)}
          </span>
        </div>
        
        <div className="ml-4">
          <h3 className={`text-lg font-semibold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {name}
          </h3>
          <p className={`text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {role} <span className="mx-1">·</span> {company}
          </p>
        </div>
      </div>

      <p className={`text-lg ${
        darkMode ? 'text-gray-300' : 'text-gray-600'
      }`}>
        {text}
      </p>

      <div className="mt-6 flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <FiStar 
            key={i}
            className={`w-5 h-5 ${
              darkMode ? 'text-yellow-400' : 'text-yellow-500'
            }`}
          />
        ))}
      </div>
    </div>
  );
}