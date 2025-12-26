"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { usePackages, type Package } from "@/contexts/packages-context"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

interface PackageFormProps {
  editingId?: string | null
  onSuccess?: () => void
}

const categories = ["Newborn", "1 Month", "6 Month", "1 Year", "Custom"]

const PackageForm: React.FC<PackageFormProps> = ({ editingId, onSuccess }) => {
  const { packages, addPackage, updatePackage, getPackageById } = usePackages()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    category: "Newborn",
    price: 0,
    duration: "",
    photos: "",
    popular: false,
    features: ["", "", "", ""],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  // Load existing package if editing
  useEffect(() => {
    if (editingId) {
      const existing = getPackageById(editingId)
      if (existing) {
        setFormData({
          title: existing.title,
          subtitle: existing.subtitle,
          description: existing.description,
          category: existing.category,
          price: existing.price,
          duration: existing.duration,
          photos: existing.photos,
          popular: existing.popular,
          features: [...existing.features, "", "", ""].slice(0, 6),
        })
      }
    }
  }, [editingId, getPackageById])

  const validateForm = () => {
    const newErrors: typeof errors = {}

    if (!formData.title) newErrors.title = "Title is required"
    if (!formData.subtitle) newErrors.subtitle = "Subtitle is required"
    if (!formData.description) newErrors.description = "Description is required"
    if (formData.price <= 0) newErrors.price = "Price must be greater than 0"
    if (!formData.duration) newErrors.duration = "Duration is required"
    if (!formData.photos) newErrors.photos = "Photos count is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const features = formData.features.filter((f) => f.trim())
      const packageData: Omit<Package, "id"> = {
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        category: formData.category,
        price: formData.price,
        duration: formData.duration,
        photos: formData.photos,
        popular: formData.popular,
        features,
      }

      if (editingId) {
        updatePackage(editingId, packageData)
        toast({
          title: "Success",
          description: "Package updated successfully!",
        })
      } else {
        addPackage(packageData)
        toast({
          title: "Success",
          description: "Package added successfully!",
        })
      }

      if (onSuccess) onSuccess()
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors({ ...errors, [field]: undefined })
  }

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = value
    setFormData((prev) => ({ ...prev, features: newFeatures }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Package Title *</label>
          <Input
            type="text"
            placeholder="e.g., Newborn Baby"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            disabled={isLoading}
          />
          {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
        </div>

        {/* Subtitle */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Subtitle *</label>
          <Input
            type="text"
            placeholder="e.g., 0-14 days old"
            value={formData.subtitle}
            onChange={(e) => handleChange("subtitle", e.target.value)}
            disabled={isLoading}
          />
          {errors.subtitle && <p className="text-xs text-destructive">{errors.subtitle}</p>}
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Category *</label>
          <select
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoading}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Price (USD) *</label>
          <Input
            type="number"
            placeholder="299"
            value={formData.price || ""}
            onChange={(e) => handleChange("price", Number.parseFloat(e.target.value) || 0)}
            disabled={isLoading}
          />
          {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Duration *</label>
          <Input
            type="text"
            placeholder="e.g., 2-3 hours"
            value={formData.duration}
            onChange={(e) => handleChange("duration", e.target.value)}
            disabled={isLoading}
          />
          {errors.duration && <p className="text-xs text-destructive">{errors.duration}</p>}
        </div>

        {/* Photos */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Number of Photos *</label>
          <Input
            type="text"
            placeholder="e.g., 20+"
            value={formData.photos}
            onChange={(e) => handleChange("photos", e.target.value)}
            disabled={isLoading}
          />
          {errors.photos && <p className="text-xs text-destructive">{errors.photos}</p>}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">Description *</label>
        <textarea
          placeholder="Describe your photography package..."
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-vertical min-h-24"
          disabled={isLoading}
        />
        {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
      </div>

      {/* Features */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">Features (up to 6)</label>
        <div className="space-y-2">
          {formData.features.map((feature, index) => (
            <Input
              key={index}
              type="text"
              placeholder={`Feature ${index + 1}`}
              value={feature}
              onChange={(e) => handleFeatureChange(index, e.target.value)}
              disabled={isLoading}
            />
          ))}
        </div>
      </div>

      {/* Popular Checkbox */}
      <div className="flex items-center gap-3">
        <Checkbox
          id="popular"
          checked={formData.popular}
          onCheckedChange={(checked) => handleChange("popular", checked)}
          disabled={isLoading}
        />
        <label htmlFor="popular" className="text-sm font-medium text-foreground cursor-pointer">
          Mark as popular package
        </label>
      </div>

      {/* Submit Button */}
      <div className="flex gap-3 pt-4">
        <motion.button
          type="submit"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          disabled={isLoading}
          className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-all"
        >
          {isLoading ? "Saving..." : editingId ? "Update Package" : "Add Package"}
        </motion.button>
      </div>
    </form>
  )
}

export default PackageForm
