import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Building2, 
  TrendingUp, 
  DollarSign, 
  Target, 
  Users, 
  MapPin,
  FileText,
  ExternalLink
} from "lucide-react";
import primaryLogo from "@assets/New Primary YLG Transparent Logo_1753681153359.png";
import founderPhoto from "@assets/Celso Professional_1753770307339.jpg";

// Type definitions for business plan data
interface BusinessPlan {
  executiveSummary: {
    overview: string;
    vision: string;
    mission: string;
    valueProp: string;
  };
  investmentOffer: {
    investmentRequired: string;
    equityOffered: string;
    postMoneyValuation: string;
    preMoneyValuation: string;
    founderRetainedEquity: string;
    valuationRationale: string[];
  };
  investorBenefits: {
    boardSeat: string;
    shareType: string;
    exitParticipation: string;
    antiDilution: string;
  };
  projections: Record<string, {
    revenue: number;
    netResult: number;
    status: string;
    cumulativeReturn: number;
  }>;
  expectedReturns: {
    roiAtYear5: string;
    investorShare: string;
    projectedAnnualReturns: string;
  };
  exitStrategy: {
    timeline: string;
    targetValuation: string;
    investorReturnAtExit: string;
    options: string[];
  };
  governance: {
    founderControl: string;
    boardStructure: string;
    protections: string;
  };
  funding: {
    required: number;
    useOfFunds: Record<string, number>;
  };
  marketOpportunity: {
    globalMarketValue: string;
    growthRate: string;
    targetSegments: string[];
  };
  revenueModel: Record<string, string>;
  locations: string[];
}

interface FounderProfile {
  name: string;
  title: string;
  companies: string[];
  education: {
    phd: string;
    masters: string;
    specialization: string;
  };
  experience: {
    countries: string;
    expertise: string;
    government: string;
    clients: string[];
  };
  credentials: {
    certifications: string[];
    teaching: string;
    standards: string;
  };
  philosophy: string;
  photoUrl: string;
}

