import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Shield, 
  UserCheck, 
  FileText, 
  Clock, 
  CheckCircle, 
  Search, 
  Lock, 
  Award,
  AlertTriangle,
  Users,
  Building,
  Globe,
  Eye,
  PhoneCall
} from "lucide-react";
import primaryLogo from "@assets/New Primary YLG Transparent Logo_1753681153359.png";

export default function VettingProcess() {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
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
            <button 
              onClick={() => window.history.back()}
              className="text-cream hover:text-gold transition-colors text-sm"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div 
            className="text-center mb-12"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">
              Comprehensive Vetting Process
            </h1>
            <p className="text-xl text-cream mb-8 leading-relaxed">
              Ensuring the highest standards of security, professionalism, and discretion 
              through our multi-tiered verification protocols.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Badge className="bg-gold text-navy px-4 py-2 text-sm font-medium">
                <Shield className="w-4 h-4 mr-2" />
                Military-Grade Security
              </Badge>
              <Badge className="bg-cream text-navy px-4 py-2 text-sm font-medium">
                <Award className="w-4 h-4 mr-2" />
                Industry Leading Standards
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            <motion.div variants={fadeInUp}>
              <Card className="bg-cream/5 border-gold/20 h-full">
                <CardContent className="p-6 text-center">
                  <UserCheck className="w-12 h-12 text-gold mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Multi-Tier Verification
                  </h3>
                  <p className="text-cream text-sm leading-relaxed">
                    Each applicant undergoes comprehensive background checks, skill assessments, 
                    and character evaluations tailored to their role requirements.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="bg-cream/5 border-gold/20 h-full">
                <CardContent className="p-6 text-center">
                  <Shield className="w-12 h-12 text-gold mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Security Clearance
                  </h3>
                  <p className="text-cream text-sm leading-relaxed">
                    Advanced security protocols ensure all personnel meet the demanding 
                    standards required for high-profile client protection and service.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="bg-cream/5 border-gold/20 h-full">
                <CardContent className="p-6 text-center">
                  <Clock className="w-12 h-12 text-gold mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Continuous Monitoring
                  </h3>
                  <p className="text-cream text-sm leading-relaxed">
                    Ongoing performance evaluations and periodic re-verification 
                    maintain the highest quality standards throughout service delivery.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Detailed Process Section */}
      <section className="py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
              Vetting Process by User Type
            </h2>
            <p className="text-cream text-lg">
              Tailored verification protocols for each participant in our luxury service ecosystem
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-8"
          >
            {/* Client Vetting */}
            <motion.div variants={fadeInUp}>
              <Card className="bg-cream/5 border-gold/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Users className="w-6 h-6 text-gold mr-3" />
                    Client Vetting Process
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gold mb-3">Standard Tier</h4>
                      <ul className="space-y-2 text-cream text-sm">
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                          Basic identity verification
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                          Payment method validation
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                          Contact information verification
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                          Service agreement acceptance
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gold mb-3">Premium & VIP Tiers</h4>
                      <ul className="space-y-2 text-cream text-sm">
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                          Enhanced identity verification
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                          Service payment method verification
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                          Professional references check
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                          Privacy preferences interview
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Service Provider Vetting */}
            <motion.div variants={fadeInUp}>
              <Card className="bg-cream/5 border-gold/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <UserCheck className="w-6 h-6 text-gold mr-3" />
                    Service Provider Vetting Process
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gold mb-3">Individual Personnel</h4>
                      <ul className="space-y-2 text-cream text-sm">
                        <li className="flex items-start">
                          <Shield className="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                          Professional certification verification
                        </li>
                        <li className="flex items-start">
                          <Shield className="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                          Skills assessment and testing
                        </li>
                        <li className="flex items-start">
                          <Shield className="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                          Basic criminal background check
                        </li>
                        <li className="flex items-start">
                          <Shield className="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                          Professional references verification
                        </li>
                        <li className="flex items-start">
                          <Shield className="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                          Confidentiality agreement signing
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gold mb-3">Service Companies</h4>
                      <ul className="space-y-2 text-cream text-sm">
                        <li className="flex items-start">
                          <Building className="w-4 h-4 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                          Business credentials and licensing
                        </li>
                        <li className="flex items-start">
                          <Building className="w-4 h-4 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                          Basic insurance verification
                        </li>
                        <li className="flex items-start">
                          <Building className="w-4 h-4 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                          Service quality standards review
                        </li>
                        <li className="flex items-start">
                          <Building className="w-4 h-4 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                          Basic staff screening protocols
                        </li>
                        <li className="flex items-start">
                          <Building className="w-4 h-4 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                          Client references and reviews
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Regional Partner & Personnel Vetting */}
            <motion.div variants={fadeInUp}>
              <Card className="bg-cream/5 border-gold/20">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Globe className="w-6 h-6 text-gold mr-3" />
                    Regional Partner & Personnel Vetting
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-gold mb-3">Regional Partners</h4>
                      <ul className="space-y-2 text-cream text-sm">
                        <li className="flex items-start">
                          <Globe className="w-4 h-4 text-orange-400 mr-2 mt-0.5 flex-shrink-0" />
                          Local market knowledge assessment
                        </li>
                        <li className="flex items-start">
                          <Globe className="w-4 h-4 text-orange-400 mr-2 mt-0.5 flex-shrink-0" />
                          Basic business licensing verification
                        </li>
                        <li className="flex items-start">
                          <Globe className="w-4 h-4 text-orange-400 mr-2 mt-0.5 flex-shrink-0" />
                          Business experience validation
                        </li>
                        <li className="flex items-start">
                          <Globe className="w-4 h-4 text-orange-400 mr-2 mt-0.5 flex-shrink-0" />
                          Professional network review
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gold mb-3">Internal Personnel</h4>
                      <ul className="space-y-2 text-cream text-sm">
                        <li className="flex items-start">
                          <Eye className="w-4 h-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                          Enhanced background verification
                        </li>
                        <li className="flex items-start">
                          <Eye className="w-4 h-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                          Professional qualification review
                        </li>
                        <li className="flex items-start">
                          <Eye className="w-4 h-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                          Confidentiality and security training
                        </li>
                        <li className="flex items-start">
                          <Eye className="w-4 h-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                          Ongoing performance review
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Verification Steps Section */}
      <section className="py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
              Standard Verification Steps
            </h2>
            <p className="text-cream text-lg">
              Our systematic approach ensures comprehensive evaluation of all participants
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <motion.div variants={fadeInUp}>
              <Card className="bg-cream/5 border-gold/20 h-full">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gold" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    1. Application Review
                  </h3>
                  <p className="text-cream text-sm">
                    Initial document verification and completeness assessment
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="bg-cream/5 border-gold/20 h-full">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gold" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    2. Background Investigation
                  </h3>
                  <p className="text-cream text-sm">
                    Comprehensive background checks and reference validation
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="bg-cream/5 border-gold/20 h-full">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PhoneCall className="w-8 h-8 text-gold" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    3. Interview Process
                  </h3>
                  <p className="text-cream text-sm">
                    Professional assessment and character evaluation
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="bg-cream/5 border-gold/20 h-full">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-gold" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    4. Final Approval
                  </h3>
                  <p className="text-cream text-sm">
                    Multi-level review and certification for service authorization
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Security Standards Section */}
      <section className="py-12 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <Card className="bg-cream/5 border-gold/20">
              <CardHeader>
                <CardTitle className="flex items-center text-white text-2xl">
                  <Lock className="w-8 h-8 text-gold mr-3" />
                  Security and Confidentiality Standards
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gold mb-3 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Core Requirements
                    </h4>
                    <ul className="space-y-2 text-cream text-sm">
                      <li>• Basic confidentiality agreement signing</li>
                      <li>• Professional conduct standards</li>
                      <li>• Service quality expectations</li>
                      <li>• Client privacy respect protocols</li>
                      <li>• Communication and feedback channels</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gold mb-3 flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      Ongoing Standards
                    </h4>
                    <ul className="space-y-2 text-cream text-sm">
                      <li>• Periodic profile updates</li>
                      <li>• Client feedback review</li>
                      <li>• Service improvement opportunities</li>
                      <li>• Platform guidelines compliance</li>
                      <li>• Basic safety and security awareness</li>
                    </ul>
                  </div>
                </div>
                
                <Separator className="bg-gold/20" />
                
                <div className="text-center">
                  <p className="text-cream text-sm leading-relaxed">
                    Our streamlined vetting process ensures quality service delivery while maintaining 
                    reasonable entry requirements for professionals joining our platform. We balance 
                    security with accessibility to build a diverse network of qualified service providers.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gold/20">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center mb-4">
            <img 
              src={primaryLogo}
              alt="YoLuxGo™" 
              className="h-8 mr-0.5"
            />
            <span className="font-serif text-xl text-white font-light">
              YoLuxGo<sup className="text-[0.4rem] ml-0.5 text-gold">™</sup>
            </span>
          </div>
          <p className="text-white text-sm mb-2">
            Discreet Luxury. Global Security.
          </p>
          <p className="text-cream text-xs">
            Powered by Nebusis<sup className="text-[0.4rem] ml-0.5 text-gold">®</sup> | 
            © 2025 Nebusis Cloud Services, LLC
          </p>
        </div>
      </footer>
    </div>
  );
}