import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Camera, Heart, Star, Clock, Palette, Gift } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Camera,
    title: "Newborn Sessions",
    description:
      "Capture those precious first days with our specialized newborn photography sessions.",
    color: "bg-blush",
  },
  {
    icon: Heart,
    title: "Milestone Moments",
    description:
      "From first smiles to first steps, we document every beautiful milestone.",
    color: "bg-lavender",
  },
  {
    icon: Star,
    title: "Premium Editing",
    description:
      "Each photo is professionally edited to bring out the natural beauty of your little one.",
    color: "bg-baby-blue",
  },
  {
    icon: Clock,
    title: "Flexible Scheduling",
    description:
      "We work around your baby's schedule for the most natural, happy moments.",
    color: "bg-cream",
  },
  {
    icon: Palette,
    title: "Custom Props & Themes",
    description:
      "Choose from our collection of adorable props and themes for a unique session.",
    color: "bg-accent",
  },
  {
    icon: Gift,
    title: "Print Packages",
    description:
      "Beautiful prints, albums, and digital packages to treasure forever.",
    color: "bg-secondary",
  },
];

const Services = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-padding bg-gradient-to-b from-background to-secondary/30" ref={ref}>
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
            Our Services
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
            Capturing Every{" "}
            <span className="text-primary italic">Precious Moment</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            We specialize in creating timeless portraits that celebrate the beauty
            of your growing family.
          </p>
        </motion.div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="soft-card p-6 lg:p-8 h-full group cursor-pointer"
              >
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-14 h-14 ${service.color} rounded-2xl flex items-center justify-center mb-5 group-hover:shadow-soft transition-shadow`}
                >
                  <service.icon className="w-7 h-7 text-foreground/80" />
                </motion.div>

                {/* Content */}
                <h3 className="font-serif text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>

                {/* Hover Arrow */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className="mt-4 text-primary font-medium flex items-center gap-2"
                >
                  Learn more →
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <Link to="/packages">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary"
            >
              View All Packages
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
