import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface HeroSectionProps {
  onJoinNetwork: () => void;
}

export default function HeroSection({ onJoinNetwork }: HeroSectionProps) {
  const scrollToNext = () => {
    const element = document.getElementById("services");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="hero-gradient min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Abstract globe background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 border border-gold rounded-full animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 border border-gold rounded-full animate-float-delayed"></div>
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 border border-gold rounded-full animate-float-delayed-2"></div>
      </div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img 
              src="/attached_assets/New Primary YLG Transparent Logo_1753681153359.png" 
              alt="" 
              className="h-16 md:h-20 max-w-full"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1 className="font-serif text-3xl md:text-5xl font-light text-white mb-4">
              YoLuxGo<sup className="text-[0.6rem] ml-1 text-gold">™</sup>
            </h1>
          </motion.div>
          
          <motion.div
            className="gold-shimmer bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="font-serif text-2xl md:text-4xl font-normal mb-8">
              Discreet Luxury. Global Security.
            </h2>
          </motion.div>
          
          <motion.p
            className="text-white text-lg md:text-xl max-w-2xl mx-auto mb-12 font-normal leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Your invisible pathway through the visible world. Coming soon. Experience unparalleled discretion and security in every journey.
          </motion.p>
          
          <motion.button
            className="bg-gold text-navy px-8 py-4 font-medium text-lg hover:bg-gold/90 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onJoinNetwork}
          >
            Join the Private Network
          </motion.button>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        onClick={scrollToNext}
      >
        <ChevronDown className="text-gold text-xl" />
      </motion.div>
    </section>
  );
}
