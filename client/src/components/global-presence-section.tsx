import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import nycImage from "@assets/image_1753688153310.png";
import marbellaImage from "@assets/image_1753688919961.png";
import miamiImage from "@assets/image_1753688848302.png";
import puntaCanaImage from "@assets/image_1753688331028.png";
import losAngelesImage from "@assets/image_1753689004995.png";
import casaDeCampoImage from "@assets/image_1753749513908.png";

const stats = [
  { number: "6", label: "Pilot Cities" },
  { number: "24/7", label: "Support Ready" },
  { number: "3", label: "Continents" },
  { number: "5★", label: "Service Standard" }
];

const pilotCities = [
  { 
    name: "New York City", 
    country: "USA", 
    image: nycImage,
    description: "The financial capital of the world, where luxury meets sophistication"
  },
  { 
    name: "Málaga-Marbella", 
    country: "Spain", 
    image: marbellaImage,
    description: "European elegance on the Costa del Sol's golden shores"
  },
  { 
    name: "Miami", 
    country: "USA", 
    image: miamiImage,
    description: "Tropical luxury hub of international business and culture"
  },
  { 
    name: "Punta Cana", 
    country: "Dominican Republic", 
    image: puntaCanaImage,
    description: "Caribbean paradise for the most discerning clientele"
  },
  { 
    name: "Los Angeles", 
    country: "USA", 
    image: losAngelesImage,
    description: "Entertainment capital and gateway to the Pacific"
  },
  { 
    name: "La Romana - Casa de Campo", 
    country: "Dominican Republic", 
    image: casaDeCampoImage,
    description: "Exclusive luxury resort community for the world's elite"
  }
];

function LocationsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % pilotCities.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + pilotCities.length) % pilotCities.length);
  };

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      className="relative mb-16 overflow-hidden rounded-2xl shadow-2xl"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      {/* Main carousel container */}
      <div className="relative h-96 md:h-[500px]">
        {pilotCities.map((city, index) => (
          <motion.div
            key={city.name}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: index === currentIndex ? 1 : 0,
              scale: index === currentIndex ? 1 : 1.05
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <img
              src={city.image}
              alt={city.name}
              className="w-full h-full object-cover"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            
            {/* City information overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ 
                  y: index === currentIndex ? 0 : 30,
                  opacity: index === currentIndex ? 1 : 0
                }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className="font-serif text-3xl md:text-4xl font-light text-cream mb-2">
                  {city.name}
                </h3>
                <p className="text-gold text-lg font-medium mb-2">
                  {city.country}
                </p>
                <p className="text-white/90 text-base max-w-2xl font-light">
                  {city.description}
                </p>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 group"
        aria-label="Previous location"
      >
        <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 group"
        aria-label="Next location"
      >
        <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-3">
        {pilotCities.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? "bg-gold shadow-lg shadow-gold/50" 
                : "bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Go to ${pilotCities[index].name}`}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function GlobalPresenceSection() {
  return (
    <section id="global" className="py-20 bg-navy">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-4xl md:text-5xl font-light text-cream mb-6">
            Pilot Launch Cities
          </h2>
          <p className="text-white text-lg max-w-3xl mx-auto mb-12 font-medium">
            Experience discreet luxury services in our exclusive pilot locations. From the vibrant streets of NYC to the pristine beaches of Punta Cana, we're establishing presence in the world's most prestigious destinations.
          </p>
        </motion.div>

        {/* Pilot Cities Carousel */}
        <LocationsCarousel />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="p-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-gold text-3xl font-bold mb-2">{stat.number}</div>
              <div className="text-white text-sm uppercase tracking-wider font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* City Indicators */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-5 gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {pilotCities.map((location, index) => (
            <motion.div
              key={location.name}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center hover:bg-white/20 transition-all duration-300 cursor-pointer border border-white/20"
              whileHover={{ scale: 1.05, y: -5 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-gold text-lg font-serif font-medium mb-2">
                {location.name}
              </div>
              <div className="text-cream text-sm font-light tracking-wide">
                {location.country}
              </div>
              <div className="mt-3 w-8 h-0.5 bg-gold mx-auto"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Coming Soon Notice */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="bg-gold/10 border border-gold/30 rounded-lg p-6 max-w-2xl mx-auto">
            <div className="text-gold text-sm font-medium uppercase tracking-wider mb-2">
              Pre-Launch Phase
            </div>
            <p className="text-cream text-base">
              Services launching soon in these exclusive markets. Join our pre-launch network to be among the first to experience YoLuxGo<span className="text-gold text-xs align-super">™</span> in your city.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
