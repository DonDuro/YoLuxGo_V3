import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft, Car, Shield, Crown, Building, Plus, Minus, CheckCircle, Calendar, MapPin, Clock, Users, CreditCard } from "lucide-react";
import ylgBrandLogo from "@assets/New Primary YLG Transparent Logo_1753681153359.png";
import { useLocation } from 'wouter';

interface ServiceRequest {
  id: string;
  type: 'transportation' | 'security' | 'concierge' | 'lodging';
  enabled: boolean;
  details: any;
}

interface MultiServiceBooking {
  tripName: string;
  startDateTime: string;
  endDateTime: string;
  primaryLocation: string;
  additionalLocations: string[];
  guestCount: number;
  specialRequirements: string;
  priority: 'standard' | 'urgent' | 'critical';
  confidential: boolean;
  services: ServiceRequest[];
  estimatedBudget: string;
}

export default function MultiServiceBooking() {
  const [booking, setBooking] = useState<MultiServiceBooking>({
    tripName: '',
    startDateTime: new Date().toISOString().slice(0, 16),
    endDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    primaryLocation: '',
    additionalLocations: [],
    guestCount: 1,
    specialRequirements: '',
    priority: 'standard',
    confidential: false,
    services: [
      {
        id: 'transportation',
        type: 'transportation',
        enabled: false,
        details: {
          vehicleType: 'luxury_sedan',
          routeType: 'point_to_point',
          multiStop: false,
          luggageAssistance: true,
          specialRequests: ''
        }
      },
      {
        id: 'security',
        type: 'security',
        enabled: false,
        details: {
          serviceType: 'executive',
          protectionLevel: 'standard',
          personnelCount: 1,
          armedProtection: false,
          counterSurveillance: false,
          emergencyMedical: false
        }
      },
      {
        id: 'concierge',
        type: 'concierge',
        enabled: false,
        details: {
          serviceType: 'travel',
          vipTreatment: true,
          reservations: true,
          personalShopping: false,
          eventPlanning: false
        }
      },
      {
        id: 'lodging',
        type: 'lodging',
        enabled: false,
        details: {
          accommodationType: 'luxury_hotel',
          roomConfiguration: 'suite',
          specialAmenities: true,
          locationPreference: 'city_center',
          securityLevel: 'standard',
          privacyRequirements: 'standard'
        }
      }
    ],
    estimatedBudget: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [newLocation, setNewLocation] = useState('');
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Submit multi-service booking
  const submitBookingMutation = useMutation({
    mutationFn: async (bookingData: MultiServiceBooking) => {
      const response = await fetch('/api/client/multi-service/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
      return response.json();
    },
    onSuccess: () => {
      setCurrentStep(4);
      toast({
        title: "Multi-Service Package Booked",
        description: "Your comprehensive service package has been submitted. Our coordination team will contact you shortly.",
      });
    },
    onError: () => {
      toast({
        title: "Booking failed",
        description: "Please try again or contact our concierge team directly.",
        variant: "destructive",
      });
    }
  });

  const toggleService = (serviceId: string) => {
    setBooking(prev => ({
      ...prev,
      services: prev.services.map(service =>
        service.id === serviceId
          ? { ...service, enabled: !service.enabled }
          : service
      )
    }));
  };

  const updateServiceDetail = (serviceId: string, field: string, value: any) => {
    setBooking(prev => ({
      ...prev,
      services: prev.services.map(service =>
        service.id === serviceId
          ? { ...service, details: { ...service.details, [field]: value } }
          : service
      )
    }));
  };

  const addLocation = () => {
    if (newLocation && !booking.additionalLocations.includes(newLocation) && newLocation !== booking.primaryLocation) {
      setBooking(prev => ({
        ...prev,
        additionalLocations: [...prev.additionalLocations, newLocation]
      }));
      setNewLocation('');
    }
  };

  const removeLocation = (index: number) => {
    setBooking(prev => ({
      ...prev,
      additionalLocations: prev.additionalLocations.filter((_, i) => i !== index)
    }));
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'transportation': return <Car className="h-5 w-5" />;
      case 'security': return <Shield className="h-5 w-5" />;
      case 'concierge': return <Crown className="h-5 w-5" />;
      case 'lodging': return <Building className="h-5 w-5" />;
      default: return <Car className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'standard': return 'text-blue-400';
      case 'urgent': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      const enabledServices = booking.services.filter(s => s.enabled);
      if (enabledServices.length === 0) {
        toast({
          title: "No services selected",
          description: "Please select at least one service for your trip.",
          variant: "destructive",
        });
        return;
      }
      
      // Store multi-service booking data for payment
      const servicesData: any = {};
      enabledServices.forEach(service => {
        servicesData[service.type] = service.details;
      });
      
      const bookingData = {
        service: 'multi-service',
        services: servicesData,
        tripDetails: {
          name: booking.tripName,
          destination: booking.primaryLocation,
          duration: Math.ceil((new Date(booking.endDateTime).getTime() - new Date(booking.startDateTime).getTime()) / (1000 * 60 * 60 * 24)),
          startDate: booking.startDateTime.split('T')[0],
          endDate: booking.endDateTime.split('T')[0],
          guestCount: booking.guestCount,
          additionalLocations: booking.additionalLocations,
          priority: booking.priority
        },
        totalEstimate: parseInt(booking.estimatedBudget) || 5000,
        specialRequirements: booking.specialRequirements,
        confidential: booking.confidential
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1a2f] via-[#1a2b3f] to-[#2a3b4f] text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back Button and Brand */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => setLocation('/client/dashboard')}
            variant="ghost"
            className="text-white hover:text-[#d4af37] hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center">
            <img src={ylgBrandLogo} alt="YoLuxGo™" className="h-10 mr-1" />
            <div className="text-right">
              <h2 className="text-lg font-serif text-white">
                YoLuxGo<sup className="text-[0.3rem] ml-0.5 text-[#d4af37]">™</sup>
              </h2>
              <p className="text-xs text-gray-300">Powered By Nebusis<sup className="text-[0.2rem] ml-0.5">®</sup></p>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Multi-Service Booking</h1>
          <p className="text-gray-300">
            Comprehensive service packages for your complete travel experience
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[
              { num: 1, label: 'Trip Details' },
              { num: 2, label: 'Service Selection' },
              { num: 3, label: 'Final Review' }
            ].map((step) => (
              <div key={step.num} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.num 
                    ? 'bg-yellow-400 border-yellow-400 text-black' 
                    : 'border-gray-500 text-gray-500'
                }`}>
                  {currentStep > step.num ? <CheckCircle className="h-5 w-5" /> : step.num}
                </div>
                {step.num < 3 && (
                  <div className={`w-16 h-0.5 ${
                    currentStep > step.num ? 'bg-yellow-400' : 'bg-gray-500'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-16 mt-2">
            <span className="text-xs text-gray-400">Trip Details</span>
            <span className="text-xs text-gray-400">Service Selection</span>
            <span className="text-xs text-gray-400">Final Review</span>
          </div>
        </div>

        {/* Step 1: Trip Details */}
        {currentStep === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-gray-700 bg-gray-900/50">
              <CardHeader>
                <CardTitle className="text-yellow-400 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Trip Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="tripName">Trip/Event Name</Label>
                  <Input
                    id="tripName"
                    placeholder="e.g., Executive Retreat, Family Vacation, Business Summit"
                    value={booking.tripName}
                    onChange={(e) => setBooking(prev => ({ ...prev, tripName: e.target.value }))}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDateTime">Start Date & Time</Label>
                    <Input
                      id="startDateTime"
                      type="datetime-local"
                      value={booking.startDateTime}
                      onChange={(e) => setBooking(prev => ({ ...prev, startDateTime: e.target.value }))}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDateTime">End Date & Time</Label>
                    <Input
                      id="endDateTime"
                      type="datetime-local"
                      value={booking.endDateTime}
                      onChange={(e) => setBooking(prev => ({ ...prev, endDateTime: e.target.value }))}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="guestCount">Number of Guests</Label>
                  <Select value={booking.guestCount.toString()} onValueChange={(value) => setBooking(prev => ({ ...prev, guestCount: parseInt(value) }))}>
                    <SelectTrigger className="bg-gray-800 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map(count => (
                        <SelectItem key={count} value={count.toString()}>{count} {count === 1 ? 'Guest' : 'Guests'}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select value={booking.priority} onValueChange={(value: any) => setBooking(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger className="bg-gray-800 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-700 bg-gray-900/50">
              <CardHeader>
                <CardTitle className="text-yellow-400 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Locations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="primaryLocation">Primary Location</Label>
                  <Select value={booking.primaryLocation} onValueChange={(value) => setBooking(prev => ({ ...prev, primaryLocation: value }))}>
                    <SelectTrigger className="bg-gray-800 border-gray-600">
                      <SelectValue placeholder="Select primary location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New York City, USA">New York City, USA</SelectItem>
                      <SelectItem value="Miami, USA">Miami, USA</SelectItem>
                      <SelectItem value="Los Angeles, USA">Los Angeles, USA</SelectItem>
                      <SelectItem value="Punta Cana, Dominican Republic">Punta Cana, Dominican Republic</SelectItem>
                      <SelectItem value="Málaga-Marbella, Spain">Málaga-Marbella, Spain</SelectItem>
                      <SelectItem value="La Romana - Casa de Campo, Dominican Republic">La Romana - Casa de Campo, Dominican Republic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Additional Locations</Label>
                  <div className="flex gap-2">
                    <Select value={newLocation} onValueChange={(value) => setNewLocation(value)}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 flex-1">
                        <SelectValue placeholder="Select additional location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New York City, USA">New York City, USA</SelectItem>
                        <SelectItem value="Miami, USA">Miami, USA</SelectItem>
                        <SelectItem value="Los Angeles, USA">Los Angeles, USA</SelectItem>
                        <SelectItem value="Punta Cana, Dominican Republic">Punta Cana, Dominican Republic</SelectItem>
                        <SelectItem value="Málaga-Marbella, Spain">Málaga-Marbella, Spain</SelectItem>
                        <SelectItem value="La Romana - Casa de Campo, Dominican Republic">La Romana - Casa de Campo, Dominican Republic</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={addLocation} size="sm" className="bg-yellow-400 text-black hover:bg-yellow-500" disabled={!newLocation}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {booking.additionalLocations.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {booking.additionalLocations.map((location, index) => (
                        <Badge key={index} variant="secondary" className="bg-gray-700 text-white">
                          {location}
                          <button
                            onClick={() => removeLocation(index)}
                            className="ml-2 hover:text-red-400"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="estimatedBudget">Estimated Budget (Optional)</Label>
                  <Select value={booking.estimatedBudget} onValueChange={(value) => setBooking(prev => ({ ...prev, estimatedBudget: value }))}>
                    <SelectTrigger className="bg-gray-800 border-gray-600">
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                      <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                      <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                      <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                      <SelectItem value="100k+">$100,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="confidential"
                    checked={booking.confidential}
                    onCheckedChange={(checked) => setBooking(prev => ({ ...prev, confidential: checked }))}
                  />
                  <Label htmlFor="confidential">Confidential/High-Profile Trip</Label>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-700 bg-gray-900/50 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-yellow-400">Special Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Describe any special requirements, preferences, or important details about your trip..."
                  value={booking.specialRequirements}
                  onChange={(e) => setBooking(prev => ({ ...prev, specialRequirements: e.target.value }))}
                  className="bg-gray-800 border-gray-600 text-white min-h-[100px]"
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Service Selection */}
        {currentStep === 2 && (
          <div className="space-y-6">
            {booking.services.map((service) => (
              <Card key={service.id} className={`border-gray-700 transition-all ${
                service.enabled ? 'bg-gray-900/70 border-yellow-400' : 'bg-gray-900/30'
              }`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                      {getServiceIcon(service.type)}
                      <span className="capitalize">{service.type} Services</span>
                      {service.enabled && <Badge className="bg-yellow-400 text-black">Selected</Badge>}
                    </CardTitle>
                    <Switch
                      checked={service.enabled}
                      onCheckedChange={() => toggleService(service.id)}
                    />
                  </div>
                </CardHeader>
                
                {service.enabled && (
                  <CardContent className="pt-0">
                    {/* Transportation Service Details */}
                    {service.type === 'transportation' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Vehicle Type</Label>
                          <Select 
                            value={service.details.vehicleType} 
                            onValueChange={(value) => updateServiceDetail(service.id, 'vehicleType', value)}
                          >
                            <SelectTrigger className="bg-gray-800 border-gray-600">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="luxury_sedan">Luxury Sedan</SelectItem>
                              <SelectItem value="executive_suv">Executive SUV</SelectItem>
                              <SelectItem value="limousine">Limousine</SelectItem>
                              <SelectItem value="private_jet">Private Jet</SelectItem>
                              <SelectItem value="yacht">Yacht</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Route Type</Label>
                          <Select 
                            value={service.details.routeType} 
                            onValueChange={(value) => updateServiceDetail(service.id, 'routeType', value)}
                          >
                            <SelectTrigger className="bg-gray-800 border-gray-600">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="point_to_point">Point to Point</SelectItem>
                              <SelectItem value="multi_stop">Multi-Stop Tour</SelectItem>
                              <SelectItem value="hourly">Hourly Service</SelectItem>
                              <SelectItem value="full_day">Full Day Service</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`${service.id}-luggage`}
                            checked={service.details.luggageAssistance}
                            onCheckedChange={(checked) => updateServiceDetail(service.id, 'luggageAssistance', checked)}
                          />
                          <Label htmlFor={`${service.id}-luggage`}>Luggage Assistance</Label>
                        </div>
                      </div>
                    )}

                    {/* Security Service Details */}
                    {service.type === 'security' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Protection Level</Label>
                          <Select 
                            value={service.details.protectionLevel} 
                            onValueChange={(value) => updateServiceDetail(service.id, 'protectionLevel', value)}
                          >
                            <SelectTrigger className="bg-gray-800 border-gray-600">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="standard">Standard</SelectItem>
                              <SelectItem value="enhanced">Enhanced</SelectItem>
                              <SelectItem value="maximum">Maximum</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Personnel Count</Label>
                          <Select 
                            value={service.details.personnelCount.toString()} 
                            onValueChange={(value) => updateServiceDetail(service.id, 'personnelCount', parseInt(value))}
                          >
                            <SelectTrigger className="bg-gray-800 border-gray-600">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5, 6].map(count => (
                                <SelectItem key={count} value={count.toString()}>{count} Personnel</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`${service.id}-armed`}
                            checked={service.details.armedProtection}
                            onCheckedChange={(checked) => updateServiceDetail(service.id, 'armedProtection', checked)}
                          />
                          <Label htmlFor={`${service.id}-armed`}>Armed Protection</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`${service.id}-surveillance`}
                            checked={service.details.counterSurveillance}
                            onCheckedChange={(checked) => updateServiceDetail(service.id, 'counterSurveillance', checked)}
                          />
                          <Label htmlFor={`${service.id}-surveillance`}>Counter-Surveillance</Label>
                        </div>
                      </div>
                    )}

                    {/* Concierge Service Details */}
                    {service.type === 'concierge' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Primary Service</Label>
                          <Select 
                            value={service.details.serviceType} 
                            onValueChange={(value) => updateServiceDetail(service.id, 'serviceType', value)}
                          >
                            <SelectTrigger className="bg-gray-800 border-gray-600">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="travel">Travel Planning</SelectItem>
                              <SelectItem value="event">Event Management</SelectItem>
                              <SelectItem value="shopping">Personal Shopping</SelectItem>
                              <SelectItem value="business">Business Services</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`${service.id}-vip`}
                            checked={service.details.vipTreatment}
                            onCheckedChange={(checked) => updateServiceDetail(service.id, 'vipTreatment', checked)}
                          />
                          <Label htmlFor={`${service.id}-vip`}>VIP Treatment</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`${service.id}-reservations`}
                            checked={service.details.reservations}
                            onCheckedChange={(checked) => updateServiceDetail(service.id, 'reservations', checked)}
                          />
                          <Label htmlFor={`${service.id}-reservations`}>Restaurant Reservations</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`${service.id}-shopping`}
                            checked={service.details.personalShopping}
                            onCheckedChange={(checked) => updateServiceDetail(service.id, 'personalShopping', checked)}
                          />
                          <Label htmlFor={`${service.id}-shopping`}>Personal Shopping</Label>
                        </div>
                      </div>
                    )}

                    {/* Lodging Service Details */}
                    {service.type === 'lodging' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Accommodation Type</Label>
                          <Select 
                            value={service.details.accommodationType} 
                            onValueChange={(value) => updateServiceDetail(service.id, 'accommodationType', value)}
                          >
                            <SelectTrigger className="bg-gray-800 border-gray-600">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="luxury_hotel">Luxury Hotel</SelectItem>
                              <SelectItem value="private_villa">Private Villa</SelectItem>
                              <SelectItem value="exclusive_resort">Exclusive Resort</SelectItem>
                              <SelectItem value="yacht_charter">Yacht Charter</SelectItem>
                              <SelectItem value="penthouse">Penthouse Suite</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Room Configuration</Label>
                          <Select 
                            value={service.details.roomConfiguration} 
                            onValueChange={(value) => updateServiceDetail(service.id, 'roomConfiguration', value)}
                          >
                            <SelectTrigger className="bg-gray-800 border-gray-600">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="suite">Executive Suite</SelectItem>
                              <SelectItem value="presidential">Presidential Suite</SelectItem>
                              <SelectItem value="villa">Private Villa</SelectItem>
                              <SelectItem value="multi_bedroom">Multi-Bedroom Setup</SelectItem>
                              <SelectItem value="entire_floor">Entire Floor</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Location Preference</Label>
                          <Select 
                            value={service.details.locationPreference} 
                            onValueChange={(value) => updateServiceDetail(service.id, 'locationPreference', value)}
                          >
                            <SelectTrigger className="bg-gray-800 border-gray-600">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="city_center">City Center</SelectItem>
                              <SelectItem value="waterfront">Waterfront</SelectItem>
                              <SelectItem value="private_estate">Private Estate</SelectItem>
                              <SelectItem value="business_district">Business District</SelectItem>
                              <SelectItem value="secluded">Secluded/Remote</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Security Level</Label>
                          <Select 
                            value={service.details.securityLevel} 
                            onValueChange={(value) => updateServiceDetail(service.id, 'securityLevel', value)}
                          >
                            <SelectTrigger className="bg-gray-800 border-gray-600">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="standard">Standard</SelectItem>
                              <SelectItem value="enhanced">Enhanced</SelectItem>
                              <SelectItem value="maximum">Maximum</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`${service.id}-amenities`}
                            checked={service.details.specialAmenities}
                            onCheckedChange={(checked) => updateServiceDetail(service.id, 'specialAmenities', checked)}
                          />
                          <Label htmlFor={`${service.id}-amenities`}>Special Amenities</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`${service.id}-privacy`}
                            checked={service.details.privacyRequirements === 'high'}
                            onCheckedChange={(checked) => updateServiceDetail(service.id, 'privacyRequirements', checked ? 'high' : 'standard')}
                          />
                          <Label htmlFor={`${service.id}-privacy`}>High Privacy Requirements</Label>
                        </div>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Step 3: Final Review */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <Card className="border-gray-700 bg-gray-900/50">
              <CardHeader>
                <CardTitle className="text-yellow-400">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-white mb-3">Trip Details</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-400">Trip Name:</span> {booking.tripName}</p>
                      <p><span className="text-gray-400">Dates:</span> {new Date(booking.startDateTime).toLocaleDateString()} - {new Date(booking.endDateTime).toLocaleDateString()}</p>
                      <p><span className="text-gray-400">Primary Location:</span> {booking.primaryLocation}</p>
                      <p><span className="text-gray-400">Guests:</span> {booking.guestCount}</p>
                      <p><span className="text-gray-400">Priority:</span> <span className={getPriorityColor(booking.priority)}>{booking.priority.charAt(0).toUpperCase() + booking.priority.slice(1)}</span></p>
                      {booking.confidential && <Badge variant="outline" className="text-red-400 border-red-400">Confidential</Badge>}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-3">Selected Services</h3>
                    <div className="space-y-2">
                      {booking.services.filter(s => s.enabled).map(service => (
                        <div key={service.id} className="flex items-center gap-2">
                          {getServiceIcon(service.type)}
                          <span className="capitalize">{service.type}</span>
                          <Badge variant="secondary">Enabled</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {booking.specialRequirements && (
                  <div>
                    <h3 className="font-semibold text-white mb-2">Special Requirements</h3>
                    <p className="text-sm text-gray-300">{booking.specialRequirements}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {currentStep === 4 && (
          <Card className="border-green-500 bg-green-900/20">
            <CardContent className="text-center p-8">
              <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-400 mb-4">Multi-Service Package Confirmed</h2>
              <p className="text-gray-300 mb-6">
                Your comprehensive service package has been successfully submitted. Our coordination team will contact you within 2 hours to finalize all arrangements.
              </p>
              <div className="flex justify-center gap-4">
                <Button onClick={() => setLocation('/client/dashboard')} className="bg-yellow-400 text-black hover:bg-yellow-500">
                  Return to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        {currentStep < 4 && (
          <div className="flex justify-between mt-8">
            <Button
              onClick={handleBack}
              disabled={currentStep === 1}
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-800"
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={submitBookingMutation.isPending}
              className="bg-yellow-400 text-black hover:bg-yellow-500"
            >
              {submitBookingMutation.isPending ? "Processing..." : 
               currentStep === 3 ? (
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4" />
                  <span>Proceed to Payment</span>
                </div>
              ) : "Next"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}