import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Shield, Globe, Star, CheckCircle, DollarSign, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ylgLogo from "@assets/New Primary YLG Transparent Logo_1753669210755.png";

export default function SurveyResults() {
  // Survey data from authentic research
  const overallAppeal = [
    { metric: "Find app concept appealing", percentage: 91 },
    { metric: "Would consider using in 12 months", percentage: 87 },
    { metric: "Tagline alignment with expectations", percentage: 93 }
  ];

  const criticalFeatures = [
    { feature: "Cloaked booking and itinerary privacy", percentage: 96, icon: Shield },
    { feature: "Vetted, discreet personnel", percentage: 94, icon: Users },
    { feature: "Elite lodging and transportation access", percentage: 91, icon: Star },
    { feature: "Global city availability", percentage: 89, icon: Globe },
    { feature: "Panic button and real-time security", percentage: 84, icon: CheckCircle }
  ];

  const respondentTypes = [
    { name: "High-net-worth individuals", value: 25, color: "#d4af37" },
    { name: "Frequent International Travelers", value: 25, color: "#b8860b" },
    { name: "Executive Assistants / Corporate Travel", value: 20, color: "#0a1a2f" },
    { name: "Hospitality Managers", value: 15, color: "#3a3a3a" },
    { name: "Security Professionals", value: 10, color: "#1e3a8a" },
    { name: "Celebrities / Public Figures", value: 5, color: "#fdfdfb" }
  ];

  const feeAcceptance = [
    { fee: "15% Platform Fee", acceptable: 82, tooHigh: 11, tooLow: 7, undecided: 0 },
    { fee: "Percentage-based Cancellation Fee (5-100%)", acceptable: 79, tooHigh: 15, tooLow: 0, undecided: 6 },
    { fee: "Dispute Handling ($250)", acceptable: 68, tooHigh: 24, tooLow: 0, undecided: 8 }
  ];

  const trustMetrics = [
    { metric: "Feel more secure with vetted contractors", percentage: 89 },
    { metric: "Approve independent contractor clarity", percentage: 84 },
    { metric: "Want visible Quality & Safety Officer", percentage: 71 }
  ];

  return (
    <div className="min-h-screen bg-navy text-white">
      {/* Header */}
      <div className="border-b border-gold/20 bg-navy/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src={ylgLogo} 
                alt="YoLuxGo Logo" 
                className="w-10 h-10 mr-1"
              />
              <div>
                <div className="font-serif text-xl font-bold text-white">
                  YoLuxGo<span className="text-gold text-sm align-super">™</span>
                </div>
                <div className="text-gold text-xs font-medium">Market Research Survey</div>
              </div>
            </div>
            <button 
              onClick={() => window.history.back()}
              className="text-white hover:text-gold transition-colors text-sm"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Title Section */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl font-bold text-white mb-4">
              User Panel Survey Insights Report
            </h1>
            <div className="w-24 h-1 bg-gold mx-auto rounded-full mb-6"></div>
            <p className="text-white/90 text-lg max-w-3xl mx-auto mb-6">
              Comprehensive market research validating YoLuxGo™'s luxury service platform 
              across global high-net-worth demographics and security professionals.
            </p>
            
            {/* Survey Overview */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <Card className="bg-cream/5 border-gold/20">
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 text-gold mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">1,000</div>
                  <div className="text-white/80 text-sm">Participants</div>
                </CardContent>
              </Card>
              <Card className="bg-cream/5 border-gold/20">
                <CardContent className="p-6 text-center">
                  <Globe className="w-8 h-8 text-gold mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">5</div>
                  <div className="text-white/80 text-sm">Global Regions</div>
                </CardContent>
              </Card>
              <Card className="bg-cream/5 border-gold/20">
                <CardContent className="p-6 text-center">
                  <Award className="w-8 h-8 text-gold mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">25-65</div>
                  <div className="text-white/80 text-sm">Age Range</div>
                </CardContent>
              </Card>
              <Card className="bg-cream/5 border-gold/20">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-8 h-8 text-gold mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">July 2025</div>
                  <div className="text-white/80 text-sm">Survey Date</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Overall Appeal Section */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl font-bold text-white mb-8 text-center">
              Overall Platform Appeal
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {overallAppeal.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-cream/5 border-gold/20 h-full">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl font-bold text-gold mb-2">{item.percentage}%</div>
                      <div className="text-white/90">{item.metric}</div>
                      <Progress value={item.percentage} className="mt-4" />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Critical Features Section */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl font-bold text-white mb-8 text-center">
              Most Valued Features
            </h2>
            <div className="space-y-4">
              {criticalFeatures.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="bg-cream/5 border-gold/20">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <IconComponent className="w-6 h-6 text-gold" />
                            <span className="text-white font-medium">{item.feature}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Badge className="bg-gold text-navy font-semibold">
                              {item.percentage}% Critical/Very Important
                            </Badge>
                            <Progress value={item.percentage} className="w-24" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Respondent Demographics */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl font-bold text-white mb-8 text-center">
              Survey Demographics
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-cream/5 border-gold/20">
                <CardHeader>
                  <CardTitle className="text-white">Respondent Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={respondentTypes}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${value}%`}
                      >
                        {respondentTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0a1a2f', 
                          border: '1px solid #d4af37',
                          borderRadius: '8px',
                          color: '#fdfdfb'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {respondentTypes.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span className="text-white/90">{item.name}</span>
                        </div>
                        <span className="text-gold font-semibold">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-cream/5 border-gold/20">
                <CardHeader>
                  <CardTitle className="text-white">Geographic Coverage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-white/90">
                    <strong className="text-white">Regions Surveyed:</strong>
                  </div>
                  <ul className="space-y-2 text-white/90">
                    <li>• North America</li>
                    <li>• Europe</li>
                    <li>• Middle East</li>
                    <li>• Asia</li>
                    <li>• Latin America</li>
                  </ul>
                  <div className="mt-6 p-4 bg-gold/10 rounded-lg border border-gold/20">
                    <div className="text-white font-semibold mb-2">Survey Method</div>
                    <div className="text-white/90 text-sm">
                      Anonymous online survey conducted across target demographics 
                      representing YoLuxGo™'s core client base and service ecosystem.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Fee Structure Acceptance */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl font-bold text-white mb-8 text-center">
              Pricing & Fee Acceptance
            </h2>
            <div className="space-y-6">
              {feeAcceptance.map((item, index) => (
                <Card key={index} className="bg-cream/5 border-gold/20">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-white">{item.fee}</h3>
                      <Badge className="bg-green-600 text-white">
                        {item.acceptable}% Acceptable
                      </Badge>
                    </div>
                    {item.fee.includes('Cancellation') && (
                      <div className="mb-4 p-3 bg-navy/50 rounded-lg border border-gold/20">
                        <div className="text-white/90 text-sm mb-2">
                          <strong>Policy Shown to Respondents:</strong>
                        </div>
                        <div className="text-white/80 text-xs">
                          Cancellations incur fees ranging from 5% (72+ hours advance) up to 75-100% (last-minute/no-shows), 
                          calculated as percentage of total booking value.
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{item.acceptable}%</div>
                        <div className="text-white/80 text-sm">
                          {item.fee.includes('Cancellation') ? 'Support Percentage-based' : 'Acceptable'}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-400">{item.tooHigh}%</div>
                        <div className="text-white/80 text-sm">
                          {item.fee.includes('Cancellation') ? 'Prefer Fixed Fee' : 'Too High'}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white/70">
                          {item.tooLow || item.undecided || 0}%
                        </div>
                        <div className="text-white/80 text-sm">
                          {item.tooLow > 0 ? 'Too Low' : 'Need More Info'}
                        </div>
                      </div>
                    </div>
                    {item.fee.includes('Cancellation') && (
                      <div className="mt-4 space-y-2 text-white/80 text-sm">
                        <div className="font-semibold text-white">Common Feedback:</div>
                        <ul className="space-y-1 text-xs">
                          <li>• "Percentage-based is more fair and scalable with luxury pricing"</li>
                          <li>• Service providers requested stricter last-minute penalties</li>
                          <li>• Clients requested flexibility for verified/repeat users</li>
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Trust & Safety Metrics */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl font-bold text-white mb-8 text-center">
              Trust & Safety Confidence
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {trustMetrics.map((item, index) => (
                <Card key={index} className="bg-cream/5 border-gold/20">
                  <CardContent className="p-6 text-center">
                    <Shield className="w-12 h-12 text-gold mx-auto mb-4" />
                    <div className="text-3xl font-bold text-gold mb-2">{item.percentage}%</div>
                    <div className="text-white/90">{item.metric}</div>
                    <Progress value={item.percentage} className="mt-4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Payment Methods & Future Features */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl font-bold text-white mb-8 text-center">
              Payment Preferences
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-cream/5 border-gold/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    Current Payment Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-400 mb-2">79%</div>
                    <div className="text-white/90">
                      Satisfied with Stripe and Bank Transfer support
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-cream/5 border-gold/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <DollarSign className="w-5 h-5 text-gold mr-2" />
                    Future Payment Demand
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gold mb-2">92%</div>
                    <div className="text-white/90 mb-4">
                      Want additional payment options
                    </div>
                    <div className="text-sm text-white/80">
                      Requested: Apple Pay, Cryptocurrency, PayPal, Wire Transfers
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Key Insights Summary */}
          <section className="mb-12">
            <Card className="bg-gold/10 border-gold/30">
              <CardHeader>
                <CardTitle className="text-white text-center text-2xl">
                  Key Market Validation Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Strong Market Demand</h3>
                    <ul className="space-y-2 text-white/90">
                      <li>• 91% find YoLuxGo™ concept appealing</li>
                      <li>• 87% would use platform within 12 months</li>
                      <li>• 93% alignment with "Discreet Luxury. Global Security" positioning</li>
                      <li>• Strong acceptance of fee structure across all service types</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Priority Features Validated</h3>
                    <ul className="space-y-2 text-white/90">
                      <li>• Privacy and discretion features (96% critical)</li>
                      <li>• Personnel vetting and quality assurance (94% critical)</li>
                      <li>• Global availability and elite access (89-91% critical)</li>
                      <li>• Trust and safety infrastructure strongly supported</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Methodology */}
          <section className="text-center">
            <Card className="bg-cream/5 border-gold/20">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-white mb-4">Survey Methodology</h3>
                <p className="text-white/90 max-w-3xl mx-auto">
                  This comprehensive market research was conducted through anonymous online surveys 
                  targeting YoLuxGo™'s core demographic segments across five global regions. 
                  The 1,000-participant sample represents high-net-worth individuals, corporate travel 
                  coordinators, security professionals, and frequent luxury travelers aged 25-65, 
                  ensuring statistically significant insights into market demand and feature preferences.
                </p>
              </CardContent>
            </Card>
          </section>
        </motion.div>
      </div>
    </div>
  );
}