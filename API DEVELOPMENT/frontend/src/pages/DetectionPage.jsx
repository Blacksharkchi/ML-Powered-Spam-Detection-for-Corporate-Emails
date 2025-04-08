import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';
import EmailInput from '../components/detection/EmailInput';
import ResultsDisplay from '../components/detection/ResultsDisplay';
import HistoryTable from '../components/detection/HistoryTable';
import ConfidenceChart from '../components/ConfidenceChart';

const API_URL = "https://ml-powered-spam-detection-for-corporate.onrender.com";

export default function DetectionPage() {
  const { darkMode } = useTheme();
  const [emailText, setEmailText] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Email Threat Detection | Zetech Security";
    const savedHistory = JSON.parse(localStorage.getItem("classificationHistory")) || [];
    setHistory(savedHistory);
  }, []);

  const classifyEmail = async (text) => {
    if (!text.trim()) {
      setError("Please enter email content to analyze");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post(`${API_URL}/classify_email`, {
        email_text: text
      });

      const newResult = { 
        ...data, 
        timestamp: new Date(),
        email_text: text // Store the analyzed text
      };
      
      const newHistory = [newResult, ...history.slice(0, 9)];
      
      setResult(newResult);
      setHistory(newHistory);
      localStorage.setItem("classificationHistory", JSON.stringify(newHistory));
    } catch (err) {
      setError(err.response?.data?.error || "Classification failed. Please try again.");
      console.error("Classification error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleHistorySelect = (entry) => {
    setEmailText(entry.email_text);
    setResult(entry);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`pt-32 pb-12 min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="space-y-8">
            <EmailInput 
              onAnalyze={classifyEmail} 
              isLoading={loading}
              emailText={emailText}
              setEmailText={setEmailText}
              error={error}
            />
            <ResultsDisplay result={result} />
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
            <ConfidenceChart 
              spamProbability={result?.spam_probability || 0} 
              history={history} 
            />
            <HistoryTable 
              history={history} 
              onSelect={handleHistorySelect} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}