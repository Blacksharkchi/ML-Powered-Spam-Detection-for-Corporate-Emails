import { useState, useCallback } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { FiUpload, FiAlertCircle } from 'react-icons/fi';

export default function EmailInput({ 
    onAnalyze, 
    isLoading, 
    emailText, 
    setEmailText
  }) {
  const { darkMode } = useTheme();
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = useCallback((file) => {
    if (!['text/plain', 'message/rfc822'].includes(file.type)) {
      setError('Only .txt and .eml files are supported');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setEmailText(e.target.result);
      setError('');
    };
    reader.readAsText(file);
  }, []);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, [handleFileUpload]);

  return (
    <div className={`rounded-xl p-1 transition-all ${darkMode ? 'bg-gradient-to-br from-blue-800/30 to-purple-800/30' : 'bg-gradient-to-br from-blue-100/50 to-purple-100/50'}`}>
      <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all 
            ${dragActive ? 'border-blue-500 bg-blue-500/10' : darkMode ? 'border-gray-600' : 'border-gray-300'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <FiUpload className={`mx-auto mb-4 h-8 w-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          <p className={`mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Drag & drop email file or{' '}
            <label className="cursor-pointer text-blue-500 hover:text-blue-600">
              browse files
              <input
                type="file"
                className="hidden"
                accept=".txt,.eml"
                onChange={(e) => handleFileUpload(e.target.files[0])}
              />
            </label>
          </p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Supports .txt and .eml files
          </p>
        </div>

        <div className="mt-6">
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Or paste email content directly:
          </label>
          <textarea
            value={emailText}
            onChange={(e) => {
                setEmailText(e.target.value);
                setError('');
            }}
            className={`w-full min-h-[200px] p-4 rounded-lg resize-none transition-all ${
              darkMode 
                ? 'bg-gray-700 text-gray-100 focus:ring-blue-500' 
                : 'bg-gray-50 text-gray-900 focus:ring-blue-500'
            } focus:ring-2 focus:border-transparent`}
            placeholder="Paste email content here..."
          />
        </div>

        {error && (
          <div className="mt-4 flex items-center text-red-500">
            <FiAlertCircle className="mr-2" />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={() => onAnalyze(emailText)}
          disabled={isLoading || !emailText.trim()}
          className={`w-full mt-6 py-4 px-6 rounded-lg font-semibold transition-all flex items-center justify-center ${
            isLoading || !emailText.trim()
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isLoading ? 'Analyzing...' : 'Analyze Email Content'}
        </button>
      </div>
    </div>
  );
}