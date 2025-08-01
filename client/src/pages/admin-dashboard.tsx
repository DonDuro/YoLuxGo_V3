import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Shield, 
  Car, 
  Building,
  Globe,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3
} from "lucide-react";
import ylgBrandLogo from "@assets/New Primary YLG Transparent Logo_1753681153359.png";
import { MasterAdminPanel } from "@/components/master-admin-panel";

interface AdminUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface BusinessMetrics {
  revenue: {
    monthly: number;
    quarterly: number;
    yearly: number;
    growth: {
      monthOverMonth: number;
      quarterOverQuarter: number;
      yearOverYear: number;
    };
  };
  clients: {
    total: number;
    active: number;
    premium: number;
    vip: number;
    newThisMonth: number;
    churnRate: number;
    avgLifetimeValue: number;
    regionBreakdown: Record<string, number>;
  };
  services: {
    transportation: { bookings: number; revenue: number; avgPrice: number; satisfaction: number; };
    security: { assignments: number; revenue: number; avgPrice: number; satisfaction: number; };
    concierge: { requests: number; revenue: number; avgPrice: number; satisfaction: number; };
  };
  operations: {
    personnelUtilization: number;
    vehicleUtilization: number;
    responseTime: number;
    incidentRate: number;
    uptime: number;
  };
  regions: Array<{
    name: string;
    revenue: number;
    clients: number;
    growth: number;
    margin: number;
  }>;
}

