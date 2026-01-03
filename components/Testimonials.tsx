import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Mother of twins",
    content:
      "The photos captured by Dev Baby Photography are absolutely magical. They perfectly captured the innocence and beauty of my newborn twins. I couldn't be happier!",
    rating: 5,
    avatar: "S",
  },
  {
    name: "Emily Chen",
    role: "First-time mom",
    content:
      "From booking to receiving the final images, the experience was seamless. The photographer was so patient and gentle with my baby. The results exceeded all my expectations!",
    rating: 5,
    avatar: "E",
  },
  {
    name: "Jessica Williams",
    role: "Mother of three",
    content:
      "We've been coming back for all three of our children's milestone sessions. The quality and creativity never disappoints. These photos are treasures we'll keep forever.",
    rating: 5,
    avatar: "J",
  },
  {
    name: "Amanda Rodriguez",
    role: "New parent",
    content:
      "The cake smash session for my son's first birthday was so much fun! The photos are colorful, joyful, and capture his personality perfectly. Highly recommend!",
    rating: 5,
    avatar: "A",
  },
];

const Testimonials = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section
      ref={ref}
      className="section-padding bg-gradient-to-b from-secondary/30 via-lavender/20 to-background overflow-hidden"
    >
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
            What <span className="text-primary italic">Parents Say</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Hear from families who trusted us to capture their precious memories.
          </p>
        </motion.div>

        {/* Testimonial Slider */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-4xl mx-auto"
        >
          {/* Main Card */}
          <div className="glass-card p-8 md:p-12 relative">
            {/* Quote Icon */}
            <div className="absolute top-6 left-6 md:top-8 md:left-8">
              <Quote className="w-10 h-10 md:w-12 md:h-12 text-primary/30" />
            </div>

            {/* Content */}
            <div className="pt-8">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                {/* Stars */}
                <div className="flex items-center gap-1 mb-6 justify-center">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <span key={i} className="text-gold text-xl">
                      ★
                    </span>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-lg md:text-xl lg:text-2xl text-foreground text-center leading-relaxed mb-8 font-serif italic">
                  "{testimonials[currentIndex].content}"
                </p>

                {/* Author */}
                <div className="flex items-center justify-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-xl">
                    {testimonials[currentIndex].avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonials[currentIndex].name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonials[currentIndex].role}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 pointer-events-none">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={goToPrevious}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-card shadow-soft flex items-center justify-center text-foreground hover:bg-accent transition-colors pointer-events-auto -translate-x-1/2"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={goToNext}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-card shadow-soft flex items-center justify-center text-foreground hover:bg-accent transition-colors pointer-events-auto translate-x-1/2"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentIndex(index);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                    ? "bg-primary w-8"
                    : "bg-muted hover:bg-muted-foreground/50"
                  }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
