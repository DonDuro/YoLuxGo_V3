import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  CreditCard, 
  Shield, 
  ArrowLeft, 
  CheckCircle,
  Car,
  Users,
  MapPin,
  Clock,
  DollarSign,
  Info
} from "lucide-react";
import primaryLogo from "@assets/New Primary YLG Transparent Logo_1753681153359.png";
import { calculateClientFees, ServicePricing, type FeeBreakdown } from '@shared/fee-schema';

// Load Stripe
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface CheckoutFormProps {
  bookingData: any;
  clientSecret: string;
  amount: number;
  breakdown: any;
  onSuccess: () => void;
}

const CheckoutForm = ({ bookingData, clientSecret, amount, breakdown, onSuccess }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!stripe || !elements) {
      setIsProcessing(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success?service=${bookingData.service}`,
      },
    });

    if (error) {
      console.error("Payment failed:", error.message);
      toast({
        title: "Payment Failed",
        description: error.message || "Please try again or contact support.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Your YoLuxGo™ service has been booked successfully!",
      });
      onSuccess();
    }
    
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-6 bg-cream/5 rounded-lg border border-gold/20">
        <PaymentElement 
          options={{
            layout: {
              type: 'accordion',
              defaultCollapsed: false,
              radios: false,
              spacedAccordionItems: true
            },
            fields: {
              billingDetails: {
                name: 'auto',
                email: 'auto',
                phone: 'auto',
                address: {
                  country: 'auto',
                  line1: 'auto',
                  line2: 'auto',
                  city: 'auto',
                  state: 'auto',
                  postalCode: 'auto'
                }
              }
            }
          }}
        />
      </div>
      
      <div className="flex items-center justify-center space-x-3 text-cream/60 text-sm">
        <Shield className="w-4 h-4" />
        <span>Secured by Stripe • 256-bit SSL encryption</span>
      </div>
      
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full bg-gold hover:bg-gold/90 text-navy font-semibold py-3 text-lg"
      >
        {isProcessing ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin w-5 h-5 border-2 border-navy border-t-transparent rounded-full" />
            <span>Processing Payment...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Pay ${amount.toFixed(2)} - Complete Booking</span>
          </div>
        )}
      </Button>
    </form>
  );
};

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [clientSecret, setClientSecret] = useState("");
  const [bookingData, setBookingData] = useState<any>(null);
  const [amount, setAmount] = useState(0);
  const [breakdown, setBreakdown] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get booking data from URL params or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const service = urlParams.get('service');
    const storedBookingData = localStorage.getItem('yoluxgo_booking_data');
    
    if (!storedBookingData) {
      setError("No booking data found. Please start a new booking.");
      setIsLoading(false);
      return;
    }

    try {
      const data = JSON.parse(storedBookingData);
      setBookingData(data);
      
      // Create payment intent based on service type
      let endpoint = "/api/create-payment-intent";
      let payload = { amount: 100, description: "YoLuxGo™ Service" };
      
      switch (data.service) {
        case "transportation":
          endpoint = "/api/payments/transportation";
          payload = {
            pickupLocation: data.pickupLocation,
            dropoffLocation: data.dropoffLocation,
            serviceType: data.serviceType,
            vehicleType: data.vehicleType,
            date: data.date,
            time: data.time,
            passengers: data.passengers,
            specialRequests: data.specialRequests
          };
          break;
        case "security":
          endpoint = "/api/payments/security";
          payload = {
            serviceType: data.serviceType,
            location: data.location,
            duration: data.duration,
            date: data.date,
            time: data.time,
            teamSize: data.teamSize,
            threatLevel: data.threatLevel,
            specialRequests: data.specialRequests
          };
          break;
        case "concierge":
          endpoint = "/api/payments/concierge";
          payload = {
            serviceType: data.serviceType,
            complexity: data.complexity,
            timeline: data.timeline,
            location: data.location,
            budget: data.budget,
            specialRequests: data.specialRequests
          };
          break;
        case "multi-service":
          endpoint = "/api/payments/multi-service";
          payload = {
            services: data.services,
            tripDetails: data.tripDetails,
            totalEstimate: data.totalEstimate
          };
          break;
      }

      apiRequest("POST", endpoint, payload)
        .then((res) => res.json())
        .then((responseData) => {
          setClientSecret(responseData.clientSecret);
          setAmount(responseData.amount);
          setBreakdown(responseData.breakdown);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error creating payment intent:", error);
          setError("Error setting up payment. Please try again.");
          setIsLoading(false);
        });
    } catch (err) {
      setError("Invalid booking data. Please start a new booking.");
      setIsLoading(false);
    }
  }, []);

  const handlePaymentSuccess = () => {
    // Clear booking data and redirect to success page
    localStorage.removeItem('yoluxgo_booking_data');
    setLocation('/payment-success');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-gold border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-cream">Setting up your secure payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <Card className="bg-cream/5 border-gold/20 max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-white mb-4">Payment Error</h2>
            <p className="text-cream mb-6">{error}</p>
            <Button 
              onClick={() => setLocation('/')}
              className="bg-gold hover:bg-gold/90 text-navy"
            >
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-center">
          <p className="text-cream">Loading payment details...</p>
        </div>
      </div>
    );
  }

  const getServiceIcon = (service: string) => {
    switch (service) {
      case "transportation": return <Car className="w-6 h-6" />;
      case "security": return <Shield className="w-6 h-6" />;
      case "concierge": return <Users className="w-6 h-6" />;
      case "multi-service": return <CheckCircle className="w-6 h-6" />;
      default: return <CheckCircle className="w-6 h-6" />;
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
            <Button 
              variant="ghost"
              onClick={() => window.history.back()}
              className="text-cream hover:text-gold transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Summary */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-cream/5 border-gold/20">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  {getServiceIcon(bookingData.service)}
                  <span className="ml-3">{getServiceTitle(bookingData.service)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Service Details */}
                <div className="space-y-4">
                  {bookingData.service === "transportation" && (
                    <>
                      <div className="flex items-center text-cream">
                        <MapPin className="w-4 h-4 mr-3 text-gold" />
                        <div>
                          <p className="font-medium">{bookingData.pickupLocation}</p>
                          <p className="text-sm text-cream/60">to {bookingData.dropoffLocation}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-cream">
                        <Clock className="w-4 h-4 mr-3 text-gold" />
                        <span>{bookingData.date} at {bookingData.time}</span>
                      </div>
                      <div className="flex items-center text-cream">
                        <Car className="w-4 h-4 mr-3 text-gold" />
                        <span>{bookingData.vehicleType}</span>
                      </div>
                    </>
                  )}

                  {bookingData.service === "security" && (
                    <>
                      <div className="flex items-center text-cream">
                        <MapPin className="w-4 h-4 mr-3 text-gold" />
                        <span>{bookingData.location}</span>
                      </div>
                      <div className="flex items-center text-cream">
                        <Clock className="w-4 h-4 mr-3 text-gold" />
                        <span>{bookingData.date} at {bookingData.time}</span>
                      </div>
                      <div className="flex items-center text-cream">
                        <Shield className="w-4 h-4 mr-3 text-gold" />
                        <span>{bookingData.serviceType} for {bookingData.duration} hours</span>
                      </div>
                    </>
                  )}

                  {bookingData.service === "concierge" && (
                    <>
                      <div className="flex items-center text-cream">
                        <Users className="w-4 h-4 mr-3 text-gold" />
                        <span>{bookingData.serviceType}</span>
                      </div>
                      <div className="flex items-center text-cream">
                        <MapPin className="w-4 h-4 mr-3 text-gold" />
                        <span>{bookingData.location}</span>
                      </div>
                      <div>
                        <Badge className="bg-gold/20 text-gold border-gold/30">
                          {bookingData.complexity} complexity
                        </Badge>
                        <Badge className="bg-gold/20 text-gold border-gold/30 ml-2">
                          {bookingData.timeline} timeline
                        </Badge>
                      </div>
                    </>
                  )}
                </div>

                <Separator className="bg-gold/20" />

                {/* Price Breakdown */}
                {breakdown && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-gold">Price Breakdown</h4>
                      <Info className="w-4 h-4 text-gold/60" />
                    </div>
                    {breakdown.baseAmount && (
                      <div className="flex justify-between text-cream">
                        <span>Service Base Price</span>
                        <span>${breakdown.baseAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-cream">
                      <span>YoLuxGo™ Booking Fee (10%)</span>
                      <span>${(breakdown.baseAmount * 0.10).toFixed(2)}</span>
                    </div>
                    {breakdown.isRush && (
                      <div className="flex justify-between text-yellow-400">
                        <span>Rush Service Fee (5%)</span>
                        <span>${(breakdown.baseAmount * 0.05).toFixed(2)}</span>
                      </div>
                    )}
                    {breakdown.serviceMultiplier && breakdown.serviceMultiplier !== 1 && (
                      <div className="flex justify-between text-cream">
                        <span>Service Multiplier</span>
                        <span>×{breakdown.serviceMultiplier}</span>
                      </div>
                    )}
                    {breakdown.packageDiscount && (
                      <div className="flex justify-between text-green-400">
                        <span>Package Discount ({breakdown.discountPercentage}%)</span>
                        <span>-${breakdown.packageDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    <Separator className="bg-gold/20" />
                    <div className="flex justify-between text-white font-semibold text-lg">
                      <span>Total</span>
                      <span>${amount.toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-cream/60 mt-4 space-y-1">
                      <p>• Platform fees support premium security and service quality</p>
                      <p>• Service providers receive 80% of base service price</p>
                      <p>• All payments securely processed through Stripe</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-cream/5 border-gold/20">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <CreditCard className="w-6 h-6 mr-3 text-gold" />
                  Secure Payment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm 
                    bookingData={bookingData}
                    clientSecret={clientSecret}
                    amount={amount}
                    breakdown={breakdown}
                    onSuccess={handlePaymentSuccess}
                  />
                </Elements>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}