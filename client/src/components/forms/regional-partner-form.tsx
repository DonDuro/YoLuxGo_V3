import { motion } from "framer-motion";
import { useState } from "react";
import { X, Upload, Check, Calendar } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const regionalPartnerSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  companyName: z.string().optional(),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  country: z.string().min(2, "Country is required"),
  city: z.string().min(2, "City is required"),
  hasExperience: z.enum(["yes", "no"]),
  experienceDescription: z.string().optional(),
  proposedRole: z.enum(["sales", "operational", "tech"]),
  regionFit: z.string().min(100, "Please provide detailed explanation (minimum 100 characters)"),
  infrastructure: z.string().min(50, "Please describe your business infrastructure"),
  fundingCapacity: z.enum(["self-funded", "seeking-support", "investment-ready"]),
  ndaWilling: z.enum(["yes", "no"]),
  availableForCall: z.string().optional()
});

type RegionalPartnerFormData = z.infer<typeof regionalPartnerSchema>;

interface RegionalPartnerFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegionalPartnerForm({ isOpen, onClose }: RegionalPartnerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [uploadedPitch, setUploadedPitch] = useState<File | null>(null);

  const form = useForm<RegionalPartnerFormData>({
    resolver: zodResolver(regionalPartnerSchema),
    defaultValues: {
      hasExperience: "no",
      proposedRole: "sales",
      fundingCapacity: "self-funded",
      ndaWilling: "yes",
      companyName: "",
      experienceDescription: "",
      availableForCall: ""
    }
  });

  const roleOptions = [
    { id: "sales", label: "Sales Partner", description: "Focus on client acquisition and relationship management" },
    { id: "operational", label: "Operational Franchise", description: "Full service delivery and operations management" },
    { id: "tech", label: "Tech Deployment Partner", description: "Technology implementation and support services" }
  ];

  const fundingOptions = [
    { id: "self-funded", label: "Self-funded", description: "Have capital available for investment" },
    { id: "seeking-support", label: "Seeking Support", description: "Need financial assistance or backing" },
    { id: "investment-ready", label: "Investment-ready", description: "Ready to discuss investment opportunities" }
  ];

  const handlePitchUpload = (files: FileList | null) => {
    if (files && files[0]) {
      setUploadedPitch(files[0]);
    }
  };

  const handleSubmit = async (data: RegionalPartnerFormData) => {
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        form.reset();
        setUploadedPitch(null);
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
                Regional Partner Inquiry
              </h3>
              <p className="text-gray-600">Join YoLuxGo™ as a regional representative or franchise partner</p>
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
              <h4 className="font-serif text-2xl text-navy mb-4">Partnership Inquiry Submitted</h4>
              <p className="text-gray-600 mb-4">Thank you for your interest in partnering with YoLuxGo™.</p>
              <p className="text-sm text-gray-500">Our partnership team will review your inquiry and contact you within 3-5 business days to discuss next steps.</p>
            </motion.div>
          ) : (
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Personal/Company Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Full Name *
                  </label>
                  <input
                    {...form.register("fullName")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                    placeholder="Your full name"
                  />
                  {form.formState.errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Company Name
                  </label>
                  <input
                    {...form.register("companyName")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                    placeholder="Your company (if applicable)"
                  />
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
                    placeholder="your@email.com"
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
                    Country of Proposed Operation *
                  </label>
                  <input
                    {...form.register("country")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                    placeholder="United Kingdom"
                  />
                  {form.formState.errors.country && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.country.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    City of Proposed Operation *
                  </label>
                  <input
                    {...form.register("city")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                    placeholder="London"
                  />
                  {form.formState.errors.city && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.city.message}</p>
                  )}
                </div>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-navy mb-3">
                  Experience in VIP, Security, or Travel Sectors? *
                </label>
                <div className="flex space-x-4 mb-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="yes"
                      {...form.register("hasExperience")}
                      className="mr-2 w-4 h-4 text-gold"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="no"
                      {...form.register("hasExperience")}
                      className="mr-2 w-4 h-4 text-gold"
                    />
                    No
                  </label>
                </div>

                {form.watch("hasExperience") === "yes" && (
                  <div>
                    <label className="block text-sm font-medium text-navy mb-2">
                      Describe Your Experience
                    </label>
                    <textarea
                      {...form.register("experienceDescription")}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all resize-none"
                      placeholder="Describe your relevant experience in VIP services, security, travel, or luxury sectors..."
                    />
                  </div>
                )}
              </div>

              {/* Proposed Role */}
              <div>
                <label className="block text-sm font-medium text-navy mb-3">
                  Proposed Role *
                </label>
                <div className="space-y-3">
                  {roleOptions.map((option) => (
                    <label key={option.id} className="flex items-start space-x-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:border-gold transition-colors">
                      <input
                        type="radio"
                        value={option.id}
                        {...form.register("proposedRole")}
                        className="w-4 h-4 text-gold border-gray-300 focus:ring-gold mt-1"
                      />
                      <div>
                        <div className="font-medium text-navy">{option.label}</div>
                        <div className="text-sm text-gray-600">{option.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Region Fit */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Why do you believe your region is a fit for YoLuxGo™? *
                </label>
                <textarea
                  {...form.register("regionFit")}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all resize-none"
                  placeholder="Describe the market opportunity, your understanding of the luxury/security sector in your region, potential client base, competitive landscape, and why YoLuxGo™ would succeed there..."
                />
                {form.formState.errors.regionFit && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.regionFit.message}</p>
                )}
              </div>

              {/* Business Infrastructure */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Business Infrastructure Available *
                </label>
                <textarea
                  {...form.register("infrastructure")}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all resize-none"
                  placeholder="Describe your office space, staff, legal entity, existing business connections, technology resources, etc..."
                />
                {form.formState.errors.infrastructure && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.infrastructure.message}</p>
                )}
              </div>

              {/* Funding Capacity */}
              <div>
                <label className="block text-sm font-medium text-navy mb-3">
                  Funding Capacity *
                </label>
                <div className="space-y-3">
                  {fundingOptions.map((option) => (
                    <label key={option.id} className="flex items-start space-x-3 cursor-pointer p-4 border border-gray-200 rounded-lg hover:border-gold transition-colors">
                      <input
                        type="radio"
                        value={option.id}
                        {...form.register("fundingCapacity")}
                        className="w-4 h-4 text-gold border-gray-300 focus:ring-gold mt-1"
                      />
                      <div>
                        <div className="font-medium text-navy">{option.label}</div>
                        <div className="text-sm text-gray-600">{option.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* NDA/MOU Willingness */}
              <div>
                <label className="block text-sm font-medium text-navy mb-3">
                  Willingness to Sign NDA/MOU *
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="yes"
                      {...form.register("ndaWilling")}
                      className="mr-2 w-4 h-4 text-gold"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="no"
                      {...form.register("ndaWilling")}
                      className="mr-2 w-4 h-4 text-gold"
                    />
                    No
                  </label>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Non-disclosure and memorandum of understanding agreements are required for detailed partnership discussions
                </p>
              </div>

              {/* Pitch Deck Upload */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Upload Pitch Deck or Proposal (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gold transition-colors">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <input
                    type="file"
                    accept=".pdf,.ppt,.pptx,.doc,.docx"
                    onChange={(e) => handlePitchUpload(e.target.files)}
                    className="hidden"
                    id="pitch-upload"
                  />
                  <label htmlFor="pitch-upload" className="cursor-pointer">
                    <div className="text-sm text-gray-600 hover:text-gold">
                      Upload your pitch deck, business proposal, or relevant documents
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Accepted formats: PDF, PPT, PPTX, DOC, DOCX (Max 10MB)
                    </div>
                  </label>
                  {uploadedPitch && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ {uploadedPitch.name} uploaded
                    </p>
                  )}
                </div>
              </div>

              {/* Availability for Call */}
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Availability for Discovery Call
                </label>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <input
                    {...form.register("availableForCall")}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                    placeholder="e.g., Weekdays 9 AM - 5 PM EST, or specific dates/times"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Optional: Let us know your preferred times for a partnership discovery call
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-navy text-cream py-4 rounded-lg font-medium hover:bg-navy/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isSubmitting ? 'Submitting Partnership Inquiry...' : 'Submit Partnership Inquiry'}
              </button>
            </form>
          )}

          <div className="mt-6 p-4 bg-navy/5 rounded-lg">
            <p className="text-xs text-gray-600 text-center font-medium mb-2">Partnership Process</p>
            <p className="text-xs text-gray-500 text-center">
              Initial review → NDA signing → Discovery call → Business plan review → Partnership agreement negotiation → Launch planning
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}