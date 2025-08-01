import React, { useState } from 'react';
import { User, Plane, Calendar, ShoppingBag, Briefcase, CheckCircle, Globe, Star, ArrowLeft, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import ylgBrandLogo from "@assets/New Primary YLG Transparent Logo_1753681153359.png";
import { useLocation } from 'wouter';

interface ConciergeRequest {
  serviceType: 'travel' | 'event' | 'shopping' | 'business';
  priority: 'standard' | 'urgent' | 'critical';
  startDateTime: string;
  endDateTime?: string;
  location: string;
  budget: string;
  requirements: string;
  vipTreatment: boolean;
  confidential: boolean;
  multiLocation: boolean;
}

export default function ConciergeIntelligence() {
  const [request, setRequest] = useState<ConciergeRequest>({
    serviceType: 'travel',
    priority: 'standard',
    startDateTime: new Date().toISOString().slice(0, 16),
    location: '',
    budget: '',
    requirements: '',
    vipTreatment: true,
    confidential: false,
    multiLocation: false,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Fetch available concierge personnel
  const { data: personnel = [] } = useQuery({
    queryKey: ['/api/admin/personnel/profiles'],
    enabled: currentStep === 2,
  });

  // Submit concierge request
  const submitRequestMutation = useMutation({
    mutationFn: async (requestData: ConciergeRequest) => {
      const response = await fetch('/api/client/concierge/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      return response.json();
    },
    onSuccess: () => {
      setCurrentStep(3);
      toast({
        title: "Concierge request submitted",
        description: "Our intelligence team is crafting your personalized solution.",
      });
    },
    onError: () => {
      toast({
        title: "Request failed",
        description: "Please try again or contact our concierge team directly.",
        variant: "destructive",
      });
    }
  });

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Store concierge booking data for payment
      const bookingData = {
        service: 'concierge',
        serviceType: request.serviceType === 'travel' ? 'travel-planning' : 
                    request.serviceType === 'event' ? 'event-management' :
                    request.serviceType === 'shopping' ? 'personal-shopping' : 'business-services',
        complexity: request.priority === 'standard' ? 'simple' : 
                   request.priority === 'urgent' ? 'complex' : 'luxury',
        timeline: request.priority === 'standard' ? 'flexible' : 
                 request.priority === 'urgent' ? 'urgent' : 'immediate',
        location: request.location,
        budget: parseInt(request.budget) || 1000,
        specialRequests: request.requirements,
        vipTreatment: request.vipTreatment,
        confidential: request.confidential,
        multiLocation: request.multiLocation,
        startDate: new Date(request.startDateTime).toISOString().split('T')[0],
        endDate: request.endDateTime ? new Date(request.endDateTime).toISOString().split('T')[0] : null
      };
      
      localStorage.setItem('yoluxgo_booking_data', JSON.stringify(bookingData));
      setLocation('/checkout');
    }
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'travel': return <Plane className="h-5 w-5" />;
      case 'event': return <Calendar className="h-5 w-5" />;
      case 'shopping': return <ShoppingBag className="h-5 w-5" />;
      case 'business': return <Briefcase className="h-5 w-5" />;
      default: return <User className="h-5 w-5" />;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1a2f] via-[#1a2b3f] to-[#2a3b4f] text-white p-6">
      <div className="max-w-4xl mx-auto">
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
          <h1 className="text-3xl font-bold mb-2">Concierge Intelligence</h1>
          <p className="text-gray-300">
            Premium lifestyle and business concierge services with global reach
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
                  {currentStep > step ? <CheckCircle className="h-5 w-5" /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-0.5 ${
                    currentStep > step ? 'bg-yellow-400' : 'bg-gray-500'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-16 mt-2">
            <span className="text-xs text-gray-400">Service Details</span>
            <span className="text-xs text-gray-400">Personnel Selection</span>
            <span className="text-xs text-gray-400">Requirements</span>
          </div>
        </div>

        {/* Step 1: Service Selection */}
        {currentStep === 1 && (
          <div className="space-y-6">
            {/* Service Types */}
            <Card className="border-gray-700 bg-gray-900/50">
              <CardHeader>
                <CardTitle className="text-yellow-400 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Concierge Service Type
                </CardTitle>
                <CardDescription>
                  Select the type of concierge assistance you require
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { 
                      id: 'travel', 
                      label: 'Travel Planning', 
                      desc: 'Luxury travel arrangements, accommodations, and experiences',
                      features: ['Private jet bookings', 'Exclusive accommodations', 'VIP experiences', 'Travel security']
                    },
                    { 
                      id: 'event', 
                      label: 'Event Management', 
                      desc: 'Corporate events, private parties, and exclusive gatherings',
                      features: ['Venue selection', 'Catering coordination', 'Entertainment booking', 'Guest management']
                    },
                    { 
                      id: 'shopping', 
                      label: 'Personal Shopping', 
                      desc: 'Luxury shopping, art acquisition, and lifestyle purchases',
                      features: ['Designer collections', 'Art & antiques', 'Rare items sourcing', 'Gift consultation']
                    },
                    { 
                      id: 'business', 
                      label: 'Business Services', 
                      desc: 'Executive assistance, meetings, and corporate services',
                      features: ['Meeting coordination', 'Document services', 'Translation services', 'Legal referrals']
                    },
                  ].map((service) => (
                    <Card 
                      key={service.id}
                      className={`cursor-pointer border-2 transition-colors ${
                        request.serviceType === service.id
                          ? 'border-yellow-400 bg-yellow-900/20'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                      onClick={() => setRequest({...request, serviceType: service.id as any})}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          {getServiceIcon(service.id)}
                          <h4 className="font-medium text-yellow-400">{service.label}</h4>
                        </div>
                        <p className="text-sm text-gray-300 mb-3">{service.desc}</p>
                        <div className="space-y-1">
                          {service.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-gray-400">
                              <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                              {feature}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Basic Details */}
            <Card className="border-gray-700 bg-gray-900/50">
              <CardHeader>
                <CardTitle className="text-yellow-400">Service Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Priority Level</Label>
                    <Select value={request.priority} onValueChange={(value: any) => setRequest({...request, priority: value})}>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            Standard (3-5 days)
                          </div>
                        </SelectItem>
                        <SelectItem value="urgent">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                            Urgent (24-48 hours)
                          </div>
                        </SelectItem>
                        <SelectItem value="critical">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                            Critical (Same day)
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Start Date & Time</Label>
                    <Input
                      type="datetime-local"
                      value={request.startDateTime}
                      onChange={(e) => setRequest({...request, startDateTime: e.target.value})}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">End Date (Optional)</Label>
                    <Input
                      type="datetime-local"
                      value={request.endDateTime || ''}
                      onChange={(e) => setRequest({...request, endDateTime: e.target.value || undefined})}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Primary Location</Label>
                    <Select value={request.location} onValueChange={(value) => setRequest({...request, location: value})}>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select location" />
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
                    <Label className="text-sm font-medium mb-2 block">Budget Range (Optional)</Label>
                    <Select value={request.budget} onValueChange={(value) => setRequest({...request, budget: value})}>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-10k">Under $10,000</SelectItem>
                        <SelectItem value="10k-50k">$10,000 - $50,000</SelectItem>
                        <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                        <SelectItem value="100k-500k">$100,000 - $500,000</SelectItem>
                        <SelectItem value="500k-plus">$500,000+</SelectItem>
                        <SelectItem value="unlimited">Unlimited</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Service Options */}
                <div className="border-t border-gray-700 pt-4">
                  <h4 className="text-sm font-medium mb-4 text-gray-300">Service Options</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <Label htmlFor="vip" className="text-sm">VIP Treatment</Label>
                        <span className="text-xs text-gray-400">(Premium service level)</span>
                      </div>
                      <Switch
                        id="vip"
                        checked={request.vipTreatment}
                        onCheckedChange={(checked) => setRequest({...request, vipTreatment: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-blue-400" />
                        <Label htmlFor="multi-location" className="text-sm">Multi-Location Service</Label>
                        <span className="text-xs text-gray-400">(Coordination across multiple cities)</span>
                      </div>
                      <Switch
                        id="multi-location"
                        checked={request.multiLocation}
                        onCheckedChange={(checked) => setRequest({...request, multiLocation: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-purple-400" />
                        <Label htmlFor="confidential" className="text-sm">Confidential Service</Label>
                        <span className="text-xs text-gray-400">(Enhanced privacy protocols)</span>
                      </div>
                      <Switch
                        id="confidential"
                        checked={request.confidential}
                        onCheckedChange={(checked) => setRequest({...request, confidential: checked})}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Personnel Selection */}
        {currentStep === 2 && (
          <Card className="border-gray-700 bg-gray-900/50">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center gap-2">
                <User className="h-5 w-5" />
                Select Concierge Personnel
              </CardTitle>
              <CardDescription>
                Choose from our elite concierge professionals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {(personnel as any[])
                  .filter((person: any) => person.role === 'Elite Concierge')
                  .map((concierge: any) => (
                  <Card key={concierge.id} className="border-2 border-gray-600 hover:border-yellow-400 transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{concierge.firstName} {concierge.lastName}</h4>
                        <div className={`w-2 h-2 rounded-full ${concierge.available ? 'bg-green-400' : 'bg-red-400'}`} />
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-400">
                        <p><strong>Vetting Level:</strong> {concierge.vettingLevel}</p>
                        <p><strong>Experience:</strong> {concierge.experience} years</p>
                        <p><strong>Rating:</strong> {concierge.rating}/5.0</p>
                        <p><strong>Languages:</strong> {JSON.parse(concierge.languages || '[]').join(', ')}</p>
                        <p><strong>Specializations:</strong></p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {JSON.parse(concierge.specializations || '[]').map((spec: string, idx: number) => (
                            <span key={idx} className="px-2 py-1 bg-yellow-400/20 text-yellow-400 rounded text-xs">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Detailed Requirements */}
        {currentStep === 3 && (
          <Card className="border-gray-700 bg-gray-900/50">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center gap-2">
                {getServiceIcon(request.serviceType)}
                Detailed Requirements
              </CardTitle>
              <CardDescription>
                Provide specific details for your {request.serviceType} request
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Service-specific forms */}
              {request.serviceType === 'travel' && (
                <div className="space-y-4">
                  <h4 className="font-medium text-blue-400">Travel Planning Details</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input placeholder="Departure city/airport" className="bg-gray-800 border-gray-700" />
                    <Input placeholder="Destination city/country" className="bg-gray-800 border-gray-700" />
                    <Input placeholder="Number of travelers" type="number" className="bg-gray-800 border-gray-700" />
                    <Select>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Accommodation preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5-star-hotel">5-Star Hotels</SelectItem>
                        <SelectItem value="luxury-resort">Luxury Resorts</SelectItem>
                        <SelectItem value="private-villa">Private Villas</SelectItem>
                        <SelectItem value="exclusive-property">Exclusive Properties</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {request.serviceType === 'event' && (
                <div className="space-y-4">
                  <h4 className="font-medium text-green-400">Event Management Details</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input placeholder="Event type" className="bg-gray-800 border-gray-700" />
                    <Input placeholder="Expected guests" type="number" className="bg-gray-800 border-gray-700" />
                    <Input placeholder="Venue preference" className="bg-gray-800 border-gray-700" />
                    <Select>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Catering style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fine-dining">Fine Dining</SelectItem>
                        <SelectItem value="cocktail-reception">Cocktail Reception</SelectItem>
                        <SelectItem value="buffet-style">Luxury Buffet</SelectItem>
                        <SelectItem value="custom-menu">Custom Menu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {request.serviceType === 'shopping' && (
                <div className="space-y-4">
                  <h4 className="font-medium text-purple-400">Personal Shopping Details</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Select>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Shopping category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fashion">Designer Fashion</SelectItem>
                        <SelectItem value="jewelry">Fine Jewelry</SelectItem>
                        <SelectItem value="art">Art & Collectibles</SelectItem>
                        <SelectItem value="luxury-goods">Luxury Goods</SelectItem>
                        <SelectItem value="gifts">Executive Gifts</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder="Preferred brands/designers" className="bg-gray-800 border-gray-700" />
                    <Input placeholder="Size/specifications" className="bg-gray-800 border-gray-700" />
                    <Select>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Delivery preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pickup">Personal Pickup</SelectItem>
                        <SelectItem value="delivery">White Glove Delivery</SelectItem>
                        <SelectItem value="secure-transport">Secure Transport</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {request.serviceType === 'business' && (
                <div className="space-y-4">
                  <h4 className="font-medium text-orange-400">Business Services Details</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Select>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Service type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="meeting-coordination">Meeting Coordination</SelectItem>
                        <SelectItem value="document-services">Document Services</SelectItem>
                        <SelectItem value="translation">Translation Services</SelectItem>
                        <SelectItem value="legal-referral">Legal Referrals</SelectItem>
                        <SelectItem value="executive-assistance">Executive Assistance</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder="Company/organization" className="bg-gray-800 border-gray-700" />
                    <Input placeholder="Industry/sector" className="bg-gray-800 border-gray-700" />
                    <Select>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Urgency level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="routine">Routine</SelectItem>
                        <SelectItem value="priority">Priority</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Universal requirements field */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Detailed Requirements</Label>
                <Textarea
                  value={request.requirements}
                  onChange={(e) => setRequest({...request, requirements: e.target.value})}
                  placeholder="Please provide detailed requirements, preferences, special requests, dietary restrictions, accessibility needs, or any other important information..."
                  className="bg-gray-800 border-gray-700 min-h-[120px]"
                />
              </div>

              {/* Additional preferences */}
              <div className="border-t border-gray-700 pt-4">
                <h4 className="text-sm font-medium mb-4 text-gray-300">Additional Preferences</h4>
                <Textarea
                  placeholder="Any additional preferences, cultural considerations, language requirements, or special instructions..."
                  className="bg-gray-800 border-gray-700"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Confirmation */}
        {currentStep === 4 && (
          <Card className="border-green-500 bg-green-900/20">
            <CardContent className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-400 mb-2">Concierge Request Submitted</h2>
              <p className="text-gray-300 mb-6">
                Our intelligence team is crafting your personalized solution. You will receive a detailed proposal within 24 hours.
              </p>
              <div className="bg-gray-800/50 p-4 rounded-lg mb-6">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Service Type:</strong> {request.serviceType.charAt(0).toUpperCase() + request.serviceType.slice(1)}</p>
                    <p><strong>Priority:</strong> <span className={getPriorityColor(request.priority)}>{request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}</span></p>
                  </div>
                  <div>
                    <p><strong>Location:</strong> {request.location}</p>
                    <p><strong>Start Time:</strong> {new Date(request.startDateTime).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => {
                  setCurrentStep(1);
                  setRequest({
                    serviceType: 'travel',
                    priority: 'standard',
                    startDateTime: new Date().toISOString().slice(0, 16),
                    location: '',
                    budget: '',
                    requirements: '',
                    vipTreatment: true,
                    confidential: false,
                    multiLocation: false,
                  });
                }}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                Request Another Service
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        {currentStep < 4 && (
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={
                (currentStep === 1 && !request.location) ||
                (currentStep === 3 && !request.requirements) ||
                submitRequestMutation.isPending
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