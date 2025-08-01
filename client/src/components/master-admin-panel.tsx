import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Crown, Users, ArrowRightLeft, RefreshCw, Eye, Search, Filter, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MasterAdminPanelProps {
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

export function MasterAdminPanel({ onUserSwitch }: MasterAdminPanelProps) {
  const [availableUsers, setAvailableUsers] = useState<UsersByType | null>(null);
  const [selectedUserType, setSelectedUserType] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterByLocation, setFilterByLocation] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load available users on component mount
  useEffect(() => {
    loadAvailableUsers();
  }, []);

  const loadAvailableUsers = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/dev-admin/available-users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAvailableUsers(data);
      } else {
        throw new Error('Failed to load users');
      }
    } catch (error) {
      console.error('Failed to load available users:', error);
      toast({
        title: "Error",
        description: "Failed to load available users",
        variant: "destructive",
      });
    }
  };

  const handleUserTypeChange = (userType: string) => {
    setSelectedUserType(userType);
    setSelectedUserId(""); // Reset user selection when type changes
  };

  const switchToUser = async (targetUser?: UserAccount) => {
    let userType = selectedUserType;
    let userId = selectedUserId;
    let subType = undefined;

    // If specific user provided, use their details
    if (targetUser) {
      userType = targetUser.userType;
      userId = targetUser.profile.id;
      subType = targetUser.subType;
    } else if (!userType) {
      toast({
        title: "Error",
        description: "Please select a user type or specific user",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      
      // Map specific service provider types back to the base type for API
      let apiUserType = userType;
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
          targetUserId: userId || undefined,
          targetSubType: subType,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update localStorage with new token
        localStorage.setItem('auth_token', data.token);
        
        toast({
          title: "Master Admin Override",
          description: `Now viewing as ${data.userType}${data.subType ? ` (${data.subType})` : ''}: ${data.profile.firstName} ${data.profile.lastName}`,
        });

        // Trigger user switch callback
        onUserSwitch(data.token, data.userType, data.profile);
        
        // Reload the page to apply the new user context
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to switch user view');
      }
    } catch (error) {
      console.error('Failed to switch user view:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to switch user view",
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

  const getAllUsers = () => {
    if (!availableUsers) return [];
    return [
      ...availableUsers.clients,
      ...availableUsers.service_providers,
      ...availableUsers.regional_partners,
      ...availableUsers.admins,
    ];
  };

  const getFilteredUsers = () => {
    let users = getAllUsers();
    
    if (searchTerm) {
      users = users.filter(user => 
        `${user.profile.firstName} ${user.profile.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterByLocation) {
      users = users.filter(user => 
        user.profile.location?.includes(filterByLocation) || 
        user.profile.region?.includes(filterByLocation)
      );
    }
    
    return users;
  };

  const getUsersByType = () => {
    const users = getFilteredUsers();
    return {
      clients: users.filter(u => u.userType === 'client'),
      service_providers_individual: users.filter(u => u.userType === 'service_provider' && u.subType === 'individual'),
      service_providers_company: users.filter(u => u.userType === 'service_provider' && u.subType === 'company'),
      regional_partners: users.filter(u => u.userType === 'regional_partner'),
      admins: users.filter(u => u.userType === 'admin'),
    };
  };

  return (
    <Card className="mb-6 border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-purple-600" />
          <CardTitle className="text-purple-800">Master Admin Navigation Panel</CardTitle>
        </div>
        <CardDescription className="text-purple-700">
          Advanced user experience navigation with comprehensive oversight capabilities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-purple-600">
          <Badge variant="outline" className="border-purple-300 text-purple-700">
            MASTER ADMIN
          </Badge>
          <span>Enhanced navigation powers - View app as any user</span>
        </div>

        <Separator />

        <Tabs defaultValue="quick-switch" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="quick-switch">Quick Switch</TabsTrigger>
            <TabsTrigger value="user-search">User Search</TabsTrigger>
            <TabsTrigger value="user-browser">User Browser</TabsTrigger>
          </TabsList>

          <TabsContent value="quick-switch" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-purple-800">User Type</label>
                <Select value={selectedUserType} onValueChange={handleUserTypeChange}>
                  <SelectTrigger className="border-purple-200">
                    <SelectValue placeholder="Select user type" />
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
                  <label className="text-sm font-medium text-purple-800">
                    Specific User (Optional)
                  </label>
                  <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                    <SelectTrigger className="border-purple-200">
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

            <Button
              onClick={() => switchToUser()}
              disabled={!selectedUserType || isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Eye className="h-4 w-4 mr-2" />
              )}
              View as User
            </Button>
          </TabsContent>

          <TabsContent value="user-search" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-purple-800">Search Users</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, or type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-purple-200"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-purple-800">Filter by Location</label>
                <div className="relative">
                  <Filter className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="e.g., New York, Miami..."
                    value={filterByLocation}
                    onChange={(e) => setFilterByLocation(e.target.value)}
                    className="pl-10 border-purple-200"
                  />
                </div>
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2">
              {getFilteredUsers().slice(0, 10).map((user) => (
                <div
                  key={user.profile.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-100 hover:border-purple-200 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {user.profile.firstName} {user.profile.lastName}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {getUserTypeLabel(user.userType)}
                        {user.subType && ` (${getUserSubTypeLabel(user.subType)})`}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                      {user.profile.location && ` • ${user.profile.location}`}
                      {user.profile.region && ` • ${user.profile.region}`}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => switchToUser(user)}
                    className="border-purple-200 text-purple-700 hover:bg-purple-50"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </div>
              ))}
              {getFilteredUsers().length > 10 && (
                <div className="text-center text-sm text-muted-foreground py-2">
                  ...and {getFilteredUsers().length - 10} more results
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="user-browser" className="space-y-4">
            <div className="space-y-4">
              {Object.entries(getUsersByType()).map(([type, users]) => (
                users.length > 0 && (
                  <div key={type} className="space-y-2">
                    <h4 className="text-sm font-medium text-purple-800 flex items-center gap-2">
                      <UserCheck className="h-4 w-4" />
                      {getUserTypeLabel(type.replace('_', ' '))} ({users.length})
                    </h4>
                    <div className="grid gap-2 md:grid-cols-2">
                      {users.slice(0, 4).map((user) => (
                        <div
                          key={user.profile.id}
                          className="flex items-center justify-between p-2 bg-white rounded border border-purple-100"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">
                              {user.profile.firstName} {user.profile.lastName}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {user.email}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => switchToUser(user)}
                            className="ml-2 flex-shrink-0"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    {users.length > 4 && (
                      <div className="text-xs text-muted-foreground">
                        ...and {users.length - 4} more
                      </div>
                    )}
                  </div>
                )
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={loadAvailableUsers}
            className="border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Users
          </Button>
        </div>

        {/* Enhanced Features Info */}
        <div className="mt-4 p-3 bg-purple-100/50 rounded-lg">
          <h4 className="text-sm font-medium text-purple-800 mb-2">
            Master Admin Enhanced Features
          </h4>
          <ul className="text-xs text-purple-700 space-y-1">
            <li>• Advanced user search and filtering capabilities</li>
            <li>• Direct user experience navigation from any interface</li>
            <li>• Comprehensive user browser with type categorization</li>
            <li>• Real-time user session switching with full context</li>
            <li>• Enhanced oversight of all user types and locations</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}