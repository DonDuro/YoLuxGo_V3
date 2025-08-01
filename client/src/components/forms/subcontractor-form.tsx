import { motion } from "framer-motion";
import { useState } from "react";
import { X, Upload, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const subcontractorSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  contactPerson: z.string().min(2, "Contact person name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  country: z.string().min(2, "Country is required"),
  city: z.string().min(2, "City is required"),
  serviceTypes: z.array(z.string()).min(1, "Select at least one service type"),
  yearsExperience: z.string().min(1, "Years of experience is required"),
  vipExperience: z.string().min(50, "Please provide detailed VIP experience (minimum 50 characters)"),
  fleetDescription: z.string().min(20, "Please describe your fleet/facilities"),
  serviceArea: z.string().min(10, "Service area coverage is required"),
  emergencyCapable: z.enum(["yes", "no"]),
  website: z.string().url().optional().or(z.literal("")),
  references: z.string().optional(),
  backgroundCheck: z.boolean().refine(val => val === true, "Must consent to background check")
});

type SubcontractorFormData = z.infer<typeof subcontractorSchema>;

interface SubcontractorFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubcontractorForm({ isOpen, onClose }: SubcontractorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: File[]}>({});

  const form = useForm<SubcontractorFormData>({
    resolver: zodResolver(subcontractorSchema),
    defaultValues: {
      serviceTypes: [],
      emergencyCapable: "no",
      website: "",
      references: "",
      backgroundCheck: false
    }
  });

  const serviceOptions = [
    { id: "transportation", label: "Transportation" },
    { id: "security", label: "Security" },
    { id: "lodging", label: "Luxury Lodging" },
    { id: "all", label: "All Services" }
  ];

  const handleFileUpload = (category: string, files: FileList | null) => {
    if (files) {
      setUploadedFiles(prev => ({
        ...prev,
        [category]: Array.from(files)
      }));
    }
  };

  const handleSubmit = async (data: SubcontractorFormData) => {
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        form.reset();
        setUploadedFiles({});
      }, 3000);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div
        className="bg-cream max-w-4xl w-full rounded-lg shadow-2xl my-8"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-serif text-3xl font-light text-navy mb-2">
                Subcontractor Application
              </h3>
              <p className="text-gray-600">Join our verified network of luxury service providers</p>
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
              <h4 className="font-serif text-2xl text-navy mb-4">Application Submitted</h4>
              <p className="text-gray-600 mb-4">Thank you for your interest in joining our network.</p>
              <p className="text-sm text-gray-500">Our team will review your application and contact you within 5-7 business days.</p>
            </motion.div>
          ) : (
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Company Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Company Name *
                  </label>
                  <input
                    {...form.register("companyName")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                    placeholder="Your company name"
                  />
                  {form.formState.errors.companyName && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.companyName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Contact Person *
                  </label>
                  <input
                    {...form.register("contactPerson")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                    placeholder="Primary contact name"
                  />
                  {form.formState.errors.contactPerson && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.contactPerson.message}</p>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    {...form.register("email")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                    placeholder="contact@company.com"
                  />
                  {form.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    {...form.register("phone")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                    placeholder="+1 (555) 123-4567"
                  />
                  {form.formState.errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.phone.message}</p>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Country *
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

                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    City of Operation *
                  </label>
                  <input
                    {...form.register("city")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                    placeholder="New York"
                  />
                  {form.formState.errors.city && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.city.message}</p>
                  )}
                </div>
              </div>

              {/* Service Types */}
              <div>
                <label className="block text-sm font-medium text-navy mb-3">
                  Type of Service Offered *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {serviceOptions.map((option) => (
                    <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value={option.id}
                        {...form.register("serviceTypes")}
                        className="w-4 h-4 text-gold border-gray-300 rounded focus:ring-gold"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
                {form.formState.errors.serviceTypes && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.serviceTypes.message}</p>
                )}
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Years of Experience *
                </label>
                <select
                  {...form.register("yearsExperience")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                >
                  <option value="">Select experience level</option>
                  <option value="1-3">1-3 years</option>
                  <option value="4-7">4-7 years</option>
                  <option value="8-15">8-15 years</option>
                  <option value="15+">15+ years</option>
                </select>
                {form.formState.errors.yearsExperience && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.yearsExperience.message}</p>
                )}
              </div>

              {/* VIP Experience Description */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Description of VIP Experience *
                </label>
                <textarea
                  {...form.register("vipExperience")}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all resize-none"
                  placeholder="Describe your experience working with high-profile clients, celebrities, executives, or VIP services..."
                />
                {form.formState.errors.vipExperience && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.vipExperience.message}</p>
                )}
              </div>

              {/* Fleet/Facility Description */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Fleet or Facility Description *
                </label>
                <textarea
                  {...form.register("fleetDescription")}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all resize-none"
                  placeholder="Describe your vehicles, facilities, equipment, or infrastructure..."
                />
                {form.formState.errors.fleetDescription && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.fleetDescription.message}</p>
                )}
              </div>

              {/* File Uploads */}
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Fleet Photos/Specs
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gold transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload('fleet', e.target.files)}
                      className="hidden"
                      id="fleet-upload"
                    />
                    <label htmlFor="fleet-upload" className="cursor-pointer text-sm text-gray-600 hover:text-gold">
                      Upload Photos/Specs
                    </label>
                    {uploadedFiles.fleet && (
                      <p className="text-xs text-green-600 mt-1">{uploadedFiles.fleet.length} files selected</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Licenses/Certifications
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gold transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload('licenses', e.target.files)}
                      className="hidden"
                      id="licenses-upload"
                    />
                    <label htmlFor="licenses-upload" className="cursor-pointer text-sm text-gray-600 hover:text-gold">
                      Upload Licenses
                    </label>
                    {uploadedFiles.licenses && (
                      <p className="text-xs text-green-600 mt-1">{uploadedFiles.licenses.length} files selected</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Insurance Documents
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gold transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload('insurance', e.target.files)}
                      className="hidden"
                      id="insurance-upload"
                    />
                    <label htmlFor="insurance-upload" className="cursor-pointer text-sm text-gray-600 hover:text-gold">
                      Upload Insurance
                    </label>
                    {uploadedFiles.insurance && (
                      <p className="text-xs text-green-600 mt-1">{uploadedFiles.insurance.length} files selected</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Service Area & Emergency */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Service Area Coverage *
                  </label>
                  <input
                    {...form.register("serviceArea")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                    placeholder="Metropolitan area, radius, or specific regions"
                  />
                  {form.formState.errors.serviceArea && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.serviceArea.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Emergency/On-Call Capabilities *
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="yes"
                        {...form.register("emergencyCapable")}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="no"
                        {...form.register("emergencyCapable")}
                        className="mr-2"
                      />
                      No
                    </label>
                  </div>
                </div>
              </div>

              {/* Website & References */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Website or Portfolio URL
                  </label>
                  <input
                    type="url"
                    {...form.register("website")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                    placeholder="https://yourcompany.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    References (Optional)
                  </label>
                  <textarea
                    {...form.register("references")}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all resize-none"
                    placeholder="Client references or testimonials"
                  />
                </div>
              </div>

              {/* Background Check Consent */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  {...form.register("backgroundCheck")}
                  className="w-4 h-4 text-gold border-gray-300 rounded focus:ring-gold mt-1"
                />
                <div>
                  <label className="text-sm text-gray-700">
                    I consent to a comprehensive background check and verification process as part of the application review. *
                  </label>
                  {form.formState.errors.backgroundCheck && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.backgroundCheck.message}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-navy text-cream py-4 rounded-lg font-medium hover:bg-navy/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
              </button>
            </form>
          )}

          <p className="text-xs text-gray-500 mt-6 text-center">
            All applications are reviewed confidentially. Response time: 5-7 business days.
          </p>
        </div>
      </motion.div>
    </div>
  );
}