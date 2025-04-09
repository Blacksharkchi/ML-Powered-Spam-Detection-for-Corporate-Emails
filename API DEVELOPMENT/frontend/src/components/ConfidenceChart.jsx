import { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Chart } from 'chart.js/auto';

export default function ConfidenceChart({ spamProbability, history }) {
  const { darkMode } = useTheme();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      renderChart();
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [spamProbability, history, darkMode]);

  const renderChart = () => {
    const ctx = chartRef.current.getContext('2d');
    const textColor = darkMode ? '#fff' : '#000';

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Spam Confidence', 'Ham Confidence'],
        datasets: [{
          data: [spamProbability * 100, 100 - spamProbability * 100],
          backgroundColor: [
            'rgba(239, 68, 68, 0.8)',
            'rgba(34, 197, 94, 0.8)'
          ],
          borderColor: darkMode 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(0, 0, 0, 0.1)',
          borderWidth: 2,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: textColor,
              font: {
                size: 14
              }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed || 0;
                return `${label}: ${value.toFixed(1)}%`;
              }
            }
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true
        }
      }
    });
  };

  return (
    <div className={`rounded-xl p-1 ${darkMode ? 'bg-gradient-to-br from-blue-800/30 to-purple-800/30' : 'bg-gradient-to-br from-blue-100/50 to-purple-100/50'}`}>
      <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
          Confidence Distribution
        </h3>
        <div className="relative h-64">
          <canvas ref={chartRef} />
        </div>
        <div className={`mt-4 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Based on {history.length} recent analyses
        </div>
      </div>
    </div>
  );
}