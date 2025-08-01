import { motion } from "framer-motion";
import { Scale, Shield, AlertTriangle, CreditCard, Globe, FileText, Users } from "lucide-react";
import ylgLogo from "@assets/New Primary YLG Transparent Logo_1753669210755.png";

export default function TermsOfService() {
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
                <div className="text-gold text-xs font-medium">Terms of Service</div>
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
              Terms of Service
            </h1>
            <div className="w-24 h-1 bg-gold mx-auto rounded-full mb-6"></div>
            <p className="text-cream/80 text-lg max-w-2xl mx-auto">
              Professional terms governing our luxury services and discrete security solutions.
            </p>
            <div className="mt-4 text-cream/60 text-sm">
              <strong>Effective Date:</strong> January 29, 2025<br/>
              <strong>Last Updated:</strong> January 29, 2025
            </div>
          </div>

          {/* Agreement */}
          <section className="mb-12 bg-gold/5 rounded-2xl p-8 border border-gold/20">
            <div className="flex items-center mb-4">
              <Scale className="w-6 h-6 text-gold mr-3" />
              <h2 className="font-serif text-2xl font-bold text-cream">Service Agreement</h2>
            </div>
            <div className="text-cream/90 leading-relaxed">
              <p className="mb-4">
                These Terms of Service ("Terms") constitute a legally binding agreement between you ("Client") 
                and <strong className="text-gold">Nebusis Cloud Services, LLC</strong> ("Company," "we," "us," or "our"), 
                the owner and operator of YoLuxGo™, governing your access to and use of our luxury transportation, 
                security, and concierge services.
              </p>
              <p className="text-cream/70">
                By accessing or using YoLuxGo™ services, you acknowledge that you have read, understood, 
                and agree to be bound by these Terms and our Privacy Policy.
              </p>
            </div>
          </section>

          {/* Independent Contractor Disclaimer */}
          <section className="mb-12">
            <div className="flex items-center mb-6">
              <Users className="w-6 h-6 text-gold mr-3" />
              <h2 className="font-serif text-2xl font-bold text-cream">Independent Contractor Disclaimer & Platform Role</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-navy/30 rounded-xl p-6 border border-gold/10">
                <h3 className="font-semibold text-cream text-lg mb-4">Platform Functionality Only</h3>
                <p className="text-cream/80 leading-relaxed">
                  YoLuxGo™ ("the Platform") provides a digital marketplace through which users ("Clients") may discover, 
                  connect with, and engage third-party service providers, including but not limited to drivers, security 
                  personnel, concierge agents, and hosts ("Providers"). Providers may use their own tools, staff, and 
                  practices in delivering services.
                </p>
              </div>

              <div className="bg-navy/30 rounded-xl p-6 border border-gold/10">
                <h3 className="font-semibold text-cream text-lg mb-4">No Employment or Agency Relationship</h3>
                <p className="text-cream/80 leading-relaxed">
                  YoLuxGo™ is not the employer, agent, joint venturer, or partner of any Provider. All Providers operate 
                  as independent contractors or independent businesses, responsible for their own actions, decisions, and services.
                </p>
              </div>

              <div className="bg-navy/30 rounded-xl p-6 border border-gold/10">
                <h3 className="font-semibold text-cream text-lg mb-4">No Guarantee of Quality or Safety</h3>
                <p className="text-cream/80 leading-relaxed">
                  While YoLuxGo™ may facilitate identity verification, ratings, or credentials, the Platform does not 
                  guarantee the accuracy, legality, or quality of services provided. Each Client is solely responsible 
                  for evaluating and selecting Providers at their own discretion.
                </p>
              </div>

              <div className="bg-navy/30 rounded-xl p-6 border border-gold/10">
                <h3 className="font-semibold text-cream text-lg mb-4">No Control Over Services</h3>
                <p className="text-cream/80 leading-relaxed">
                  YoLuxGo™ does not supervise, direct, or control the day-to-day operations or service delivery of any 
                  Provider. Any agreements or arrangements made are between the Client and the Provider.
                </p>
              </div>

              <div className="bg-gold/5 rounded-xl p-6 border border-gold/20">
                <h3 className="font-semibold text-cream text-lg mb-4">Dispute Resolution</h3>
                <p className="text-cream/80 leading-relaxed">
                  Disputes between users and providers do not involve the platform. All disputes must be resolved directly 
                  between the parties involved. YoLuxGo™ shall not be responsible for mediating or resolving such disputes.
                </p>
              </div>

              <div className="bg-gold/5 rounded-xl p-6 border border-gold/20">
                <h3 className="font-semibold text-cream text-lg mb-4">Indemnification</h3>
                <p className="text-cream/80 leading-relaxed">
                  Users agree to hold YoLuxGo™ harmless from claims related to provider conduct. You agree to indemnify, 
                  defend, and hold harmless Nebusis Cloud Services, LLC and YoLuxGo™ from and against any and all claims, 
                  damages, obligations, losses, liabilities, costs, and expenses arising from your use of the platform or 
                  engagement with providers.
                </p>
              </div>

              <div className="bg-red-900/20 rounded-xl p-6 border border-red-500/30">
                <h3 className="font-semibold text-cream text-lg mb-4">Limitation of Liability</h3>
                <p className="text-cream/80 leading-relaxed">
                  <strong className="text-red-300">TO THE FULLEST EXTENT PERMITTED BY LAW</strong>, YoLuxGo™ disclaims all liability 
                  for acts, omissions, or disputes arising from engagements between Clients and Providers. Our liability is 
                  limited to the platform facilitation services only.
                </p>
              </div>
            </div>
          </section>

          {/* Service Description */}
          <section className="mb-12">
            <div className="flex items-center mb-6">
              <Shield className="w-6 h-6 text-gold mr-3" />
              <h2 className="font-serif text-2xl font-bold text-cream">Service Description</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-navy/30 rounded-xl p-6 border border-gold/10">
                <h3 className="font-semibold text-cream text-lg mb-4">Luxury Transportation</h3>
                <ul className="text-cream/80 space-y-2 list-disc list-inside">
                  <li>Executive ground transportation</li>
                  <li>Private aviation services</li>
                  <li>Luxury yacht charters</li>
                  <li>Helicopter and specialized transport</li>
                  <li>Armored vehicle services</li>
                </ul>
              </div>

              <div className="bg-navy/30 rounded-xl p-6 border border-gold/10">
                <h3 className="font-semibold text-cream text-lg mb-4">Executive Security</h3>
                <ul className="text-cream/80 space-y-2 list-disc list-inside">
                  <li>Close protection services</li>
                  <li>Residential security</li>
                  <li>Event security coordination</li>
                  <li>Travel security planning</li>
                  <li>Threat assessment and mitigation</li>
                </ul>
              </div>

              <div className="bg-navy/30 rounded-xl p-6 border border-gold/10">
                <h3 className="font-semibold text-cream text-lg mb-4">Concierge Intelligence</h3>
                <ul className="text-cream/80 space-y-2 list-disc list-inside">
                  <li>Elite travel planning</li>
                  <li>Exclusive event management</li>
                  <li>Personal shopping services</li>
                  <li>Business support services</li>
                  <li>Lifestyle coordination</li>
                </ul>
              </div>

              <div className="bg-navy/30 rounded-xl p-6 border border-gold/10">
                <h3 className="font-semibold text-cream text-lg mb-4">Cloaking Technology</h3>
                <ul className="text-cream/80 space-y-2 list-disc list-inside">
                  <li>Identity protection services</li>
                  <li>Digital privacy solutions</li>
                  <li>Secure communications</li>
                  <li>Anonymous travel arrangements</li>
                  <li>Discretion protocols</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Eligibility */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-cream mb-6">Eligibility & Account Registration</h2>
            
            <div className="space-y-6">
              <div className="bg-navy/30 rounded-xl p-6 border border-gold/10">
                <h3 className="font-semibold text-cream text-lg mb-4">Client Requirements</h3>
                <ul className="text-cream/80 space-y-2 list-disc list-inside">
                  <li>Must be at least 21 years of age</li>
                  <li>Valid government-issued identification required</li>
                  <li>Comprehensive background verification</li>
                  <li>Financial qualification and credit verification</li>
                  <li>Acceptance of discretion and confidentiality protocols</li>
                  <li>Compliance with international security requirements</li>
                </ul>
              </div>

              <div className="bg-gold/5 rounded-xl p-6 border border-gold/20">
                <h3 className="font-semibold text-cream text-lg mb-4">Account Security</h3>
                <p className="text-cream/80 leading-relaxed">
                  You are responsible for maintaining the confidentiality of your account credentials, 
                  including multi-factor authentication devices and biometric data. You must immediately 
                  notify us of any unauthorized access or security breaches. We reserve the right to 
                  suspend or terminate accounts that compromise security protocols.
                </p>
              </div>
            </div>
          </section>

          {/* Service Terms */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-cream mb-6">Service Terms & Conditions</h2>

            <div className="space-y-6">
              <div className="bg-navy/30 rounded-xl p-6 border border-gold/10">
                <h3 className="font-semibold text-cream text-lg mb-4">Booking & Reservations</h3>
                <div className="text-cream/80 space-y-3">
                  <p>
                    <strong className="text-cream">Advance Notice:</strong> Services require minimum 24-48 hour advance booking. 
                    Emergency services may be available with premium surcharges.
                  </p>
                  <p>
                    <strong className="text-cream">Confirmation:</strong> All bookings require written confirmation 
                    and may be subject to availability and security clearances.
                  </p>
                  <p>
                    <strong className="text-cream">Modifications:</strong> Changes to confirmed bookings may incur fees 
                    and are subject to availability and security re-evaluation.
                  </p>
                </div>
              </div>

              <div className="bg-navy/30 rounded-xl p-6 border border-gold/10">
                <h3 className="font-semibold text-cream text-lg mb-4">Cancellation Policy</h3>
                <div className="text-cream/80 space-y-3">
                  <p className="text-cream/90 font-medium mb-3">
                    Cancellation fees are calculated as a percentage of the total booking value, based on timing:
                  </p>
                  <div className="space-y-2 text-sm">
                    <p><strong className="text-cream">More than 72 hours:</strong> 5% of total booking value</p>
                    <p><strong className="text-cream">24 to 72 hours:</strong> 15% of total booking value</p>
                    <p><strong className="text-cream">6 to 24 hours:</strong> 25% of total booking value</p>
                    <p><strong className="text-cream">Less than 6 hours:</strong> 50% of total booking value</p>
                    <p><strong className="text-cream">No-show or post-dispatch:</strong> 75-100% (provider discretion)</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gold/20">
                    <p className="text-cream/70 text-sm">
                      <strong className="text-cream">Emergency exceptions:</strong> Medical emergencies, flight delays, 
                      and extraordinary circumstances may qualify for fee waivers with proper documentation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-navy/30 rounded-xl p-6 border border-gold/10">
                <h3 className="font-semibold text-cream text-lg mb-4">Service Standards</h3>
                <div className="text-cream/80 space-y-3">
                  <p>
                    We maintain the highest standards of luxury service delivery, discretion, and security. 
                    All personnel undergo comprehensive background checks, security clearances, and ongoing training.
                  </p>
                  <p>
                    Services are delivered with absolute professionalism and confidentiality. Any breach of 
                    our service standards should be reported immediately through secure channels.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Payment Processing and Payout Policy */}
          <section className="mb-12">
            <div className="flex items-center mb-6">
              <CreditCard className="w-6 h-6 text-gold mr-3" />
              <h2 className="font-serif text-2xl font-bold text-cream">Payment Processing & Payout Policy</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-navy/30 rounded-xl p-6 border border-gold/10">
                <h3 className="font-semibold text-cream text-lg mb-4">Platform Overview</h3>
                <p className="text-cream/80 leading-relaxed">
                  YoLuxGo™ is a luxury service platform that connects clients with independent providers of transportation, 
                  security, lodging, and concierge services. YoLuxGo™ facilitates booking, payment, and coordination while 
                  maintaining strict quality, security, and discretion protocols. All service providers operate as 
                  independent contractors.
                </p>
              </div>

              <div className="bg-navy/30 rounded-xl p-6 border border-gold/10">
                <h3 className="font-semibold text-cream text-lg mb-4">Accepted Payment Methods</h3>
                <p className="text-cream/80 leading-relaxed mb-3">
                  At launch, YoLuxGo™ accepts:
                </p>
                <ul className="text-cream/80 space-y-2">
                  <li>• Credit/Debit Cards via Stripe</li>
                  <li>• Direct Bank Transfers</li>
                </ul>
                <p className="text-cream/70 mt-4 text-sm">
                  Additional payment methods (e.g., PayPal, cryptocurrency, and localized options) will be introduced progressively.
                </p>
              </div>

              <div className="bg-navy/30 rounded-xl p-6 border border-gold/10">
                <h3 className="font-semibold text-cream text-lg mb-4">Platform Fees</h3>
                <p className="text-cream/80 leading-relaxed mb-4">
                  To support operational excellence, security, and premium user experience, YoLuxGo™ applies the following standard fees:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-cream/80 border-collapse">
                    <thead>
                      <tr className="border-b border-gold/20">
                        <th className="text-left py-2 px-3 font-semibold text-gold">Fee Type</th>
                        <th className="text-left py-2 px-3 font-semibold text-gold">Amount</th>
                        <th className="text-left py-2 px-3 font-semibold text-gold">Applied To</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gold/10">
                        <td className="py-2 px-3">Client Booking Fee</td>
                        <td className="py-2 px-3">10% of total booking value</td>
                        <td className="py-2 px-3">Charged to client at checkout</td>
                      </tr>
                      <tr className="border-b border-gold/10">
                        <td className="py-2 px-3">Provider Commission</td>
                        <td className="py-2 px-3">20% of service value</td>
                        <td className="py-2 px-3">Deducted from provider payout</td>
                      </tr>
                      <tr className="border-b border-gold/10">
                        <td className="py-2 px-3">Rush Service Fee</td>
                        <td className="py-2 px-3">Additional 5% (if applicable)</td>
                        <td className="py-2 px-3">Charged to client on urgent bookings</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3">Dispute Handling Fee</td>
                        <td className="py-2 px-3">$250 flat (when triggered)</td>
                        <td className="py-2 px-3">Applied when arbitration is required</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-cream/70 mt-4 text-sm">
                  All applicable fees are transparently shown at the time of booking and in the provider's payout dashboard.
                </p>
              </div>

              <div className="bg-navy/30 rounded-xl p-6 border border-gold/10">
                <h3 className="font-semibold text-cream text-lg mb-4">Escrow and Payout Schedule</h3>
                <p className="text-cream/80 leading-relaxed mb-4">
                  Client funds are held in escrow until service delivery is confirmed. Once confirmed:
                </p>
                <ul className="text-cream/80 space-y-2 mb-4">
                  <li>• Payouts are released to providers within 24–72 hours</li>
                  <li>• Payment channels: Stripe Connect for instant payments</li>
                  <li>• Direct Bank Transfer (available where supported)</li>
                  <li>• All payouts are issued net of commission</li>
                </ul>
              </div>

              <div className="bg-navy/30 rounded-xl p-6 border border-gold/10">
                <h3 className="font-semibold text-cream text-lg mb-4">Provider Requirements for Payouts</h3>
                <p className="text-cream/80 leading-relaxed mb-4">To receive payouts, providers must:</p>
                <ul className="text-cream/80 space-y-2">
                  <li>• Complete full identity and background verification</li>
                  <li>• Provide valid banking or Stripe account details</li>
                  <li>• Accept the YoLuxGo™ Provider Agreement</li>
                  <li>• Comply with local tax, licensing, and insurance requirements</li>
                </ul>
              </div>

              <div className="bg-red-900/20 rounded-xl p-6 border border-red-500/30">
                <h3 className="font-semibold text-cream text-lg mb-4">Cancellation Fee Allocation & Disputes</h3>
                <div className="text-cream/80 space-y-4">
                  <div>
                    <p className="font-medium text-cream mb-2">Fee Distribution:</p>
                    <ul className="space-y-1 text-sm">
                      <li>• Service Provider Share: 80-90% (compensation for lost time/resources)</li>
                      <li>• YoLuxGo™ Platform Fee: 10-20% (administrative and transaction costs)</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-cream mb-2">Refund Processing:</p>
                    <p className="text-sm">
                      Refunds are processed to original payment method within 5-10 business days, 
                      minus applicable cancellation fees.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-cream mb-2">Dispute Resolution:</p>
                    <ul className="space-y-1 text-sm">
                      <li>• Formal dispute handling fee: $250 USD (non-refundable)</li>
                      <li>• Investigation period: up to 10 business days</li>
                      <li>• Platform reserves right to adjust final cancellation amounts based on provider-reported costs</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Liability */}
          <section className="mb-12">
            <div className="flex items-center mb-6">
              <AlertTriangle className="w-6 h-6 text-gold mr-3" />
              <h2 className="font-serif text-2xl font-bold text-cream">Liability & Insurance</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-navy/30 rounded-xl p-6 border border-gold/10">
                <h3 className="font-semibold text-cream text-lg mb-4">Service Limitations</h3>
                <div className="text-cream/80 space-y-3">
                  <p>
                    While we maintain the highest service standards, we cannot guarantee absolute safety 
                    or prevention of all risks. Our liability is limited to the value of services provided, 
                    except where prohibited by law.
                  </p>
                  <p>
                    <strong className="text-cream">Force Majeure:</strong> We are not liable for service 
                    disruptions due to acts of nature, terrorism, government actions, or circumstances 
                    beyond our reasonable control.
                  </p>
                </div>
              </div>

              <div className="bg-navy/30 rounded-xl p-6 border border-gold/10">
                <h3 className="font-semibold text-cream text-lg mb-4">Insurance Coverage</h3>
                <ul className="text-cream/80 space-y-2 list-disc list-inside">
                  <li>Comprehensive general liability insurance</li>
                  <li>Professional liability and errors & omissions</li>
                  <li>Cyber liability and data breach protection</li>
                  <li>International coverage for global operations</li>
                  <li>Additional coverage available upon request</li>
                </ul>
              </div>

              <div className="bg-gold/5 rounded-xl p-6 border border-gold/20">
                <h3 className="font-semibold text-cream text-lg mb-4">Client Responsibilities</h3>
                <p className="text-cream/80 leading-relaxed">
                  Clients must provide accurate information, comply with security protocols, follow 
                  personnel instructions, and maintain appropriate behavior. Clients are responsible 
                  for any damages caused by their actions or failure to follow established procedures.
                </p>
              </div>
            </div>
          </section>

          {/* Confidentiality */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-cream mb-6">Confidentiality & Discretion</h2>
            
            <div className="bg-gold/5 rounded-2xl p-8 border border-gold/20 mb-6">
              <h3 className="font-semibold text-cream text-xl mb-4">Mutual Confidentiality</h3>
              <p className="text-cream/90 leading-relaxed mb-4">
                Absolute discretion is fundamental to our service relationship. Both parties agree to maintain 
                strict confidentiality regarding all aspects of services, personal information, and business arrangements.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h4 className="font-semibold text-cream mb-3">Our Commitment</h4>
                  <ul className="text-cream/80 space-y-1 list-disc list-inside text-sm">
                    <li>Non-disclosure of client identity</li>
                    <li>Protection of travel and service details</li>
                    <li>Secure handling of all communications</li>
                    <li>Anonymous service delivery protocols</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-cream mb-3">Client Agreement</h4>
                  <ul className="text-cream/80 space-y-1 list-disc list-inside text-sm">
                    <li>Non-disclosure of service capabilities</li>
                    <li>Protection of personnel identities</li>
                    <li>Confidentiality of security protocols</li>
                    <li>Discretion regarding business relationships</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Prohibited Uses */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-cream mb-6">Prohibited Uses</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-navy/30 rounded-xl p-6 border border-gold/10">
                <h3 className="font-semibold text-cream text-lg mb-4">Illegal Activities</h3>
                <ul className="text-cream/80 space-y-2 list-disc list-inside">
                  <li>Any illegal or criminal activities</li>
                  <li>Money laundering or financial crimes</li>
                  <li>Drug trafficking or controlled substances</li>
                  <li>Human trafficking or exploitation</li>
                  <li>Terrorism or violent activities</li>
                </ul>
              </div>

              <div className="bg-navy/30 rounded-xl p-6 border border-gold/10">
                <h3 className="font-semibold text-cream text-lg mb-4">Service Misuse</h3>
                <ul className="text-cream/80 space-y-2 list-disc list-inside">
                  <li>Harassment of personnel or staff</li>
                  <li>Violation of local laws or regulations</li>
                  <li>Compromising security protocols</li>
                  <li>Misrepresentation of identity or purpose</li>
                  <li>Breach of confidentiality agreements</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 bg-gold/5 rounded-xl p-6 border border-gold/20">
              <p className="text-cream/90 leading-relaxed">
                <strong className="text-cream">Enforcement:</strong> We reserve the right to immediately 
                terminate services, report violations to authorities, and pursue legal remedies for any 
                prohibited use of our services.
              </p>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-cream mb-6">Intellectual Property Rights</h2>
            
            <div className="space-y-6">
              <div className="bg-navy/30 rounded-xl p-6 border border-gold/10">
                <h3 className="font-semibold text-cream text-lg mb-4">Company Rights</h3>
                <p className="text-cream/80 leading-relaxed">
                  YoLuxGo™ and all associated trademarks, logos, service marks, trade names, and intellectual 
                  property are owned by Nebusis Cloud Services, LLC. The platform, technology, methodologies, 
                  and proprietary systems are protected by copyright, trademark, and trade secret laws.
                </p>
              </div>

              <div className="bg-navy/30 rounded-xl p-6 border border-gold/10">
                <h3 className="font-semibold text-cream text-lg mb-4">Limited License</h3>
                <p className="text-cream/80 leading-relaxed">
                  We grant you a limited, non-exclusive, non-transferable license to access and use our 
                  services for personal, non-commercial purposes. This license does not permit copying, 
                  distributing, or creating derivative works of our intellectual property.
                </p>
              </div>
            </div>
          </section>

          {/* Termination */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-cream mb-6">Termination</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-navy/30 rounded-xl p-6 border border-gold/10">
                <h3 className="font-semibold text-cream text-lg mb-4">Client Termination</h3>
                <div className="text-cream/80 space-y-3">
                  <p>
                    You may terminate your account at any time with 30 days written notice. 
                    Outstanding service obligations and payments remain in effect.
                  </p>
                  <p>
                    Confidentiality obligations survive termination indefinitely.
                  </p>
                </div>
              </div>

              <div className="bg-navy/30 rounded-xl p-6 border border-gold/10">
                <h3 className="font-semibold text-cream text-lg mb-4">Company Termination</h3>
                <div className="text-cream/80 space-y-3">
                  <p>
                    We may terminate or suspend services immediately for violations of these Terms, 
                    illegal activities, or breach of security protocols.
                  </p>
                  <p>
                    Termination with cause does not entitle clients to refunds of prepaid services.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Governing Law */}
          <section className="mb-12">
            <div className="flex items-center mb-6">
              <Globe className="w-6 h-6 text-gold mr-3" />
              <h2 className="font-serif text-2xl font-bold text-cream">Governing Law & Disputes</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-navy/30 rounded-xl p-6 border border-gold/10">
                <h3 className="font-semibold text-cream text-lg mb-4">Jurisdiction</h3>
                <p className="text-cream/80 leading-relaxed">
                  These Terms are governed by the laws of the State of Florida, United States, 
                  without regard to conflict of law principles. Any disputes shall be resolved 
                  in the courts of Florida or through binding arbitration as specified below.
                </p>
              </div>

              <div className="bg-navy/30 rounded-xl p-6 border border-gold/10">
                <h3 className="font-semibold text-cream text-lg mb-4">Dispute Resolution</h3>
                <div className="text-cream/80 space-y-3">
                  <p>
                    <strong className="text-cream">Arbitration:</strong> Most disputes will be resolved through 
                    confidential binding arbitration administered by the American Arbitration Association.
                  </p>
                  <p>
                    <strong className="text-cream">Emergency Relief:</strong> Either party may seek injunctive 
                    relief in court for breaches of confidentiality or intellectual property rights.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Updates */}
          <section className="mb-12">
            <div className="flex items-center mb-6">
              <FileText className="w-6 h-6 text-gold mr-3" />
              <h2 className="font-serif text-2xl font-bold text-cream">Terms Updates</h2>
            </div>
            
            <div className="bg-gold/5 rounded-xl p-6 border border-gold/20">
              <p className="text-cream/90 leading-relaxed">
                We may update these Terms to reflect changes in our services, legal requirements, 
                or business practices. Material changes will be communicated through secure channels 
                with at least 30 days notice. Continued use of services after updates constitutes 
                acceptance of revised Terms.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-cream mb-6">Contact Information</h2>
            
            <div className="bg-gold/5 rounded-2xl p-8 border border-gold/20">
              <div className="text-center">
                <h3 className="font-semibold text-cream text-lg mb-4">Legal & Terms Inquiries</h3>
                <p className="text-cream/80 mb-6 leading-relaxed">
                  For questions about these Terms of Service, legal matters, business inquiries, or feedback, 
                  please use our secure contact form. Our legal team maintains strict confidentiality 
                  and will respond promptly to all inquiries and feedback.
                </p>
                
                <div className="mb-6">
                  <a 
                    href="/contact" 
                    className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-gold to-gold/80 hover:from-gold/80 hover:to-gold text-navy font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Contact Legal Department
                  </a>
                </div>
                
                <div className="text-cream/60 text-sm">
                  <p>Operated by Nebusis Cloud Services, LLC</p>
                </div>
              </div>
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