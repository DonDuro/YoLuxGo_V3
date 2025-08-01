import React, { useState } from 'react';
import { Shield, User, Home, Calendar, MapPin, Clock, CheckCircle, AlertTriangle, ArrowLeft, CreditCard } from 'lucide-react';
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

interface SecurityRequest {
  serviceType: 'executive' | 'residential' | 'event' | 'travel';
  startDateTime: string;
  endDateTime?: string;
  location: string;
  protectionLevel: 'standard' | 'enhanced' | 'maximum';
  personnelCount: number;
  specialRequirements: string;
  armedProtection: boolean;
  counterSurveillance: boolean;
  emergencyMedical: boolean;
}

export default function PersonalSecurity() {
  const [request, setRequest] = useState<SecurityRequest>({
    serviceType: 'executive',
    startDateTime: new Date().toISOString().slice(0, 16),
    location: '',
    protectionLevel: 'standard',
    personnelCount: 1,
    specialRequirements: '',
    armedProtection: false,
    counterSurveillance: false,
    emergencyMedical: false,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Fetch available security personnel
  const { data: personnel = [] } = useQuery({
    queryKey: ['/api/admin/personnel/profiles'],
    enabled: currentStep === 2,
  });

  // Submit security request
  const submitRequestMutation = useMutation({
    mutationFn: async (requestData: SecurityRequest) => {
      const response = await fetch('/api/client/security/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      return response.json();
    },
    onSuccess: () => {
      setCurrentStep(3);
      toast({
        title: "Security request submitted",
        description: "Your protection team is being assembled and will contact you shortly.",
      });
    },
    onError: () => {
      toast({
        title: "Request failed",
        description: "Please try again or contact our security command center.",
        variant: "destructive",
      });
    }
  });

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      // Store security booking data for payment
      const bookingData = {
        service: 'security',
        serviceType: request.serviceType === 'executive' ? 'executive-protection' : 
                    request.serviceType === 'residential' ? 'residential-security' :
                    request.serviceType === 'event' ? 'event-security' : 'travel-security',
        location: request.location,
        duration: request.endDateTime ? 
          Math.ceil((new Date(request.endDateTime).getTime() - new Date(request.startDateTime).getTime()) / (1000 * 60 * 60)) : 8,
        date: new Date(request.startDateTime).toISOString().split('T')[0],
        time: new Date(request.startDateTime).toTimeString().split(' ')[0].slice(0, 5),
        teamSize: request.personnelCount,
        threatLevel: request.protectionLevel === 'standard' ? 'medium' : 
                    request.protectionLevel === 'enhanced' ? 'high' : 'critical',
        specialRequests: request.specialRequirements,
        armedProtection: request.armedProtection,
        counterSurveillance: request.counterSurveillance,
        emergencyMedical: request.emergencyMedical
      };
      
      localStorage.setItem('yoluxgo_booking_data', JSON.stringify(bookingData));
      setLocation('/checkout');
    }
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'executive': return <User className="h-5 w-5" />;
      case 'residential': return <Home className="h-5 w-5" />;
      case 'event': return <Calendar className="h-5 w-5" />;
      case 'travel': return <MapPin className="h-5 w-5" />;
      default: return <Shield className="h-5 w-5" />;
    }
  };

  const getProtectionLevelColor = (level: string) => {
    switch (level) {
      case 'standard': return 'text-blue-400';
      case 'enhanced': return 'text-yellow-400';
      case 'maximum': return 'text-red-400';
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
          <h1 className="text-3xl font-bold mb-2">Personal Security Services</h1>
          <p className="text-gray-300">
            Executive protection and security services tailored to your needs
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[1, 2].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step 
                    ? 'bg-yellow-400 border-yellow-400 text-black' 
                    : 'border-gray-500 text-gray-500'
                }`}>
                  {currentStep > step ? <CheckCircle className="h-5 w-5" /> : step}
                </div>
                {step < 2 && (
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
          </div>
        </div>

        {/* Step 1: Service Configuration */}
        {currentStep === 1 && (
          <div className="space-y-6">
            {/* Service Types */}
            <Card className="border-gray-700 bg-gray-900/50">
              <CardHeader>
                <CardTitle className="text-yellow-400 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Service Type
                </CardTitle>
                <CardDescription>
                  Select the type of protection service you require
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { id: 'executive', label: 'Executive Protection', desc: 'Personal protection for executives and VIPs', icon: User },
                    { id: 'residential', label: 'Residential Security', desc: 'Secure your home and family', icon: Home },
                    { id: 'event', label: 'Event Security', desc: 'Protection for special events and gatherings', icon: Calendar },
                    { id: 'travel', label: 'Travel Security', desc: 'Security escorts for domestic and international travel', icon: MapPin },
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
                          <service.icon className="h-5 w-5 text-yellow-400" />
                          <h4 className="font-medium">{service.label}</h4>
                        </div>
                        <p className="text-sm text-gray-400">{service.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Service Details */}
            <Card className="border-gray-700 bg-gray-900/50">
              <CardHeader>
                <CardTitle className="text-yellow-400">Service Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
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
                    <Label className="text-sm font-medium mb-2 block">End Date & Time (Optional)</Label>
                    <Input
                      type="datetime-local"
                      value={request.endDateTime || ''}
                      onChange={(e) => setRequest({...request, endDateTime: e.target.value || undefined})}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                </div>

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

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Protection Level</Label>
                    <Select value={request.protectionLevel} onValueChange={(value: any) => setRequest({...request, protectionLevel: value})}>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            Standard Protection
                          </div>
                        </SelectItem>
                        <SelectItem value="enhanced">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                            Enhanced Protection
                          </div>
                        </SelectItem>
                        <SelectItem value="maximum">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                            Maximum Protection
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Personnel Count</Label>
                    <Select value={request.personnelCount.toString()} onValueChange={(value) => setRequest({...request, personnelCount: parseInt(value)})}>
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map((count) => (
                          <SelectItem key={count} value={count.toString()}>
                            {count} {count === 1 ? 'Agent' : 'Agents'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Special Requirements</Label>
                  <Textarea
                    value={request.specialRequirements}
                    onChange={(e) => setRequest({...request, specialRequirements: e.target.value})}
                    placeholder="Any specific security requirements, threat assessments, or special considerations..."
                    className="bg-gray-800 border-gray-700"
                    rows={3}
                  />
                </div>

                {/* Advanced Options */}
                <div className="border-t border-gray-700 pt-4">
                  <h4 className="text-sm font-medium mb-4 text-gray-300">Advanced Security Options</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-4 w-4 text-red-400" />
                        <Label htmlFor="armed" className="text-sm">Armed Protection</Label>
                      </div>
                      <Switch
                        id="armed"
                        checked={request.armedProtection}
                        onCheckedChange={(checked) => setRequest({...request, armedProtection: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-blue-400" />
                        <Label htmlFor="counter-surveillance" className="text-sm">Counter-Surveillance</Label>
                      </div>
                      <Switch
                        id="counter-surveillance"
                        checked={request.counterSurveillance}
                        onCheckedChange={(checked) => setRequest({...request, counterSurveillance: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Shield className="h-4 w-4 text-green-400" />
                        <Label htmlFor="medical" className="text-sm">Emergency Medical Support</Label>
                      </div>
                      <Switch
                        id="medical"
                        checked={request.emergencyMedical}
                        onCheckedChange={(checked) => setRequest({...request, emergencyMedical: checked})}
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
                Select Security Personnel
              </CardTitle>
              <CardDescription>
                Choose from available certified protection specialists
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {(personnel as any[]).map((agent: any) => (
                  <Card key={agent.id} className="border-2 border-gray-600 hover:border-yellow-400 transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{agent.firstName} {agent.lastName}</h4>
                        <div className={`w-2 h-2 rounded-full ${agent.available ? 'bg-green-400' : 'bg-red-400'}`} />
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-400">
                        <p><strong>Vetting Level:</strong> {agent.vettingLevel}</p>
                        <p><strong>Experience:</strong> {agent.experience} years</p>
                        <p><strong>Rating:</strong> {agent.rating}/5.0</p>
                        <p><strong>Languages:</strong> {JSON.parse(agent.languages || '[]').join(', ')}</p>
                        <p><strong>Specializations:</strong></p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {JSON.parse(agent.specializations || '[]').map((spec: string, idx: number) => (
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

        {/* Step 3: Confirmation */}
        {currentStep === 3 && (
          <Card className="border-green-500 bg-green-900/20">
            <CardContent className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-400 mb-2">Security Request Submitted</h2>
              <p className="text-gray-300 mb-6">
                Your protection team is being assembled. You will receive confirmation and team details shortly.
              </p>
              <div className="bg-gray-800/50 p-4 rounded-lg mb-6">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Service Type:</strong> {request.serviceType.charAt(0).toUpperCase() + request.serviceType.slice(1)} Protection</p>
                    <p><strong>Protection Level:</strong> <span className={getProtectionLevelColor(request.protectionLevel)}>{request.protectionLevel.charAt(0).toUpperCase() + request.protectionLevel.slice(1)}</span></p>
                  </div>
                  <div>
                    <p><strong>Personnel:</strong> {request.personnelCount} Agent{request.personnelCount > 1 ? 's' : ''}</p>
                    <p><strong>Start Time:</strong> {new Date(request.startDateTime).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => {
                  setCurrentStep(1);
                  setRequest({
                    serviceType: 'executive',
                    startDateTime: new Date().toISOString().slice(0, 16),
                    location: '',
                    protectionLevel: 'standard',
                    personnelCount: 1,
                    specialRequirements: '',
                    armedProtection: false,
                    counterSurveillance: false,
                    emergencyMedical: false,
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
        {currentStep < 3 && (
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
                (currentStep === 1 && (!request.location || !request.specialRequirements)) ||
                submitRequestMutation.isPending
              }
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              {currentStep === 2 ? (
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