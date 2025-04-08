import { useTheme } from '../../contexts/ThemeContext';
import HeroSection from './HeroSection';
import FeaturesGrid from './FeaturesGrid';
import TestimonialsSection from './TestimonialsSection';

export default function HomePage() {
  const { darkMode } = useTheme();

  return (
    <div className={`pt-24 pb-12 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HeroSection />
        <FeaturesGrid />
        <TestimonialsSection />
      </div>
    </div>
  );
}