"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"

export interface Package {
  id: string
  _id?: string
  title: string
  subtitle: string
  description: string
  price: number
  duration: string
  photos: string
  features: string[]
  category: string
  popular: boolean
  image?: string
  color?: string
}

export interface PackagesContextType {
  packages: Package[]
  isLoading: boolean
  addPackage: (pkg: Omit<Package, "id">) => void
  updatePackage: (id: string, pkg: Partial<Package>) => void
  deletePackage: (id: string) => void
  getPackageById: (id: string) => Package | undefined
}

const PackagesContext = createContext<PackagesContextType | undefined>(undefined)

export const PackagesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [packages, setPackages] = useState<Package[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchPackages = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/packages")
      if (res.ok) {
        const data = await res.json()
        const formatted = data.map((p: any) => ({ ...p, id: p._id }))
        setPackages(formatted)
      }
    } catch (err) {
      console.error("Failed to fetch packages", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPackages()
  }, [fetchPackages])

  const addPackage = useCallback(async (pkg: Omit<Package, "id">) => {
    try {
      const res = await fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pkg),
      })
      if (res.ok) {
        fetchPackages() // Refresh list
      }
    } catch (err) {
      console.error("Failed to add package", err)
    }
  }, [fetchPackages])

  const updatePackage = useCallback(async (id: string, updates: Partial<Package>) => {
    try {
      const res = await fetch(`/api/packages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (res.ok) {
        fetchPackages()
      }
    } catch (err) {
      console.error("Failed to update package", err)
    }
  }, [fetchPackages])

  const deletePackage = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/packages/${id}`, { method: "DELETE" })
      if (res.ok) {
        setPackages((prev) => prev.filter((pkg) => pkg.id !== id))
      }
    } catch (err) {
      console.error("Failed to delete package", err)
    }
  }, [])

  const getPackageById = useCallback(
    (id: string) => {
      return packages.find((pkg) => pkg.id === id)
    },
    [packages],
  )

  const value: PackagesContextType = {
    packages,
    isLoading,
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
