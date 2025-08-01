import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Search, Filter, Eye, Clock, CheckCircle, XCircle, AlertTriangle, Users, FileText, Shield, TrendingUp } from "lucide-react";

// Mock authentication - in production, this would use proper JWT handling
const useVettingAuth = () => {
  const [officer, setOfficer] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/vetting/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('vetting_token', data.token);
        setOfficer(data.officer);
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, message: error.message };
      }
    } catch (error) {
      return { success: false, message: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('vetting_token');
    setOfficer(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('vetting_token');
    if (token) {
      // In production, verify token and get officer data
      // For demo, set a mock officer
      setOfficer({
        id: 'officer-001',
        firstName: 'Sarah',
        lastName: 'Mitchell',
        email: 's.mitchell@eliteverification.com',
        accessLevel: 'supervisor',
        clearanceLevel: 'enhanced',
        specializations: ['background_check', 'credential_validation']
      });
    }
  }, []);

  return { officer, login, logout, loading };
};

const VettingLogin = ({ onLogin }: { onLogin: (email: string, password: string) => Promise<any> }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await onLogin(email, password);

    if (result.success) {
      toast({
        title: "Login Successful",
        description: "Welcome to the YoLuxGo™ Vetting System",
      });
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1a2f] via-[#1a2b45] to-[#0a1a2f] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-[#d4af37]" />
            <span className="text-2xl font-bold text-[#0a1a2f]">YoLuxGo™</span>
          </div>
          <CardTitle>Vetting Officer Portal</CardTitle>
          <CardDescription>
            Access the comprehensive vetting system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@eliteverification.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2"><strong>Demo Credentials:</strong></p>
            <div className="text-xs space-y-1">
              <p><strong>Supervisor:</strong> s.mitchell@eliteverification.com / admin123</p>
              <p><strong>Officer:</strong> m.rodriguez@eliteverification.com / admin123</p>
              <p><strong>Manager:</strong> j.thompson@eliteverification.com / admin123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const variants: Record<string, { color: string; icon: React.ReactNode }> = {
    submitted: { color: "bg-blue-100 text-blue-800", icon: <Clock className="h-3 w-3" /> },
    in_review: { color: "bg-yellow-100 text-yellow-800", icon: <Eye className="h-3 w-3" /> },
    additional_info_required: { color: "bg-orange-100 text-orange-800", icon: <AlertTriangle className="h-3 w-3" /> },
    approved: { color: "bg-green-100 text-green-800", icon: <CheckCircle className="h-3 w-3" /> },
    rejected: { color: "bg-red-100 text-red-800", icon: <XCircle className="h-3 w-3" /> },
    suspended: { color: "bg-gray-100 text-gray-800", icon: <XCircle className="h-3 w-3" /> }
  };

  const variant = variants[status] || variants.submitted;

  return (
    <Badge className={`${variant.color} flex items-center gap-1`}>
      {variant.icon}
      {status.replace(/_/g, ' ').toUpperCase()}
    </Badge>
  );
};

const PriorityBadge = ({ priority }: { priority: string }) => {
  const colors: Record<string, string> = {
    urgent: "bg-red-100 text-red-800",
    high: "bg-orange-100 text-orange-800", 
    standard: "bg-blue-100 text-blue-800",
    low: "bg-gray-100 text-gray-800"
  };

  return (
    <Badge className={colors[priority] || colors.standard}>
      {priority.toUpperCase()}
    </Badge>
  );
};

const ApplicationsList = ({ officer }: { officer: any }) => {
  const [applications, setApplications] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    userType: 'all',
    priority: 'all',
    assigned: false
  });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('vetting_token');
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== 'all' && value !== false) {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/vetting/applications?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
        setSummary(data.summary || {});
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [filters]);

  const filteredApplications = applications.filter(app =>
    app.applicantEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.applicationData.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.applicationData.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-[#0a1a2f]">{summary.total || 0}</p>
              </div>
              <FileText className="h-8 w-8 text-[#d4af37]" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Review</p>
                <p className="text-2xl font-bold text-yellow-600">{summary.byStatus?.in_review || 0}</p>
              </div>
              <Eye className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{summary.byStatus?.approved || 0}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-red-600">{summary.byPriority?.high || 0}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="in_review">In Review</SelectItem>
                  <SelectItem value="additional_info_required">Additional Info Required</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>User Type</Label>
              <Select value={filters.userType} onValueChange={(value) => setFilters({...filters, userType: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="service_provider">Service Provider</SelectItem>
                  <SelectItem value="regional_partner">Regional Partner</SelectItem>
                  <SelectItem value="personnel">Personnel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={filters.priority} onValueChange={(value) => setFilters({...filters, priority: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button
                variant={filters.assigned ? "default" : "outline"}
                onClick={() => setFilters({...filters, assigned: !filters.assigned})}
                className="w-full"
              >
                <Users className="h-4 w-4 mr-2" />
                Assigned to Me
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <Card>
        <CardHeader>
          <CardTitle>Vetting Applications</CardTitle>
          <CardDescription>
            Manage and review candidate applications based on your clearance level
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#d4af37]"></div>
              <p className="mt-2 text-gray-600">Loading applications...</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No applications found matching your criteria</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((app) => (
                <div key={app.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-[#0a1a2f]">{app.id}</h3>
                        <StatusBadge status={app.currentStatus} />
                        <PriorityBadge priority={app.priorityLevel} />
                        <Badge variant="outline">
                          {app.userType.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-700">Applicant</p>
                          <p className="text-gray-600">
                            {app.applicationData.firstName} {app.applicationData.lastName}
                          </p>
                          <p className="text-gray-500">{app.applicantEmail}</p>
                        </div>
                        
                        <div>
                          <p className="font-medium text-gray-700">Vetting Tier</p>
                          <p className="text-gray-600 capitalize">{app.vettingTier}</p>
                          {app.serviceCategory && (
                            <p className="text-gray-500">{app.serviceCategory}</p>
                          )}
                        </div>
                        
                        <div>
                          <p className="font-medium text-gray-700">Timeline</p>
                          <p className="text-gray-600">
                            Submitted: {new Date(app.submittedAt).toLocaleDateString()}
                          </p>
                          {app.estimatedCompletionDate && (
                            <p className="text-gray-500">
                              Due: {new Date(app.estimatedCompletionDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default function VettingDashboard() {
  const { officer, login, logout, loading } = useVettingAuth();

  if (!officer) {
    return <VettingLogin onLogin={login} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-[#d4af37]" />
              <div>
                <h1 className="text-xl font-bold text-[#0a1a2f]">YoLuxGo™ Vetting System</h1>
                <p className="text-sm text-gray-600">Comprehensive Verification Portal</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-[#0a1a2f]">
                  {officer.firstName} {officer.lastName}
                </p>
                <p className="text-xs text-gray-600 capitalize">
                  {officer.accessLevel} • {officer.clearanceLevel}
                </p>
              </div>
              <Button variant="outline" onClick={logout}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="tasks">Verification Tasks</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="applications">
            <ApplicationsList officer={officer} />
          </TabsContent>
          
          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle>Verification Tasks</CardTitle>
                <CardDescription>
                  Individual verification components assigned to you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Task management interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Verification Analytics</CardTitle>
                <CardDescription>
                  Performance metrics and processing statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Analytics dashboard coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Officer Settings</CardTitle>
                <CardDescription>
                  Manage your verification preferences and notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Settings panel coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}