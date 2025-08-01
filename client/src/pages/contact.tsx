import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Send, MapPin, Shield, Users, Globe } from "lucide-react";
import { Link } from "wouter";
import ylgLogo from "@assets/New Primary YLG Transparent Logo_1753669210755.png";

const contactSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  inquiryType: z.string().min(1, "Please select an inquiry or feedback type"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const inquiryType = watch("inquiryType");

  const contactMutation = useMutation({
    mutationFn: (data: ContactFormData) => {
      return apiRequest("/api/contact", "POST", data);
    },
    onSuccess: () => {
      setIsSubmitted(true);
      reset();
      toast({
        title: "Message Sent Successfully",
        description: "Thank you for contacting YoLuxGo™. We will respond within 24 hours.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Sending Message",
        description: "Please try again or contact us directly if the problem persists.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-navy text-cream">
        {/* Header */}
        <div className="border-b border-gold/20 bg-navy/90 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <img src={ylgLogo} alt="YLG" className="w-12 h-12" />
                <span className="text-2xl font-bold text-gold">YoLuxGo™</span>
              </Link>
              <Link href="/" className="text-cream hover:text-gold transition-colors flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="flex items-center justify-center min-h-[80vh] px-6">
          <Card className="max-w-2xl w-full bg-navy/50 border-gold/20">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="w-8 h-8 text-gold" />
              </div>
              <h1 className="text-3xl font-bold text-gold mb-4">Message Sent Successfully</h1>
              <p className="text-lg text-cream/80 mb-8">
                Thank you for contacting YoLuxGo™. Our team will review your inquiry and respond within 24 hours.
              </p>
              <div className="space-y-4">
                <p className="text-cream/60">
                  For urgent matters requiring immediate assistance, please indicate this in your message.
                </p>
                <Link href="/">
                  <Button className="bg-gradient-to-r from-gold to-gold/80 hover:from-gold/80 hover:to-gold text-navy font-semibold px-8">
                    Return to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy text-cream">
      {/* Header */}
      <div className="border-b border-gold/20 bg-navy/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <img src={ylgLogo} alt="YLG" className="w-12 h-12" />
              <span className="text-2xl font-bold text-gold">YoLuxGo™</span>
            </Link>
            <Link href="/" className="text-cream hover:text-gold transition-colors flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gold mb-4">Contact YoLuxGo™</h1>
          <p className="text-xl text-cream/80 max-w-3xl mx-auto">
            Experience discreet luxury and global security. Share your inquiry or feedback with our team.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="bg-navy/50 border-gold/20">
              <CardHeader>
                <CardTitle className="text-gold flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Discreet Communication</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-cream/80">
                  All communications are handled with the utmost discretion and confidentiality, 
                  ensuring your privacy is protected at every step.
                </p>

              </CardContent>
            </Card>

            <Card className="bg-navy/50 border-gold/20">
              <CardHeader>
                <CardTitle className="text-gold flex items-center space-x-2">
                  <Globe className="w-5 h-5" />
                  <span>Global Coverage</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-cream/80 mb-4">
                  Operating in premium destinations worldwide:
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm text-cream/60">
                  <div>• New York City</div>
                  <div>• Miami</div>
                  <div>• Los Angeles</div>
                  <div>• Punta Cana</div>
                  <div>• Malaga-Marbella</div>
                  <div>• La Romana - Casa de Campo</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-navy/50 border-gold/20">
              <CardHeader>
                <CardTitle className="text-gold flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Response Time</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-cream/80">
                  Our team responds to all inquiries within 24 hours. For urgent matters, 
                  please clearly indicate the priority level in your message.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="bg-navy/50 border-gold/20">
            <CardHeader>
              <CardTitle className="text-gold">Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-cream">First Name *</Label>
                    <Input
                      id="firstName"
                      {...register("firstName")}
                      className="bg-navy/50 border-gold/20 text-cream placeholder:text-cream/50"
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-400">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-cream">Last Name *</Label>
                    <Input
                      id="lastName"
                      {...register("lastName")}
                      className="bg-navy/50 border-gold/20 text-cream placeholder:text-cream/50"
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-400">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-cream">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    className="bg-navy/50 border-gold/20 text-cream placeholder:text-cream/50"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-400">{errors.email.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-cream">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...register("phone")}
                      className="bg-navy/50 border-gold/20 text-cream placeholder:text-cream/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-cream">Company/Organization</Label>
                    <Input
                      id="company"
                      {...register("company")}
                      className="bg-navy/50 border-gold/20 text-cream placeholder:text-cream/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inquiryType" className="text-cream">Inquiry or Feedback Type *</Label>
                  <Select onValueChange={(value) => setValue("inquiryType", value)}>
                    <SelectTrigger className="bg-navy/50 border-gold/20 text-cream">
                      <SelectValue placeholder="Select inquiry or feedback type" className="text-cream/50" />
                    </SelectTrigger>
                    <SelectContent className="bg-navy border-gold/20">
                      <SelectItem value="transportation" className="text-cream hover:bg-gold/20">Elite Transportation Services</SelectItem>
                      <SelectItem value="security" className="text-cream hover:bg-gold/20">Personal Security Services</SelectItem>
                      <SelectItem value="concierge" className="text-cream hover:bg-gold/20">Concierge Intelligence</SelectItem>
                      <SelectItem value="multi-service" className="text-cream hover:bg-gold/20">Multi-Service Packages</SelectItem>
                      <SelectItem value="partnership" className="text-cream hover:bg-gold/20">Partnership Opportunities</SelectItem>
                      <SelectItem value="support" className="text-cream hover:bg-gold/20">Technical Support</SelectItem>
                      <SelectItem value="feedback" className="text-cream hover:bg-gold/20">Service Feedback</SelectItem>
                      <SelectItem value="general" className="text-cream hover:bg-gold/20">General Inquiry</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.inquiryType && (
                    <p className="text-sm text-red-400">{errors.inquiryType.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-cream">Subject *</Label>
                  <Input
                    id="subject"
                    {...register("subject")}
                    className="bg-navy/50 border-gold/20 text-cream placeholder:text-cream/50"
                    placeholder="Brief description of your inquiry or feedback"
                  />
                  {errors.subject && (
                    <p className="text-sm text-red-400">{errors.subject.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-cream">Message *</Label>
                  <Textarea
                    id="message"
                    {...register("message")}
                    rows={5}
                    className="bg-navy/50 border-gold/20 text-cream placeholder:text-cream/50 resize-none"
                    placeholder="Please provide details about your inquiry or feedback, including any specific requirements or timeline..."
                  />
                  {errors.message && (
                    <p className="text-sm text-red-400">{errors.message.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-gold to-gold/80 hover:from-gold/80 hover:to-gold text-navy font-semibold py-3 transition-all duration-200 shadow-lg hover:shadow-xl"
                  disabled={contactMutation.isPending}
                >
                  {contactMutation.isPending ? "Sending Message..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}