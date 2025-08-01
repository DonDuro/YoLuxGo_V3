import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Shield, MapPin, Users, FileText, Zap, Globe, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface CloakingSettings {
  id?: string;
  hideName: boolean;
  hideItinerary: boolean;
  hideLocation: boolean;
  hideCompanions: boolean;
  cloakModeActive: boolean;
  createDecoyData: boolean;
  watermarkData: boolean;
}

export default function CloakingControls() {
  const [settings, setSettings] = useState<CloakingSettings>({
    hideName: false,
    hideItinerary: false,
    hideLocation: false,
    hideCompanions: false,
    cloakModeActive: false,
    createDecoyData: false,
    watermarkData: true,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current cloaking settings
  const { data: currentSettings, isLoading } = useQuery({
    queryKey: ['/api/client/cloaking'],
    enabled: true,
  });

  // Update settings when data is fetched
  useEffect(() => {
    if (currentSettings) {
      setSettings(currentSettings);
    }
  }, [currentSettings]);

  // Update cloaking settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: CloakingSettings) => {
      const response = await fetch('/api/client/cloaking', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/client/cloaking'] });
      toast({
        title: "Cloaking settings updated",
        description: "Your privacy controls have been applied.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to update settings",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSettingChange = (key: keyof CloakingSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    updateSettingsMutation.mutate(newSettings);
  };

  const activateCloakMode = () => {
    const cloakSettings = {
      ...settings,
      cloakModeActive: true,
      hideName: true,
      hideItinerary: true,
      hideLocation: true,
      hideCompanions: true,
      createDecoyData: true,
      watermarkData: true,
    };
    setSettings(cloakSettings);
    updateSettingsMutation.mutate(cloakSettings);
    
    toast({
      title: "🕶️ Cloak Mode Activated",
      description: "Maximum privacy protection is now active.",
      variant: "default",
    });
  };

  const deactivateCloakMode = () => {
    const normalSettings = {
      ...settings,
      cloakModeActive: false,
      hideName: false,
      hideItinerary: false,
      hideLocation: false,
      hideCompanions: false,
      createDecoyData: false,
      watermarkData: true,
    };
    setSettings(normalSettings);
    updateSettingsMutation.mutate(normalSettings);

    toast({
      title: "Cloak Mode Deactivated",
      description: "Normal privacy settings restored.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 animate-spin text-yellow-400" />
          <p>Loading cloaking controls...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <img 
              src="/attached_assets/New Primary YLG Transparent Logo_1753681153359.png" 
              alt="YoLuxGo" 
              className="h-16 w-16"
            />
          </div>
          <div className="flex items-center justify-center gap-3 mb-4">
            {settings.cloakModeActive ? (
              <EyeOff className="h-12 w-12 text-purple-400" />
            ) : (
              <Eye className="h-12 w-12 text-yellow-400" />
            )}
            <Shield className="h-10 w-10 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Cloaking & Privacy Controls</h1>
          <p className="text-gray-300">
            Advanced privacy protection for high-profile operations
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cloak Mode Toggle */}
          <div className="lg:col-span-3">
            <Card className={`border-2 ${settings.cloakModeActive ? 'border-purple-500 bg-purple-900/20' : 'border-yellow-500 bg-yellow-900/20'}`}>
              <CardHeader>
                <CardTitle className={`${settings.cloakModeActive ? 'text-purple-400' : 'text-yellow-400'} flex items-center gap-2`}>
                  {settings.cloakModeActive ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  {settings.cloakModeActive ? 'Cloak Mode Active' : 'Cloak Mode Inactive'}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {settings.cloakModeActive 
                    ? 'Maximum privacy protection is currently active. All data is encrypted and access is restricted.'
                    : 'Activate cloak mode for maximum privacy protection during sensitive operations.'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  {settings.cloakModeActive ? (
                    <Button 
                      onClick={deactivateCloakMode}
                      disabled={updateSettingsMutation.isPending}
                      variant="outline"
                      className="border-purple-500 text-purple-400 hover:bg-purple-900/50 px-8 py-3"
                    >
                      <Eye className="h-5 w-5 mr-2" />
                      Deactivate Cloak Mode
                    </Button>
                  ) : (
                    <Button 
                      onClick={activateCloakMode}
                      disabled={updateSettingsMutation.isPending}
                      className="bg-purple-600 hover:bg-purple-700 px-8 py-3"
                    >
                      <EyeOff className="h-5 w-5 mr-2" />
                      Activate Cloak Mode
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Basic Privacy Controls */}
          <Card className="border-blue-500 bg-blue-900/20">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Basic Privacy
              </CardTitle>
              <CardDescription className="text-gray-300">
                Control visibility of your basic information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-blue-400" />
                  <Label htmlFor="hide-name" className="text-sm">Hide Name</Label>
                </div>
                <Switch
                  id="hide-name"
                  checked={settings.hideName}
                  onCheckedChange={(checked) => handleSettingChange('hideName', checked)}
                  disabled={settings.cloakModeActive || updateSettingsMutation.isPending}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-blue-400" />
                  <Label htmlFor="hide-companions" className="text-sm">Hide Companions</Label>
                </div>
                <Switch
                  id="hide-companions"
                  checked={settings.hideCompanions}
                  onCheckedChange={(checked) => handleSettingChange('hideCompanions', checked)}
                  disabled={settings.cloakModeActive || updateSettingsMutation.isPending}
                />
              </div>

              <Separator className="bg-gray-700" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-blue-400" />
                  <Label htmlFor="watermark-data" className="text-sm">Watermark Data</Label>
                </div>
                <Switch
                  id="watermark-data"
                  checked={settings.watermarkData}
                  onCheckedChange={(checked) => handleSettingChange('watermarkData', checked)}
                  disabled={updateSettingsMutation.isPending}
                />
              </div>
            </CardContent>
          </Card>

          {/* Location Privacy */}
          <Card className="border-green-500 bg-green-900/20">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location Privacy
              </CardTitle>
              <CardDescription className="text-gray-300">
                Control visibility of your movements and destinations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-green-400" />
                  <Label htmlFor="hide-location" className="text-sm">Hide Real-time Location</Label>
                </div>
                <Switch
                  id="hide-location"
                  checked={settings.hideLocation}
                  onCheckedChange={(checked) => handleSettingChange('hideLocation', checked)}
                  disabled={settings.cloakModeActive || updateSettingsMutation.isPending}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-green-400" />
                  <Label htmlFor="hide-itinerary" className="text-sm">Hide Itinerary</Label>
                </div>
                <Switch
                  id="hide-itinerary"
                  checked={settings.hideItinerary}
                  onCheckedChange={(checked) => handleSettingChange('hideItinerary', checked)}
                  disabled={settings.cloakModeActive || updateSettingsMutation.isPending}
                />
              </div>

              <Separator className="bg-gray-700" />

              <div className="p-3 bg-green-800/30 rounded-lg">
                <p className="text-xs text-green-300">
                  Location data is encrypted and only accessible to authorized security personnel during active bookings.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Security */}
          <Card className="border-red-500 bg-red-900/20">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Advanced Security
              </CardTitle>
              <CardDescription className="text-gray-300">
                Sophisticated protection measures for high-risk situations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-red-400" />
                  <Label htmlFor="create-decoy" className="text-sm">Create Decoy Data</Label>
                </div>
                <Switch
                  id="create-decoy"
                  checked={settings.createDecoyData}
                  onCheckedChange={(checked) => handleSettingChange('createDecoyData', checked)}
                  disabled={settings.cloakModeActive || updateSettingsMutation.isPending}
                />
              </div>

              <Separator className="bg-gray-700" />

              <div className="p-3 bg-red-800/30 rounded-lg">
                <div className="flex items-start gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-red-300 font-medium">High-Security Features</p>
                </div>
                <ul className="text-xs text-red-200 space-y-1">
                  <li>• Generates false location data</li>
                  <li>• Creates phantom bookings</li>
                  <li>• Masks real travel patterns</li>
                  <li>• Watermarks all data transfers</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Overview */}
        <div className="mt-8">
          <Card className="border-gray-500 bg-gray-900/50">
            <CardHeader>
              <CardTitle className="text-gray-300">Current Privacy Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className={`p-3 rounded-lg ${settings.hideName ? 'bg-green-800/30 text-green-300' : 'bg-gray-800/30 text-gray-400'}`}>
                  <p className="font-medium">Name Protection</p>
                  <p className="text-xs">{settings.hideName ? 'Hidden' : 'Visible'}</p>
                </div>
                
                <div className={`p-3 rounded-lg ${settings.hideLocation ? 'bg-green-800/30 text-green-300' : 'bg-gray-800/30 text-gray-400'}`}>
                  <p className="font-medium">Location Privacy</p>
                  <p className="text-xs">{settings.hideLocation ? 'Protected' : 'Standard'}</p>
                </div>
                
                <div className={`p-3 rounded-lg ${settings.createDecoyData ? 'bg-purple-800/30 text-purple-300' : 'bg-gray-800/30 text-gray-400'}`}>
                  <p className="font-medium">Decoy Systems</p>
                  <p className="text-xs">{settings.createDecoyData ? 'Active' : 'Inactive'}</p>
                </div>
                
                <div className={`p-3 rounded-lg ${settings.watermarkData ? 'bg-blue-800/30 text-blue-300' : 'bg-gray-800/30 text-gray-400'}`}>
                  <p className="font-medium">Data Watermarking</p>
                  <p className="text-xs">{settings.watermarkData ? 'Enabled' : 'Disabled'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}