import { motion } from "framer-motion";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  ChevronLeft, 
  Users, 
  Search, 
  Filter, 
  Eye, 
  MessageSquare, 
  CheckCircle, 
  XCircle,
  Clock,
  UserCheck,
  Briefcase,
  Mail,
  Phone,
  ExternalLink,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import primaryLogo from "@assets/New Primary YLG Transparent Logo_1753681153359.png";
import type { JobApplication } from "@shared/schema";

export default function HRDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [positionFilter, setPositionFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [notes, setNotes] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: applications = [], isLoading } = useQuery<JobApplication[]>({
    queryKey: ["/api/hr/applications"],
    retry: false,
  });

  const updateApplicationStatus = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes?: string }) => {
      return await apiRequest("PATCH", `/api/hr/applications/${id}`, { status, notes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hr/applications"] });
      toast({
        title: "Application Updated",
        description: "The application status has been updated successfully.",
      });
      setShowDetailsModal(false);
      setSelectedApplication(null);
      setNotes("");
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update the application status.",
        variant: "destructive",
      });
    },
  });

  const filteredApplications = applications.filter((app) => {
    const matchesSearch = 
      app.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesPosition = positionFilter === "all" || app.position === positionFilter;
    
    return matchesSearch && matchesStatus && matchesPosition;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      reviewed: "bg-blue-100 text-blue-800 border-blue-200",
      interviewing: "bg-purple-100 text-purple-800 border-purple-200",
      hired: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800 border-gray-200"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPositionTitle = (positionId: string) => {
    const positions = {
      "operations-manager": "Operations & Provider Onboarding Manager",
      "client-success": "Client Success & Support Coordinator",
      "marketing-partnerships": "Marketing & Partnerships Assistant",
      "finance-admin": "Finance & Administrative Support",
      "technical-lead": "Technical Lead / Fractional CTO"
    };
    return positions[positionId as keyof typeof positions] || positionId;
  };

  const handleViewDetails = (application: JobApplication) => {
    setSelectedApplication(application);
    setNotes(application.notes || "");
    setShowDetailsModal(true);
  };

  const handleStatusUpdate = (status: string) => {
    if (selectedApplication) {
      updateApplicationStatus.mutate({
        id: selectedApplication.id,
        status,
        notes
      });
    }
  };

  const stats = {
    total: applications.length,
    pending: applications.filter((app) => app.status === "pending").length,
    reviewed: applications.filter((app) => app.status === "reviewed").length,
    interviewing: applications.filter((app) => app.status === "interviewing").length,
    hired: applications.filter((app) => app.status === "hired").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy/95 to-charcoal">
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" className="text-cream hover:text-gold">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-serif text-cream font-bold">HR Dashboard</h1>
                <p className="text-cream/70">Manage job applications and recruitment</p>
              </div>
            </div>
            <Link href="/">
              <div className="flex items-center">
                <img 
                  src={primaryLogo}
                  alt="YoLuxGo™" 
                  className="h-8 mr-0.5"
                />
                <span className="font-serif text-xl text-white font-light">
                  YoLuxGo<sup className="text-[0.4rem] ml-0.5 text-gold">™</sup>
                </span>
              </div>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            {[
              { label: "Total Applications", value: stats.total, icon: Users, color: "text-blue-400" },
              { label: "Pending Review", value: stats.pending, icon: Clock, color: "text-yellow-400" },
              { label: "Under Review", value: stats.reviewed, icon: Eye, color: "text-blue-400" },
              { label: "Interviewing", value: stats.interviewing, icon: MessageSquare, color: "text-purple-400" },
              { label: "Hired", value: stats.hired, icon: UserCheck, color: "text-green-400" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border border-gold/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-cream/70 uppercase tracking-wide">{stat.label}</p>
                        <p className="text-2xl font-bold text-cream">{stat.value}</p>
                      </div>
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Filters and Search */}
          <Card className="bg-white/95 backdrop-blur-sm border border-gold/20 mb-6">
            <CardHeader>
              <CardTitle className="text-navy">Application Management</CardTitle>
              <CardDescription>Review and manage job applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Search by name, email, or position..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="interviewing">Interviewing</SelectItem>
                    <SelectItem value="hired">Hired</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={positionFilter} onValueChange={setPositionFilter}>
                  <SelectTrigger className="w-full md:w-64">
                    <SelectValue placeholder="Filter by position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Positions</SelectItem>
                    <SelectItem value="operations-manager">Operations Manager</SelectItem>
                    <SelectItem value="client-success">Client Success</SelectItem>
                    <SelectItem value="marketing-partnerships">Marketing Assistant</SelectItem>
                    <SelectItem value="finance-admin">Finance Support</SelectItem>
                    <SelectItem value="technical-lead">Technical Lead</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Applications List */}
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-navy border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-charcoal">Loading applications...</p>
                </div>
              ) : filteredApplications.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-charcoal">No applications found matching your criteria.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredApplications.map((application) => (
                    <div
                      key={application.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-navy">
                              {application.firstName} {application.lastName}
                            </h3>
                            {getStatusBadge(application.status)}
                          </div>
                          <p className="text-charcoal text-sm mb-1">
                            <Briefcase className="h-4 w-4 inline mr-1" />
                            {getPositionTitle(application.position)}
                          </p>
                          <p className="text-charcoal/70 text-sm mb-1">
                            <Mail className="h-4 w-4 inline mr-1" />
                            {application.email}
                          </p>
                          {application.phone && (
                            <p className="text-charcoal/70 text-sm mb-1">
                              <Phone className="h-4 w-4 inline mr-1" />
                              {application.phone}
                            </p>
                          )}
                          <p className="text-xs text-gray-500">
                            Applied on {new Date(application.createdAt || new Date()).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {application.linkedinUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(application.linkedinUrl!, "_blank")}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(application)}
                          >
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

          {/* Application Details Modal */}
          <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-navy">
                  Application Details - {selectedApplication?.firstName} {selectedApplication?.lastName}
                </DialogTitle>
                <DialogDescription>
                  Review application details and update status
                </DialogDescription>
              </DialogHeader>
              
              {selectedApplication && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Position</label>
                      <p className="text-navy">{getPositionTitle(selectedApplication.position)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Current Status</label>
                      <div className="mt-1">{getStatusBadge(selectedApplication.status)}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-charcoal">{selectedApplication.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-charcoal">{selectedApplication.phone || "Not provided"}</p>
                    </div>
                  </div>

                  {selectedApplication.linkedinUrl && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">LinkedIn Profile</label>
                      <a 
                        href={selectedApplication.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center mt-1"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View LinkedIn Profile
                      </a>
                    </div>
                  )}

                  {selectedApplication.coverLetter && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Cover Letter</label>
                      <div className="mt-1 p-3 bg-gray-50 rounded-md">
                        <p className="text-charcoal text-sm whitespace-pre-wrap">
                          {selectedApplication.coverLetter}
                        </p>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-700">HR Notes</label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add your notes about this candidate..."
                      rows={4}
                      className="mt-1"
                    />
                  </div>

                  <div className="border-t pt-4">
                    <label className="text-sm font-medium text-gray-700 mb-3 block">Update Status</label>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={() => handleStatusUpdate("reviewed")}
                        variant="outline"
                        size="sm"
                        disabled={updateApplicationStatus.isPending}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Mark as Reviewed
                      </Button>
                      <Button
                        onClick={() => handleStatusUpdate("interviewing")}
                        variant="outline"
                        size="sm"
                        disabled={updateApplicationStatus.isPending}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Schedule Interview
                      </Button>
                      <Button
                        onClick={() => handleStatusUpdate("hired")}
                        variant="outline"
                        size="sm"
                        disabled={updateApplicationStatus.isPending}
                        className="border-green-200 text-green-700 hover:bg-green-50"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Hire Candidate
                      </Button>
                      <Button
                        onClick={() => handleStatusUpdate("rejected")}
                        variant="outline"
                        size="sm"
                        disabled={updateApplicationStatus.isPending}
                        className="border-red-200 text-red-700 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject Application
                      </Button>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 pt-2 border-t">
                    <p>Applied: {new Date(selectedApplication.createdAt || new Date()).toLocaleString()}</p>
                    {selectedApplication.updatedAt !== selectedApplication.createdAt && (
                      <p>Last updated: {new Date(selectedApplication.updatedAt || new Date()).toLocaleString()}</p>
                    )}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
    </div>
  );
}