import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Shield, Car, Crown, Plus, Settings, User, Bell } from "lucide-react";
import ylgBrandLogo from "@assets/New Primary YLG Transparent Logo_1753681153359.png";
import ylgHorizontalLogo from "@assets/image_1753681143925.png";
import { UserMenu } from "@/components/user-menu";

interface ServiceRequest {
  id: string;
  type: 'transportation' | 'security' | 'concierge' | 'multi-service';
  title: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed';
  location: string;
  datetime: string;
  details: string;
  cost?: string;
  createdAt?: string;
  services?: any[];
}

export function ClientDashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'services' | 'requests' | 'profile'>('dashboard');

  // Fetch real service requests from the API
  const { data: serviceRequests = [], isLoading: isLoadingRequests } = useQuery<ServiceRequest[]>({
    queryKey: ['/api/client/service-requests'],
    retry: false,
  });

  // Mock client data
  const client = {
    firstName: "Alexander",
    lastName: "Sterling",
    email: "a.sterling@private.com",
    membershipLevel: "Platinum Elite",
    joinDate: "2024-01-15",
    location: "New York, NY"
  };

  // Use real requests from API, fallback to empty array
  const recentRequests: ServiceRequest[] = Array.isArray(serviceRequests) ? serviceRequests.slice(0, 5) : []; // Show only latest 5 requests

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'transportation': return <Car className="h-5 w-5" />;
      case 'security': return <Shield className="h-5 w-5" />;
      case 'concierge': return <Crown className="h-5 w-5" />;
      case 'multi-service': return <Plus className="h-5 w-5" />;
      default: return <Car className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1a2f] via-[#1a2b3f] to-[#2a3b4f]">
      {/* Header */}
      <div className="bg-[#fdfdfb] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img src={ylgBrandLogo} alt="YoLuxGo" className="h-10 mr-1" />
              <div>
                <h1 className="text-xl font-serif text-[#0a1a2f]">YoLuxGo<sup className="text-[0.3rem] ml-0.5 text-[#d4af37]">™</sup> Portal</h1>
                <p className="text-[#666] text-sm">Discreet Luxury. Global Security.</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="text-right">
                <p className="font-medium text-[#0a1a2f]">{client.firstName} {client.lastName}</p>
                <p className="text-sm text-[#d4af37]">{client.membershipLevel}</p>
              </div>
              <UserMenu />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-[#fdfdfb] border-t">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: User },
              { id: 'services', label: 'Book Services', icon: Plus },
              { id: 'requests', label: 'My Requests', icon: Clock },
              { id: 'profile', label: 'Profile', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                  activeTab === tab.id 
                    ? 'border-[#d4af37] text-[#d4af37]' 
                    : 'border-transparent text-[#666] hover:text-[#0a1a2f]'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Welcome Section */}
            <Card className="bg-[#fdfdfb]">
              <CardHeader>
                <CardTitle className="text-[#0a1a2f]">Welcome back, {client.firstName}</CardTitle>
                <p className="text-[#666]">Your luxury services dashboard</p>
              </CardHeader>
            </Card>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="bg-[#fdfdfb]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#666]">Active Requests</p>
                      <p className="text-2xl font-bold text-[#d4af37]">2</p>
                    </div>
                    <Clock className="h-8 w-8 text-[#d4af37]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#fdfdfb]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#666]">This Month</p>
                      <p className="text-2xl font-bold text-[#d4af37]">7</p>
                    </div>
                    <Calendar className="h-8 w-8 text-[#d4af37]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#fdfdfb]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#666]">Membership</p>
                      <p className="text-lg font-bold text-[#d4af37]">Platinum</p>
                    </div>
                    <Shield className="h-8 w-8 text-[#d4af37]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#fdfdfb]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#666]">Location</p>
                      <p className="text-sm font-medium text-[#0a1a2f]">New York</p>
                    </div>
                    <MapPin className="h-8 w-8 text-[#d4af37]" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Requests */}
            <Card className="bg-[#fdfdfb]">
              <CardHeader>
                <CardTitle className="text-[#0a1a2f]">Recent Service Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingRequests ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-[#666]">Loading your service requests...</p>
                  </div>
                ) : recentRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-[#666] mb-4">No service requests yet</p>
                    <p className="text-sm text-[#666]">Your completed and pending service requests will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentRequests.map(request => (
                      <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-[#d4af37]/10 rounded-lg">
                            {getServiceIcon(request.type)}
                          </div>
                          <div>
                            <h3 className="font-medium text-[#0a1a2f]">{request.title}</h3>
                            <p className="text-sm text-[#666]">{request.location} • {request.datetime}</p>
                            <p className="text-sm text-[#666]">{request.details}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(request.status)}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Badge>
                          {request.cost && (
                            <p className="text-sm font-medium text-[#0a1a2f] mt-1">{request.cost}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-6">
            <Card className="bg-[#fdfdfb]">
              <CardHeader>
                <CardTitle className="text-[#0a1a2f]">Book Luxury Services</CardTitle>
                <p className="text-[#666]">Request premium transportation, security, lodging, and concierge services</p>
              </CardHeader>
            </Card>

            {/* Multi-Service Booking - Featured Option */}
            <Card className="bg-gradient-to-r from-[#d4af37]/10 to-[#d4af37]/5 border-[#d4af37]/20">
              <CardHeader>
                <CardTitle className="text-[#0a1a2f] flex items-center gap-3">
                  <div className="p-2 bg-[#d4af37]/20 rounded-lg">
                    <Plus className="h-6 w-6 text-[#d4af37]" />
                  </div>
                  Complete Trip Package
                </CardTitle>
                <p className="text-[#666]">Book multiple services for a single trip or project - Transportation, Security, and Concierge all coordinated seamlessly</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Car className="h-4 w-4 text-[#d4af37]" />
                      <span className="text-sm text-[#666]">Transportation</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-[#d4af37]" />
                      <span className="text-sm text-[#666]">Security</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Crown className="h-4 w-4 text-[#d4af37]" />
                      <span className="text-sm text-[#666]">Concierge</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => window.location.href = '/multi-service-booking'}
                    className="bg-[#d4af37] text-[#0a1a2f] hover:bg-[#b8941f] font-semibold"
                  >
                    Start Multi-Service Booking
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Elite Transportation",
                  description: "Private jets, luxury vehicles, yacht charters",
                  icon: Car,
                  features: ["Private Aviation", "Luxury Ground Transport", "Yacht Services", "Helicopter Transfers"]
                },
                {
                  title: "Personal Security",
                  description: "Executive protection and security services",
                  icon: Shield,
                  features: ["Executive Protection", "Residential Security", "Event Security", "Travel Security"]
                },
                {
                  title: "Luxury Lodging",
                  description: "Exclusive villas, penthouses, and private estates",
                  icon: Crown,
                  features: ["Private Villas", "Luxury Penthouses", "Historic Estates", "Private Islands"]
                },
                {
                  title: "Concierge Intelligence",
                  description: "Premium lifestyle and business concierge",
                  icon: User,
                  features: ["Travel Planning", "Event Management", "Personal Shopping", "Business Services"]
                }
              ].map(service => (
                <Card key={service.title} className="bg-[#fdfdfb] hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-[#d4af37]/10 rounded-lg">
                        <service.icon className="h-6 w-6 text-[#d4af37]" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-[#0a1a2f]">{service.title}</CardTitle>
                        <p className="text-sm text-[#666]">{service.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      {service.features.map(feature => (
                        <li key={feature} className="text-sm text-[#666] flex items-center">
                          <div className="w-1.5 h-1.5 bg-[#d4af37] rounded-full mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full bg-[#d4af37] hover:bg-[#b8941f] text-[#0a1a2f]"
                      onClick={() => {
                        if (service.title === "Elite Transportation") {
                          window.location.href = '/vehicles';
                        } else if (service.title === "Personal Security") {
                          window.location.href = '/personal-security';
                        } else if (service.title === "Luxury Lodging") {
                          window.location.href = '/properties';
                        } else if (service.title === "Concierge Intelligence") {
                          window.location.href = '/concierge-intelligence';
                        }
                      }}
                    >
                      {service.title === "Elite Transportation" ? "View Fleet" : 
                       service.title === "Personal Security" ? "Book Security" :
                       service.title === "Luxury Lodging" ? "View Properties" : 
                       service.title === "Concierge Intelligence" ? "Request Concierge" : 
                       "Request Service"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="space-y-6">
            <Card className="bg-[#fdfdfb]">
              <CardHeader>
                <CardTitle className="text-[#0a1a2f]">Service Request History</CardTitle>
                <p className="text-[#666]">Track and manage your luxury service requests</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentRequests.map(request => (
                    <Card key={request.id} className="border">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="p-3 bg-[#d4af37]/10 rounded-lg">
                              {getServiceIcon(request.type)}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-semibold text-[#0a1a2f]">{request.title}</h3>
                                <Badge className={getStatusColor(request.status)}>
                                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-[#666] mb-1">Request ID: {request.id}</p>
                              <p className="text-[#666] mb-1">📍 {request.location}</p>
                              <p className="text-[#666] mb-1">🕒 {request.datetime}</p>
                              <p className="text-[#666]">{request.details}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            {request.cost && (
                              <p className="text-lg font-semibold text-[#d4af37]">{request.cost}</p>
                            )}
                            <Button variant="outline" size="sm" className="mt-2">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <Card className="bg-[#fdfdfb]">
              <CardHeader>
                <CardTitle className="text-[#0a1a2f]">Client Profile</CardTitle>
                <p className="text-[#666]">Manage your account and preferences</p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-[#0a1a2f] mb-4">Personal Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-[#666]">Full Name</label>
                        <p className="font-medium text-[#0a1a2f]">{client.firstName} {client.lastName}</p>
                      </div>
                      <div>
                        <label className="text-sm text-[#666]">Email</label>
                        <p className="font-medium text-[#0a1a2f]">{client.email}</p>
                      </div>
                      <div>
                        <label className="text-sm text-[#666]">Primary Location</label>
                        <p className="font-medium text-[#0a1a2f]">{client.location}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0a1a2f] mb-4">Membership Details</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-[#666]">Membership Level</label>
                        <p className="font-medium text-[#d4af37]">{client.membershipLevel}</p>
                      </div>
                      <div>
                        <label className="text-sm text-[#666]">Member Since</label>
                        <p className="font-medium text-[#0a1a2f]">{new Date(client.joinDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <label className="text-sm text-[#666]">Preferred Services</label>
                        <p className="font-medium text-[#0a1a2f]">Transportation, Security</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}