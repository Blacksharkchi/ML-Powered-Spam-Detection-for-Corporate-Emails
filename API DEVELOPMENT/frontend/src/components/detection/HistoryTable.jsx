import { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { FiFileText, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { Chart } from 'chart.js/auto';

export default function HistoryTable({ history, onSelect }) {
  const { darkMode } = useTheme();
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    if (history.length > 0) {
      renderChart();
    }
  }, [history, darkMode]);

  const renderChart = () => {
    const ctx = document.getElementById('historyChart');
    if (chartInstance) chartInstance.destroy();

    const labels = history.map(entry => 
      new Date(entry.timestamp).toLocaleDateString()
    );

    const newChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Spam Confidence',
          data: history.map(entry => entry.spam_probability * 100),
          borderColor: '#ef4444',
          backgroundColor: '#ef444433',
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: (items) => new Date(items[0].raw.x).toLocaleString(),
              label: (item) => `${item.dataset.label}: ${item.raw.y.toFixed(1)}%`
            }
          }
        },
        scales: {
          y: {
            grid: { color: darkMode ? '#374151' : '#e5e7eb' },
            ticks: { color: darkMode ? '#9ca3af' : '#6b7280' }
          },
          x: {
            grid: { display: false },
            ticks: { color: darkMode ? '#9ca3af' : '#6b7280' }
          }
        }
      }
    });

    setChartInstance(newChart);
  };

  const sortedHistory = [...history].sort((a, b) => {
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
  });

  const requestSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  return (
    <div className={`rounded-xl p-1 ${darkMode ? 'bg-gradient-to-br from-blue-800/30 to-purple-800/30' : 'bg-gradient-to-br from-blue-100/50 to-purple-100/50'}`}>
      <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
            Analysis History
          </h3>
          <div className="h-48 w-full">
            <canvas id="historyChart" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`text-left border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                {['Date', 'Classification', 'Spam %', 'Ham %'].map((header, index) => (
                  <th 
                    key={index}
                    className="pb-3 pr-4 font-medium cursor-pointer"
                    onClick={() => requestSort(header.toLowerCase().replace(' %', ''))}
                  >
                    <div className="flex items-center">
                      {header}
                      {sortConfig.key === header.toLowerCase().replace(' %', '') && (
                        sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedHistory.map((entry, index) => (
                <tr 
                  key={index}
                  className={`cursor-pointer hover:${
                    darkMode ? 'bg-gray-700' : 'bg-gray-50'
                  } transition-colors`}
                  onClick={() => onSelect(entry)}
                >
                  <td className={`py-3 pr-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {new Date(entry.timestamp).toLocaleString()}
                  </td>
                  <td className="pr-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                      entry.is_spam
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {entry.classification.toUpperCase()}
                    </span>
                  </td>
                  <td className={`pr-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                    {(entry.spam_probability * 100).toFixed(1)}%
                  </td>
                  <td className={darkMode ? 'text-green-400' : 'text-green-600'}>
                    {100 - (entry.spam_probability * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}