import { useTheme } from '../../contexts/ThemeContext';
import TestimonialCard from '../../components/ui/TestimonialCard';

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CTO",
    company: "FinSecure Inc.",
    text: "The accuracy of this system has dramatically reduced our false positives. The enterprise features and API integration capabilities are exactly what we needed for our security stack."
  },
  {
    name: "Michael Chen",
    role: "IT Director",
    company: "HealthTech Global",
    text: "Implementation was seamless and the support team was exceptional. Our email security metrics improved by 40% within the first month of deployment."
  },
  {
    name: "Emma Wilson",
    role: "Security Architect",
    company: "CloudGuard Solutions",
    text: "The real-time analytics dashboard provides exactly the visibility we need. The machine learning models adapt remarkably well to evolving threats."
  },
  {
    name: "David Müller",
    role: "Compliance Manager",
    company: "EuroBank AG",
    text: "Meeting regulatory requirements became significantly easier with their comprehensive audit logs and GDPR-compliant data processing."
  }
];

export default function TestimonialsSection() {
  const { darkMode } = useTheme();

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className={`text-3xl font-bold text-center mb-12 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Trusted by Security Leaders
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={index}
              {...testimonial}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}