export default function BusinessPlan() {
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check investor authentication
  useEffect(() => {
    const investorAuth = localStorage.getItem("investorAuth");
    if (!investorAuth) {
      setLocation("/investor-login");
      return;
    }
    
    try {
      const auth = JSON.parse(investorAuth);
      const loginTime = new Date(auth.loginTime);
      const now = new Date();
      const hoursSinceLogin = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceLogin > 24) {
        localStorage.removeItem("investorAuth");
        setLocation("/investor-login");
        return;
      }
      
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem("investorAuth");
      setLocation("/investor-login");
    }
  }, [setLocation]);

  const { data: businessPlan, isLoading } = useQuery<BusinessPlan>({
    queryKey: ["/api/investor/business-plan"],
    enabled: isAuthenticated
  });

  const { data: founderProfile } = useQuery<FounderProfile>({
    queryKey: ["/api/investor/founder-profile"],
    enabled: isAuthenticated
  });

  const handleLogout = () => {
    localStorage.removeItem("investorAuth");
    setLocation("/investor-login");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-white text-xl">Loading Business Plan...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy to-navy/95">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-charcoal/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-charcoal hover:text-navy"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Logout
              </Button>
              <div className="flex items-center">
                <img 
                  src={primaryLogo}
                  alt="YoLuxGo™" 
                  className="h-8 mr-0.5"
                />
                <span className="font-serif text-xl text-navy font-light">
                  YoLuxGo<sup className="text-[0.4rem] ml-0.5 text-gold">™</sup>
                </span>
              </div>
            </div>
            <Badge variant="outline" className="border-gold text-gold">
              Investor Access
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Header Section */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 mb-8 border border-gold/20">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-serif text-navy font-bold text-left">
                Business Plan
              </h1>
              <div className="text-left space-y-2">
                <p className="text-2xl text-gold font-light">
                  YoLuxGo™ - Discreet Luxury. Global Security.
                </p>
                <p className="text-lg text-charcoal leading-relaxed max-w-4xl">
                  Comprehensive investment overview and equity allocation strategy for institutional investors
                </p>
              </div>
              <div className="flex items-center space-x-4 text-charcoal/70 pt-4 border-t border-charcoal/20 text-left">
                <span className="text-sm">Confidential & Proprietary</span>
                <span className="w-1 h-1 bg-charcoal/50 rounded-full"></span>
                <span className="text-sm">© 2025 Nebusis Cloud Services, LLC</span>
              </div>
            </div>
          </div>

          {/* Founder Profile Card */}
          {founderProfile && (
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-navy">
                  <Users className="h-6 w-6 mr-2" />
                  Founder Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex justify-center">
                    <img
                      src={founderPhoto}
                      alt="Dr. Celso Alvarado"
                      className="w-48 h-48 object-cover rounded-lg shadow-lg"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <h3 className="text-2xl font-serif text-navy">{founderProfile.name}</h3>
                      <p className="text-gold font-medium">{founderProfile.title}</p>
                      <p className="text-charcoal">{founderProfile.companies.join(", ")}</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-navy mb-2">Education</h4>
                        <ul className="text-sm text-charcoal space-y-1">
                          <li>• Ph.D. {founderProfile.education.phd}</li>
                          <li>• M.S. {founderProfile.education.masters}</li>
                          <li>• Specialization: {founderProfile.education.specialization}</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-navy mb-2">Global Experience</h4>
                        <ul className="text-sm text-charcoal space-y-1">
                          <li>• {founderProfile.experience.countries}</li>
                          <li>• {founderProfile.experience.expertise}</li>
                          <li>• {founderProfile.experience.government}</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-navy mb-2">Key Clients</h4>
                      <div className="flex flex-wrap gap-2">
                        {founderProfile.experience.clients.map((client: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {client}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Executive Summary */}
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-navy">
                <FileText className="h-6 w-6 mr-2" />
                Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-navy mb-2">Overview</h3>
                <p className="text-charcoal leading-relaxed">{businessPlan?.executiveSummary.overview}</p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold text-navy mb-2">Vision</h3>
                <p className="text-charcoal leading-relaxed">{businessPlan?.executiveSummary.vision}</p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold text-navy mb-2">Value Proposition</h3>
                <p className="text-charcoal leading-relaxed">{businessPlan?.executiveSummary.valueProp}</p>
              </div>
            </CardContent>
          </Card>

          {/* Investment Offer */}
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-navy">
                <Target className="h-6 w-6 mr-2" />
                Investment Offer & Equity Allocation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-gold/20 to-gold/10 p-4 rounded-lg">
                    <h3 className="font-semibold text-navy mb-3">Investment Terms</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-charcoal">Investment Required:</span>
                        <span className="font-semibold text-navy">{businessPlan?.investmentOffer.investmentRequired}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-charcoal">Equity Offered:</span>
                        <span className="font-semibold text-navy">{businessPlan?.investmentOffer.equityOffered}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-charcoal">Pre-Money Valuation:</span>
                        <span className="font-semibold text-navy">{businessPlan?.investmentOffer.preMoneyValuation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-charcoal">Post-Money Valuation:</span>
                        <span className="font-semibold text-navy">{businessPlan?.investmentOffer.postMoneyValuation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-charcoal">Founder Retained:</span>
                        <span className="font-semibold text-navy">{businessPlan?.investmentOffer.founderRetainedEquity}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-navy mb-3">Valuation Rationale</h3>
                    <ul className="space-y-2">
                      {businessPlan?.investmentOffer.valuationRationale.map((reason, index) => (
                        <li key={index} className="text-sm text-charcoal flex items-start">
                          <span className="text-gold mr-2">•</span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Investor Benefits & Governance */}
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-navy">
                <Users className="h-6 w-6 mr-2" />
                Investor Benefits & Governance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-navy mb-3">Investor Benefits</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-charcoal">Board Representation</h4>
                      <p className="text-sm text-charcoal/80">{businessPlan?.investorBenefits.boardSeat}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-charcoal">Share Type</h4>
                      <p className="text-sm text-charcoal/80">{businessPlan?.investorBenefits.shareType}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-charcoal">Exit Participation</h4>
                      <p className="text-sm text-charcoal/80">{businessPlan?.investorBenefits.exitParticipation}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-charcoal">Anti-Dilution Protection</h4>
                      <p className="text-sm text-charcoal/80">{businessPlan?.investorBenefits.antiDilution}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-navy mb-3">Governance Structure</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-charcoal">Founder Control</h4>
                      <p className="text-sm text-charcoal/80">{businessPlan?.governance.founderControl}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-charcoal">Board Structure</h4>
                      <p className="text-sm text-charcoal/80">{businessPlan?.governance.boardStructure}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-charcoal">Strategic Protections</h4>
                      <p className="text-sm text-charcoal/80">{businessPlan?.governance.protections}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Funding Requirements */}
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-navy">
                <DollarSign className="h-6 w-6 mr-2" />
                Funding Requirements
              </CardTitle>
              <CardDescription>
                Total Required: {formatCurrency(businessPlan?.funding.required)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  {Object.entries(businessPlan?.funding.useOfFunds || {}).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-charcoal capitalize">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </span>
                      <span className="font-semibold text-navy">
                        {formatCurrency(value || 0)}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-gold/20 to-gold/10 p-4 rounded-lg">
                    <h4 className="font-semibold text-navy mb-2">Investment Highlight</h4>
                    <p className="text-sm text-charcoal">
                      Strategic allocation across product development, market acquisition, and operational 
                      excellence to ensure rapid scale and market penetration.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Projections & Expected Returns */}
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-navy">
                <TrendingUp className="h-6 w-6 mr-2" />
                Financial Projections & Expected Returns
              </CardTitle>
              <CardDescription>
                {businessPlan?.expectedReturns.projectedAnnualReturns}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-5 gap-3">
                {Object.entries(businessPlan?.projections || {}).map(([year, data]: [string, any]) => (
                  <div key={year} className="bg-cream/30 p-4 rounded-lg text-center">
                    <h3 className="text-lg font-semibold text-navy mb-2">
                      {year.charAt(0).toUpperCase() + year.slice(1)}
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-charcoal">Revenue</p>
                        <p className="text-lg font-bold text-navy">
                          {formatCurrency(data.revenue)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-charcoal">Net Result</p>
                        <p className={`text-sm font-semibold ${data.netResult >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(data.netResult)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-charcoal">Investor Return</p>
                        <p className="text-sm font-bold text-gold">
                          {formatCurrency(data.cumulativeReturn)}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {data.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="bg-gradient-to-r from-gold/20 to-gold/10 p-6 rounded-lg">
                <h3 className="font-semibold text-navy mb-3">Investment Return Summary</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-charcoal">ROI at Year 5</p>
                    <p className="text-xl font-bold text-navy">{businessPlan?.expectedReturns.roiAtYear5}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-charcoal">Investor Share</p>
                    <p className="text-xl font-bold text-navy">{businessPlan?.expectedReturns.investorShare}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-charcoal">Exit Return Potential</p>
                    <p className="text-xl font-bold text-gold">{businessPlan?.exitStrategy.investorReturnAtExit}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market Opportunity & Revenue Model */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-navy">
                  <Target className="h-6 w-6 mr-2" />
                  Market Opportunity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-navy">Market Size</h4>
                  <p className="text-2xl font-bold text-gold">{businessPlan?.marketOpportunity.globalMarketValue}</p>
                  <p className="text-sm text-charcoal">Growing at {businessPlan?.marketOpportunity.growthRate}</p>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-semibold text-navy mb-2">Target Segments</h4>
                  <ul className="text-sm text-charcoal space-y-1">
                    {businessPlan?.marketOpportunity.targetSegments.map((segment: string, index: number) => (
                      <li key={index}>• {segment}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-navy">
                  <Building2 className="h-6 w-6 mr-2" />
                  Revenue Model
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(businessPlan?.revenueModel || {}).map(([key, value]) => (
                  <div key={key}>
                    <h4 className="font-medium text-navy capitalize">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </h4>
                    <p className="text-sm text-charcoal">{value}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Exit Strategy & Locations */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-navy">
                  <ExternalLink className="h-6 w-6 mr-2" />
                  Exit Strategy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center bg-gradient-to-r from-gold/20 to-gold/10 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-gold">{businessPlan?.exitStrategy.targetValuation}</p>
                  <p className="text-sm text-charcoal">Target Valuation in {businessPlan?.exitStrategy.timeline}</p>
                  <p className="text-lg font-semibold text-navy mt-2">{businessPlan?.exitStrategy.investorReturnAtExit}</p>
                  <p className="text-xs text-charcoal">Investor Return at Exit</p>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-semibold text-navy mb-2">Exit Options</h4>
                  <ul className="text-sm text-charcoal space-y-1">
                    {businessPlan?.exitStrategy.options.map((option: string, index: number) => (
                      <li key={index}>• {option}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-navy">
                  <MapPin className="h-6 w-6 mr-2" />
                  Pilot Locations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {businessPlan?.locations.map((location: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-center py-2">
                      {location}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Investment Interest Invitation */}
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="text-center py-12">
              <div className="mb-6">
                <FileText className="h-16 w-16 mx-auto text-gold mb-4" />
                <h3 className="text-2xl font-serif text-navy mb-3">
                  📝 Interested in Investing?
                </h3>
                <p className="text-lg text-charcoal leading-relaxed max-w-2xl mx-auto">
                  For qualified investors interested in participating in YoLuxGo™'s seed funding round, 
                  we invite you to complete our Expression of Intent to Invest form.
                </p>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-charcoal">
                  Investment ranges from $50,000 to $2,500,000 | Multiple structure options available
                </p>
                <Link href="/investment-interest">
                  <Button 
                    className="bg-gradient-to-r from-gold to-gold/80 hover:from-gold/80 hover:to-gold text-navy font-semibold px-8 py-3 text-lg"
                  >
                    <ExternalLink className="h-5 w-5 mr-2" />
                    Complete Investment Interest Form
                  </Button>
                </Link>
                <p className="text-xs text-charcoal/70">
                  🔐 All submissions are confidential and require NDA execution for detailed financials
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center py-8">
            <p className="text-cream/70 text-sm">
              Confidential & Proprietary - YoLuxGo™ Business Plan
            </p>
            <p className="text-cream/50 text-xs mt-2">
              © 2025 Nebusis Cloud Services, LLC. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}