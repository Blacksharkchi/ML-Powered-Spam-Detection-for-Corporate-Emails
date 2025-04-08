import { useTheme } from '../../contexts/ThemeContext';
import FeatureCard from '../../components/ui/FeatureCard';
import { FiActivity, FiMail, FiShield, FiDatabase, FiLock, FiBarChart } from 'react-icons/fi';

const features = [
  {
    icon: <FiActivity className="w-6 h-6" />,
    title: "Real-time Analysis",
    description: "Instant email scanning with sub-second response times powered by optimized ML models"
  },
  {
    icon: <FiShield className="w-6 h-6" />,
    title: "Advanced Protection",
    description: "Multi-layered detection system combining NLP and pattern recognition"
  },
  {
    icon: <FiDatabase className="w-6 h-6" />,
    title: "Historical Insights",
    description: "Comprehensive audit logs and historical analysis of all processed emails"
  },
  {
    icon: <FiLock className="w-6 h-6" />,
    title: "End-to-End Encryption",
    description: "Military-grade AES-256 encryption for all data processing and storage"
  },
  {
    icon: <FiMail className="w-6 h-6" />,
    title: "Bulk Processing",
    description: "API support for batch processing of thousands of emails simultaneously"
  },
  {
    icon: <FiBarChart className="w-6 h-6" />,
    title: "Custom Analytics",
    description: "Exportable reports and customizable dashboards for team insights"
  }
];

export default function FeaturesGrid() {
  const { darkMode } = useTheme();

  return (
    <section className="py-16">
      <div className="text-center mb-16">
        <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Enterprise-Grade Security Features
        </h2>
        <p className={`text-lg md:text-xl max-w-2xl mx-auto ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Comprehensive solution combining cutting-edge AI with robust security protocols
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>

      {/* Security badges */}
      <div className={`mt-16 pt-8 border-t ${
        darkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex flex-wrap justify-center gap-8 opacity-75">
          <div className="flex items-center gap-3">
            <FiLock className={`w-6 h-6 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              SOC 2 Type II Compliant
            </span>
          </div>
          <div className="flex items-center gap-3">
            <FiShield className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              GDPR Ready
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}