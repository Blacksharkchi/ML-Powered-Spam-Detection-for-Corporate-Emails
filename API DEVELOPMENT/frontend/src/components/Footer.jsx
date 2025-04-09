import { useTheme } from '../contexts/ThemeContext';
import { Link } from 'react-router-dom';
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiTwitter, 
  FiLinkedin, 
  FiGithub 
} from 'react-icons/fi';
import logoUrl from '/university-logo.png';

export default function Footer() {
  const { darkMode } = useTheme();

  return (
    <footer className={`${darkMode ? 'bg-gray-800' : 'bg-gray-100'} mt-auto`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Branding Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <img 
                src={logoUrl} 
                alt="University Logo" 
                className="h-12 w-auto"
              />
              <span className={`ml-3 text-xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Zetech Security
              </span>
            </Link>
            <p className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Empowering organizations with AI-driven email security solutions
            </p>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Product
            </h3>
            <ul className="space-y-2">
              <FooterLink to="/detect" text="Detection" />
              <FooterLink to="/analytics" text="Analytics" />
              <FooterLink to="/docs" text="Documentation" />
              <FooterLink to="/pricing" text="Pricing" />
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Company
            </h3>
            <ul className="space-y-2">
              <FooterLink to="/about" text="About" />
              <FooterLink to="/blog" text="Blog" />
              <FooterLink to="/careers" text="Careers" />
              <FooterLink to="/partners" text="Partners" />
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Contact
            </h3>
            <div className={`space-y-3 text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <div className="flex items-center space-x-2">
                <FiMail className="flex-shrink-0" />
                <span>security@zetech.ac.ke</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiPhone className="flex-shrink-0" />
                <span>+254 700 000 000</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiMapPin className="flex-shrink-0" />
                <span>Nairobi, Kenya</span>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="pt-4 flex space-x-4">
              <SocialIcon 
                icon={<FiTwitter />} 
                href="https://twitter.com" 
                darkMode={darkMode} 
              />
              <SocialIcon 
                icon={<FiLinkedin />} 
                href="https://linkedin.com" 
                darkMode={darkMode} 
              />
              <SocialIcon 
                icon={<FiGithub />} 
                href="https://github.com" 
                darkMode={darkMode} 
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`pt-8 mt-8 border-t ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              © {new Date().getFullYear()} Zetech University. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <FooterLink to="/privacy" text="Privacy Policy" small />
              <FooterLink to="/terms" text="Terms of Service" small />
              <FooterLink to="/cookies" text="Cookies" small />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Helper Components
const FooterLink = ({ to, text, small = false }) => {
  const { darkMode } = useTheme();
  
  return (
    <li>
      <Link
        to={to}
        className={`hover:text-blue-500 transition-colors ${
          small ? 'text-sm' : 'text-base'
        } ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}
      >
        {text}
      </Link>
    </li>
  );
};

const SocialIcon = ({ icon, href, darkMode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`p-2 rounded-lg transition-all ${
      darkMode 
        ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
    }`}
  >
    {icon}
  </a>
);