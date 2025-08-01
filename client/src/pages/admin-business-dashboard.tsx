import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft,
  TrendingUp,
  Users,
  DollarSign,
  FileText,
  Building2,
  Mail,
  Phone,
  Calendar,
  Eye,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Briefcase
} from "lucide-react";
import primaryLogo from "@assets/New Primary YLG Transparent Logo_1753681153359.png";

interface InvestmentInterest {
  id: string;
  fullName: string;
  entityName?: string;
  country: string;
  email: string;
  phone: string;
  investmentRange: string;
  investmentStructure: string;
  dueDiligenceTimeline: string;
  agreesToNDA: boolean;
  requestsMeeting: boolean;
  digitalSignature: string;
  status: 'submitted' | 'under_review' | 'nda_sent' | 'meeting_scheduled' | 'declined';
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface JobApplication {
  id: string;
  position: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  linkedinUrl?: string;
  coverLetter?: string;
  photoUrl?: string;
  status: 'pending' | 'reviewed' | 'interviewing' | 'interviewed' | 'hired' | 'rejected';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'submitted':
    case 'pending':
      return 'text-yellow-600 bg-yellow-100';
    case 'under_review':
    case 'reviewed':
    case 'interviewing':
      return 'text-blue-600 bg-blue-100';
    case 'nda_sent':
    case 'interviewed':
      return 'text-purple-600 bg-purple-100';
    case 'meeting_scheduled':
    case 'hired':
      return 'text-green-600 bg-green-100';
    case 'declined':
    case 'rejected':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

const formatInvestmentRange = (range: string) => {
  return range.replace(/[\$,]/g, '').replace(/–/g, ' - ');
};

export default function AdminBusinessDashboard() {
  const [selectedView, setSelectedView] = useState<'investments' | 'applications'>('investments');
  const [selectedInvestment, setSelectedInvestment] = useState<InvestmentInterest | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch investment interests
  const { data: investmentInterests = [], isLoading: loadingInvestments } = useQuery<InvestmentInterest[]>({
    queryKey: ["/api/admin/investment-interests"],
    retry: false,
    enabled: selectedView === 'investments',
  });

  // Fetch job applications
  const { data: jobApplications = [], isLoading: loadingApplications } = useQuery<JobApplication[]>({
    queryKey: ["/api/admin/job-applications"],
    retry: false,
    enabled: selectedView === 'applications',
  });

  // Update investment interest mutation
  const updateInvestmentMutation = useMutation({
    mutationFn: async ({ id, status, adminNotes }: { id: string; status: string; adminNotes?: string }) => {
      return await apiRequest("PATCH", `/api/admin/investment-interests/${id}`, { 
        status, 
        adminNotes, 
        reviewedBy: 'Celso Alvarado' 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/investment-interests"] });
      toast({
        title: "Investment Interest Updated",
        description: "The investment interest status has been updated successfully.",
      });
      setShowDetailsModal(false);
      setSelectedInvestment(null);
      setAdminNotes("");
      setNewStatus("");
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update the investment interest status.",
        variant: "destructive",
      });
    },
  });

  // Filter functions
  const filteredInvestments = investmentInterests.filter((investment) => {
    const matchesSearch = investment.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (investment.entityName && investment.entityName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || investment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredApplications = jobApplications.filter((app) => {
    const matchesSearch = `${app.firstName} ${app.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (item: InvestmentInterest | JobApplication, type: 'investment' | 'application') => {
    if (type === 'investment') {
      setSelectedInvestment(item as InvestmentInterest);
      setAdminNotes((item as InvestmentInterest).adminNotes || "");
      setNewStatus((item as InvestmentInterest).status);
    } else {
      setSelectedApplication(item as JobApplication);
    }
    setShowDetailsModal(true);
  };

  const handleUpdateInvestment = () => {
    if (selectedInvestment) {
      updateInvestmentMutation.mutate({
        id: selectedInvestment.id,
        status: newStatus,
        adminNotes: adminNotes
      });
    }
  };

  return (
    <div className="min-h-screen bg-navy">
      {/* Header */}
      <motion.header 
        className="bg-navy border-b border-gold/20 sticky top-0 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src={primaryLogo}
                alt="YoLuxGo™" 
                className="h-10 mr-0.5"
              />
              <span className="font-serif text-2xl text-white font-light">
                YoLuxGo<sup className="text-[0.4rem] ml-0.5 text-gold">™</sup>
              </span>
            </div>
            <Link href="/dashboard">
              <Button variant="ghost" className="text-cream hover:text-gold">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-serif text-4xl font-bold text-white mb-4">
              Potential Investors and Collaborators
            </h1>
            <div className="w-24 h-1 bg-gold mx-auto rounded-full mb-6"></div>
            <p className="text-white/90 text-lg max-w-3xl mx-auto">
              Manage potential investor interests and collaborator applications with comprehensive oversight tools
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >

          {/* Toggle Tabs */}
          <Tabs defaultValue="investments" className="w-full" onValueChange={(value) => setSelectedView(value as 'investments' | 'applications')}>
            <TabsList className="grid w-full grid-cols-2 bg-cream/10 backdrop-blur-sm border border-gold/20 mb-8 p-1 rounded-lg">
              <TabsTrigger 
                value="investments" 
                className="flex items-center space-x-2 data-[state=active]:bg-gold data-[state=active]:text-navy text-cream hover:text-white transition-colors rounded-md"
              >
                <DollarSign className="h-4 w-4" />
                <span>Investment Interests</span>
              </TabsTrigger>
              <TabsTrigger 
                value="applications" 
                className="flex items-center space-x-2 data-[state=active]:bg-gold data-[state=active]:text-navy text-cream hover:text-white transition-colors rounded-md"
              >
                <Briefcase className="h-4 w-4" />
                <span>Collaborator Applications</span>
              </TabsTrigger>
            </TabsList>

            {/* Investment Interests Tab */}
            <TabsContent value="investments">
              <Card className="bg-cream/5 backdrop-blur-sm border border-gold/20 shadow-2xl">
                <CardHeader className="border-b border-gold/10 pb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center text-white text-2xl font-serif mb-2">
                        <TrendingUp className="h-6 w-6 mr-3 text-gold" />
                        Investment Interests
                      </CardTitle>
                      <CardDescription className="text-white/80 text-base">
                        Manage and review investment interest submissions
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-gold border-gold bg-gold/10 px-4 py-2 text-sm font-medium">
                      {filteredInvestments.length} Total
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {/* Filters */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="flex-1">
                      <Input
                        placeholder="Search by name, email, or entity..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-cream/10 backdrop-blur-sm border-gold/20 text-white placeholder:text-white/60 focus:border-gold focus:ring-gold/20"
                      />
                    </div>
                    <div className="w-full sm:w-48">
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="bg-cream/10 backdrop-blur-sm border-gold/20 text-white focus:border-gold focus:ring-gold/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="submitted">Submitted</SelectItem>
                          <SelectItem value="under_review">Under Review</SelectItem>
                          <SelectItem value="nda_sent">NDA Sent</SelectItem>
                          <SelectItem value="meeting_scheduled">Meeting Scheduled</SelectItem>
                          <SelectItem value="declined">Declined</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Investment Interests List */}
                  {loadingInvestments ? (
                    <div className="text-center py-12">
                      <div className="animate-spin w-8 h-8 border-4 border-gold border-t-transparent rounded-full mx-auto mb-4" />
                      <p className="text-white/80">Loading investment interests...</p>
                    </div>
                  ) : filteredInvestments.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="bg-gold/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FileText className="h-8 w-8 text-gold" />
                      </div>
                      <h3 className="text-xl font-serif text-white mb-3">No Investment Interests Found</h3>
                      <p className="text-white/70 max-w-md mx-auto">
                        When investors submit their interest through the platform, they will appear here for review and management.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredInvestments.map((investment) => (
                        <div key={investment.id} className="bg-cream/5 border border-gold/20 rounded-lg p-6 hover:bg-cream/10 transition-all duration-200 hover:border-gold/40">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-3">
                                <h3 className="font-semibold text-white text-lg">{investment.fullName}</h3>
                                {investment.entityName && (
                                  <Badge variant="outline" className="text-xs bg-gold/10 text-gold border-gold/30">
                                    {investment.entityName}
                                  </Badge>
                                )}
                                <Badge className={`text-xs ${getStatusColor(investment.status)}`}>
                                  {investment.status.replace('_', ' ')}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-white/80">
                                <div className="flex items-center">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {investment.email}
                                </div>
                                <div className="flex items-center">
                                  <DollarSign className="h-3 w-3 mr-1" />
                                  {formatInvestmentRange(investment.investmentRange)}
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {new Date(investment.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(investment, 'investment')}
                              className="border-gold text-gold hover:bg-gold hover:text-navy"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Job Applications Tab */}
            <TabsContent value="applications">
              <Card className="bg-cream/5 backdrop-blur-sm border border-gold/20 shadow-2xl">
                <CardHeader className="border-b border-gold/10 pb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center text-white text-2xl font-serif mb-2">
                        <Users className="h-6 w-6 mr-3 text-gold" />
                        Collaborator Applications
                      </CardTitle>
                      <CardDescription className="text-white/80 text-base">
                        Review and manage collaborator applications for open positions
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-gold border-gold bg-gold/10 px-4 py-2 text-sm font-medium">
                      {filteredApplications.length} Total
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {/* Filters */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="flex-1">
                      <Input
                        placeholder="Search by name, email, or position..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-cream/10 backdrop-blur-sm border-gold/20 text-white placeholder:text-white/60 focus:border-gold focus:ring-gold/20"
                      />
                    </div>
                    <div className="w-full sm:w-48">
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="bg-cream/10 backdrop-blur-sm border-gold/20 text-white focus:border-gold focus:ring-gold/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="reviewed">Reviewed</SelectItem>
                          <SelectItem value="interviewing">Interviewing</SelectItem>
                          <SelectItem value="interviewed">Interviewed</SelectItem>
                          <SelectItem value="hired">Hired</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Job Applications List */}
                  {loadingApplications ? (
                    <div className="text-center py-12">
                      <div className="animate-spin w-8 h-8 border-4 border-gold border-t-transparent rounded-full mx-auto mb-4" />
                      <p className="text-white/80">Loading job applications...</p>
                    </div>
                  ) : filteredApplications.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="bg-gold/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Briefcase className="h-8 w-8 text-gold" />
                      </div>
                      <h3 className="text-xl font-serif text-white mb-3">No Collaborator Applications Found</h3>
                      <p className="text-white/70 max-w-md mx-auto">
                        When candidates apply for positions through the careers page, their applications will appear here for review.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredApplications.map((application) => (
                        <div key={application.id} className="bg-cream/5 border border-gold/20 rounded-lg p-6 hover:bg-cream/10 transition-all duration-200 hover:border-gold/40">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-3">
                                <h3 className="font-semibold text-white text-lg">
                                  {application.firstName} {application.lastName}
                                </h3>
                                <Badge variant="outline" className="text-xs bg-gold/10 text-gold border-gold/30">
                                  {application.position}
                                </Badge>
                                <Badge className={`text-xs ${getStatusColor(application.status)}`}>
                                  {application.status}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-white/80">
                                <div className="flex items-center">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {application.email}
                                </div>
                                {application.phone && (
                                  <div className="flex items-center">
                                    <Phone className="h-3 w-3 mr-1" />
                                    {application.phone}
                                  </div>
                                )}
                                <div className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {new Date(application.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(application, 'application')}
                              className="bg-gold/10 text-gold border-gold hover:bg-gold hover:text-navy transition-colors"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Details Modal */}
          <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              {selectedInvestment && (
                <>
                  <DialogHeader>
                    <DialogTitle className="flex items-center text-navy">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Investment Interest Details
                    </DialogTitle>
                    <DialogDescription>
                      Review and update investment interest submission
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    {/* Investor Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-charcoal font-semibold">Full Name</Label>
                        <p className="text-navy">{selectedInvestment.fullName}</p>
                      </div>
                      {selectedInvestment.entityName && (
                        <div>
                          <Label className="text-charcoal font-semibold">Entity/Company</Label>
                          <p className="text-navy">{selectedInvestment.entityName}</p>
                        </div>
                      )}
                      <div>
                        <Label className="text-charcoal font-semibold">Country</Label>
                        <p className="text-navy">{selectedInvestment.country}</p>
                      </div>
                      <div>
                        <Label className="text-charcoal font-semibold">Email</Label>
                        <p className="text-navy">{selectedInvestment.email}</p>
                      </div>
                      <div>
                        <Label className="text-charcoal font-semibold">Phone</Label>
                        <p className="text-navy">{selectedInvestment.phone}</p>
                      </div>
                      <div>
                        <Label className="text-charcoal font-semibold">Investment Range</Label>
                        <p className="text-navy">{selectedInvestment.investmentRange}</p>
                      </div>
                      <div>
                        <Label className="text-charcoal font-semibold">Investment Structure</Label>
                        <p className="text-navy">{selectedInvestment.investmentStructure}</p>
                      </div>
                      <div>
                        <Label className="text-charcoal font-semibold">Due Diligence Timeline</Label>
                        <p className="text-navy">{selectedInvestment.dueDiligenceTimeline}</p>
                      </div>
                      <div>
                        <Label className="text-charcoal font-semibold">Agrees to NDA</Label>
                        <p className="text-navy">{selectedInvestment.agreesToNDA ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <Label className="text-charcoal font-semibold">Requests Meeting</Label>
                        <p className="text-navy">{selectedInvestment.requestsMeeting ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <Label className="text-charcoal font-semibold">Digital Signature</Label>
                        <p className="text-navy">{selectedInvestment.digitalSignature}</p>
                      </div>
                      <div>
                        <Label className="text-charcoal font-semibold">Submitted Date</Label>
                        <p className="text-navy">{new Date(selectedInvestment.createdAt).toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Admin Controls */}
                    <div className="border-t pt-6 space-y-4">
                      <h3 className="text-lg font-semibold text-navy">Admin Controls</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="status">Update Status</Label>
                          <Select value={newStatus} onValueChange={setNewStatus}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="submitted">Submitted</SelectItem>
                              <SelectItem value="under_review">Under Review</SelectItem>
                              <SelectItem value="nda_sent">NDA Sent</SelectItem>
                              <SelectItem value="meeting_scheduled">Meeting Scheduled</SelectItem>
                              <SelectItem value="declined">Declined</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="adminNotes">Admin Notes</Label>
                        <Textarea
                          id="adminNotes"
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          placeholder="Add internal notes about this investment interest..."
                          rows={4}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowDetailsModal(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleUpdateInvestment}
                          disabled={updateInvestmentMutation.isPending}
                          className="bg-gold hover:bg-gold/80 text-navy"
                        >
                          {updateInvestmentMutation.isPending ? "Updating..." : "Update"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {selectedApplication && (
                <>
                  <DialogHeader>
                    <DialogTitle className="flex items-center text-navy">
                      <User className="h-5 w-5 mr-2" />
                      Job Application Details
                    </DialogTitle>
                    <DialogDescription>
                      Review job application submission
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    {/* Applicant Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-charcoal font-semibold">Name</Label>
                        <p className="text-navy">{selectedApplication.firstName} {selectedApplication.lastName}</p>
                      </div>
                      <div>
                        <Label className="text-charcoal font-semibold">Position</Label>
                        <p className="text-navy">{selectedApplication.position}</p>
                      </div>
                      <div>
                        <Label className="text-charcoal font-semibold">Email</Label>
                        <p className="text-navy">{selectedApplication.email}</p>
                      </div>
                      {selectedApplication.phone && (
                        <div>
                          <Label className="text-charcoal font-semibold">Phone</Label>
                          <p className="text-navy">{selectedApplication.phone}</p>
                        </div>
                      )}
                      {selectedApplication.linkedinUrl && (
                        <div>
                          <Label className="text-charcoal font-semibold">LinkedIn</Label>
                          <a 
                            href={selectedApplication.linkedinUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gold hover:underline"
                          >
                            View Profile
                          </a>
                        </div>
                      )}
                      <div>
                        <Label className="text-charcoal font-semibold">Status</Label>
                        <Badge className={getStatusColor(selectedApplication.status)}>
                          {selectedApplication.status}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-charcoal font-semibold">Applied Date</Label>
                        <p className="text-navy">{new Date(selectedApplication.createdAt).toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Cover Letter */}
                    {selectedApplication.coverLetter && (
                      <div>
                        <Label className="text-charcoal font-semibold">Cover Letter</Label>
                        <div className="bg-cream/20 rounded-lg p-4 mt-2">
                          <p className="text-navy whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
                        </div>
                      </div>
                    )}

                    {/* Admin Notes */}
                    {selectedApplication.notes && (
                      <div>
                        <Label className="text-charcoal font-semibold">HR Notes</Label>
                        <div className="bg-gold/10 border border-gold/30 rounded-lg p-4 mt-2">
                          <p className="text-navy">{selectedApplication.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
    </div>
  );
}