import React, { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { FiAlertTriangle, FiCheckCircle, FiTrendingUp } from 'react-icons/fi';
import { Chart } from 'chart.js/auto';
// import ThreatOriginMap from '../../components/ThreatOriginMap';

export default function AnalyticsPage() {
  const { darkMode } = useTheme();
  const [history] = useState(() => {
    return JSON.parse(localStorage.getItem("classificationHistory")) || []
  });

  useEffect(() => {
    renderCharts();
  }, [darkMode]);

  const renderCharts = () => {
    renderTimeSeriesChart();
    renderProbabilityDistributionChart();
    renderFeatureRadarChart();
  };

  const renderTimeSeriesChart = () => {
    const ctx = document.getElementById('timeSeriesChart');
    const existing = Chart.getChart(ctx);
    if (existing) existing.destroy();

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: history.map(entry => 
          new Date(entry.timestamp).toLocaleDateString()
        ),
        datasets: [{
          label: 'Spam Probability',
          data: history.map(entry => entry.spam_probability * 100),
          borderColor: '#ef4444',
          backgroundColor: '#ef444433',
          tension: 0.4,
          pointRadius: 4
        }]
      },
      options: chartOptions('Spam Confidence Over Time', '%')
    });
  };

  const renderProbabilityDistributionChart = () => {
    const ctx = document.getElementById('probabilityChart');
    const existing = Chart.getChart(ctx);
    if (existing) existing.destroy();

    const spamCount = history.filter(e => e.is_spam).length;
    const hamCount = history.length - spamCount;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Spam', 'Ham'],
        datasets: [{
          label: 'Classifications',
          data: [spamCount, hamCount],
          backgroundColor: ['#ef4444dd', '#22c55edd']
        }]
      },
      options: chartOptions('Classification Distribution', 'Emails')
    });
  };

  const renderFeatureRadarChart = () => {
    const ctx = document.getElementById('radarChart');
    const existing = Chart.getChart(ctx);
    if (existing) existing.destroy();

    // Aggregate feature importance from history
    const features = history.reduce((acc, entry) => {
      entry.reasons?.forEach(({ feature, score }) => {
        acc[feature] = (acc[feature] || 0) + score;
      });
      return acc;
    }, {});

    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: Object.keys(features),
        datasets: [{
          label: 'Feature Impact',
          data: Object.values(features),
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderColor: '#3b82f6'
        }]
      },
      options: chartOptions('Feature Impact Analysis', 'Score')
    });
  };

  const chartOptions = (title, unit) => ({
    responsive: true,
    plugins: {
      legend: { 
        labels: { color: darkMode ? '#fff' : '#000' } 
      },
      title: { 
        display: true, 
        text: title,
        color: darkMode ? '#fff' : '#000',
        font: { size: 16 }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y ?? context.parsed;
            return `${label}: ${value}${unit ? ' ' + unit : ''}`;
          }
        }
      }
    },
    scales: darkMode ? {
      r: { 
        grid: { color: '#374151' }, 
        ticks: { color: '#9ca3af' } 
      },
      x: { 
        grid: { color: '#374151' }, 
        ticks: { color: '#9ca3af' } 
      },
      y: { 
        grid: { color: '#374151' }, 
        ticks: { color: '#9ca3af' } 
      }
    } : {}
  });
  

  return (
    <div className={`pt-32 pb-12 min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <StatCard 
            title="Total Analyses" 
            value={history.length} 
            icon={<FiTrendingUp />}
            trend={history.length > 0 ? 
              ((history.length / 30) * 100).toFixed(1) : 0} // 30-day assumption
          />
          <StatCard 
            title="Spam Detected" 
            value={history.filter(e => e.is_spam).length}
            icon={<FiAlertTriangle />}
            color="red"
          />
          <StatCard 
            title="Legitimate Emails" 
            value={history.filter(e => !e.is_spam).length}
            icon={<FiCheckCircle />}
            color="green"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <ChartCard title="Spam Confidence Over Time">
            <canvas id="timeSeriesChart" />
          </ChartCard>
          
          <ChartCard title="Classification Distribution">
            <canvas id="probabilityChart" />
          </ChartCard>

          <ChartCard title="Feature Impact Analysis">
            <canvas id="radarChart" />
          </ChartCard>

          <ThreatOriginMap />
        </div>
      </div>
    </div>
  );
}

const ChartCard = ({ title, children }) => {
  const { darkMode } = useTheme();
  
  return (
    <div className={`rounded-xl p-1 ${darkMode ? 'bg-gradient-to-br from-blue-800/30 to-purple-800/30' : 'bg-gradient-to-br from-blue-100/50 to-purple-100/50'}`}>
      <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
          {title}
        </h3>
        <div className="relative h-80">
          {children}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color = 'blue', trend }) => {
  const { darkMode } = useTheme();
  const colors = {
    red: { bg: 'bg-red-500/20', text: 'text-red-600' },
    green: { bg: 'bg-green-500/20', text: 'text-green-600' },
    blue: { bg: 'bg-blue-500/20', text: 'text-blue-600' }
  };

  return (
    <div className={`rounded-xl p-1 ${darkMode ? 'bg-gradient-to-br from-blue-800/30 to-purple-800/30' : 'bg-gradient-to-br from-blue-100/50 to-purple-100/50'}`}>
      <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center">
          <div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
            <p className={`text-3xl font-bold mt-2 ${colors[color].text}`}>{value}</p>
          </div>
          <div className={`p-4 rounded-full ${colors[color].bg}`}>
            {React.cloneElement(icon, { className: `w-6 h-6 ${colors[color].text}` })}
          </div>
        </div>
        {trend && (
          <div className="mt-4 flex items-center text-sm">
            <span className={`mr-2 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              vs previous period
            </span>
          </div>
        )}
      </div>
      {/* <ThreatOriginMap /> */}
    </div>
  );
};

