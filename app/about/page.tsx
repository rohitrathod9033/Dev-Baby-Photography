"use client"

import { motion, type Variants } from "framer-motion"
import { Award, Heart, Star, Users, Target, Zap } from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  const values = [
    {
      icon: Heart,
      title: "Passion",
      description: "We pour our hearts into capturing every precious moment with care and dedication.",
    },
    {
      icon: Star,
      title: "Excellence",
      description: "Premium quality in every shot, every session, and every interaction with our families.",
    },
    {
      icon: Users,
      title: "Family First",
      description: "We believe in creating a comfortable, stress-free environment for you and your little ones.",
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Using the latest techniques and technology to deliver timeless, stunning photographs.",
    },
  ]

  const stats = [
    { number: "5000+", label: "Happy Families" },
    { number: "12+", label: "Years Experience" },
    { number: "25K+", label: "Precious Moments" },
    { number: "100%", label: "Satisfaction Rate" },
  ]

  const awards = [
    { year: "2023", title: "Best Family Portrait Studio" },
    { year: "2022", title: "Customer Choice Award" },
    { year: "2021", title: "Innovation in Photography" },
    { year: "2020", title: "Most Trusted Studio" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto text-center relative z-10"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            Our Story
          </span>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-6 leading-tight">
            Capturing Moments,
            <br />
            Creating Memories
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            For over a decade, Dev Baby has been dedicated to capturing the most precious moments of childhood with
            artistry, professionalism, and love.
          </p>
        </motion.div>
      </section>

      {/* Brand Story Section */}
      <section className="py-20 px-6 bg-card">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="container mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image Side */}
            <motion.div variants={itemVariants} className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary to-primary/50 overflow-hidden">
                <img
                  src="/placeholder.jpg?height=500&width=500&query=professional-photographer-with-camera"
                  alt="Our Studio"
                  className="w-full h-full object-cover"
                />
              </div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 4 }}
                className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl"
              />
            </motion.div>

            {/* Content Side */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div>
                <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Our Journey</h2>
                <p className="text-lg text-foreground/70 leading-relaxed mb-4">
                  What started as a passion project in 2012 has grown into the most trusted name in baby and family
                  photography. We've been honored to document thousands of precious moments—first smiles, tiny yawns,
                  and beautiful family gatherings.
                </p>
                <p className="text-lg text-foreground/70 leading-relaxed">
                  Our commitment to excellence, combined with our genuine love for working with families, has made us
                  the go-to studio for capturing life's most magical moments.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-background rounded-xl p-4 text-center"
                  >
                    <p className="text-3xl font-bold text-primary">{stat.number}</p>
                    <p className="text-sm text-foreground/60">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="container mx-auto"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl font-serif font-bold text-center text-foreground mb-16"
          >
            Mission & Vision
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Mission */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20 hover:border-primary/40 transition-colors"
            >
              <Target className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-serif font-bold text-foreground mb-4">Our Mission</h3>
              <p className="text-foreground/70 leading-relaxed">
                To create a warm, welcoming environment where families can be themselves while we capture their most
                authentic, beautiful moments. We aim to deliver not just photos, but treasured heirlooms that families
                will cherish for generations.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20 hover:border-primary/40 transition-colors"
            >
              <Award className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-2xl font-serif font-bold text-foreground mb-4">Our Vision</h3>
              <p className="text-foreground/70 leading-relaxed">
                To be the world's most trusted and beloved family photography studio, known for our artistic excellence,
                innovative approach, and genuine passion for celebrating life's milestones with every family we serve.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 px-6 bg-card">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="container mx-auto"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl font-serif font-bold text-center text-foreground mb-16"
          >
            Our Core Values
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="flex gap-6 p-6 rounded-xl border border-border hover:border-primary/40 transition-all duration-300 group"
                >
                  <div className="flex-shrink-0">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="w-12 h-12 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors"
                    >
                      <Icon className="w-6 h-6 text-primary" />
                    </motion.div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2">{value.title}</h3>
                    <p className="text-foreground/70 leading-relaxed">{value.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-20 px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="container mx-auto"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl font-serif font-bold text-center text-foreground mb-16"
          >
            Recognition & Awards
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-6">
            {awards.map((award, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-6 p-6 rounded-xl bg-gradient-to-r from-primary/5 to-transparent border border-border hover:border-primary/40 transition-all"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Star className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-primary font-semibold">{award.year}</p>
                  <p className="text-lg font-semibold text-foreground">{award.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-card">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="container mx-auto"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl font-serif font-bold text-center text-foreground mb-16"
          >
            What Families Say
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-background rounded-xl p-8 border border-border hover:border-primary/40 transition-colors"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="text-primary text-lg"
                    >
                      ★
                    </motion.span>
                  ))}
                </div>
                <p className="text-foreground/80 mb-4 leading-relaxed">
                  "Dev Baby Studio captured the most beautiful memories of our family. The team was so professional,
                  patient, and kind. We couldn't be happier with our photos!"
                </p>
                <p className="font-semibold text-foreground">The Johnson Family</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto text-center"
        >
          <h2 className="text-4xl font-serif font-bold text-foreground mb-6">Ready to Create Memories?</h2>
          <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
            Let's capture the precious moments that make your family story unique.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:shadow-lg transition-shadow"
          >
            Book Your Session Now
          </motion.button>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}

