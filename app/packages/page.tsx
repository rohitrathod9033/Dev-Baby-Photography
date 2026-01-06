"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Check, Clock, Camera, ImageIcon, Sparkles, ArrowRight, Lock } from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { useAuth } from "@/contexts/auth-context"
import { usePackages } from "@/contexts/packages-context"
import { useToast } from "@/hooks/use-toast"
import Script from "next/script"

export default function PackagesPage() {
  const router = useRouter()
  const { user } = useAuth()
  console.log("PackagesPage User State:", user)
  const { packages, isLoading } = usePackages()
  const { toast } = useToast()

  const handleBooking = async (pkg: any) => {
    try {
      toast({
        title: "Processing Booking",
        description: "Please wait while we set up the payment...",
      })

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          packageId: pkg.id,
          title: pkg.title,
          price: pkg.price,
          image: pkg.image,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create order")
      }

      const orderData = await response.json()

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Dev Baby Photography",
        description: `Booking for ${pkg.title}`,
        image: pkg.image,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // Verify Payment
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: orderData.bookingId
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.status === "success") {
              toast({
                title: "Payment Successful",
                description: "Your booking has been confirmed!",
              });
              router.push("/success");
            } else {
              toast({
                title: "Payment Verification Failed",
                description: verifyData.error || "Please contact support.",
                variant: "destructive",
              });
            }
          } catch (err) {
            toast({
              title: "Verification Error",
              description: "Something went wrong verifying the payment.",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error("Booking error:", error)
      toast({
        title: "Booking Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-gradient-to-b from-cream via-background to-secondary/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
              Photography Packages
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
              Choose Your <span className="text-primary italic">Perfect Package</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">
              From newborn sessions to first birthday celebrations, we have the perfect package for every milestone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                <p className="text-muted-foreground animate-pulse">Loading packages...</p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
              {packages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.4 }}
                    className={`soft-card overflow-hidden relative ${pkg.popular ? "ring-2 ring-primary" : ""}`}
                  >
                    {/* Popular Badge */}
                    {pkg.popular && (
                      <div className="absolute top-4 right-4 z-10">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                          <Sparkles className="w-3 h-3" />
                          Most Popular
                        </span>
                      </div>
                    )}

                    {/* Image */}
                    <div className="image-hover h-64 md:h-72">
                      <img src={pkg.image || "/placeholder.svg"} alt={pkg.title} className="w-full h-full object-cover" />
                      <div className={`absolute inset-0 bg-gradient-to-t ${pkg.color} opacity-20`} />
                    </div>

                    {/* Content */}
                    <div className="p-6 lg:p-8">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-serif text-2xl font-semibold text-foreground">{pkg.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{pkg.subtitle}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-serif font-bold text-primary">${pkg.price}</div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-muted-foreground mb-6 leading-relaxed">{pkg.description}</p>

                      {/* Quick Info */}
                      <div className="flex items-center gap-6 mb-6 text-sm">
                        <div className="flex items-center gap-2 text-foreground">
                          <Clock className="w-4 h-4 text-primary" />
                          {pkg.duration}
                        </div>
                        <div className="flex items-center gap-2 text-foreground">
                          <ImageIcon className="w-4 h-4 text-primary" />
                          {pkg.photos} photos
                        </div>
                      </div>

                      {/* Features */}
                      <ul className="space-y-3 mb-8">
                        {pkg.features.slice(0, 4).map((feature, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm text-foreground">
                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Check className="w-3 h-3 text-primary" />
                            </div>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      {/* CTA Button */}
                      {!user ? (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => router.push("/login")}
                          className={`w-full py-4 rounded-full font-medium flex items-center justify-center gap-2 transition-all duration-300 group ${pkg.popular ? "btn-primary" : "btn-secondary"
                            }`}
                        >
                          <Lock className="w-4 h-4" />
                          Sign In to Book
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            console.log("Book package clicked", pkg)
                            handleBooking(pkg)
                          }}
                          className={`w-full py-4 rounded-full font-medium flex items-center justify-center gap-2 transition-all duration-300 group relative z-20 cursor-pointer ${pkg.popular ? "btn-primary" : "btn-secondary"
                            }`}
                        >
                          Book This Package
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h3 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-4">
              Need a Custom Package?
            </h3>
            <p className="text-muted-foreground mb-6">
              We offer customized photography packages tailored to your specific needs. Contact us to discuss your
              vision and get a personalized quote.
            </p>
            <motion.a
              href="mailto:hello@devbaby.com"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Camera className="w-5 h-5" />
              Get Custom Quote
            </motion.a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </motion.div>
  )
}

