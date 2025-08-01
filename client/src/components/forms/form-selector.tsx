import { motion } from "framer-motion";
import { X, Users, Globe } from "lucide-react";
import ylgLogo from "@assets/New Primary YLG Transparent Logo_1753678100391.png";

interface FormSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectForm: (formType: 'client' | 'subcontractor' | 'partner') => void;
}

export default function FormSelector({ isOpen, onClose, onSelectForm }: FormSelectorProps) {
  if (!isOpen) return null;

  const formOptions = [
    {
      id: 'client' as const,
      title: 'Client Pre-Registration',
      description: 'Discreet intake for high-net-worth individuals, celebrities, executives, and VIP assistants',
      icon: 'logo',
      features: ['Confidential processing', 'Security requirements assessment', 'Private consultation scheduling'],
      buttonText: 'Register as Client'
    },
    {
      id: 'subcontractor' as const,
      title: 'Subcontractor Application',
      description: 'Join our verified network of luxury transportation, security, and lodging providers',
      icon: Users,
      features: ['Network partnership', 'Background verification', 'Global opportunity'],
      buttonText: 'Apply as Provider'
    },
    {
      id: 'partner' as const,
      title: 'Regional Partner Inquiry',
      description: 'Explore franchise and representative opportunities in new territories',
      icon: Globe,
      features: ['Franchise opportunities', 'Business partnership', 'Territory expansion'],
      buttonText: 'Partner with Us'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-cream max-w-4xl w-full rounded-lg shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-serif text-3xl font-light text-navy mb-2">
                Join Our Network
              </h3>
              <p className="text-gray-600">Choose the option that best describes your interest in YoLuxGo™</p>
            </div>
            <button
              onClick={onClose}
              className="text-navy hover:text-navy/70 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {formOptions.map((option) => (
              <motion.div
                key={option.id}
                className="bg-white rounded-lg p-6 shadow-lg border border-gray-100 hover:border-gold transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectForm(option.id)}
              >
                <div className="text-center mb-6">
                  <div className="bg-navy/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    {option.icon === 'logo' ? (
                      <img src={ylgLogo} alt="YLG Logo" className="w-10 h-10 object-contain" />
                    ) : (
                      <option.icon className="w-8 h-8 text-navy" />
                    )}
                  </div>
                  <h4 className="font-serif text-xl font-medium text-navy mb-2">
                    {option.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    {option.description}
                  </p>
                </div>

                <div className="space-y-2 mb-6">
                  {option.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-gold rounded-full mr-3" />
                      {feature}
                    </div>
                  ))}
                </div>

                <button className="w-full bg-navy text-cream py-3 rounded-lg font-medium hover:bg-navy/90 transition-all duration-300">
                  {option.buttonText}
                </button>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              All applications and inquiries are processed securely and confidentially. 
              Our team will contact you discretely within 2-7 business days depending on your selection.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}