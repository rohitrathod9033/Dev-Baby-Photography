"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

export interface Package {
  id: string
  title: string
  subtitle: string
  description: string
  price: number
  duration: string
  photos: string
  features: string[]
  category: string
  popular: boolean
}

export interface PackagesContextType {
  packages: Package[]
  addPackage: (pkg: Omit<Package, "id">) => void
  updatePackage: (id: string, pkg: Partial<Package>) => void
  deletePackage: (id: string) => void
  getPackageById: (id: string) => Package | undefined
}

const PackagesContext = createContext<PackagesContextType | undefined>(undefined)

const defaultPackages: Package[] = [
  {
    id: "newborn",
    title: "Newborn Baby",
    subtitle: "0-14 days old",
    description:
      "Capture the delicate beauty of your newborn in their first days of life with our specialized newborn session.",
    price: 299,
    duration: "2-3 hours",
    photos: "20+",
    features: [
      "Professional studio session",
      "20+ fully edited digital images",
      "Multiple outfit changes",
      "Props & accessories included",
      "Parent & sibling shots",
      "Online gallery access",
    ],
    category: "Newborn",
    popular: false,
  },
  {
    id: "one-month",
    title: "1 Month Baby",
    subtitle: "30 days celebration",
    description:
      "Celebrate your baby's first month milestone with a beautiful session capturing their growing personality.",
    price: 349,
    duration: "1.5-2 hours",
    photos: "25+",
    features: [
      "Studio or in-home session",
      "25+ fully edited digital images",
      "Theme customization",
      "Props & outfits provided",
      "Family group photos",
      "Print-ready files",
    ],
    category: "1 Month",
    popular: true,
  },
  {
    id: "six-month",
    title: "6 Month Baby",
    subtitle: "Sitting & smiling",
    description:
      "At six months, babies are full of expression! Capture their sitting milestone and infectious giggles.",
    price: 399,
    duration: "1.5-2 hours",
    photos: "30+",
    features: [
      "Interactive playful session",
      "30+ fully edited digital images",
      "Multiple themed setups",
      "All props included",
      "Outdoor option available",
      "Social media ready files",
    ],
    category: "6 Month",
    popular: false,
  },
  {
    id: "one-year",
    title: "1 Year Birthday",
    subtitle: "Cake smash celebration",
    description:
      "Celebrate their first birthday with our signature cake smash session - messy, fun, and absolutely adorable!",
    price: 449,
    duration: "2-2.5 hours",
    photos: "40+",
    features: [
      "Custom cake smash setup",
      "40+ fully edited digital images",
      "Before, during & after shots",
      "Cake & decorations included",
      "Balloon garland setup",
      "Outfit & cleanup time",
    ],
    category: "1 Year",
    popular: false,
  },
]

export const PackagesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [packages, setPackages] = useState<Package[]>(defaultPackages)

  const addPackage = useCallback((pkg: Omit<Package, "id">) => {
    const newPackage: Package = {
      ...pkg,
      id: Date.now().toString(),
    }
    setPackages((prev) => [...prev, newPackage])
  }, [])

  const updatePackage = useCallback((id: string, updates: Partial<Package>) => {
    setPackages((prev) => prev.map((pkg) => (pkg.id === id ? { ...pkg, ...updates } : pkg)))
  }, [])

  const deletePackage = useCallback((id: string) => {
    setPackages((prev) => prev.filter((pkg) => pkg.id !== id))
  }, [])

  const getPackageById = useCallback(
    (id: string) => {
      return packages.find((pkg) => pkg.id === id)
    },
    [packages],
  )

  const value: PackagesContextType = {
    packages,
    addPackage,
    updatePackage,
    deletePackage,
    getPackageById,
  }

  return <PackagesContext.Provider value={value}>{children}</PackagesContext.Provider>
}

export const usePackages = () => {
  const context = useContext(PackagesContext)
  if (context === undefined) {
    throw new Error("usePackages must be used within a PackagesProvider")
  }
  return context
}
