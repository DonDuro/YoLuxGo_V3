import { motion } from "framer-motion";
import { Link } from "wouter";
import primaryLogo from "@assets/New Primary YLG Transparent Logo_1753681153359.png";

export default function Footer() {
  return (
    <footer className="bg-navy py-12">
      <div className="container mx-auto px-6">
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center mb-4 md:mb-0">
            <img 
              src={primaryLogo}
              alt="YoLuxGo™ - Discreet Luxury. Global Security." 
              className="h-8 mr-0.5"
            />
            <span className="font-serif text-xl text-white font-light">
              YoLuxGo<sup className="text-[0.4rem] ml-0.5 text-gold">™</sup>
            </span>
          </div>
          <div className="text-cream text-sm text-center md:text-right">
            <div className="mb-2">
              <span className="text-white font-medium">Powered By{' '}</span>
              <a 
                href="https://www.nebusis.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gold hover:text-gold/80 transition-colors font-medium"
              >
                Nebusis<sup className="text-[0.4rem] ml-0.5 text-gold">®</sup>
              </a>
            </div>
            <div className="text-white font-medium mb-2">
              © 2025 Nebusis Cloud Services, LLC. All rights reserved.
            </div>
            <div className="flex flex-col sm:flex-row justify-center md:justify-end items-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs">
              <Link 
                href="/privacy-policy" 
                className="text-cream hover:text-gold transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="hidden sm:inline text-cream/50">•</span>
              <Link 
                href="/terms-of-service" 
                className="text-cream hover:text-gold transition-colors"
              >
                Terms of Service
              </Link>
              <span className="hidden sm:inline text-cream/50">•</span>
              <Link 
                href="/vetting-process" 
                className="text-cream hover:text-gold transition-colors"
              >
                Vetting Process
              </Link>
              <span className="hidden sm:inline text-cream/50">•</span>
              <Link 
                href="/survey-results" 
                className="text-cream hover:text-gold transition-colors"
              >
                Survey Results
              </Link>
              <span className="hidden sm:inline text-cream/50">•</span>
              <Link 
                href="/careers" 
                className="text-cream hover:text-gold transition-colors"
              >
                Careers
              </Link>
              <span className="hidden sm:inline text-cream/50">•</span>
              <Link 
                href="/investor-login" 
                className="text-cream hover:text-gold transition-colors"
              >
                Business Plan Access
              </Link>
              <span className="hidden sm:inline text-cream/50">•</span>
              <Link 
                href="/contact" 
                className="text-cream hover:text-gold transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
