import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Settings, Users, ArrowRightLeft, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface DevAdminPanelProps {
  onUserSwitch: (token: string, userType: string, profile: any) => void;
}

interface UserAccount {
  email: string;
  userType: string;
  subType?: string;
  profile: {
    id: string;
    firstName: string;
    lastName: string;
    [key: string]: any;
  };
}

interface UsersByType {
  clients: UserAccount[];
  service_providers: UserAccount[];
  regional_partners: UserAccount[];
  admins: UserAccount[];
}

export function DevAdminPanel({ onUserSwitch }: DevAdminPanelProps) {
  const [availableUsers, setAvailableUsers] = useState<UsersByType | null>(null);
  const [selectedUserType, setSelectedUserType] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load available users on component mount with a small delay to ensure auth is ready
  useEffect(() => {
    const timer = setTimeout(() => {
      loadAvailableUsers();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const loadAvailableUsers = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        console.log('No auth token found, skipping user load');
        return;
      }

      const response = await fetch('/api/dev-admin/available-users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAvailableUsers(data);
      } else if (response.status === 401) {
        console.log('Token expired or invalid, redirecting to login');
        localStorage.removeItem('auth_token');
        window.location.href = '/auth';
      } else {
        throw new Error(`Failed to load users: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to load available users:', error);
      // Only show toast if we have a valid token but still failed
      const token = localStorage.getItem('auth_token');
      if (token) {
        toast({
          title: "Error", 
          description: "Failed to load available users",
          variant: "destructive",
        });
      }
    }
  };

  const handleUserTypeChange = (userType: string) => {
    setSelectedUserType(userType);
    setSelectedUserId(""); // Reset user selection when type changes
  };

  const switchUserType = async () => {
    if (!selectedUserType) {
      toast({
        title: "Error",
        description: "Please select a user type",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      
      // Map specific service provider types back to the base type for API
      let apiUserType = selectedUserType;
      let subType = undefined;
      
      if (selectedUserType === 'service_provider_individual') {
        apiUserType = 'service_provider';
        subType = 'individual';
      } else if (selectedUserType === 'service_provider_company') {
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
          targetUserId: selectedUserId || undefined,
          targetSubType: subType,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update localStorage with new token
        localStorage.setItem('auth_token', data.token);
        
        toast({
          title: "Success",
          description: `Switched to ${data.userType}${data.subType ? ` (${data.subType})` : ''}: ${data.profile.firstName} ${data.profile.lastName}`,
        });

        // Trigger user switch callback
        onUserSwitch(data.token, data.userType, data.profile);
        
        // Reload the page to apply the new user context
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to switch user type');
      }
    } catch (error) {
      console.error('Failed to switch user type:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to switch user type",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getUserTypeLabel = (userType: string) => {
    switch (userType) {
      case 'client': return 'Client';
      case 'service_provider': return 'Service Provider';
      case 'service_provider_individual': return 'Individual Service Provider';
      case 'service_provider_company': return 'Company Service Provider';
      case 'regional_partner': return 'Regional Partner';
      case 'admin': return 'Admin';
      default: return userType;
    }
  };

  const getUserSubTypeLabel = (subType?: string) => {
    if (subType === 'individual') return 'Individual';
    if (subType === 'company') return 'Company';
    return '';
  };

  const getSelectedUsers = () => {
    if (!availableUsers || !selectedUserType) return [];
    
    // Handle specific service provider subtypes
    if (selectedUserType === 'service_provider_individual') {
      return availableUsers.service_providers.filter(user => user.subType === 'individual');
    }
    if (selectedUserType === 'service_provider_company') {
      return availableUsers.service_providers.filter(user => user.subType === 'company');
    }
    
    return availableUsers[selectedUserType as keyof UsersByType] || [];
  };

  return (
    <Card className="mb-6 border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-amber-600" />
          <CardTitle className="text-amber-800">Development Admin Panel</CardTitle>
        </div>
        <CardDescription className="text-amber-700">
          Switch between different user types for testing functionality
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-amber-600">
          <Badge variant="outline" className="border-amber-300 text-amber-700">
            DEV MODE
          </Badge>
          <span>Testing interface - Not visible to production users</span>
        </div>

        <Separator />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-amber-800">User Type</label>
            <Select value={selectedUserType} onValueChange={handleUserTypeChange}>
              <SelectTrigger className="border-amber-200">
                <SelectValue placeholder="Select user type to test" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Client
                  </div>
                </SelectItem>
                <SelectItem value="service_provider">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Service Provider (All Types)
                  </div>
                </SelectItem>
                <SelectItem value="service_provider_individual">
                  <div className="flex items-center gap-2 ml-4">
                    <Users className="h-3 w-3" />
                    → Individual Service Provider
                  </div>
                </SelectItem>
                <SelectItem value="service_provider_company">
                  <div className="flex items-center gap-2 ml-4">
                    <Users className="h-3 w-3" />
                    → Company Service Provider
                  </div>
                </SelectItem>
                <SelectItem value="regional_partner">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Regional Partner
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Admin
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedUserType && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-amber-800">
                Specific User (Optional)
              </label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger className="border-amber-200">
                  <SelectValue placeholder="Any user of this type" />
                </SelectTrigger>
                <SelectContent>
                  {getSelectedUsers().map((user) => (
                    <SelectItem key={user.profile.id} value={user.profile.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {user.profile.firstName} {user.profile.lastName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {user.email}
                          {user.subType && ` • ${getUserSubTypeLabel(user.subType)}`}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={switchUserType}
            disabled={!selectedUserType || isLoading}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <ArrowRightLeft className="h-4 w-4 mr-2" />
            )}
            Switch User Type
          </Button>
          
          <Button
            variant="outline"
            onClick={loadAvailableUsers}
            className="border-amber-300 text-amber-700 hover:bg-amber-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Users
          </Button>
        </div>

        {selectedUserType && availableUsers && (
          <div className="mt-4 p-3 bg-amber-100/50 rounded-lg">
            <h4 className="text-sm font-medium text-amber-800 mb-2">
              Available {getUserTypeLabel(selectedUserType)}s ({getSelectedUsers().length})
            </h4>
            <div className="text-xs text-amber-700 space-y-1">
              {getSelectedUsers().slice(0, 3).map((user) => (
                <div key={user.profile.id} className="flex justify-between">
                  <span>{user.profile.firstName} {user.profile.lastName}</span>
                  <span className="text-muted-foreground">{user.email}</span>
                </div>
              ))}
              {getSelectedUsers().length > 3 && (
                <div className="text-muted-foreground">
                  ...and {getSelectedUsers().length - 3} more
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}