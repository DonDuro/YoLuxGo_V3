import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft,
  TrendingUp,
  Shield,
  FileText,
  DollarSign,
  Globe,
  CheckCircle,
  Building2,
  Users,
  Clock
} from "lucide-react";
import primaryLogo from "@assets/New Primary YLG Transparent Logo_1753681153359.png";

const investmentInterestSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  entityName: z.string().optional(),
  country: z.string().min(2, "Country is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  investmentRange: z.string().min(1, "Investment range is required"),
  investmentStructure: z.string().min(1, "Investment structure is required"),
  dueDiligenceTimeline: z.string().min(1, "Due diligence timeline is required"),
  agreesToNDA: z.boolean().refine(val => val === true, "You must agree to the NDA requirement"),
  requestsMeeting: z.boolean(),
  digitalSignature: z.string().min(2, "Digital signature is required"),
});

type InvestmentInterestForm = z.infer<typeof investmentInterestSchema>;

const investmentRanges = [
  "$250,000 – $500,000",
  "$500,000 – $1,000,000", 
  "$1,000,000 – $2,500,000",
  "$2,500,000 – $5,000,000",
  "$5,000,000 – $10,000,000",
  "$10,000,000+"
];

const investmentStructures = [
  "Equity Investment",
  "Convertible Note",
  "SAFE Agreement",
  "Revenue-Based Financing",
  "Strategic Partnership",
  "Debt Financing",
  "Hybrid Structure"
];

const dueDiligenceTimelines = [
  "30 days",
  "45 days", 
  "60 days",
  "90 days",
  "120 days",
  "Flexible timeline"
];

const countries = [
  "United States", "Canada", "United Kingdom", "Germany", "France", "Switzerland",
  "Netherlands", "Austria", "Belgium", "Luxembourg", "Ireland", "Italy", "Spain",
  "Portugal", "Monaco", "Liechtenstein", "Singapore", "Hong Kong", "Japan",
  "Australia", "New Zealand", "UAE", "Saudi Arabia", "Qatar", "Kuwait", "Bahrain",
  "Mexico", "Brazil", "Argentina", "Chile", "Colombia", "Panama", "Other"
];

