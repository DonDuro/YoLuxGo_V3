import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import primaryLogo from "@assets/New Primary YLG Transparent Logo_1753681153359.png";
import horizontalLogo from "@assets/image_1753681143925.png";
import { UserMenu } from "@/components/user-menu";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-navy/95 backdrop-blur-sm" : "bg-navy/95 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src={primaryLogo}
              alt="YoLuxGo™ - Discreet Luxury. Global Security." 
              className="h-6 sm:h-8 mr-1"
            />
            <span className="font-serif text-lg sm:text-xl text-white font-light">
              YoLuxGo<sup className="text-[0.4rem] ml-0.5 text-gold">™</sup>
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("services")}
              className="text-cream hover:text-gold transition-colors duration-300"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection("global")}
              className="text-cream hover:text-gold transition-colors duration-300"
            >
              Global Presence
            </button>
            <button
              onClick={() => scrollToSection("clientele")}
              className="text-cream hover:text-gold transition-colors duration-300"
            >
              Clientele
            </button>
            <button
              onClick={() => scrollToSection("mobile-app")}
              className="text-cream hover:text-gold transition-colors duration-300"
            >
              Mobile App
            </button>
            <UserMenu />
          </div>

          {/* Mobile Menu and User Menu */}
          <div className="md:hidden flex items-center space-x-4">
            <UserMenu />
            <button
              className="text-cream"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4 space-y-4"
          >
            <button
              onClick={() => scrollToSection("services")}
              className="block text-cream hover:text-gold transition-colors duration-300"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection("global")}
              className="block text-cream hover:text-gold transition-colors duration-300"
            >
              Global Presence
            </button>
            <button
              onClick={() => scrollToSection("clientele")}
              className="block text-cream hover:text-gold transition-colors duration-300"
            >
              Clientele
            </button>
            <button
              onClick={() => scrollToSection("mobile-app")}
              className="block text-cream hover:text-gold transition-colors duration-300"
            >
              Mobile App
            </button>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
