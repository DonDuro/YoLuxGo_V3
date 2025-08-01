import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Filter, 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Users, 
  FileText, 
  Shield, 
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  UserCheck,
  Building,
  Target
} from "lucide-react";

interface VettingOverview {
  applications: {
    total: number;
    byStatus: Record<string, number>;
    byUserType: Record<string, number>;
    byPriority: Record<string, number>;
    byVettingTier: Record<string, number>;
  };
  tasks: {
    total: number;
    byStatus: Record<string, number>;
    byType: Record<string, number>;
  };
  companies: {
    total: number;
    active: number;
  };
  officers: {
    total: number;
    active: number;
    byAccessLevel: Record<string, number>;
    byClearanceLevel: Record<string, number>;
  };
  performance: {
    averageProcessingTime: string;
    approvalRate: string;
    escalationRate: string;
    qualityScore: string;
  };
}

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

const VettingOverviewDashboard = ({ overview }: { overview: VettingOverview | null }) => {
  if (!overview) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#d4af37]"></div>
        <p className="mt-2 text-gray-600">Loading vetting overview...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-[#0a1a2f]">{overview.applications.total}</p>
                <p className="text-xs text-gray-500">All vetting requests</p>
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
                <p className="text-2xl font-bold text-yellow-600">{overview.applications.byStatus.in_review || 0}</p>
                <p className="text-xs text-gray-500">Active processing</p>
              </div>
              <Eye className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approval Rate</p>
                <p className="text-2xl font-bold text-green-600">{overview.performance.approvalRate}</p>
                <p className="text-xs text-gray-500">Quality metric</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Officers</p>
                <p className="text-2xl font-bold text-blue-600">{overview.officers.active}</p>
                <p className="text-xs text-gray-500">Verification staff</p>
              </div>
              <UserCheck className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#d4af37]" />
              Application Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(overview.applications.byStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <StatusBadge status={status} />
                  <div className="flex-1 mx-4">
                    <Progress 
                      value={(count / overview.applications.total) * 100} 
                      className="h-2"
                    />
                  </div>
                  <span className="text-sm font-medium">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-[#d4af37]" />
              User Type Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(overview.applications.byUserType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm capitalize">{type.replace('_', ' ')}</span>
                  </div>
                  <div className="flex-1 mx-4">
                    <Progress 
                      value={(count / overview.applications.total) * 100} 
                      className="h-2"
                    />
                  </div>
                  <span className="text-sm font-medium">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vetting Companies & Officers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-[#d4af37]" />
              Vetting Companies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Companies</span>
                <span className="font-medium">{overview.companies.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Companies</span>
                <span className="font-medium text-green-600">{overview.companies.active}</span>
              </div>
              <Progress 
                value={(overview.companies.active / overview.companies.total) * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-[#d4af37]" />
              Officer Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(overview.officers.byAccessLevel).map(([level, count]) => (
                <div key={level} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{level}</span>
                  <div className="flex-1 mx-4">
                    <Progress 
                      value={(count / overview.officers.total) * 100} 
                      className="h-2"
                    />
                  </div>
                  <span className="text-sm font-medium">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#d4af37]" />
            Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#0a1a2f]">{overview.performance.averageProcessingTime}</div>
              <div className="text-sm text-gray-600">Avg Processing Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{overview.performance.approvalRate}</div>
              <div className="text-sm text-gray-600">Approval Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{overview.performance.escalationRate}</div>
              <div className="text-sm text-gray-600">Escalation Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{overview.performance.qualityScore}</div>
              <div className="text-sm text-gray-600">Quality Score</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ApplicationsManagement = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    userType: 'all',
    company: 'all',
    officer: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    limit: 25
  });

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== 'all') {
          params.append(key, value);
        }
      });
      params.append('page', pagination.current.toString());
      params.append('limit', pagination.limit.toString());

      const response = await fetch(`/api/admin/vetting/applications?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
        setPagination(data.pagination || pagination);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [filters, pagination.current]);

  const filteredApplications = applications.filter(app =>
    app.applicantEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.applicationData.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.applicationData.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
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
                  <SelectItem value="suspended">Suspended</SelectItem>
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
              <Label>Company</Label>
              <Select value={filters.company} onValueChange={(value) => setFilters({...filters, company: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  <SelectItem value="vetting-001">Elite Verification Services LLC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button onClick={() => fetchApplications()} className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <Card>
        <CardHeader>
          <CardTitle>Vetting Applications Management</CardTitle>
          <CardDescription>
            Complete oversight of all vetting processes across all companies and user types
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
                        <Badge variant="secondary" className="capitalize">
                          {app.vettingTier}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-700">Applicant</p>
                          <p className="text-gray-600">
                            {app.applicationData.firstName} {app.applicationData.lastName}
                          </p>
                          <p className="text-gray-500">{app.applicantEmail}</p>
                        </div>
                        
                        <div>
                          <p className="font-medium text-gray-700">Details</p>
                          <p className="text-gray-600 capitalize">{app.vettingTier} Tier</p>
                          {app.serviceCategory && (
                            <p className="text-gray-500">{app.serviceCategory}</p>
                          )}
                          {app.membershipTier && (
                            <p className="text-gray-500 capitalize">{app.membershipTier} Member</p>
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
                          {app.actualCompletionDate && (
                            <p className="text-green-600">
                              Completed: {new Date(app.actualCompletionDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <p className="font-medium text-gray-700">Assignment</p>
                          {app.assignedCompanyId && (
                            <p className="text-gray-600">Elite Verification Services</p>
                          )}
                          {app.primaryOfficerId && (
                            <p className="text-gray-500">Officer Assigned</p>
                          )}
                          {app.secondaryOfficerId && (
                            <p className="text-gray-500">Dual Verification</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Activity className="h-4 w-4 mr-1" />
                        View Tasks
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-500">
                    Showing {((pagination.current - 1) * pagination.limit) + 1} to{' '}
                    {Math.min(pagination.current * pagination.limit, pagination.total)} of{' '}
                    {pagination.total} applications
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.current === 1}
                      onClick={() => setPagination({...pagination, current: pagination.current - 1})}
                    >
                      Previous
                    </Button>
                    
                    <span className="flex items-center px-3 text-sm">
                      Page {pagination.current} of {pagination.pages}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.current === pagination.pages}
                      onClick={() => setPagination({...pagination, current: pagination.current + 1})}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default function AdminVettingManagement() {
  const [overview, setOverview] = useState<VettingOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/admin/vetting/overview', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setOverview(data);
      } else {
        throw new Error('Failed to fetch vetting overview');
      }
    } catch (error) {
      console.error('Error fetching vetting overview:', error);
      toast({
        title: "Error",
        description: "Failed to load vetting overview. Please check your access permissions.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-[#d4af37]" />
              <div>
                <h1 className="text-xl font-bold text-[#0a1a2f]">YoLuxGo™ Master Admin</h1>
                <p className="text-sm text-gray-600">Comprehensive Vetting System Oversight</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button onClick={fetchOverview} variant="outline">
                <Activity className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="companies">Companies</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <VettingOverviewDashboard overview={overview} />
          </TabsContent>
          
          <TabsContent value="applications">
            <ApplicationsManagement />
          </TabsContent>
          
          <TabsContent value="companies">
            <Card>
              <CardHeader>
                <CardTitle>Vetting Companies Management</CardTitle>
                <CardDescription>
                  Manage contracts, performance, and relationships with vetting service providers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Company management interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Vetting Analytics & Reporting</CardTitle>
                <CardDescription>
                  Comprehensive analytics and performance reporting across all vetting operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Advanced analytics dashboard coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}