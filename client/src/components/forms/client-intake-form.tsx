import { motion } from "framer-motion";
import { useState } from "react";
import { X, Check } from "lucide-react";
import ylgBrandLogo from "@assets/New Primary YLG Transparent Logo_1753681153359.png";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const clientIntakeSchema = z.object({
  fullName: z.string().min(2, "Name or alias is required"),
  email: z.string().email("Valid email is required"),
  country: z.string().min(2, "Country of residence is required"),
  useType: z.enum(["personal", "business", "government", "other"]),
  purposeTypes: z.array(z.string()).min(1, "Select at least one purpose"),
  securityRequirements: z.string().optional(),
  preferredLocations: z.string().min(5, "Please specify preferred service locations"),
  referralCode: z.string().optional(),
  contactPreference: z.enum(["email", "encrypted", "assistant"]),
  wantsConsultation: z.boolean(),
  captchaVerified: z.boolean().refine(val => val === true, "Please verify you are human")
});

type ClientIntakeFormData = z.infer<typeof clientIntakeSchema>;

interface ClientIntakeFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ClientIntakeForm({ isOpen, onClose }: ClientIntakeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const form = useForm<ClientIntakeFormData>({
    resolver: zodResolver(clientIntakeSchema),
    defaultValues: {
      useType: "personal",
      purposeTypes: [],
      contactPreference: "email",
      wantsConsultation: false,
      captchaVerified: false,
      securityRequirements: "",
      referralCode: ""
    }
  });

  const useTypeOptions = [
    { id: "personal", label: "Personal" },
    { id: "business", label: "Business" },
    { id: "government", label: "Government" },
    { id: "other", label: "Other" }
  ];

  const purposeOptions = [
    { id: "secure-travel", label: "Secure Travel" },
    { id: "lodging", label: "Luxury Lodging" },
    { id: "full-concierge", label: "Full Concierge" },
    { id: "other", label: "Other Services" }
  ];

  const contactOptions = [
    { id: "email", label: "Secure Email" },
    { id: "encrypted", label: "Encrypted App" },
    { id: "assistant", label: "Through Assistant" }
  ];

  const handleCaptchaVerify = () => {
    // Simulate captcha verification
    setCaptchaVerified(true);
    form.setValue("captchaVerified", true);
  };

  const handleSubmit = async (data: ClientIntakeFormData) => {
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        form.reset();
        setCaptchaVerified(false);
      }, 3000);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div
        className="bg-cream max-w-3xl w-full rounded-lg shadow-2xl my-8"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-serif text-3xl font-light text-navy mb-2">
                Client Pre-Registration
              </h3>
              <div className="flex items-center space-x-3">
                <img src={ylgBrandLogo} alt="YoLuxGo™" className="h-8" />
                <p className="text-gray-600">
                  Discreet and confidential intake process
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-navy hover:text-navy/70 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
          </div>

          {submitted ? (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-gold text-6xl mb-6">
                <Check className="w-16 h-16 mx-auto" />
              </div>
              <h4 className="font-serif text-2xl text-navy mb-4">Registration Received</h4>
              <p className="text-gray-600 mb-4">Your information has been securely processed.</p>
              <p className="text-sm text-gray-500">Our team will contact you discretely using your preferred method within 24-48 hours.</p>
            </motion.div>
          ) : (
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Full Name or Alias *
                  </label>
                  <input
                    {...form.register("fullName")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                    placeholder="Your name or preferred alias"
                  />
                  {form.formState.errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    {...form.register("email")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                    placeholder="secure@email.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">For response purposes only</p>
                  {form.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Primary Country of Residence *
                </label>
                <input
                  {...form.register("country")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                  placeholder="United States"
                />
                {form.formState.errors.country && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.country.message}</p>
                )}
              </div>

              {/* Type of Use */}
              <div>
                <label className="block text-sm font-medium text-navy mb-3">
                  Type of Use *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {useTypeOptions.map((option) => (
                    <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        value={option.id}
                        {...form.register("useType")}
                        className="w-4 h-4 text-gold border-gray-300 focus:ring-gold"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Purpose of Interest */}
              <div>
                <label className="block text-sm font-medium text-navy mb-3">
                  Purpose of Interest *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {purposeOptions.map((option) => (
                    <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value={option.id}
                        {...form.register("purposeTypes")}
                        className="w-4 h-4 text-gold border-gray-300 rounded focus:ring-gold"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
                {form.formState.errors.purposeTypes && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.purposeTypes.message}</p>
                )}
              </div>

              {/* Security Requirements */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Security or Privacy Requirements
                </label>
                <textarea
                  {...form.register("securityRequirements")}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all resize-none"
                  placeholder="Optional: Describe any specific security, privacy, or discretion requirements..."
                />
                <p className="text-xs text-gray-500 mt-1">This information helps us tailor our services to your needs</p>
              </div>

              {/* Preferred Locations */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Preferred Locations of Service *
                </label>
                <input
                  {...form.register("preferredLocations")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                  placeholder="New York, London, Dubai, or worldwide"
                />
                {form.formState.errors.preferredLocations && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.preferredLocations.message}</p>
                )}
              </div>

              {/* Referral Code */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Referral Code or Referred By
                </label>
                <input
                  {...form.register("referralCode")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                  placeholder="Optional: Enter referral code or referring person"
                />
              </div>

              {/* Contact Preference */}
              <div>
                <label className="block text-sm font-medium text-navy mb-3">
                  Contact Preference *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {contactOptions.map((option) => (
                    <label key={option.id} className="flex items-center space-x-2 cursor-pointer p-3 border border-gray-200 rounded-lg hover:border-gold transition-colors">
                      <input
                        type="radio"
                        value={option.id}
                        {...form.register("contactPreference")}
                        className="w-4 h-4 text-gold border-gray-300 focus:ring-gold"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Consultation Request */}
              <div className="bg-navy/5 rounded-lg p-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...form.register("wantsConsultation")}
                    className="w-4 h-4 text-gold border-gray-300 rounded focus:ring-gold mt-1"
                  />
                  <div>
                    <span className="text-sm font-medium text-navy">Schedule Private Consultation</span>
                    <p className="text-xs text-gray-600 mt-1">
                      Would you like to schedule a confidential consultation to discuss your specific requirements?
                    </p>
                  </div>
                </label>
              </div>

              {/* CAPTCHA Verification */}
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-navy mb-3">
                  Human Verification *
                </label>
                {!captchaVerified ? (
                  <div className="flex items-center space-x-4">
                    <div className="bg-white border-2 border-gray-300 rounded p-4 text-center">
                      <div className="text-lg font-mono mb-2">7 + 3 = ?</div>
                      <input
                        type="number"
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                        placeholder="10"
                        onBlur={(e) => {
                          if (e.target.value === "10") {
                            handleCaptchaVerify();
                          }
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">Please solve to verify you are human</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-green-600">
                    <Check className="w-4 h-4" />
                    <span className="text-sm">Verified</span>
                  </div>
                )}
                {form.formState.errors.captchaVerified && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.captchaVerified.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !captchaVerified}
                className="w-full bg-navy text-cream py-4 rounded-lg font-medium hover:bg-navy/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isSubmitting ? 'Processing Registration...' : 'Submit Secure Registration'}
              </button>
            </form>
          )}

          <div className="mt-6 p-4 bg-navy/5 rounded-lg">
            <p className="text-xs text-gray-600 text-center font-medium mb-2">Legal Notice</p>
            <p className="text-xs text-gray-500 text-center">
              This form is not a booking. All information is treated confidentially under our privacy and security protocols. 
              Your data is encrypted and stored securely in compliance with international privacy standards.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}