import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { FiCheck, FiZap, FiShield, FiGlobe, FiDatabase } from 'react-icons/fi';

export default function PricingPage() {
  const { darkMode } = useTheme();
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'annual'
  const [hoveredPlan, setHoveredPlan] = useState(null);

  const plans = [
    {
      name: 'Starter',
      price: {
        monthly: '$29',
        annual: '$25'
      },
      description: 'Perfect for small teams getting started with email security',
      features: [
        '1,000 emails/month',
        'Basic threat detection',
        'Email analytics',
        '24-hour support response'
      ],
      cta: 'Get Started',
      popular: false,
      icon: <FiZap />
    },
    {
      name: 'Professional',
      price: {
        monthly: '$99',
        annual: '$85'
      },
      description: 'For growing businesses with advanced security needs',
      features: [
        '10,000 emails/month',
        'Advanced threat detection',
        'Priority email processing',
        'Real-time analytics',
        '4-hour support response'
      ],
      cta: 'Start Free Trial',
      popular: true,
      icon: <FiShield />
    },
    {
      name: 'Enterprise',
      price: {
        monthly: 'Custom',
        annual: 'Custom'
      },
      description: 'For organizations with mission-critical email security needs',
      features: [
        'Unlimited emails',
        'AI-powered threat detection',
        'Dedicated infrastructure',
        'Advanced reporting',
        '24/7 premium support',
        'SLA guarantees'
      ],
      cta: 'Contact Sales',
      popular: false,
      icon: <FiGlobe />
    }
  ];

  const allFeatures = [
    'Monthly email volume',
    'Threat detection',
    'Analytics dashboard',
    'API access',
    'Support response time',
    'SLA guarantees',
    'Dedicated account manager'
  ];

  return (
    <div className={`pt-32 pb-12 min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Flexible Pricing Plans
          </h1>
          <p className={`text-xl max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Choose the perfect plan for your organization's email security needs
          </p>
          
          {/* Billing Toggle */}
          <div className="mt-8 flex items-center justify-center">
            <span className={`mr-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Monthly</span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
                darkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full transition-transform ${
                  darkMode ? 'bg-blue-500' : 'bg-blue-600'
                } ${
                  billingCycle === 'annual' ? 'translate-x-8' : 'translate-x-2'
                }`}
              />
            </button>
            <span className={`ml-4 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Annual <span className={`ml-2 px-2 py-1 rounded-md text-sm ${
                darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'
              }`}>Save 15%</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div 
              key={index}
              onMouseEnter={() => setHoveredPlan(index)}
              onMouseLeave={() => setHoveredPlan(null)}
              className={`relative rounded-xl p-1 transition-all ${
                plan.popular 
                  ? darkMode 
                    ? 'bg-gradient-to-br from-blue-700/30 to-purple-700/30' 
                    : 'bg-gradient-to-br from-blue-400/30 to-purple-400/30'
                  : darkMode 
                    ? 'bg-gray-800/50' 
                    : 'bg-white'
              } ${
                hoveredPlan === index ? 'transform scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className={`absolute top-0 right-0 px-4 py-1 rounded-bl-lg rounded-tr-xl ${
                  darkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
                } text-sm font-medium`}>
                  Most Popular
                </div>
              )}
              <div className={`rounded-xl p-6 h-full ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg mr-4 ${
                    darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {plan.icon}
                  </div>
                  <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                </div>
                <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {plan.description}
                </p>
                <div className="mb-8">
                  <span className={`text-4xl font-bold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {plan.price[billingCycle]}
                  </span>
                  {plan.price[billingCycle] !== 'Custom' && (
                    <span className={`ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      /month
                    </span>
                  )}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <FiCheck className={`flex-shrink-0 mt-1 mr-2 ${
                        darkMode ? 'text-green-400' : 'text-green-600'
                      }`} />
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : darkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className={`rounded-xl p-1 ${
          darkMode ? 'bg-gradient-to-br from-blue-800/30 to-purple-800/30' : 'bg-gradient-to-br from-blue-100/50 to-purple-100/50'
        }`}>
          <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-2xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Plan Comparison
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <th className="pb-4 text-left font-medium">Feature</th>
                    {plans.map((plan, index) => (
                      <th key={index} className="pb-4 text-center font-medium">
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allFeatures.map((feature, rowIndex) => (
                    <tr 
                      key={rowIndex} 
                      className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                    >
                      <td className={`py-4 pr-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {feature}
                      </td>
                      {plans.map((plan, colIndex) => {
                        const hasFeature = plan.features.some(f => 
                          f.toLowerCase().includes(feature.toLowerCase())
                        );
                        return (
                          <td key={colIndex} className="py-4 text-center">
                            {hasFeature ? (
                              <FiCheck className={`inline-block ${
                                darkMode ? 'text-green-400' : 'text-green-600'
                              }`} />
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className={`text-2xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <FAQItem 
              question="Can I switch plans later?" 
              answer="Yes, you can upgrade or downgrade at any time. We'll prorate the difference."
              darkMode={darkMode}
            />
            <FAQItem 
              question="Is there a free trial available?" 
              answer="The Professional plan includes a 14-day free trial. No credit card required."
              darkMode={darkMode}
            />
            <FAQItem 
              question="What payment methods do you accept?" 
              answer="We accept all major credit cards, PayPal, and bank transfers for annual plans."
              darkMode={darkMode}
            />
            <FAQItem 
              question="Do you offer discounts for non-profits?" 
              answer="Yes, we offer 30% discounts for registered non-profit organizations."
              darkMode={darkMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const FAQItem = ({ question, answer, darkMode }) => {
  return (
    <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {question}
      </h3>
      <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
        {answer}
      </p>
    </div>
  );
};