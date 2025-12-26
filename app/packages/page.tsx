"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Check, Clock, ImageIcon, ArrowRight, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import type { IPackage } from "@/models/Package"

export default function PackagesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [packages, setPackages] = useState<IPackage[]>([])
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPackagesAndUser = async () => {
      try {
        const packagesRes = await fetch("/api/packages")
        if (packagesRes.ok) {
          const data = await packagesRes.json()
          setPackages(data.packages)
        }

        const userRes = await fetch("/api/auth/me")
        if (userRes.ok) {
          const userData = await userRes.json()
          setUser(userData.user)
        }
      } catch (error) {
        console.error("[v0] Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPackagesAndUser()
  }, [])

  const handleBooking = (packageId: string, packageTitle: string) => {
    if (!user) {
      router.push("/login")
      return
    }

    toast({
      title: "Booking Request Received",
      description: `${packageTitle} booking request submitted. We'll contact you shortly to confirm details.`,
    })
  }

  return (
    <main className="min-h-screen bg-background">
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
            <div className="text-center py-12">Loading packages...</div>
          ) : packages.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No packages available</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
              {packages.map((pkg, index) => (
                <motion.div
                  key={pkg._id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.4 }}
                    className="soft-card overflow-hidden"
                  >
                    {/* Image */}
                    <div className="image-hover h-64 md:h-72 bg-secondary">
                      {pkg.images && pkg.images.length > 0 ? (
                        <img
                          src={pkg.images[0] || "/placeholder.svg"}
                          alt={pkg.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          No image available
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 lg:p-8">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-serif text-2xl font-semibold text-foreground">{pkg.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{pkg.category}</p>
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
                          {pkg.duration} {pkg.durationUnit}
                        </div>
                        {pkg.features && (
                          <div className="flex items-center gap-2 text-foreground">
                            <ImageIcon className="w-4 h-4 text-primary" />
                            {pkg.features.length} features
                          </div>
                        )}
                      </div>

                      {/* Features */}
                      <ul className="space-y-3 mb-8">
                        {pkg.features &&
                          pkg.features.slice(0, 4).map((feature, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-foreground">
                              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Check className="w-3 h-3 text-primary" />
                              </div>
                              {feature}
                            </li>
                          ))}
                      </ul>

                      {/* CTA Button */}
                      <Button
                        onClick={() => handleBooking(pkg._id?.toString() || "", pkg.name)}
                        className="w-full"
                        size="lg"
                      >
                        {user ? (
                          <>
                            Book This Package
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 mr-2" />
                            Sign In to Book
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
