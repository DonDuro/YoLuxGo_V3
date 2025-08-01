import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Car, Shield, Plane, Home, Eye, EyeOff, CheckCircle, AlertCircle, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useLocation } from 'wouter';

interface BookingRequest {
  type: 'transportation' | 'security' | 'lodging' | 'concierge';
  startDateTime: Date;
  endDateTime?: Date;
  location: string;
  destination?: string;
  details: string;
  vehicleId?: string;
  propertyId?: string;
  personnelId?: string;
  isDecoy: boolean;
  cloakingActive: boolean;
}

export default function RealTimeBooking() {
  const [booking, setBooking] = useState<BookingRequest>({
    type: 'transportation',
    startDateTime: new Date(),
    location: '',
    details: '',
    isDecoy: false,
    cloakingActive: false,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [availableAssets, setAvailableAssets] = useState<any[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  // WebSocket for real-time updates
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'booking_confirmed') {
        toast({
          title: "✓ Booking Confirmed",
          description: "Your request has been processed and assigned.",
        });
      }
    };

    return () => ws.close();
  }, [toast]);

  // Fetch available assets based on booking type
  const { data: assets = [] } = useQuery({
    queryKey: [`/api/inventory/${booking.type === 'transportation' ? 'vehicles' : booking.type === 'lodging' ? 'properties' : 'personnel'}`],
    enabled: currentStep === 2,
  });

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: BookingRequest) => {
      const response = await fetch('/api/client/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
      return response.json();
    },
    onSuccess: () => {
      setCurrentStep(4);
      queryClient.invalidateQueries({ queryKey: ['/api/client/bookings'] });
      toast({
        title: "Booking submitted successfully",
        description: "Your request is being processed by our command center.",
      });
    },
    onError: () => {
      toast({
        title: "Booking failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  });

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Store booking data for payment
      const bookingData = {
        service: booking.type,
        pickupLocation: booking.location,
        dropoffLocation: booking.destination || booking.location,
        serviceType: booking.type === 'transportation' ? 'city-transport' : booking.type,
        vehicleType: booking.vehicleId ? 'luxury-sedan' : 'luxury-sedan',
        date: booking.startDateTime.toISOString().split('T')[0],
        time: booking.startDateTime.toTimeString().split(' ')[0].slice(0, 5),
        passengers: 1,
        specialRequests: booking.details,
        duration: booking.endDateTime ? 
          Math.ceil((booking.endDateTime.getTime() - booking.startDateTime.getTime()) / (1000 * 60 * 60)) : 4,
        teamSize: 1,
        threatLevel: 'medium',
        complexity: 'moderate',
        timeline: 'standard',
        budget: 1000,
        cloakingActive: booking.cloakingActive,
        isDecoy: booking.isDecoy
      };
      
      localStorage.setItem('yoluxgo_booking_data', JSON.stringify(bookingData));
      setLocation('/checkout');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1: return <Calendar className="h-5 w-5" />;
      case 2: return booking.type === 'transportation' ? <Car className="h-5 w-5" /> : 
                   booking.type === 'security' ? <Shield className="h-5 w-5" /> :
                   booking.type === 'lodging' ? <Home className="h-5 w-5" /> : <Plane className="h-5 w-5" />;
      case 3: return <CheckCircle className="h-5 w-5" />;
      default: return <AlertCircle className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Real-Time Booking System</h1>
          <p className="text-gray-300">
            Advanced scheduling with live availability and instant confirmation
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step 
                    ? 'bg-yellow-400 border-yellow-400 text-black' 
                    : 'border-gray-500 text-gray-500'
                }`}>
                  {currentStep > step ? <CheckCircle className="h-5 w-5" /> : getStepIcon(step)}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-0.5 ${
                    currentStep > step ? 'bg-yellow-400' : 'bg-gray-500'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-8 mt-2">
            <span className="text-xs text-gray-400">Service Details</span>
            <span className="text-xs text-gray-400">Asset Selection</span>
            <span className="text-xs text-gray-400">Confirmation</span>
          </div>
        </div>

        {/* Step 1: Service Details */}
        {currentStep === 1 && (
          <Card className="border-gray-700 bg-gray-900/50">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Service Details & Scheduling
              </CardTitle>
              <CardDescription>
                Configure your service requirements and timing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Service Type */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Service Type</Label>
                <Select value={booking.type} onValueChange={(value: any) => setBooking({...booking, type: value})}>
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transportation">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4" />
                        Elite Transportation
                      </div>
                    </SelectItem>
                    <SelectItem value="security">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Personal Security
                      </div>
                    </SelectItem>
                    <SelectItem value="lodging">
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        Luxury Lodging
                      </div>
                    </SelectItem>
                    <SelectItem value="concierge">
                      <div className="flex items-center gap-2">
                        <Plane className="h-4 w-4" />
                        Concierge Intelligence
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date and Time */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Start Date & Time</Label>
                  <Input
                    type="datetime-local"
                    value={booking.startDateTime.toISOString().slice(0, 16)}
                    onChange={(e) => setBooking({...booking, startDateTime: new Date(e.target.value)})}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">End Date & Time (Optional)</Label>
                  <Input
                    type="datetime-local"
                    value={booking.endDateTime?.toISOString().slice(0, 16) || ''}
                    onChange={(e) => setBooking({...booking, endDateTime: e.target.value ? new Date(e.target.value) : undefined})}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Pickup/Meeting Location</Label>
                  <Input
                    value={booking.location}
                    onChange={(e) => setBooking({...booking, location: e.target.value})}
                    placeholder="Enter address or landmark..."
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                {booking.type === 'transportation' && (
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Destination (Optional)</Label>
                    <Input
                      value={booking.destination || ''}
                      onChange={(e) => setBooking({...booking, destination: e.target.value})}
                      placeholder="Enter destination..."
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                )}
              </div>

              {/* Details */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Special Requirements</Label>
                <Textarea
                  value={booking.details}
                  onChange={(e) => setBooking({...booking, details: e.target.value})}
                  placeholder="Any specific requirements, preferences, or security considerations..."
                  className="bg-gray-800 border-gray-700"
                  rows={3}
                />
              </div>

              {/* Privacy Options */}
              <div className="border-t border-gray-700 pt-4">
                <h4 className="text-sm font-medium mb-4 text-gray-300">Privacy & Security Options</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <EyeOff className="h-4 w-4 text-purple-400" />
                      <Label htmlFor="cloaking" className="text-sm">Enable Cloaking</Label>
                      <span className="text-xs text-gray-400">(Hides real details from logs)</span>
                    </div>
                    <Switch
                      id="cloaking"
                      checked={booking.cloakingActive}
                      onCheckedChange={(checked) => setBooking({...booking, cloakingActive: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Eye className="h-4 w-4 text-blue-400" />
                      <Label htmlFor="decoy" className="text-sm">Deploy Decoy Service</Label>
                      <span className="text-xs text-gray-400">(Creates false booking data)</span>
                    </div>
                    <Switch
                      id="decoy"
                      checked={booking.isDecoy}
                      onCheckedChange={(checked) => setBooking({...booking, isDecoy: checked})}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Asset Selection */}
        {currentStep === 2 && (
          <Card className="border-gray-700 bg-gray-900/50">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center gap-2">
                {getStepIcon(2)}
                Select Your Asset
              </CardTitle>
              <CardDescription>
                Choose from available {booking.type} options for your requested time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assets.map((asset: any) => (
                  <Card 
                    key={asset.id}
                    className={`cursor-pointer border-2 transition-colors ${
                      (booking.vehicleId === asset.id || booking.propertyId === asset.id || booking.personnelId === asset.id)
                        ? 'border-yellow-400 bg-yellow-900/20'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                    onClick={() => {
                      if (booking.type === 'transportation') {
                        setBooking({...booking, vehicleId: asset.id});
                      } else if (booking.type === 'lodging') {
                        setBooking({...booking, propertyId: asset.id});
                      } else {
                        setBooking({...booking, personnelId: asset.id});
                      }
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{asset.name || `${asset.make} ${asset.model}` || `${asset.firstName} ${asset.lastName}`}</h4>
                        <div className={`w-2 h-2 rounded-full ${asset.available ? 'bg-green-400' : 'bg-red-400'}`} />
                      </div>
                      
                      <p className="text-sm text-gray-400 mb-2">
                        {asset.category || asset.type} • {asset.location}
                      </p>
                      
                      {asset.hourlyRate && (
                        <p className="text-sm text-yellow-400">
                          ${asset.hourlyRate}/hour • ${asset.dailyRate}/day
                        </p>
                      )}
                      
                      {asset.dailyRate && !asset.hourlyRate && (
                        <p className="text-sm text-yellow-400">
                          ${asset.dailyRate}/day
                        </p>
                      )}
                      
                      {asset.rating && (
                        <p className="text-xs text-gray-400 mt-1">
                          Rating: {asset.rating}/5.0
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Confirmation */}
        {currentStep === 3 && (
          <Card className="border-gray-700 bg-gray-900/50">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Confirm Your Booking
              </CardTitle>
              <CardDescription>
                Review all details before submitting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 text-gray-300">Service Details</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-400">Type:</span> {booking.type}</p>
                    <p><span className="text-gray-400">Start:</span> {booking.startDateTime.toLocaleString()}</p>
                    {booking.endDateTime && (
                      <p><span className="text-gray-400">End:</span> {booking.endDateTime.toLocaleString()}</p>
                    )}
                    <p><span className="text-gray-400">Location:</span> {booking.location}</p>
                    {booking.destination && (
                      <p><span className="text-gray-400">Destination:</span> {booking.destination}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3 text-gray-300">Privacy Settings</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      {booking.cloakingActive ? <EyeOff className="h-4 w-4 text-purple-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                      <span>Cloaking: {booking.cloakingActive ? 'Active' : 'Inactive'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {booking.isDecoy ? <Eye className="h-4 w-4 text-blue-400" /> : <EyeOff className="h-4 w-4 text-gray-400" />}
                      <span>Decoy Service: {booking.isDecoy ? 'Enabled' : 'Disabled'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {booking.details && (
                <div>
                  <h4 className="font-medium mb-2 text-gray-300">Special Requirements</h4>
                  <p className="text-sm text-gray-400 bg-gray-800/50 p-3 rounded">
                    {booking.details}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 4: Success */}
        {currentStep === 4 && (
          <Card className="border-green-500 bg-green-900/20">
            <CardContent className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-400 mb-2">Booking Confirmed!</h2>
              <p className="text-gray-300 mb-6">
                Your request has been submitted and is being processed by our command center.
                You will receive real-time updates on the status.
              </p>
              <Button 
                onClick={() => {
                  setCurrentStep(1);
                  setBooking({
                    type: 'transportation',
                    startDateTime: new Date(),
                    location: '',
                    details: '',
                    isDecoy: false,
                    cloakingActive: false,
                  });
                }}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                Create Another Booking
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        {currentStep < 4 && (
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={
                (currentStep === 1 && (!booking.location || !booking.details)) ||
                (currentStep === 2 && !booking.vehicleId && !booking.propertyId && !booking.personnelId) ||
                createBookingMutation.isPending
              }
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              {currentStep === 3 ? (
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4" />
                  <span>Proceed to Payment</span>
                </div>
              ) : 'Next'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}