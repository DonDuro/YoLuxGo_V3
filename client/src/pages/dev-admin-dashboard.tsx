import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DevAdminPanel } from "@/components/dev-admin-panel";
import { Button } from "@/components/ui/button";
import { LogOut, Code, TestTube, Users, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ylgLogo from "@assets/New Primary YLG Transparent Logo_1753687059072.png";

export function DevAdminDashboard() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  // Get current user from token
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUser(payload);
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
  }, []);

  const handleUserSwitch = (token: string, userType: string, profile: any) => {
    setCurrentUser({ ...profile, userType });
    toast({
      title: "User Switched",
      description: `Now testing as ${userType}: ${profile.firstName} ${profile.lastName}`,
    });
  };

  // Handle quick switch functionality
  const handleQuickSwitch = async (userType: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      // Map specific service provider types back to the base type for API
      let apiUserType = userType;
      let subType = undefined;
      
      if (userType === 'service_provider_individual') {
        apiUserType = 'service_provider';
        subType = 'individual';
      } else if (userType === 'service_provider_company') {
        apiUserType = 'service_provider';
        subType = 'company';
      }
      
      const response = await fetch('/api/dev-admin/switch-user-type', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetUserType: apiUserType,
          targetSubType: subType,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update localStorage with new token
        localStorage.setItem('auth_token', data.token);
        
        // Update current user state
        setCurrentUser({ ...data.profile, userType: data.userType });
        
        toast({
          title: "Quick Switch Successful",
          description: `Now testing as ${data.userType}${data.subType ? ` (${data.subType})` : ''}: ${data.profile.firstName} ${data.profile.lastName}`,
        });
        
        // Redirect to appropriate dashboard
        if (data.userType === 'client') {
          setTimeout(() => window.location.href = '/client/dashboard', 1000);
        } else if (data.userType === 'admin') {
          setTimeout(() => window.location.href = '/admin/dashboard', 1000);
        }
      } else {
        const error = await response.text();
        toast({
          title: "Quick Switch Failed",
          description: `Failed to switch user type: ${error}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Quick Switch Error",
        description: `An error occurred: ${error}`,
        variant: "destructive",
      });
    }
  };

  const quickActions = [
    {
      title: "Client Testing",
      description: "Test booking flows and client dashboard",
      icon: Users,
      userType: "client",
      color: "bg-blue-500",
    },
    {
      title: "Individual Provider Testing", 
      description: "Test individual service provider interfaces",
      icon: Shield,
      userType: "service_provider_individual",
      color: "bg-green-500",
    },
    {
      title: "Company Provider Testing", 
      description: "Test company service provider interfaces",
      icon: Shield,
      userType: "service_provider_company",
      color: "bg-teal-500",
    },
    {
      title: "Regional Partner Testing",
      description: "Test regional management features",
      icon: TestTube,
      userType: "regional_partner", 
      color: "bg-purple-500",
    },
    {
      title: "Admin Testing",
      description: "Test administrative functions",
      icon: Code,
      userType: "admin",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <header className="bg-black/20 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img src={ylgLogo} alt="YLG" className="h-8 w-8" />
              <span className="text-2xl font-bold text-white">
                YoLuxGo<span className="text-yellow-400">™</span>
              </span>
              <Badge variant="outline" className="border-amber-300 text-amber-300 ml-4">
                DEV ADMIN
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">
                {currentUser?.firstName} {currentUser?.lastName}
              </span>
              <Button
                variant="outline"
                onClick={() => {
                  localStorage.removeItem('auth_token');
                  window.location.href = '/';
                }}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Development Admin Dashboard
          </h1>
          <p className="text-gray-300 text-lg">
            Test YoLuxGo™ functionality by switching between different user types
          </p>
        </div>

        {/* Dev Admin Panel */}
        <DevAdminPanel onUserSwitch={handleUserSwitch} />

        {/* Quick Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Quick Testing Actions
            </CardTitle>
            <CardDescription>
              Jump directly to test specific user experiences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {quickActions.map((action) => (
                <div
                  key={action.userType}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleQuickSwitch(action.userType)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-full ${action.color}`}>
                      <action.icon className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="font-medium">{action.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Info */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Current Session</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">User Type:</span>
                <Badge variant="outline">
                  {currentUser?.userType || 'dev_admin'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">User ID:</span>
                <span className="font-mono text-sm">
                  {currentUser?.id || 'dev-admin'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span>
                  {currentUser?.firstName} {currentUser?.lastName}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Testing Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  User type switching
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  Dashboard access testing
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  Feature availability testing
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  Permission validation
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Warning */}
        <Card className="mt-6 border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-amber-800">
              <Shield className="h-5 w-5" />
              <span className="font-medium">Development Environment Only</span>
            </div>
            <p className="text-amber-700 mt-2 text-sm">
              This Dev Admin interface is only available in development mode and will not be accessible in production environments.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}