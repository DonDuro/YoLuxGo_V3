import { motion } from "framer-motion";
import { Star, Briefcase, Crown, Globe, Gem } from "lucide-react";

const clientTypes = [
  {
    icon: Star,
    title: "Celebrities",
    description: "Spotlight discretion"
  },
  {
    icon: Briefcase,
    title: "Executives",
    description: "Corporate confidentiality"
  },
  {
    icon: Crown,
    title: "Royals",
    description: "Regal privacy"
  },
  {
    icon: Globe,
    title: "Diplomats",
    description: "Strategic security"
  },
  {
    icon: Gem,
    title: "Billionaire Families",
    description: "Legacy protection"
  }
];

export default function ClienteleSection() {
  return (
    <section id="clientele" className="py-20 bg-cream">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-4xl md:text-5xl font-light text-navy mb-6">
            Built for the Invisible Elite
          </h2>
          <p className="text-gray-800 text-lg max-w-3xl mx-auto font-medium">
            Designed for those who cannot afford to be seen, but refuse to compromise on luxury.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-8 text-center">
          {clientTypes.map((client, index) => (
            <motion.div
              key={client.title}
              className="group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="w-20 h-20 bg-navy group-hover:bg-gold rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300">
                <client.icon className="text-gold group-hover:text-navy w-8 h-8" />
              </div>
              <h3 className="font-serif text-lg font-medium text-navy mb-2">
                {client.title}
              </h3>
              <p className="text-gray-700 text-sm font-medium">{client.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
