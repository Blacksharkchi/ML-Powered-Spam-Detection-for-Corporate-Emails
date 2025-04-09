import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import CtaButton from '../../components/ui/CtaButton';
import { FiArrowRight, FiBookOpen } from 'react-icons/fi';

export default function HeroSection() {
  const { darkMode } = useTheme();

  return (
    <section className="relative py-20 md:py-32">
      <div className="relative max-w-7xl mx-auto text-center">
        <div className="mb-8">
          <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
            darkMode 
              ? 'bg-blue-900/30 text-blue-400' 
              : 'bg-blue-100 text-blue-600'
          }`}>
            AI-Powered Threat Detection
          </span>
        </div>
        
        <h1 className={`text-4xl md:text-6xl font-bold leading-tight mb-6 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Secure Your Organization's<br className="hidden lg:block" />
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Email Communications
          </span>
        </h1>

        <p className={`text-xl md:text-2xl mb-12 max-w-3xl mx-auto ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Enterprise-grade spam detection powered by machine learning with real-time 
          threat analytics and comprehensive reporting.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/detect">
            <CtaButton variant="primary">
              Start Analyzing
              <FiArrowRight className="ml-3 h-5 w-5" />
            </CtaButton>
          </Link>
          
          <Link to="/docs">
            <CtaButton variant="secondary">
              View Documentation
              <FiBookOpen className="ml-3 h-5 w-5" />
            </CtaButton>
          </Link>
        </div>

        {/* Decorative elements */}
        <div className={`absolute top-24 -left-48 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl opacity-50 ${
          darkMode ? 'mix-blend-screen' : ''
        }`}></div>
        <div className={`absolute top-0 -right-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-50 ${
          darkMode ? 'mix-blend-screen' : ''
        }`}></div>
      </div>
    </section>
  );
}