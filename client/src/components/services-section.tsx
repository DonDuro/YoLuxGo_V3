import { motion } from "framer-motion";
import { UserCheck, Car, Shield, Bell } from "lucide-react";

const services = [
  {
    icon: UserCheck,
    title: "Cloaking Technology",
    description: "Control what others see. Cloak your name, location, companions, and itinerary with one tap."
  },
  {
    icon: Car,
    title: "Elite Transportation",
    description: "Armored vehicles, private jets, and luxury accommodations tailored to your security requirements."
  },
  {
    icon: Shield,
    title: "Personal Security",
    description: "Vetted security agents, decoy options, and panic modes for complete protection."
  },
  {
    icon: Bell,
    title: "Concierge Intelligence",
    description: "Lifestyle managers, security liaisons, and legal travel clearance worldwide."
  }
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-cream">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-4xl md:text-5xl font-light text-navy mb-6">
            Designed for the World's Most Watched
          </h2>
          <p className="text-gray-800 text-lg max-w-3xl mx-auto font-medium">
            Your peace of mind will be our protocol. Whether it's a high-profile appearance or a silent escape, we're building the infrastructure to move you safely and elegantly.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className="group bg-white p-8 hover:bg-navy transition-all duration-500 hover:shadow-2xl cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-navy group-hover:bg-gold rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300">
                  <service.icon className="text-gold group-hover:text-navy w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl font-medium text-navy group-hover:text-cream mb-4 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-800 font-medium group-hover:text-cream text-sm leading-relaxed transition-all duration-300">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
