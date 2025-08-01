import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import tahoeImage from "@assets/image_1753672516868.png";
import securityGuardImage from "@assets/YLG Security Guard_1753674519958.png";
import villaImage from "@assets/Villa for YLG_1753675034059.png";

const LuxuryCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const carouselItems = [
    {
      id: 'vehicle',
      image: tahoeImage,
      title: 'Elite Transportation',
      subtitle: 'Armored luxury vehicles for secure transportation',
      description: 'Presidential-grade security features and luxury comfort'
    },
    {
      id: 'villa',
      image: villaImage,
      title: 'Luxury Accommodations',
      subtitle: 'Exclusive villas and secure properties worldwide',
      description: 'Private villa with 24/7 security and concierge services'
    },
    {
      id: 'security',
      image: securityGuardImage,
      title: 'Elite Security',
      subtitle: 'Professional protection teams with YoLuxGo™ certification',
      description: 'Trained security professionals maintaining discretion and excellence'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Auto-advance every 5 seconds

    return () => clearInterval(interval);
  }, [carouselItems.length]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? carouselItems.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === carouselItems.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative bg-navy rounded-lg overflow-hidden h-96 group shadow-2xl">
      {/* Main Carousel Container */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {/* Background Image */}
            <div className="relative w-full h-full">
              <img
                src={carouselItems[currentIndex].image}
                alt={carouselItems[currentIndex].description}
                className={`w-full h-full ${
                  carouselItems[currentIndex].id === 'vehicle' 
                    ? 'object-cover object-bottom scale-125' 
                    : 'object-cover'
                }`}
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>

            {/* YoLuxGo Brand Overlay */}
            <div className="absolute top-4 left-4">
              <span className="text-gold font-serif text-sm font-light">
                YoLuxGo<sup className="text-[0.4rem] ml-0.5">™</sup>
              </span>
            </div>

            {/* Service Badge */}
            <div className="absolute top-4 right-4">
              <span className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                {carouselItems[currentIndex].id === 'vehicle' ? 'Transportation' : 
                 carouselItems[currentIndex].id === 'villa' ? 'Accommodations' : 'Security'}
              </span>
            </div>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <h3 className="font-serif text-2xl font-light text-gold mb-2">
                  {carouselItems[currentIndex].title}
                </h3>
                <p className="text-lg font-medium mb-2">
                  {carouselItems[currentIndex].subtitle}
                </p>
                <p className="text-sm text-gray-300 max-w-2xl">
                  {carouselItems[currentIndex].description}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
        aria-label="Next image"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-gold scale-110' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default LuxuryCarousel;