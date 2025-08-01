import { motion } from "framer-motion";
import LuxuryCarousel from "./luxury-carousel";

const features = [
  "Private, Cloaked Booking",
  "Elite Transportation & Residences",
  "Personal Security",
  "Global Access"
];

export default function LuxuryExperienceSection() {
  return (
    <section className="py-20 bg-navy">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl md:text-5xl font-light text-cream mb-6">
              More Than a Ride
            </h2>
            <p className="text-white text-lg mb-8 leading-relaxed font-medium">
              YoLuxGo<sup className="text-[0.5rem] ml-0.5 text-gold">™</sup> will connect you to premium residences, vetted agents, armored vehicles, and secure experiences—all tailored to your lifestyle.
            </p>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  className="flex items-center space-x-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-2 h-2 bg-gold rounded-full"></div>
                  <span className="text-white font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <LuxuryCarousel />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
