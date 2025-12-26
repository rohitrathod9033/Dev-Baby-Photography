"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Edit2, Trash2, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import type { IPackage } from "@/models/Package"

export default function AdminDashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [packages, setPackages] = useState<IPackage[]>([])
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    duration: "",
    durationUnit: "hours",
    features: "",
  })

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        const userRes = await fetch("/api/auth/me")
        if (!userRes.ok) {
          router.push("/admin/login")
          return
        }

        const userData = await userRes.json()
        if (userData.user.role !== "admin") {
          router.push("/")
          return
        }

        setUser(userData.user)

        const packagesRes = await fetch("/api/packages")
        if (packagesRes.ok) {
          const data = await packagesRes.json()
          setPackages(data.packages)
        }
      } catch (error) {
        console.error("[v0] Error:", error)
        router.push("/admin/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthAndFetchData()
  }, [router])

  const handleAddPackage = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number.parseFloat(formData.price),
          duration: Number.parseInt(formData.duration),
          features: formData.features.split("\n").filter((f) => f.trim()),
        }),
      })

      if (!response.ok) throw new Error("Failed to create package")

      const data = await response.json()
      setPackages([...packages, data.package])
      setFormData({
        name: "",
        category: "",
        description: "",
        price: "",
        duration: "",
        durationUnit: "hours",
        features: "",
      })
      setShowForm(false)

      toast({
        title: "Success",
        description: "Package created successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create package",
        variant: "destructive",
      })
    }
  }

  const handleDeletePackage = async (id: string) => {
    try {
      const response = await fetch(`/api/packages/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete package")

      setPackages(packages.filter((p) => p._id?.toString() !== id))
      toast({
        title: "Success",
        description: "Package deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete package",
        variant: "destructive",
      })
    }
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/")
  }

  if (isLoading) return <div className="p-8">Loading...</div>

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="font-serif text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.name}</span>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="text-sm text-muted-foreground">Total Packages</div>
            <div className="text-3xl font-bold">{packages.length}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground">Average Price</div>
            <div className="text-3xl font-bold">
              ${packages.length > 0 ? (packages.reduce((sum, p) => sum + p.price, 0) / packages.length).toFixed(0) : 0}
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground">Total Revenue</div>
            <div className="text-3xl font-bold">${packages.reduce((sum, p) => sum + p.price, 0).toFixed(0)}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-muted-foreground">Popular Package</div>
            <div className="text-lg font-bold">{packages[0]?.name || "N/A"}</div>
          </Card>
        </div>

        {/* Add Package Section */}
        <Card className="mb-8">
          <div className="p-6">
            {!showForm ? (
              <Button onClick={() => setShowForm(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Package
              </Button>
            ) : (
              <form onSubmit={handleAddPackage} className="space-y-4">
                <h3 className="font-serif text-xl font-bold">Add New Package</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Package Name</label>
                    <Input
                      type="text"
                      placeholder="e.g., Newborn Package"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <Input
                      type="text"
                      placeholder="e.g., Newborn"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Price</label>
                    <Input
                      type="number"
                      placeholder="500"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Duration</label>
                    <Input
                      type="number"
                      placeholder="2"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    placeholder="Package description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Features (one per line)</label>
                  <textarea
                    placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows={3}
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit">Create Package</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        </Card>

        {/* Packages List */}
        <div className="space-y-4">
          <h3 className="font-serif text-xl font-bold">Packages</h3>
          {packages.length === 0 ? (
            <p className="text-muted-foreground">No packages yet</p>
          ) : (
            packages.map((pkg) => (
              <Card key={pkg._id?.toString()} className="p-6 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{pkg.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    ${pkg.price} • {pkg.duration} {pkg.durationUnit}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeletePackage(pkg._id?.toString() || "")}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </main>
  )
}
