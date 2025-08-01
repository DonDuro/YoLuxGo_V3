import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Home, 
  MessageSquare, 
  Calendar,
  Download,
  Share,
  Car,
  Shield,
  Users
} from "lucide-react";
import primaryLogo from "@assets/New Primary YLG Transparent Logo_1753681153359.png";

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();
  const [serviceType, setServiceType] = useState<string>('');
  const [confirmationNumber] = useState(() => 
    'YLG-' + Date.now().toString().slice(-8).toUpperCase()
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const service = urlParams.get('service') || 'service';
    setServiceType(service);
  }, []);

  const getServiceIcon = (service: string) => {
    switch (service) {
      case "transportation": return <Car className="w-8 h-8 text-gold" />;
      case "security": return <Shield className="w-8 h-8 text-gold" />;
      case "concierge": return <Users className="w-8 h-8 text-gold" />;
      case "multi-service": return <CheckCircle className="w-8 h-8 text-gold" />;
      default: return <CheckCircle className="w-8 h-8 text-gold" />;
    }
  };

  const getServiceTitle = (service: string) => {
    switch (service) {
      case "transportation": return "Transportation Service";
      case "security": return "Security Service";
      case "concierge": return "Concierge Service";
      case "multi-service": return "Complete Trip Package";
      default: return "YoLuxGo™ Service";
    }
  };

  const getNextSteps = (service: string) => {
    switch (service) {
      case "transportation":
        return [
          "Your assigned driver will contact you 30 minutes before pickup",
          "Vehicle details and license plate will be sent via SMS",
          "Real-time tracking will be available on your dashboard"
        ];
      case "security":
        return [
          "Your security team lead will contact you within 2 hours",
          "Detailed security briefing will be scheduled 24 hours prior",
          "Emergency contact protocols will be provided"
        ];
      case "concierge":
        return [
          "Your dedicated concierge will reach out within 1 hour",
          "Detailed planning session will be scheduled at your convenience",
          "Regular updates will be provided throughout the process"
        ];
      case "multi-service":
        return [
          "Your trip coordinator will contact you within 1 hour",
          "Comprehensive itinerary will be prepared within 24 hours",
          "All service providers will be briefed and coordinated"
        ];
      default:
        return [
          "You will receive a confirmation email shortly",
          "Our team will contact you to finalize details",
          "24/7 support is available for any questions"
        ];
    }
  };

  return (
    <div className="min-h-screen bg-navy">
      {/* Header */}
      <motion.header 
        className="bg-navy border-b border-gold/20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-center">
            <img 
              src={primaryLogo}
              alt="YoLuxGo™" 
              className="h-10 mr-0.5"
            />
            <span className="font-serif text-2xl text-white font-light">
              YoLuxGo<sup className="text-[0.4rem] ml-0.5 text-gold">™</sup>
            </span>
          </div>
        </div>
      </motion.header>

      {/* Success Content */}
      <div className="container mx-auto px-6 py-16 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-cream">
            Your {getServiceTitle(serviceType)} has been confirmed
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Confirmation Details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-cream/5 border-gold/20">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  {getServiceIcon(serviceType)}
                  <span className="ml-3">Booking Confirmation</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center p-6 bg-gold/10 rounded-lg border border-gold/20">
                  <p className="text-cream mb-2">Confirmation Number</p>
                  <p className="text-2xl font-mono font-bold text-gold tracking-wider">
                    {confirmationNumber}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-cream font-medium mb-2">Service Details:</p>
                    <Badge className="bg-gold/20 text-gold border-gold/30">
                      {getServiceTitle(serviceType)}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-cream font-medium mb-2">Status:</p>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse" />
                      <span className="text-green-400 font-medium">Confirmed & Processing</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-cream font-medium mb-2">Booking Date:</p>
                    <p className="text-white">{new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-cream/5 border-gold/20">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Calendar className="w-6 h-6 mr-3 text-gold" />
                  What Happens Next
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {getNextSteps(serviceType).map((step, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-6 h-6 bg-gold/20 rounded-full flex items-center justify-center mt-0.5 mr-3 flex-shrink-0">
                      <span className="text-gold font-bold text-sm">{index + 1}</span>
                    </div>
                    <p className="text-cream text-sm">{step}</p>
                  </div>
                ))}

                <div className="mt-6 p-4 bg-navy/50 rounded-lg border border-gold/20">
                  <p className="text-gold font-medium mb-2">Important:</p>
                  <p className="text-cream text-sm">
                    Please keep your confirmation number safe. You can access your booking 
                    details anytime from your client dashboard.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Button 
            onClick={() => setLocation('/client')}
            className="bg-gold hover:bg-gold/90 text-navy font-semibold"
          >
            <Home className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          
          <Button 
            variant="outline"
            className="border-gold/30 text-gold hover:bg-gold/10"
            onClick={() => {
              navigator.clipboard.writeText(confirmationNumber);
              // You could add a toast notification here
            }}
          >
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
          
          <Button 
            variant="outline"
            className="border-gold/30 text-gold hover:bg-gold/10"
            onClick={() => window.print()}
          >
            <Download className="w-4 h-4 mr-2" />
            Print
          </Button>
          
          <Button 
            variant="outline"
            className="border-gold/30 text-gold hover:bg-gold/10"
            onClick={() => setLocation('/client/messaging')}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Support
          </Button>
        </motion.div>

        {/* Footer Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <Card className="bg-cream/5 border-gold/20 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-xl font-serif text-white mb-4">
                Welcome to YoLuxGo™ Excellence
              </h3>
              <p className="text-cream mb-6">
                Thank you for choosing YoLuxGo™ for your luxury service needs. 
                Our commitment to discreet luxury and global security ensures 
                you receive world-class service every step of the way.
              </p>
              <div className="flex items-center justify-center text-gold">
                <Shield className="w-5 h-5 mr-2" />
                <span className="font-medium">Discreet Luxury. Global Security.</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}