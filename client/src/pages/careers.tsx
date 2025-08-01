import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, Users, Star, MapPin, Clock, DollarSign, Send, Upload, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import primaryLogo from "@assets/New Primary YLG Transparent Logo_1753681153359.png";

const jobApplicationSchema = z.object({
  position: z.string().min(1, "Please select a position"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  linkedinUrl: z.string().optional(),
  coverLetter: z.string().optional(),
});

type JobApplicationFormData = z.infer<typeof jobApplicationSchema>;

const openPositions = [
  {
    id: "operations-manager",
    title: "Operations & Provider Onboarding Manager",
    type: "Full-time or part-time",
    location: "Remote with global flexibility",
    description: "Lead the vetting and onboarding of elite service providers including chauffeurs, security professionals, and concierges. Build comprehensive verification frameworks and establish quality control standards that define luxury service excellence.",
    requirements: [
      "Operations or premium client service background",
      "Experience in hospitality, security, or luxury logistics preferred",
      "Multilingual capabilities valued"
    ],
    benefits: ["Shape global luxury standards", "Build world-class operational framework", "Competitive compensation and benefits"]
  },
  {
    id: "client-success",
    title: "Client Success & Experience Coordinator",
    type: "Part-time or freelance",
    location: "Remote",
    description: "Deliver exceptional client experiences through personalized support and onboarding. Monitor client interactions to continuously enhance service quality and develop sophisticated support systems.",
    requirements: [
      "Excellence in luxury customer service",
      "Experience with premium support platforms",
      "Multiple language proficiency preferred"
    ],
    benefits: ["Flexible global schedule", "Luxury services industry expertise", "Professional growth opportunities"]
  },
  {
    id: "marketing-partnerships",
    title: "Marketing & Strategic Partnerships",
    type: "Part-time, freelance, or full-time",
    location: "Remote",
    description: "Build brand presence across digital channels and establish strategic partnerships with luxury service providers. Create compelling content that resonates with discerning clientele worldwide.",
    requirements: [
      "Marketing or brand development experience",
      "Luxury market understanding",
      "Creative vision and strategic thinking"
    ],
    benefits: ["Creative brand leadership", "Luxury market expertise", "Global corporate networking"]
  },
  {
    id: "finance-admin",
    title: "Finance & Operations Support",
    type: "Freelance or part-time",
    location: "Remote",
    description: "Manage financial operations including bookkeeping, payment processing, and investor relations. Support banking operations and ensure compliance across international markets.",
    requirements: [
      "Startup financial operations experience",
      "Proficiency in financial management tools",
      "High attention to detail and discretion"
    ],
    benefits: ["Flexible schedule", "Corporate finance experience", "Professional development"]
  },
  {
    id: "technical-lead",
    title: "Technical Lead / Fractional CTO",
    type: "Part-time to full-time with equity",
    location: "Remote",
    description: "Lead technical architecture and platform development. Ensure world-class security, performance, and scalability while making strategic technology decisions that support global expansion.",
    requirements: [
      "Platform development expertise (Go, mobile-first)",
      "Secure payment integration experience",
      "Strategic technical leadership background"
    ],
    benefits: ["Competitive compensation package", "Technical leadership autonomy", "Define luxury tech standards"]
  }
];

export default function Careers() {
  const [selectedPosition, setSelectedPosition] = useState<string>("");
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const { toast } = useToast();

  const form = useForm<JobApplicationFormData>({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues: {
      position: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      linkedinUrl: "",
      coverLetter: "",
    },
  });

  const submitApplication = useMutation({
    mutationFn: async (data: JobApplicationFormData) => {
      return await apiRequest("POST", "/api/careers/apply", data);
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: "Thank you for your interest! We'll review your application and get back to you soon.",
      });
      form.reset();
      setShowApplicationForm(false);
      setSelectedPosition("");
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleApplyClick = (positionId: string) => {
    setSelectedPosition(positionId);
    form.setValue("position", positionId);
    setShowApplicationForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = (data: JobApplicationFormData) => {
    submitApplication.mutate(data);
  };

  if (showApplicationForm) {
    return (
      <div className="min-h-screen bg-navy">
        {/* Header */}
        <motion.header 
          className="bg-navy border-b border-gold/20 sticky top-0 z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img 
                  src={primaryLogo}
                  alt="YoLuxGo™" 
                  className="h-10 mr-0.5"
                />
                <span className="font-serif text-2xl text-white font-light">
                  YoLuxGo<sup className="text-[0.4rem] ml-0.5 text-gold">™</sup>
                </span>
              </div>
              <button 
                onClick={() => setShowApplicationForm(false)}
                className="text-cream hover:text-gold transition-colors text-sm"
              >
                ← Back to Positions
              </button>
            </div>
          </div>
        </motion.header>

        {/* Hero Section */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-4xl">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-serif text-4xl font-bold text-white mb-4">
                Apply for Position
              </h1>
              <div className="w-24 h-1 bg-gold mx-auto rounded-full mb-6"></div>
              <p className="text-white/90 text-lg">
                {openPositions.find(p => p.id === selectedPosition)?.title}
              </p>
            </motion.div>
          </div>
        </section>

        <div className="container mx-auto px-6 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Application Form */}
            <Card className="max-w-2xl mx-auto bg-white/95 backdrop-blur-sm border border-gold/20">
              <CardHeader>
                <CardTitle className="text-2xl text-navy font-serif">Join Our Founding Team</CardTitle>
                <CardDescription className="text-charcoal">
                  Help us build the future of luxury services. Complete the form below to apply.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-navy font-medium">Position *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select the position you're applying for" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {openPositions.map((position) => (
                                <SelectItem key={position.id} value={position.id}>
                                  {position.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-navy font-medium">First Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Your first name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-navy font-medium">Last Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Your last name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-navy font-medium">Email Address *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your.email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-navy font-medium">Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="linkedinUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-navy font-medium">LinkedIn Profile</FormLabel>
                          <FormControl>
                            <Input placeholder="https://linkedin.com/in/yourprofile" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="coverLetter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-navy font-medium">Cover Letter (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us why you're interested in this position and what makes you a great fit for our founding team..."
                              rows={6}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="border-2 border-dashed border-gold/30 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-gold mx-auto mb-2" />
                      <p className="text-sm text-charcoal">
                        Optional: Upload your photo (Coming soon)
                      </p>
                      <p className="text-xs text-charcoal/60">
                        For now, you can include a photo link in your cover letter
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-navy hover:bg-navy/90 text-white"
                      disabled={submitApplication.isPending}
                    >
                      {submitApplication.isPending ? (
                        "Submitting Application..."
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Submit Application
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy">
      {/* Header */}
      <motion.header 
        className="bg-navy border-b border-gold/20 sticky top-0 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src={primaryLogo}
                alt="YoLuxGo™" 
                className="h-10 mr-0.5"
              />
              <span className="font-serif text-2xl text-white font-light">
                YoLuxGo<sup className="text-[0.4rem] ml-0.5 text-gold">™</sup>
              </span>
            </div>
            <button 
              onClick={() => window.history.back()}
              className="text-cream hover:text-gold transition-colors text-sm"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-serif text-4xl font-bold text-white mb-4">
              Open Positions
            </h1>
            <div className="w-24 h-1 bg-gold mx-auto rounded-full mb-6"></div>
            <p className="text-white/90 text-lg max-w-3xl mx-auto">
              Join our team of professionals delivering world-class experiences to discerning clientele worldwide
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >

          {/* Open Positions */}
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {openPositions.map((position, index) => (
                <motion.div
                  key={position.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-white/95 backdrop-blur-sm border border-gold/30 h-full hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-2xl text-navy font-serif mb-3 leading-tight">
                            {position.title}
                          </CardTitle>
                          <div className="flex flex-wrap gap-3 mb-4">
                            <Badge variant="secondary" className="bg-gold/20 text-charcoal px-3 py-1">
                              <Clock className="h-3 w-3 mr-2" />
                              {position.type}
                            </Badge>
                            <Badge variant="outline" className="border-charcoal/20 text-charcoal px-3 py-1">
                              <MapPin className="h-3 w-3 mr-2" />
                              {position.location}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <CardDescription className="text-charcoal text-base leading-relaxed">
                        {position.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="bg-navy/5 rounded-lg p-4">
                        <h4 className="font-semibold text-navy mb-3 flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          What You'll Bring:
                        </h4>
                        <ul className="space-y-2">
                          {position.requirements.map((req, reqIndex) => (
                            <li key={reqIndex} className="text-sm text-charcoal flex items-start">
                              <span className="text-gold mr-3 mt-1">◆</span>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-gold/5 rounded-lg p-4">
                        <h4 className="font-semibold text-navy mb-3 flex items-center">
                          <Star className="h-4 w-4 mr-2" />
                          What You'll Gain:
                        </h4>
                        <ul className="space-y-2">
                          {position.benefits.map((benefit, benefitIndex) => (
                            <li key={benefitIndex} className="text-sm text-charcoal flex items-start">
                              <span className="text-gold mr-3 mt-1">◆</span>
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button
                        onClick={() => handleApplyClick(position.id)}
                        className="w-full bg-navy hover:bg-navy/90 text-white py-3 text-base font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Apply for This Position
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            </motion.div>
          </div>


        </motion.div>
      </div>
    </div>
  );
}