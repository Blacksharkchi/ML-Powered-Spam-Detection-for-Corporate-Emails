import { useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export default function ConfidenceMeter({ spamProbability, isSpam }) {
  const { darkMode } = useTheme();
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const target = spamProbability * 100;
    const increment = target / 50;
    
    const animate = () => {
      setAnimatedProgress(prev => {
        if (prev >= target) return target;
        return prev + increment;
      });
    };

    const interval = setInterval(animate, 10);
    return () => clearInterval(interval);
  }, [spamProbability]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm font-medium">
        <span className={isSpam ? 'text-red-500' : 'text-green-500'}>
          SPAM {(animatedProgress).toFixed(1)}%
        </span>
        <span className={!isSpam ? 'text-green-500' : 'text-red-500'}>
          HAM {(100 - animatedProgress).toFixed(1)}%
        </span>
      </div>
      
      <div className={`h-3 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
        <div 
          className="h-full transition-all duration-1000 ease-out" 
          style={{
            width: `${animatedProgress}%`,
            background: `linear-gradient(90deg, 
              ${isSpam ? '#ef4444' : '#22c55e'} 0%, 
              ${isSpam ? '#dc2626' : '#16a34a'} 100%)`
          }}
        />
      </div>
    </div>
  );
}