export default function InvestmentInterest() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<InvestmentInterestForm>({
    resolver: zodResolver(investmentInterestSchema),
    defaultValues: {
      fullName: "",
      entityName: "",
      country: "",
      email: "",
      phone: "",
      investmentRange: "",
      investmentStructure: "",
      dueDiligenceTimeline: "",
      agreesToNDA: false,
      requestsMeeting: false,
      digitalSignature: "",
    },
  });

  const submitInvestmentInterest = useMutation({
    mutationFn: async (data: InvestmentInterestForm) => {
      setIsSubmitting(true);
      return await apiRequest("POST", "/api/investment-interest", data);
    },
    onSuccess: (response) => {
      setIsSubmitting(false);
      toast({
        title: "Investment Interest Submitted",
        description: "Thank you for your interest. We will contact you within 48 hours to begin the NDA process.",
      });
      form.reset();
    },
    onError: (error) => {
      setIsSubmitting(false);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your investment interest. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InvestmentInterestForm) => {
    submitInvestmentInterest.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy/95 to-charcoal">
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link href="/business-plan">
                <Button variant="ghost" className="text-cream hover:text-gold">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Business Plan
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-serif text-cream font-bold">Investment Interest Form</h1>
                <p className="text-cream/70">Express your interest in YoLuxGo™ investment opportunities</p>
              </div>
            </div>
            <Link href="/">
              <div className="flex items-center">
                <img 
                  src={primaryLogo}
                  alt="YoLuxGo™" 
                  className="h-8 mr-0.5"
                />
                <span className="font-serif text-xl text-white font-light">
                  YoLuxGo<sup className="text-[0.4rem] ml-0.5 text-gold">™</sup>
                </span>
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Investment Highlights */}
            <div className="space-y-6">
              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-navy">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Investment Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-gold mt-1" />
                    <div>
                      <h4 className="font-semibold text-navy">Market Leadership</h4>
                      <p className="text-sm text-charcoal">Dominant position in luxury security and transportation</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <DollarSign className="h-5 w-5 text-gold mt-1" />
                    <div>
                      <h4 className="font-semibold text-navy">Revenue Growth</h4>
                      <p className="text-sm text-charcoal">Proven revenue model with high-value clientele</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Globe className="h-5 w-5 text-gold mt-1" />
                    <div>
                      <h4 className="font-semibold text-navy">Global Expansion</h4>
                      <p className="text-sm text-charcoal">Strategic expansion across key luxury markets</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Building2 className="h-5 w-5 text-gold mt-1" />
                    <div>
                      <h4 className="font-semibold text-navy">Technology Platform</h4>
                      <p className="text-sm text-charcoal">Proprietary cloaking and security technology</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-navy">
                    <Users className="h-5 w-5 mr-2" />
                    Target Investors
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-charcoal">
                    <strong>High Net Worth Individuals</strong>
                    <p>Ultra-high net worth investors seeking luxury sector exposure</p>
                  </div>
                  <div className="text-sm text-charcoal">
                    <strong>Family Offices</strong>
                    <p>Sophisticated institutional investors with long-term vision</p>
                  </div>
                  <div className="text-sm text-charcoal">
                    <strong>Strategic Partners</strong>
                    <p>Industry leaders looking for synergistic opportunities</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-navy">
                    <Clock className="h-5 w-5 mr-2" />
                    Next Steps
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-charcoal">Submit Interest Form</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 border-2 border-charcoal/30 rounded-full" />
                    <span className="text-sm text-charcoal">NDA Execution</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 border-2 border-charcoal/30 rounded-full" />
                    <span className="text-sm text-charcoal">Due Diligence Materials</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 border-2 border-charcoal/30 rounded-full" />
                    <span className="text-sm text-charcoal">Management Presentation</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Investment Interest Form */}
            <div className="lg:col-span-2">
              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-navy text-xl">
                    <FileText className="h-5 w-5 mr-2" />
                    Investment Interest Form
                  </CardTitle>
                  <CardDescription>
                    Please provide your information to begin the confidential investment process
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Personal Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-navy border-b border-charcoal/20 pb-2">
                          Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your full name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="entityName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Entity/Company Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Investment entity or company" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Country *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select your country" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {countries.map((country) => (
                                      <SelectItem key={country} value={country}>
                                        {country}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address *</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="your@email.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel>Phone Number *</FormLabel>
                                <FormControl>
                                  <Input placeholder="+1 (555) 123-4567" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Investment Details */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-navy border-b border-charcoal/20 pb-2">
                          Investment Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="investmentRange"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Investment Range *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select investment amount" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {investmentRanges.map((range) => (
                                      <SelectItem key={range} value={range}>
                                        {range}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="investmentStructure"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Preferred Investment Structure *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select structure" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {investmentStructures.map((structure) => (
                                      <SelectItem key={structure} value={structure}>
                                        {structure}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="dueDiligenceTimeline"
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel>Due Diligence Timeline *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select preferred timeline" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {dueDiligenceTimelines.map((timeline) => (
                                      <SelectItem key={timeline} value={timeline}>
                                        {timeline}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Legal and Compliance */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-navy border-b border-charcoal/20 pb-2">
                          Legal and Compliance
                        </h3>
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="agreesToNDA"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>
                                    I agree to execute a mutual Non-Disclosure Agreement (NDA) *
                                  </FormLabel>
                                  <p className="text-sm text-charcoal">
                                    Required to review confidential business information and financial data.
                                  </p>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="requestsMeeting"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>
                                    I would like to schedule a management presentation meeting
                                  </FormLabel>
                                  <p className="text-sm text-charcoal">
                                    Optional - Meet with the founding team to discuss the opportunity.
                                  </p>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Digital Signature */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-navy border-b border-charcoal/20 pb-2">
                          Digital Signature
                        </h3>
                        <FormField
                          control={form.control}
                          name="digitalSignature"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Digital Signature *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Type your full name as digital signature" 
                                  {...field} 
                                />
                              </FormControl>
                              <p className="text-sm text-charcoal">
                                By typing your name, you confirm the accuracy of all information provided.
                              </p>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Submit Button */}
                      <div className="pt-6 border-t border-charcoal/20">
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-gold hover:bg-gold/80 text-navy font-semibold text-lg py-3"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin w-4 h-4 border-2 border-navy border-t-transparent rounded-full mr-2" />
                              Submitting Investment Interest...
                            </>
                          ) : (
                            "Submit Investment Interest"
                          )}
                        </Button>
                        <p className="text-center text-sm text-cream/70 mt-4">
                          We will contact you within 48 hours to begin the NDA process and provide access to detailed investment materials.
                        </p>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}