export function AdminDashboard() {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [financials, setFinancials] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Pagination and filtering state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [trips, setTrips] = useState<any[]>([]);
  const [totalTrips, setTotalTrips] = useState(0);
  
  const { toast } = useToast();

  useEffect(() => {
    // Try admin token first, then fall back to main auth token for admin users
    let token = localStorage.getItem('adminToken');
    let adminData = localStorage.getItem('adminUser');
    
    // If no admin token, check if user is admin via main auth system
    if (!token || !adminData) {
      const mainAuthToken = localStorage.getItem('auth_token');
      if (mainAuthToken) {
        try {
          const payload = JSON.parse(atob(mainAuthToken.split('.')[1]));
          if (payload.userType === 'admin') {
            // Find the admin profile from test accounts
            const testAccounts = [
              { email: "calvarado@nebusis.com", profile: { id: "admin-master", firstName: "Celso", lastName: "Alvarado", role: "Master Admin", title: "Founder & CEO" }},
              { email: "dzambrano@nebusis.com", profile: { id: "admin-daniel", firstName: "Daniel", lastName: "Zambrano", role: "Master Admin", title: "CTO" }}
            ];
            
            const adminAccount = testAccounts.find(acc => acc.email === payload.email);
            const adminProfile = {
              id: payload.userId,
              username: payload.email,
              email: payload.email,
              firstName: adminAccount?.profile.firstName || 'Admin',
              lastName: adminAccount?.profile.lastName || 'User', 
              role: adminAccount?.profile.role || 'Master Admin'
            };
            setAdmin(adminProfile);
            loadBusinessData(mainAuthToken);
            return;
          }
        } catch (error) {
          console.error('Error parsing main auth token:', error);
        }
      }
      
      // No valid admin credentials found
      window.location.href = '/admin';
      return;
    }

    setAdmin(JSON.parse(adminData));
    loadBusinessData(token);
  }, []);

  const loadBusinessData = async (token: string) => {
    try {
      // Load all business data in parallel with proper authorization headers
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      const [metricsRes, suppliersRes, financialsRes] = await Promise.all([
        fetch('/api/admin/analytics/dashboard', { headers }),
        fetch('/api/admin/suppliers', { headers }),
        fetch('/api/admin/financial/overview', { headers })
      ]);
      
      // Load initial trips data
      loadTrips(token);

      if (metricsRes.ok) {
        const metricsData = await metricsRes.json();
        setMetrics(metricsData);
      }

      if (suppliersRes.ok) {
        const suppliersData = await suppliersRes.json();
        setSuppliers(suppliersData);
      }

      if (financialsRes.ok) {
        const financialData = await financialsRes.json();
        setFinancials(financialData);
      }

    } catch (error) {
      console.error('Error loading business data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTrips = async (token: string) => {
    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        city: cityFilter,
        search: searchTerm
      });
      
      const response = await fetch(`/api/admin/trips?${params}`, { headers });
      if (response.ok) {
        const data = await response.json();
        setTrips(data.trips);
        setTotalTrips(data.total);
      }
    } catch (error) {
      console.error('Error loading trips:', error);
      toast({
        title: "Error",
        description: "Failed to load trips data",
        variant: "destructive",
      });
    }
  };

  // Load trips when pagination/filtering changes
  useEffect(() => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('auth_token');
    if (token && admin) {
      loadTrips(token);
    }
  }, [currentPage, itemsPerPage, cityFilter, searchTerm, admin]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const handleUserSwitch = (token: string, userType: string, profile: any) => {
    // This will be handled by the component itself - just for interface compliance
    console.log('Master Admin switched to:', { userType, profile });
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin';
  };

  if (!admin || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1a2f] via-[#1a2b3f] to-[#2a3b4f] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#d4af37] mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Business Intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1a2f] via-[#1a2b3f] to-[#2a3b4f] p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="bg-[#fdfdfb] shadow-2xl">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <img src={ylgBrandLogo} alt="YoLuxGo™" className="h-12 mr-1" />
                <div>
                  <h1 className="text-3xl font-serif text-[#0a1a2f]">
                    YoLuxGo<sup className="text-[0.4rem] ml-0.5 text-[#d4af37]">™</sup> Business Intelligence
                  </h1>
                  <p className="text-[#666] font-medium">Master Administration Dashboard</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-bold text-[#0a1a2f] text-lg">{admin.firstName} {admin.lastName}</p>
                  <Badge variant="outline" className="border-[#d4af37] text-[#d4af37]">
                    {admin.role.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                {admin.email === 'calvarado@nebusis.com' && (
                  <Button 
                    onClick={() => window.location.href = '/admin/business-dashboard'}
                    className="bg-blue-600 text-white hover:bg-blue-700 font-semibold"
                  >
                    Investors & Collaborators
                  </Button>
                )}
                <Button 
                  onClick={handleLogout}
                  className="bg-[#d4af37] text-[#0a1a2f] hover:bg-[#b8941f] font-semibold"
                >
                  Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Master Admin Navigation Panel - Only show for Master Admin */}
        {admin?.id === 'admin-master' && (
          <MasterAdminPanel onUserSwitch={handleUserSwitch} />
        )}

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-[#fdfdfb]">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-[#0a1a2f]">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="trips" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-[#0a1a2f]">
              <Car className="w-4 h-4 mr-2" />
              Trips
            </TabsTrigger>
            <TabsTrigger value="financials" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-[#0a1a2f]">
              <DollarSign className="w-4 h-4 mr-2" />
              Financials
            </TabsTrigger>
            <TabsTrigger value="clients" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-[#0a1a2f]">
              <Users className="w-4 h-4 mr-2" />
              Clients
            </TabsTrigger>
            <TabsTrigger value="suppliers" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-[#0a1a2f]">
              <Building className="w-4 h-4 mr-2" />
              Suppliers
            </TabsTrigger>
            <TabsTrigger value="operations" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-[#0a1a2f]">
              <Globe className="w-4 h-4 mr-2" />
              Operations
            </TabsTrigger>
            <TabsTrigger value="vetting" className="data-[state=active]:bg-[#d4af37] data-[state=active]:text-[#0a1a2f]">
              <Shield className="w-4 h-4 mr-2" />
              Vetting
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Revenue Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-[#fdfdfb] shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-[#666] flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Monthly Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#0a1a2f]">
                    {metrics ? formatCurrency(metrics.revenue.monthly) : '$0'}
                  </div>
                  <div className="flex items-center mt-1">
                    {metrics && metrics.revenue.growth.monthOverMonth > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      metrics && metrics.revenue.growth.monthOverMonth > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metrics ? formatPercentage(metrics.revenue.growth.monthOverMonth) : '0%'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#fdfdfb] shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-[#666] flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Active Clients
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#0a1a2f]">
                    {metrics ? metrics.clients.active.toLocaleString() : '0'}
                  </div>
                  <div className="text-sm text-[#666] mt-1">
                    {metrics ? metrics.clients.newThisMonth : 0} new this month
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#fdfdfb] shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-[#666] flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Security Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#0a1a2f]">
                    {metrics ? metrics.services.security.assignments : 0}
                  </div>
                  <div className="text-sm text-[#666] mt-1">
                    {metrics ? formatCurrency(metrics.services.security.revenue) : '$0'} revenue
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#fdfdfb] shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-[#666] flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    System Uptime
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#0a1a2f]">
                    {metrics ? metrics.operations.uptime : 0}%
                  </div>
                  <div className="text-sm text-green-600 mt-1 flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Operational
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Regional Performance */}
            <Card className="bg-[#fdfdfb] shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-[#0a1a2f] flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Regional Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {metrics?.regions.map((region) => (
                    <div key={region.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#0a1a2f]">{region.name}</h3>
                        <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                          <div>
                            <p className="text-[#666]">Revenue</p>
                            <p className="font-semibold text-[#0a1a2f]">{formatCurrency(region.revenue)}</p>
                          </div>
                          <div>
                            <p className="text-[#666]">Clients</p>
                            <p className="font-semibold text-[#0a1a2f]">{region.clients}</p>
                          </div>
                          <div>
                            <p className="text-[#666]">Growth</p>
                            <p className="font-semibold text-green-600">{formatPercentage(region.growth)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[#666]">Margin</p>
                        <p className="text-lg font-bold text-[#d4af37]">{region.margin.toFixed(1)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financials" className="space-y-6">
            {financials && (
              <>
                {/* P&L Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-[#fdfdfb] shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl text-[#0a1a2f]">Profit & Loss</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-[#666]">Total Revenue</span>
                        <span className="font-bold text-[#0a1a2f]">{formatCurrency(financials.profitLoss.revenue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#666]">Gross Profit</span>
                        <span className="font-bold text-green-600">{formatCurrency(financials.profitLoss.grossProfit)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#666]">Net Profit</span>
                        <span className="font-bold text-[#d4af37]">{formatCurrency(financials.profitLoss.netProfit)}</span>
                      </div>
                      <div className="pt-4 border-t">
                        <div className="flex justify-between">
                          <span className="text-[#666]">Net Margin</span>
                          <span className="font-bold text-[#0a1a2f]">{financials.profitLoss.margins.net}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#fdfdfb] shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl text-[#0a1a2f]">Cash Flow</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-[#666]">Operating Cash Flow</span>
                        <span className="font-bold text-green-600">{formatCurrency(financials.cashFlow.operating)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#666]">Investing Cash Flow</span>
                        <span className="font-bold text-red-600">{formatCurrency(financials.cashFlow.investing)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#666]">Financing Cash Flow</span>
                        <span className="font-bold text-red-600">{formatCurrency(financials.cashFlow.financing)}</span>
                      </div>
                      <div className="pt-4 border-t">
                        <div className="flex justify-between">
                          <span className="text-[#666]">Net Cash Flow</span>
                          <span className="font-bold text-[#d4af37]">{formatCurrency(financials.cashFlow.net)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Cost Breakdown */}
                <Card className="bg-[#fdfdfb] shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl text-[#0a1a2f]">Cost Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(financials.profitLoss.costs).map(([category, amount]) => (
                        <div key={category} className="text-center p-4 border rounded-lg">
                          <p className="text-sm text-[#666] capitalize">{category.replace(/([A-Z])/g, ' $1')}</p>
                          <p className="text-lg font-bold text-[#0a1a2f]">{formatCurrency(amount as number)}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            {metrics && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card className="bg-[#fdfdfb] shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-[#0a1a2f]">{metrics.clients.total.toLocaleString()}</div>
                      <p className="text-[#666] mt-1">Total Clients</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-[#fdfdfb] shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-[#d4af37]">{metrics.clients.vip}</div>
                      <p className="text-[#666] mt-1">VIP Clients</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-[#fdfdfb] shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-green-600">{formatCurrency(metrics.clients.avgLifetimeValue)}</div>
                      <p className="text-[#666] mt-1">Avg Lifetime Value</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-[#fdfdfb] shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl font-bold text-red-600">{metrics.clients.churnRate}%</div>
                      <p className="text-[#666] mt-1">Churn Rate</p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-[#fdfdfb] shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl text-[#0a1a2f]">Client Distribution by Region</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(metrics.clients.regionBreakdown).map(([region, count]) => (
                        <div key={region} className="flex items-center justify-between">
                          <span className="text-[#0a1a2f] font-medium">{region}</span>
                          <div className="flex items-center space-x-3">
                            <Progress 
                              value={(count / metrics.clients.total) * 100} 
                              className="w-32"
                            />
                            <span className="text-[#d4af37] font-bold min-w-[3rem]">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="suppliers" className="space-y-6">
            <Card className="bg-[#fdfdfb] shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-[#0a1a2f]">Supplier Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {suppliers.map((supplier) => (
                    <div key={supplier.id} className="border rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-[#0a1a2f]">{supplier.name}</h3>
                          <div className="flex items-center space-x-4 mt-2">
                            <Badge variant="outline">{supplier.type}</Badge>
                            <Badge variant="outline">{supplier.region}</Badge>
                            <Badge variant={supplier.status === 'active' ? 'default' : 'secondary'}>
                              {supplier.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-[#d4af37]">{formatCurrency(supplier.monthlySpend)}</p>
                          <p className="text-sm text-[#666]">Monthly Spend</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-[#666]">Contracts</p>
                          <p className="font-semibold text-[#0a1a2f]">{supplier.contracts}</p>
                        </div>
                        <div>
                          <p className="text-[#666]">Rating</p>
                          <p className="font-semibold text-[#0a1a2f]">{supplier.rating}/5.0</p>
                        </div>
                        <div>
                          <p className="text-[#666]">Last Payment</p>
                          <p className="font-semibold text-[#0a1a2f]">{supplier.lastPayment}</p>
                        </div>
                        <div>
                          <p className="text-[#666]">Next Review</p>
                          <p className="font-semibold text-[#0a1a2f]">{supplier.nextReview}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="operations" className="space-y-6">
            {metrics && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-[#fdfdfb] shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-sm text-[#666]">Personnel Utilization</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-[#0a1a2f] mb-2">
                        {metrics.operations.personnelUtilization}%
                      </div>
                      <Progress value={metrics.operations.personnelUtilization} className="mb-2" />
                      <p className="text-xs text-[#666]">Optimal range: 80-90%</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#fdfdfb] shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-sm text-[#666]">Vehicle Utilization</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-[#0a1a2f] mb-2">
                        {metrics.operations.vehicleUtilization}%
                      </div>
                      <Progress value={metrics.operations.vehicleUtilization} className="mb-2" />
                      <p className="text-xs text-[#666]">Fleet efficiency metric</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#fdfdfb] shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-sm text-[#666] flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        Response Time
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-[#0a1a2f] mb-2">
                        {metrics.operations.responseTime} min
                      </div>
                      <p className="text-xs text-green-600">Excellent performance</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(metrics.services).map(([service, data]) => (
                    <Card key={service} className="bg-[#fdfdfb] shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-lg text-[#0a1a2f] capitalize flex items-center">
                          {service === 'transportation' && <Car className="w-5 h-5 mr-2" />}
                          {service === 'security' && <Shield className="w-5 h-5 mr-2" />}
                          {service === 'concierge' && <Building className="w-5 h-5 mr-2" />}
                          {service}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-[#666]">
                            {service === 'transportation' ? 'Bookings' : 
                             service === 'security' ? 'Assignments' : 'Requests'}
                          </span>
                          <span className="font-bold text-[#0a1a2f]">
                            {service === 'transportation' ? (data as any).bookings :
                             service === 'security' ? (data as any).assignments : (data as any).requests}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#666]">Revenue</span>
                          <span className="font-bold text-[#d4af37]">{formatCurrency(data.revenue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#666]">Avg Price</span>
                          <span className="font-bold text-[#0a1a2f]">{formatCurrency(data.avgPrice)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#666]">Satisfaction</span>
                          <span className="font-bold text-green-600">{data.satisfaction}/5.0</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          {/* Trips Management Tab */}
          <TabsContent value="trips" className="space-y-6">
            <Card className="bg-[#fdfdfb] shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-[#0a1a2f] flex items-center">
                  <Car className="w-6 h-6 mr-3" />
                  Trips Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Filters and Search */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-[#0a1a2f] mb-2">Buscar</label>
                    <Input
                      placeholder="Buscar por cliente, ID de viaje..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border-[#d4af37] focus:border-[#0a1a2f]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0a1a2f] mb-2">Ciudad</label>
                    <Select value={cityFilter} onValueChange={setCityFilter}>
                      <SelectTrigger className="border-[#d4af37] focus:border-[#0a1a2f]">
                        <SelectValue placeholder="Filtrar por ciudad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las ciudades</SelectItem>
                        <SelectItem value="New York">New York</SelectItem>
                        <SelectItem value="Miami">Miami</SelectItem>
                        <SelectItem value="Los Angeles">Los Angeles</SelectItem>
                        <SelectItem value="Malaga-Marbella">Malaga-Marbella</SelectItem>
                        <SelectItem value="Punta Cana">Punta Cana</SelectItem>
                        <SelectItem value="La Romana">La Romana - Casa de Campo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0a1a2f] mb-2">Resultados por página</label>
                    <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                      <SelectTrigger className="border-[#d4af37] focus:border-[#0a1a2f]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <div className="text-sm text-[#666]">
                      Total: <span className="font-bold text-[#0a1a2f]">{totalTrips}</span> viajes
                    </div>
                  </div>
                </div>

                {/* Trips Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                    <thead>
                      <tr className="bg-[#0a1a2f] text-white">
                        <th className="p-4 text-left font-semibold">ID Viaje</th>
                        <th className="p-4 text-left font-semibold">Cliente</th>
                        <th className="p-4 text-left font-semibold">Ciudad</th>
                        <th className="p-4 text-left font-semibold">Servicio</th>
                        <th className="p-4 text-left font-semibold">Fecha</th>
                        <th className="p-4 text-left font-semibold">Estado</th>
                        <th className="p-4 text-left font-semibold">Monto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trips.map((trip, index) => (
                        <tr key={trip.id} className={index % 2 === 0 ? "bg-[#fdfdfb]" : "bg-white"}>
                          <td className="p-4 font-mono text-sm">{trip.id}</td>
                          <td className="p-4">
                            <div>
                              <div className="font-semibold text-[#0a1a2f]">{trip.clientName}</div>
                              <div className="text-sm text-[#666]">{trip.clientEmail}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline" className="border-[#d4af37] text-[#0a1a2f]">
                              {trip.city}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center">
                              {trip.serviceType === 'transportation' && <Car className="w-4 h-4 mr-2" />}
                              {trip.serviceType === 'security' && <Shield className="w-4 h-4 mr-2" />}
                              {trip.serviceType === 'concierge' && <Building className="w-4 h-4 mr-2" />}
                              <span className="capitalize">{trip.serviceType}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div>
                              <div className="font-semibold">{trip.date}</div>
                              <div className="text-sm text-[#666]">{trip.time}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge 
                              variant={trip.status === 'completed' ? 'default' : 
                                     trip.status === 'active' ? 'secondary' : 'outline'}
                              className={
                                trip.status === 'completed' ? 'bg-green-100 text-green-800' :
                                trip.status === 'active' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }
                            >
                              {trip.status === 'completed' ? 'Completado' :
                               trip.status === 'active' ? 'Activo' : 'Pendiente'}
                            </Badge>
                          </td>
                          <td className="p-4 font-bold text-[#d4af37]">
                            {formatCurrency(trip.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-6">
                  <div className="text-sm text-[#666]">
                    Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, totalTrips)} de {totalTrips} resultados
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="border-[#d4af37] text-[#0a1a2f] hover:bg-[#d4af37] hover:text-[#0a1a2f]"
                    >
                      Anterior
                    </Button>
                    <div className="flex items-center space-x-2">
                      {Array.from({ length: Math.min(5, Math.ceil(totalTrips / itemsPerPage)) }, (_, i) => {
                        const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                        const totalPages = Math.ceil(totalTrips / itemsPerPage);
                        if (pageNum > totalPages) return null;
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={pageNum === currentPage ? "default" : "outline"}
                            onClick={() => setCurrentPage(pageNum)}
                            className={pageNum === currentPage ? 
                              "bg-[#d4af37] text-[#0a1a2f]" : 
                              "border-[#d4af37] text-[#0a1a2f] hover:bg-[#d4af37] hover:text-[#0a1a2f]"
                            }
                            size="sm"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.min(Math.ceil(totalTrips / itemsPerPage), currentPage + 1))}
                      disabled={currentPage === Math.ceil(totalTrips / itemsPerPage)}
                      className="border-[#d4af37] text-[#0a1a2f] hover:bg-[#d4af37] hover:text-[#0a1a2f]"
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vetting" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-[#fdfdfb] shadow-lg">
                <CardHeader>
                  <CardTitle className="text-[#0a1a2f] flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-[#d4af37]" />
                    Vetting System Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#666] mb-4">
                    Comprehensive vetting system management for all user types and service providers.
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-[#666]">Total Applications</span>
                      <span className="font-semibold text-[#0a1a2f]">247</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#666]">In Review</span>
                      <span className="font-semibold text-yellow-600">32</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#666]">Approved This Month</span>
                      <span className="font-semibold text-green-600">89</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#666]">Active Vetting Officers</span>
                      <span className="font-semibold text-blue-600">12</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#fdfdfb] shadow-lg">
                <CardHeader>
                  <CardTitle className="text-[#0a1a2f] flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-[#d4af37]" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button 
                      onClick={() => window.location.href = '/admin/vetting'}
                      className="w-full bg-[#d4af37] text-[#0a1a2f] hover:bg-[#b8941f] font-semibold"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Open Full Vetting Management
                    </Button>
                    <Button 
                      onClick={() => window.location.href = '/vetting/dashboard'}
                      variant="outline"
                      className="w-full border-[#d4af37] text-[#0a1a2f] hover:bg-[#d4af37] hover:text-[#0a1a2f]"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      View Vetting Officer Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-[#fdfdfb] shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#0a1a2f] flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-[#d4af37]" />
                  Vetting Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#0a1a2f]">3.2 days</div>
                    <div className="text-sm text-[#666]">Avg Processing Time</div>
                    <Progress value={85} className="mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">94.2%</div>
                    <div className="text-sm text-[#666]">Approval Rate</div>
                    <Progress value={94} className="mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">2.1%</div>
                    <div className="text-sm text-[#666]">Escalation Rate</div>
                    <Progress value={21} className="mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">A+</div>
                    <div className="text-sm text-[#666]">Quality Score</div>
                    <Progress value={95} className="mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#fdfdfb] shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#0a1a2f] flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-[#d4af37]" />
                  Recent Vetting Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-semibold text-[#0a1a2f]">Service Provider Application - VET-2025-001</p>
                      <p className="text-sm text-[#666]">Miami Executive Protection Services • High Priority</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">In Review</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-semibold text-[#0a1a2f]">Client Application - VET-2025-002</p>
                      <p className="text-sm text-[#666]">VIP Member • La Romana</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Approved</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-semibold text-[#0a1a2f]">Regional Partner Application - VET-2025-003</p>
                      <p className="text-sm text-[#666]">Marbella Operations • Standard</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Under Review</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}