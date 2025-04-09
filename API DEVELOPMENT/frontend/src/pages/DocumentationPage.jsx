import { useTheme } from '../contexts/ThemeContext';
import { FiCode, FiBookOpen, FiTerminal, FiInfo } from 'react-icons/fi';
import React from 'react'

const API_URL = "https://ml-powered-spam-detection-for-corporate.onrender.com";

export default function DocumentationPage() {
  const { darkMode } = useTheme();
  
  const sections = [
    {
      title: "API Reference",
      icon: <FiCode />,
      content: (
        <div className="space-y-6">
          <APISection 
            method="POST" 
            endpoint="/classify_email"
            description="Analyze email content for spam"
            sampleRequest={{
              email_text: "Sample email content..."
            }}
            sampleResponse={{
              classification: "spam",
              is_spam: true,
              spam_probability: 0.97,
              reasons: [
                { feature: "suspicious_links", score: 0.92 },
                { feature: "urgent_language", score: 0.85 }
              ]
            }}
          />
        </div>
      )
    },
    {
      title: "Getting Started",
      icon: <FiBookOpen />,
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold mb-4">Integration Guide</h3>
          <StepSection
            steps={[
              "Obtain API credentials from your dashboard",
              "Install the SDK or use direct API calls",
              "Implement email processing in your workflow",
              "Monitor analytics through our dashboard"
            ]}
          />
        </div>
      )
    },
    {
      title: "Code Samples",
      icon: <FiTerminal />,
      content: (
        <div className="grid md:grid-cols-2 gap-6">
          <CodeSample 
            language="python"
            code={`import requests\n\nresponse = requests.post(\n    '${API_URL}/classify_email',\n    json={'email_text': email_content}\n)`}
          />
          <CodeSample 
            language="javascript"
            code={`fetch('${API_URL}/classify_email', {\n  method: 'POST',\n  body: JSON.stringify({ email_text: emailContent })\n})`}
          />
        </div>
      )
    },
    {
      title: "FAQs",
      icon: <FiInfo />,
      content: (
        <div className="space-y-4">
          <FAQItem
            question="How is data secured?"
            answer="All communications are encrypted with TLS 1.3. Data is processed in memory and never stored permanently."
          />
          <FAQItem
            question="Rate limits?"
            answer="Free tier: 100 requests/day. Enterprise tiers available."
          />
        </div>
      )
    }
  ];

  return (
    <div className={`pt-32 pb-12 min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className={`text-4xl font-bold mb-12 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Developer Documentation
        </h1>
        
        <div className="space-y-12">
          {sections.map((section, index) => (
            <SectionCard 
              key={index}
              title={section.title}
              icon={section.icon}
            >
              {section.content}
            </SectionCard>
          ))}
        </div>
      </div>
    </div>
  );
}

const SectionCard = ({ title, icon, children }) => {
  const { darkMode } = useTheme();

  return (
    <div className={`rounded-xl p-1 ${darkMode ? 'bg-gradient-to-br from-blue-800/30 to-purple-800/30' : 'bg-gradient-to-br from-blue-100/50 to-purple-100/50'}`}>
      <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center mb-6">
          {React.cloneElement(icon, { 
            className: `w-8 h-8 mr-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
          })}
          <h2 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </h2>
        </div>
        {children}
      </div>
    </div>
  );
};

const APISection = ({ method, endpoint, description, sampleRequest, sampleResponse }) => {
  const { darkMode } = useTheme();

  return (
    <div className="space-y-4">
      <div className="flex items-baseline gap-4">
        <span className={`px-3 py-1 rounded-md ${method === 'POST' ? 'bg-green-500/20 text-green-600' : 'bg-blue-500/20 text-blue-600'}`}>
          {method}
        </span>
        <code className={`font-mono ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
          {endpoint}
        </code>
      </div>
      <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{description}</p>
      
      <div className="grid md:grid-cols-2 gap-6">
        <CodeBlock title="Request" data={sampleRequest} />
        <CodeBlock title="Response" data={sampleResponse} />
      </div>
    </div>
  );
};

const CodeBlock = ({ title, data }) => (
  <div>
    <h4 className="text-sm font-semibold mb-2">{title}</h4>
    <pre className="p-4 rounded-lg bg-gray-800 text-gray-100 overflow-x-auto">
      <code>{JSON.stringify(data, null, 2)}</code>
    </pre>
  </div>
);

const StepSection = ({ steps }) => (
  <div className="space-y-4">
    {steps.map((step, index) => (
      <div key={index} className="flex items-start">
        <div className="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-600 rounded-full flex items-center justify-center mr-3">
          {index + 1}
        </div>
        <p className="text-gray-600 dark:text-gray-300">{step}</p>
      </div>
    ))}
  </div>
);

const CodeSample = ({ language, code }) => (
  <div>
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm font-mono text-gray-500">{language}</span>
    </div>
    <pre className="p-4 rounded-lg bg-gray-800 text-gray-100 overflow-x-auto">
      <code>{code}</code>
    </pre>
  </div>
);

const FAQItem = ({ question, answer }) => {
  const { darkMode } = useTheme();

  return (
    <details className="group">
      <summary className={`flex items-center justify-between p-4 rounded-lg cursor-pointer ${
        darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
      }`}>
        <h3 className="font-medium">{question}</h3>
        <div className={`transform transition-transform ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <FiChevronDown className="group-open:rotate-180" />
        </div>
      </summary>
      <div className={`p-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        {answer}
      </div>
    </details>
  );
};