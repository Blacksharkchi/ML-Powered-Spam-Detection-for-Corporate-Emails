import { useTheme } from '../../contexts/ThemeContext';
import { FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import ConfidenceMeter from './ConfidenceMeter';

export default function ResultsDisplay({ result }) {
  const { darkMode } = useTheme();

  if (!result) return null;

  return (
    <div className={`rounded-xl p-1 ${darkMode ? 'bg-gradient-to-br from-blue-800/30 to-purple-800/30' : 'bg-gradient-to-br from-blue-100/50 to-purple-100/50'}`}>
      <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className={`flex items-center mb-6 p-4 rounded-lg ${
          result.is_spam 
            ? 'bg-red-500/20 text-red-600' 
            : 'bg-green-500/20 text-green-600'
        }`}>
          {result.is_spam ? (
            <FiAlertTriangle className="w-6 h-6 mr-3" />
          ) : (
            <FiCheckCircle className="w-6 h-6 mr-3" />
          )}
          <h3 className="text-xl font-semibold">
            Classification: {result.classification.toUpperCase()}
          </h3>
        </div>

        <ConfidenceMeter 
          spamProbability={result.spam_probability}
          isSpam={result.is_spam}
        />

        <div className="mt-6">
          <h4 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
            Key Indicators
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.reasons?.map((reason, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg flex items-center ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              >
                <span className={`mr-3 ${result.is_spam ? 'text-red-500' : 'text-green-500'}`}>
                  {reason.score > 0.7 ? '⚠️' : 'ℹ️'}
                </span>
                <div>
                  <p className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                    {reason.feature}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Confidence: {(reason.score * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}