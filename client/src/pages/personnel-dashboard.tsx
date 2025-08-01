import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Mail, 
  Clock, 
  User, 
  Building, 
  Phone, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Eye,
  LogOut,
  Shield,
  Search,
  Filter
} from "lucide-react";
import { Link } from "wouter";
import ylgLogo from "@assets/New Primary YLG Transparent Logo_1753669210755.png";

interface Personnel {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'privacy' | 'legal' | 'support' | 'security' | 'concierge' | 'admin';
  department: string;
}

interface ContactInquiry {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  inquiryType: string;
  subject: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export default function PersonnelDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get personnel info from main auth system
  const { data: personnel, isLoading: personnelLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  // Get inquiries based on personnel role
  const { data: inquiries = [], isLoading: inquiriesLoading } = useQuery({
    queryKey: ["/api/personnel/inquiries", statusFilter, priorityFilter],
    enabled: !!personnel,
  });

  const updateInquiryMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<ContactInquiry> }) => {
      return apiRequest("PATCH", `/api/personnel/inquiries/${id}`, updates);
    },
    onSuccess: () => {
      toast({
        title: "Inquiry Updated",
        description: "The inquiry status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/personnel/inquiries"] });
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    window.location.href = "/auth";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'resolved': return 'bg-green-500';
      case 'closed': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  const getInquiryTypeIcon = (type: string) => {
    switch (type) {
      case 'security': return <Shield className="w-4 h-4" />;
      case 'support': return <MessageSquare className="w-4 h-4" />;
      case 'partnership': return <Building className="w-4 h-4" />;
      default: return <Mail className="w-4 h-4" />;
    }
  };

  const filteredInquiries = inquiries.filter((inquiry: ContactInquiry) => {
    const matchesSearch = 
      inquiry.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || inquiry.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || inquiry.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (personnelLoading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-cream">Loading...</div>
      </div>
    );
  }

  // Allow personnel or master admins
  const isMasterAdmin = personnel?.email === 'calvarado@nebusis.com' || personnel?.email === 'dzambrano@nebusis.com';
  
  if (!personnel || (personnel.userType !== 'personnel' && !isMasterAdmin)) {
    window.location.href = "/auth";
    return null;
  }

  return (
    <div className="min-h-screen bg-navy text-cream">
      {/* Header */}
      <div className="border-b border-gold/20 bg-navy/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={ylgLogo} alt="YLG" className="w-10 h-10" />
              <span className="text-xl font-bold text-gold">YoLuxGo™</span>
              <span className="text-cream/60">Personnel Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-cream">
                  {personnel.firstName} {personnel.lastName}
                </p>
                <p className="text-xs text-cream/60 capitalize">
                  {isMasterAdmin ? 'Master Admin - All Inquiries' : personnel.department}
                </p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-gold/20 text-cream hover:bg-gold/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-cream mb-2">
            {personnel.department} Dashboard
          </h1>
          <p className="text-cream/70">
            Manage inquiries and feedback assigned to your department
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cream/40 w-4 h-4" />
              <Input
                placeholder="Search inquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-navy/50 border-gold/20 text-cream pl-10"
              />
            </div>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-navy/50 border-gold/20 text-cream">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-navy border-gold/20">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-40 bg-navy/50 border-gold/20 text-cream">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent className="bg-navy border-gold/20">
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Inquiries List */}
          <Card className="bg-navy/50 border-gold/20">
            <CardHeader>
              <CardTitle className="text-gold flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <span>Inquiries ({filteredInquiries.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredInquiries.map((inquiry: ContactInquiry) => (
                  <div
                    key={inquiry.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedInquiry?.id === inquiry.id
                        ? "border-gold/40 bg-gold/10"
                        : "border-gold/20 hover:border-gold/30 hover:bg-navy/30"
                    }`}
                    onClick={() => setSelectedInquiry(inquiry)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getInquiryTypeIcon(inquiry.inquiryType)}
                        <span className="font-medium text-cream">
                          {inquiry.firstName} {inquiry.lastName}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className={`${getPriorityColor(inquiry.priority)} text-white text-xs`}>
                          {inquiry.priority}
                        </Badge>
                        <Badge className={`${getStatusColor(inquiry.status)} text-white text-xs`}>
                          {inquiry.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-cream/80 mb-2 line-clamp-1">
                      {inquiry.subject}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-cream/60">
                      <span>{inquiry.email}</span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(inquiry.createdAt).toLocaleDateString()}</span>
                      </span>
                    </div>
                  </div>
                ))}
                
                {filteredInquiries.length === 0 && (
                  <div className="text-center py-8 text-cream/60">
                    <Mail className="w-12 h-12 mx-auto mb-4 text-cream/30" />
                    <p>No inquiries found matching your criteria</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Inquiry Details */}
          <Card className="bg-navy/50 border-gold/20">
            <CardHeader>
              <CardTitle className="text-gold flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>Inquiry Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedInquiry ? (
                <div className="space-y-6">
                  {/* Contact Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-cream/60 text-xs">Name</Label>
                      <p className="text-cream font-medium">
                        {selectedInquiry.firstName} {selectedInquiry.lastName}
                      </p>
                    </div>
                    <div>
                      <Label className="text-cream/60 text-xs">Email</Label>
                      <p className="text-cream">{selectedInquiry.email}</p>
                    </div>
                    {selectedInquiry.phone && (
                      <div>
                        <Label className="text-cream/60 text-xs">Phone</Label>
                        <p className="text-cream">{selectedInquiry.phone}</p>
                      </div>
                    )}
                    {selectedInquiry.company && (
                      <div>
                        <Label className="text-cream/60 text-xs">Company</Label>
                        <p className="text-cream">{selectedInquiry.company}</p>
                      </div>
                    )}
                  </div>

                  {/* Inquiry Details */}
                  <div>
                    <Label className="text-cream/60 text-xs">Type</Label>
                    <p className="text-cream capitalize">{selectedInquiry.inquiryType.replace('_', ' ')}</p>
                  </div>

                  <div>
                    <Label className="text-cream/60 text-xs">Subject</Label>
                    <p className="text-cream font-medium">{selectedInquiry.subject}</p>
                  </div>

                  <div>
                    <Label className="text-cream/60 text-xs">Message</Label>
                    <div className="bg-navy/30 rounded-lg p-4 border border-gold/10">
                      <p className="text-cream/90 whitespace-pre-wrap">{selectedInquiry.message}</p>
                    </div>
                  </div>

                  {/* Status Actions */}
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => updateInquiryMutation.mutate({
                        id: selectedInquiry.id,
                        updates: { status: 'in_progress' }
                      })}
                      className="bg-yellow-600 hover:bg-yellow-700"
                      disabled={selectedInquiry.status === 'in_progress'}
                    >
                      Mark In Progress
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => updateInquiryMutation.mutate({
                        id: selectedInquiry.id,
                        updates: { status: 'resolved' }
                      })}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={selectedInquiry.status === 'resolved'}
                    >
                      Mark Resolved
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-cream/60">
                  <Eye className="w-12 h-12 mx-auto mb-4 text-cream/30" />
                  <p>Select an inquiry to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}