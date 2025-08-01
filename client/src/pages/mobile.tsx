import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, Car, Users, Smartphone, Lock, Globe, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import ylgLogo from "@assets/New Primary YLG Transparent Logo_1753681153359.png";

export default function MobilePage() {
  const { isAuthenticated, user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleAuthRedirect = () => {
    if (isAuthenticated) {
      // Redirect based on user type
      if ((user as any)?.role === 'admin') {
        window.location.href = '/admin/dashboard';
      } else {
        window.location.href = '/client/dashboard';
      }
    } else {
      window.location.href = '/auth';
    }
  };

  const handleViewDesktop = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-navy text-cream overflow-x-hidden">
      {/* Enhanced Hero Section */}
      <div className="relative min-h-screen flex flex-col">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-navy"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-32 h-32 bg-gold/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-40 left-8 w-24 h-24 bg-gold/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-60 left-12 w-16 h-16 bg-gold/8 rounded-full blur-xl animate-pulse delay-500"></div>
        </div>
        
        <div className="relative flex-1 flex flex-col justify-center px-6 py-12">
          {/* Premium Logo Section */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center justify-center mb-6">
              <motion.div
                className="relative"
                initial={{ rotate: -180, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <img 
                  src={ylgLogo} 
                  alt="YoLuxGo Logo" 
                  className="w-20 h-20 mr-1 drop-shadow-2xl"
                />
              </motion.div>
              <motion.div
                className="text-left"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <h1 className="font-serif text-4xl font-bold text-cream leading-none tracking-tight drop-shadow-lg">
                  YoLuxGo<span className="text-gold text-lg align-super">™</span>
                </h1>
                <motion.p 
                  className="text-gold text-base font-medium mt-1 tracking-wide drop-shadow-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  Discreet Luxury. Global Security.
                </motion.p>
              </motion.div>
            </div>
          </motion.div>

          {/* Elite Welcome Message */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <motion.h2 
              className="text-3xl font-serif font-bold mb-4 text-cream drop-shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              Elite Mobile Platform
            </motion.h2>
            <motion.p 
              className="text-cream text-lg leading-relaxed max-w-sm mx-auto drop-shadow-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              Access luxury services, secure transportation, and exclusive experiences 
              from anywhere in the world with unparalleled discretion.
            </motion.p>
            
            {/* Premium Stats */}
            <motion.div
              className="flex justify-center space-x-8 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6 }}
            >
              <div className="text-center">
                <div className="text-gold text-2xl font-bold">6</div>
                <div className="text-cream text-xs uppercase tracking-wide">Elite Cities</div>
              </div>
              <div className="text-center">
                <div className="text-gold text-2xl font-bold">24/7</div>
                <div className="text-cream text-xs uppercase tracking-wide">Security</div>
              </div>
              <div className="text-center">
                <div className="text-gold text-2xl font-bold">100%</div>
                <div className="text-cream text-xs uppercase tracking-wide">Discrete</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Premium Action Buttons */}
          <motion.div
            className="space-y-4 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleAuthRedirect}
                className="w-full py-5 bg-gradient-to-r from-gold via-gold to-gold/90 hover:from-gold/90 hover:via-gold hover:to-gold text-navy font-bold text-lg rounded-xl shadow-xl border border-gold/20 transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <div className="relative flex items-center justify-center">
                  <Smartphone className="w-5 h-5 mr-3" />
                  {isAuthenticated ? 'Access Elite Dashboard' : 'Enter Elite Portal'}
                </div>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleViewDesktop}
                variant="outline"
                className="w-full py-4 border-2 border-cream/40 text-cream hover:bg-cream/10 hover:border-cream/60 font-semibold text-lg rounded-xl transition-all duration-300 backdrop-blur-sm"
              >
                <Globe className="w-5 h-5 mr-3" />
                Experience Full Platform
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Elite Services Showcase */}
      <div className="px-6 py-12 bg-gradient-to-b from-navy to-navy/95">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-serif font-bold text-cream mb-3">
            Elite Service Collection
          </h3>
          <div className="w-20 h-1 bg-gold mx-auto rounded-full mb-4"></div>
          <p className="text-cream text-sm max-w-xs mx-auto">
            Exclusive access to world-class luxury services across all major global destinations
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-6 max-w-sm mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {/* Enhanced Service Cards */}
          <motion.div 
            className="bg-gradient-to-br from-cream/15 via-cream/10 to-cream/5 backdrop-blur-lg rounded-2xl p-6 border border-gold/20 shadow-2xl"
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gold/20 rounded-xl flex items-center justify-center">
                <Shield className="w-7 h-7 text-gold" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-cream text-base mb-1">Executive Security</h4>
                <p className="text-cream/80 text-sm leading-relaxed">Close protection, threat assessment, secure transport coordination</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-cream/15 via-cream/10 to-cream/5 backdrop-blur-lg rounded-2xl p-6 border border-gold/20 shadow-2xl"
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gold/20 rounded-xl flex items-center justify-center">
                <Car className="w-7 h-7 text-gold" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-cream text-base mb-1">Luxury Transportation</h4>
                <p className="text-cream/80 text-sm leading-relaxed">Private jets, armored vehicles, luxury yachts, executive helicopters</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-cream/15 via-cream/10 to-cream/5 backdrop-blur-lg rounded-2xl p-6 border border-gold/20 shadow-2xl"
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gold/20 rounded-xl flex items-center justify-center">
                <Users className="w-7 h-7 text-gold" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-cream text-base mb-1">Concierge Intelligence</h4>
                <p className="text-cream/80 text-sm leading-relaxed">Elite travel planning, exclusive access, personal shopping</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-cream/15 via-cream/10 to-cream/5 backdrop-blur-lg rounded-2xl p-6 border border-gold/20 shadow-2xl"
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gold/20 rounded-xl flex items-center justify-center">
                <Lock className="w-7 h-7 text-gold" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-cream text-base mb-1">Cloaking Technology</h4>
                <p className="text-cream/80 text-sm leading-relaxed">Identity protection, digital privacy, secure communications</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Elite Global Presence */}
      <div className="px-6 py-12 bg-gradient-to-b from-navy/95 to-navy">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center mb-4">
            <Globe className="w-6 h-6 text-gold mr-2" />
            <h3 className="text-2xl font-serif font-bold text-cream">Elite Global Network</h3>
          </div>
          <div className="w-16 h-1 bg-gold mx-auto rounded-full mb-4"></div>
          <p className="text-cream text-sm max-w-xs mx-auto">
            Premium operations across six exclusive destinations worldwide
          </p>
        </motion.div>

        <motion.div
          className="max-w-sm mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 gap-3 text-center">
            {[
              { city: "New York", desc: "Financial Capital" },
              { city: "Miami", desc: "Gateway to Americas" },
              { city: "Los Angeles", desc: "Entertainment Hub" },
              { city: "Punta Cana", desc: "Caribbean Paradise" },
              { city: "Malaga-Marbella", desc: "Costa del Sol" },
              { city: "La Romana", desc: "Casa de Campo" }
            ].map((location, index) => (
              <motion.div
                key={location.city}
                className="bg-cream/10 backdrop-blur-sm rounded-xl p-4 border border-cream/20 hover:border-gold/30 transition-all duration-300"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-semibold text-white text-base mb-1">{location.city}</div>
                    <div className="text-gold text-sm">{location.desc}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Elite Security Promise */}
      <div className="px-6 py-12 bg-gradient-to-b from-navy to-navy/90">
        <motion.div
          className="max-w-sm mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-br from-cream/15 via-cream/10 to-cream/5 backdrop-blur-lg rounded-3xl p-8 text-center border border-gold/20 shadow-2xl">
            <motion.div
              className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Lock className="w-8 h-8 text-gold" />
            </motion.div>
            <h4 className="font-serif text-xl font-bold text-cream mb-3">Elite Security Standard</h4>
            <p className="text-cream text-sm leading-relaxed mb-4">
              Military-grade encryption, biometric authentication, and quantum-secure communication 
              channels ensure absolute discretion for our distinguished clientele.
            </p>
            <div className="flex justify-center space-x-6 text-xs text-cream">
              <div className="text-center">
                <Star className="w-4 h-4 text-gold mx-auto mb-1" />
                <div>256-bit Encryption</div>
              </div>
              <div className="text-center">
                <Shield className="w-4 h-4 text-gold mx-auto mb-1" />
                <div>Zero-Log Policy</div>
              </div>
              <div className="text-center">
                <Lock className="w-4 h-4 text-gold mx-auto mb-1" />
                <div>Biometric Access</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Premium Footer */}
      <div className="bg-gradient-to-b from-navy/90 to-black px-6 py-12 border-t border-gold/10">
        <motion.div
          className="text-center max-w-sm mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Logo Footer */}
          <div className="flex items-center justify-center mb-6">
            <img 
              src={ylgLogo} 
              alt="YoLuxGo Logo" 
              className="w-12 h-12 mr-1 opacity-80"
            />
            <div className="text-left">
              <div className="font-serif text-lg font-bold text-cream">
                YoLuxGo<span className="text-gold text-sm align-super">™</span>
              </div>
              <div className="text-gold text-xs font-medium">Discreet Luxury</div>
            </div>
          </div>

          {/* Elite Status */}
          <div className="bg-gold/10 rounded-2xl p-4 mb-6 border border-gold/20">
            <div className="text-gold text-xs font-medium uppercase tracking-widest mb-2">Elite Mobile Platform</div>
            <div className="text-cream text-sm">
              Exclusive access to the world's most sophisticated luxury and security services
            </div>
          </div>

          {/* Copyright */}
          <div className="space-y-2">
            <p className="text-cream/70 text-sm">
              Powered by <span className="text-gold font-medium">Nebusis®</span>
            </p>
            <p className="text-cream/60 text-xs">
              © 2025 Nebusis Cloud Services, LLC
            </p>
            <div className="text-cream/50 text-xs">
              All rights reserved. Licensed security and transportation services.
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}