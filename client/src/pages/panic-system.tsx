import React, { useState } from 'react';
import { AlertTriangle, Shield, Phone, MapPin, MessageSquare, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export default function PanicSystem() {
  const [panicMode, setPanicMode] = useState(false);
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState('');
  const { toast } = useToast();

  const triggerPanicMutation = useMutation({
    mutationFn: async (data: { message?: string; location?: string }) => {
      const response = await fetch('/api/client/panic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      setPanicMode(true);
      toast({
        title: "🚨 PANIC ALERT TRIGGERED",
        description: "YoLuxGo™ Command Center has been notified. Help is on the way.",
        variant: "destructive",
      });
    },
    onError: () => {
      toast({
        title: "Failed to trigger panic",
        description: "Please try again or contact emergency services.",
        variant: "destructive",
      });
    }
  });

  const handlePanicTrigger = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const currentLocation = `${position.coords.latitude}, ${position.coords.longitude}`;
        triggerPanicMutation.mutate({ 
          message: message || "Emergency assistance required",
          location: location || currentLocation 
        });
      });
    } else {
      triggerPanicMutation.mutate({ 
        message: message || "Emergency assistance required",
        location: location 
      });
    }
  };

  if (panicMode) {
    return (
      <div className="min-h-screen bg-red-900 text-white p-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <AlertTriangle className="h-24 w-24 text-yellow-400 mx-auto mb-4 animate-pulse" />
            <h1 className="text-4xl font-bold mb-2">PANIC MODE ACTIVE</h1>
            <p className="text-xl">YoLuxGo™ Command Center Notified</p>
          </div>

          <div className="grid gap-6">
            <Card className="border-red-400 bg-red-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Protocol Activated
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white">
                <ul className="space-y-2">
                  <li>• Account access restricted</li>
                  <li>• Emergency contacts notified</li>
                  <li>• Location tracking activated</li>
                  <li>• Secure communication channel opened</li>
                  <li>• Response team dispatched</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-yellow-400 bg-yellow-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Emergency Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full bg-green-600 hover:bg-green-700 text-white border-green-500"
                    onClick={() => window.open('tel:911')}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call 911 (Emergency Services)
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white border-blue-500"
                    onClick={() => window.open('tel:+1-555-YOLUXGO')}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    YoLuxGo™ Command Center
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-400 bg-gray-800/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Secure Communication
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Textarea 
                    placeholder="Send secure message to command center..."
                    className="bg-gray-700 text-white border-gray-600"
                  />
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    <Lock className="h-4 w-4 mr-2" />
                    Send Encrypted Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Button 
              variant="outline" 
              onClick={() => setPanicMode(false)}
              className="bg-gray-700 hover:bg-gray-600 text-white border-gray-500"
            >
              Exit Panic Mode (Admin Override Required)
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <img 
              src="/attached_assets/New Primary YLG Transparent Logo_1753681153359.png" 
              alt="YoLuxGo" 
              className="h-16 w-16"
            />
          </div>
          <h1 className="text-3xl font-bold mb-2">Emergency Panic System</h1>
          <p className="text-gray-300">
            Immediate response protocols for high-risk situations
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Panic Trigger */}
          <Card className="border-red-500 bg-red-900/20">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Red Panic Button
              </CardTitle>
              <CardDescription className="text-gray-300">
                Triggers immediate lockdown and emergency response
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Emergency Message</label>
                <Textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe the emergency situation..."
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Current Location</label>
                <Input 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Auto-detected or manual entry..."
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <Button 
                onClick={handlePanicTrigger}
                disabled={triggerPanicMutation.isPending}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg font-bold"
              >
                {triggerPanicMutation.isPending ? (
                  "ACTIVATING PANIC PROTOCOL..."
                ) : (
                  <>
                    <AlertTriangle className="h-6 w-6 mr-2" />
                    TRIGGER PANIC ALERT
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Protocol Information */}
          <div className="space-y-6">
            <Card className="border-yellow-500 bg-yellow-900/20">
              <CardHeader>
                <CardTitle className="text-yellow-400">Panic Protocol</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• <strong>Immediate Response:</strong> Command center alerted within seconds</li>
                  <li>• <strong>Account Lockdown:</strong> Restricts access to sensitive data</li>
                  <li>• <strong>Location Tracking:</strong> GPS coordinates transmitted</li>
                  <li>• <strong>Emergency Contacts:</strong> Pre-configured contacts notified</li>
                  <li>• <strong>Response Team:</strong> Security personnel dispatched</li>
                  <li>• <strong>Data Protection:</strong> Sensitive information secured</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-blue-500 bg-blue-900/20">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300 mb-4">
                  Your location will be automatically detected and transmitted to ensure rapid response.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full border-blue-500 text-blue-400 hover:bg-blue-900/50"
                  onClick={() => navigator.geolocation?.getCurrentPosition((pos) => {
                    setLocation(`${pos.coords.latitude}, ${pos.coords.longitude}`);
                    toast({
                      title: "Location detected",
                      description: "GPS coordinates have been captured.",
                    });
                  })}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Test Location Detection
                </Button>
              </CardContent>
            </Card>

            <Card className="border-green-500 bg-green-900/20">
              <CardHeader>
                <CardTitle className="text-green-400">False Alarm Procedure</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-300">
                <p>
                  If panic mode is triggered accidentally, contact the Command Center immediately 
                  at <strong>+1-555-YOLUXGO</strong> with your authentication code to cancel the response.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}