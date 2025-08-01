import { motion } from "framer-motion";
import { Shield, Lock, Eye, Database, Globe, FileText } from "lucide-react";
import ylgLogo from "@assets/New Primary YLG Transparent Logo_1753669210755.png";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-navy text-cream">
      {/* Header */}
      <div className="border-b border-gold/20 bg-navy/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src={ylgLogo} 
                alt="YoLuxGo Logo" 
                className="w-10 h-10 mr-1"
              />
              <div>
                <div className="font-serif text-xl font-bold text-cream">
                  YoLuxGo<span className="text-gold text-sm align-super">™</span>
                </div>
                <div className="text-gold text-xs font-medium">Privacy Policy</div>
              </div>
            </div>
            <button 
              onClick={() => window.history.back()}
              className="text-cream hover:text-gold transition-colors text-sm"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl font-bold text-cream mb-4">
              Privacy Policy
            </h1>
            <div className="w-24 h-1 bg-gold mx-auto rounded-full mb-6"></div>
            <p className="text-cream/80 text-lg max-w-2xl mx-auto">
              Your privacy and security are paramount to our luxury service commitment.
            </p>
            <div className="mt-4 text-cream/60 text-sm">
              <strong>Effective Date:</strong> January 29, 2025<br/>
              <strong>Last Updated:</strong> January 29, 2025
            </div>
          </div>

          {/* Company Information */}
          <section className="mb-12 bg-gold/5 rounded-2xl p-8 border border-gold/20">
            <div className="flex items-center mb-4">
              <Globe className="w-6 h-6 text-gold mr-3" />
              <h2 className="font-serif text-2xl font-bold text-cream">Company Information</h2>
            </div>
            <div className="text-cream/90 leading-relaxed">
              <p className="mb-4">
                YoLuxGo™ is owned and operated by <strong className="text-gold">Nebusis Cloud Services, LLC</strong>, 
                a Delaware Limited Liability Company specializing in luxury technology solutions and discrete 
                service platforms for high-profile clientele.
              </p>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h4 className="font-semibold text-cream mb-2">Corporate Address:</h4>
                  <p className="text-cream/80">
                    Nebusis Cloud Services, LLC<br/>
                    [Corporate Address]<br/>
                    Delaware, United States
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-cream mb-2">Contact Information:</h4>
                  <p className="text-cream/80">
                    Email: privacy@nebusis.com<br/>
                    Phone: [Privacy Hotline]<br/>
                    Website: https://www.nebusis.com
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Information We Collect */}
          <section className="mb-12">
            <div className="flex items-center mb-6">
              <Database className="w-6 h-6 text-gold mr-3" />
              <h2 className="font-serif text-2xl font-bold text-cream">Information We Collect</h2>
            </div>

            <div className="space-y-8">
              <div className="bg-navy/30 rounded-xl p-6 border border-gold/10">
                <h3 className="font-semibold text-cream text-lg mb-4">Personal Information</h3>
                <ul className="text-cream/80 space-y-2 list-disc list-inside">
                  <li>Full name, email address, phone number</li>
                  <li>Government-issued identification for security verification</li>
                  <li>Billing and payment information</li>
                  <li>Emergency contact details</li>
                  <li>Travel preferences and accessibility requirements</li>
                  <li>Security clearance levels and background verification</li>
                </ul>
              </div>

              <div className="bg-navy/30 rounded-xl p-6 border border-gold/10">
                <h3 className="font-semibold text-cream text-lg mb-4">Service Data</h3>
                <ul className="text-cream/80 space-y-2 list-disc list-inside">
                  <li>Transportation bookings and travel history</li>
                  <li>Security service requests and threat assessments</li>
                  <li>Concierge service preferences and requests</li>
                  <li>Location data for service delivery</li>
                  <li>Communication records and service feedback</li>
                  <li>Biometric data for enhanced security protocols</li>
                </ul>
              </div>

              <div className="bg-navy/30 rounded-xl p-6 border border-gold/10">
                <h3 className="font-semibold text-cream text-lg mb-4">Technical Information</h3>
                <ul className="text-cream/80 space-y-2 list-disc list-inside">
                  <li>Device information and unique identifiers</li>
                  <li>IP addresses and network connection data</li>
                  <li>Browser type, version, and operating system</li>
                  <li>Usage patterns and platform interactions</li>
                  <li>Security logs and access records</li>
                  <li>Encrypted communication metadata</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section className="mb-12">
            <div className="flex items-center mb-6">
              <Shield className="w-6 h-6 text-gold mr-3" />
              <h2 className="font-serif text-2xl font-bold text-cream">How We Use Your Information</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-navy/30 rounded-xl p-6 border border-gold/10">
                <h3 className="font-semibold text-cream text-lg mb-4">Service Delivery</h3>
                <ul className="text-cream/80 space-y-2 list-disc list-inside">
                  <li>Coordinating luxury transportation services</li>
                  <li>Providing executive protection and security</li>
                  <li>Facilitating concierge and lifestyle services</li>
                  <li>Managing bookings and service schedules</li>
                  <li>Processing payments and invoicing</li>
                </ul>
              </div>

              <div className="bg-navy/30 rounded-xl p-6 border border-gold/10">
                <h3 className="font-semibold text-cream text-lg mb-4">Security & Safety</h3>
                <ul className="text-cream/80 space-y-2 list-disc list-inside">
                  <li>Conducting background verification</li>
                  <li>Threat assessment and risk management</li>
                  <li>Emergency response coordination</li>
                  <li>Identity verification and authentication</li>
                  <li>Fraud prevention and detection</li>
                </ul>
              </div>

              <div className="bg-navy/30 rounded-xl p-6 border border-gold/10">
                <h3 className="font-semibold text-cream text-lg mb-4">Platform Improvement</h3>
                <ul className="text-cream/80 space-y-2 list-disc list-inside">
                  <li>Analyzing usage patterns and preferences</li>
                  <li>Enhancing security protocols</li>
                  <li>Developing new luxury services</li>
                  <li>Improving user experience</li>
                  <li>Quality assurance and service optimization</li>
                </ul>
              </div>

              <div className="bg-navy/30 rounded-xl p-6 border border-gold/10">
                <h3 className="font-semibold text-cream text-lg mb-4">Legal Compliance</h3>
                <ul className="text-cream/80 space-y-2 list-disc list-inside">
                  <li>Meeting regulatory requirements</li>
                  <li>Responding to legal requests</li>
                  <li>Maintaining business records</li>
                  <li>Tax reporting and compliance</li>
                  <li>Insurance and liability management</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Protection */}
          <section className="mb-12">
            <div className="flex items-center mb-6">
              <Lock className="w-6 h-6 text-gold mr-3" />
              <h2 className="font-serif text-2xl font-bold text-cream">Data Protection & Security</h2>
            </div>

            <div className="bg-gold/5 rounded-2xl p-8 border border-gold/20 mb-6">
              <h3 className="font-semibold text-cream text-xl mb-4">Military-Grade Security</h3>
              <p className="text-cream/90 leading-relaxed mb-4">
                We employ the highest standards of data protection, utilizing military-grade encryption 
                and quantum-secure communication channels to ensure absolute discretion for our distinguished clientele.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Lock className="w-8 h-8 text-gold" />
                  </div>
                  <h4 className="font-semibold text-cream mb-2">256-bit Encryption</h4>
                  <p className="text-cream/70 text-sm">End-to-end encryption for all data transmission</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-8 h-8 text-gold" />
                  </div>
                  <h4 className="font-semibold text-cream mb-2">Biometric Auth</h4>
                  <p className="text-cream/70 text-sm">Multi-factor authentication with biometric verification</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Eye className="w-8 h-8 text-gold" />
                  </div>
                  <h4 className="font-semibold text-cream mb-2">Zero-Knowledge</h4>
                  <p className="text-cream/70 text-sm">Data stored with zero-knowledge architecture</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-cream/80">
              <p>
                <strong className="text-cream">Physical Security:</strong> Our data centers are protected by 24/7 
                armed security, biometric access controls, and environmental monitoring systems.
              </p>
              <p>
                <strong className="text-cream">Network Security:</strong> All connections use VPN tunneling, 
                intrusion detection systems, and real-time threat monitoring with immediate response protocols.
              </p>
              <p>
                <strong className="text-cream">Data Integrity:</strong> Regular security audits, penetration 
                testing, and compliance verification ensure the highest standards of data protection.
              </p>
            </div>
          </section>

          {/* Information Sharing */}
          <section className="mb-12">
            <div className="flex items-center mb-6">
              <Eye className="w-6 h-6 text-gold mr-3" />
              <h2 className="font-serif text-2xl font-bold text-cream">Information Sharing & Disclosure</h2>
            </div>

            <div className="bg-navy/30 rounded-xl p-6 border border-gold/10 mb-6">
              <h3 className="font-semibold text-cream text-lg mb-4">Discretion Guarantee</h3>
              <p className="text-cream/90 leading-relaxed">
                We maintain absolute discretion and will never sell, rent, or share your personal information 
                with third parties for marketing purposes. Your privacy is sacred to our service commitment.
              </p>
            </div>

            <h3 className="font-semibold text-cream text-lg mb-4">Limited Sharing Scenarios:</h3>
            <div className="space-y-4 text-cream/80">
              <p>
                <strong className="text-cream">Service Providers:</strong> Vetted and security-cleared partners 
                necessary for service delivery (drivers, security personnel, hospitality providers) receive only 
                the minimum information required.
              </p>
              <p>
                <strong className="text-cream">Legal Requirements:</strong> When required by law, court order, 
                or government regulation, we may disclose information while maintaining maximum discretion.
              </p>
              <p>
                <strong className="text-cream">Emergency Situations:</strong> In life-threatening emergencies, 
                we may share information with emergency services or medical personnel.
              </p>
              <p>
                <strong className="text-cream">Business Operations:</strong> In the event of merger, acquisition, 
                or business transfer, information may be transferred under strict confidentiality agreements.
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-12">
            <div className="flex items-center mb-6">
              <FileText className="w-6 h-6 text-gold mr-3" />
              <h2 className="font-serif text-2xl font-bold text-cream">Your Privacy Rights</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-navy/30 rounded-xl p-6 border border-gold/10">
                <h3 className="font-semibold text-cream text-lg mb-4">Access & Control</h3>
                <ul className="text-cream/80 space-y-2 list-disc list-inside">
                  <li>Access your personal information</li>
                  <li>Update or correct data</li>
                  <li>Request data deletion</li>
                  <li>Opt-out of communications</li>
                  <li>Data portability requests</li>
                </ul>
              </div>

              <div className="bg-navy/30 rounded-xl p-6 border border-gold/10">
                <h3 className="font-semibold text-cream text-lg mb-4">Enhanced Rights</h3>
                <ul className="text-cream/80 space-y-2 list-disc list-inside">
                  <li>Request processing limitations</li>
                  <li>Object to data processing</li>
                  <li>Withdraw consent</li>
                  <li>Lodge privacy complaints</li>
                  <li>Request security reports</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 bg-gold/5 rounded-xl p-6 border border-gold/20">
              <p className="text-cream/90 leading-relaxed">
                <strong className="text-cream">To exercise your rights:</strong> Use our secure contact form 
                or contact your dedicated account manager. All requests are processed with the utmost discretion and priority.
              </p>
            </div>
          </section>

          {/* International Compliance */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-cream mb-6">International Compliance</h2>
            
            <div className="space-y-6">
              <div className="bg-navy/30 rounded-xl p-6 border border-gold/10">
                <h3 className="font-semibold text-cream text-lg mb-3">GDPR Compliance (EU)</h3>
                <p className="text-cream/80">
                  Full compliance with European General Data Protection Regulation, including lawful basis 
                  for processing, data subject rights, and privacy by design principles.
                </p>
              </div>

              <div className="bg-navy/30 rounded-xl p-6 border border-gold/10">
                <h3 className="font-semibold text-cream text-lg mb-3">CCPA Compliance (California)</h3>
                <p className="text-cream/80">
                  California Consumer Privacy Act compliance with enhanced consumer rights, 
                  including the right to know, delete, and opt-out of personal information sales.
                </p>
              </div>

              <div className="bg-navy/30 rounded-xl p-6 border border-gold/10">
                <h3 className="font-semibold text-cream text-lg mb-3">Global Standards</h3>
                <p className="text-cream/80">
                  Compliance with international privacy frameworks including PIPEDA (Canada), 
                  Privacy Act (Australia), and emerging global privacy regulations.
                </p>
              </div>
            </div>
          </section>

          {/* Data Retention */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-cream mb-6">Data Retention</h2>
            
            <div className="bg-gold/5 rounded-xl p-6 border border-gold/20 mb-6">
              <p className="text-cream/90 leading-relaxed">
                We retain personal information only as long as necessary for legitimate business purposes, 
                legal compliance, and service delivery. Retention periods vary based on data type and regulatory requirements.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-navy/30 rounded-xl p-6 border border-gold/10">
                <h3 className="font-semibold text-cream text-lg mb-3">Service Data</h3>
                <p className="text-cream/80 text-sm">
                  Retained for 7 years for security and service improvement purposes
                </p>
              </div>
              <div className="bg-navy/30 rounded-xl p-6 border border-gold/10">
                <h3 className="font-semibold text-cream text-lg mb-3">Financial Records</h3>
                <p className="text-cream/80 text-sm">
                  Retained for 10 years per regulatory and tax compliance requirements
                </p>
              </div>
              <div className="bg-navy/30 rounded-xl p-6 border border-gold/10">
                <h3 className="font-semibold text-cream text-lg mb-3">Security Logs</h3>
                <p className="text-cream/80 text-sm">
                  Retained for 5 years for security analysis and threat prevention
                </p>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-cream mb-6">Contact Our Privacy Team</h2>
            
            <div className="bg-gold/5 rounded-2xl p-8 border border-gold/20">
              <div className="text-center">
                <h3 className="font-semibold text-cream text-lg mb-4">Privacy Inquiries & Feedback</h3>
                <p className="text-cream/80 mb-6 leading-relaxed">
                  For all privacy-related questions, data subject requests, feedback, or concerns about how your 
                  personal information is handled, please use our secure contact form. Our privacy team 
                  will respond within 24 hours.
                </p>
                
                <div className="mb-6">
                  <a 
                    href="/contact" 
                    className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-gold to-gold/80 hover:from-gold/80 hover:to-gold text-navy font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Submit Privacy Inquiry or Feedback
                  </a>
                </div>
                
                <div className="text-cream/60 text-sm">
                  <p>Operated by Nebusis Cloud Services, LLC</p>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gold/20">
                <p className="text-cream/90 text-center text-sm">
                  <strong>24/7 Privacy Support:</strong> For urgent privacy matters, please indicate 
                  "URGENT - PRIVACY" in your contact form subject line. We maintain strict confidentiality 
                  and discrete communication protocols for all privacy inquiries.
                </p>
              </div>
            </div>
          </section>

          {/* Updates */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-cream mb-6">Policy Updates</h2>
            <div className="bg-navy/30 rounded-xl p-6 border border-gold/10">
              <p className="text-cream/80 leading-relaxed">
                We may update this Privacy Policy to reflect changes in our practices, technology, 
                legal requirements, or other factors. We will notify you of material changes through 
                your preferred communication method and require acknowledgment for significant updates. 
                Continued use of our services constitutes acceptance of the updated policy.
              </p>
            </div>
          </section>

          {/* Footer */}
          <div className="text-center pt-8 border-t border-gold/20">
            <p className="text-cream/60 text-sm mb-2">
              Powered by <span className="text-gold font-medium">Nebusis®</span>
            </p>
            <p className="text-cream/40 text-xs">
              © 2025 Nebusis Cloud Services, LLC. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}