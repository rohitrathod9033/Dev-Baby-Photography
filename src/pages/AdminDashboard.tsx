"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Plus, Trash2, Edit2, LogOut, PackageIcon, LayoutDashboard } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { usePackages } from "@/contexts/packages-context"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import PackageForm from "@/components/PackageForm"

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { packages, deletePackage } = usePackages()
  const { toast } = useToast()

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/admin-login")
    }
  }, [user, navigate])

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
    navigate("/")
  }

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      deletePackage(id)
      toast({
        title: "Deleted",
        description: "Package has been deleted successfully.",
      })
    }
  }

  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="p-2 bg-primary/10 rounded-lg">
              <LayoutDashboard className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">Manage your photography packages</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-4"
          >
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.role}</p>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm" className="gap-2 bg-transparent">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-card rounded-lg p-6 border border-border">
            <p className="text-muted-foreground text-sm mb-2">Total Packages</p>
            <p className="font-serif text-4xl font-bold text-foreground">{packages.length}</p>
          </div>
          <div className="bg-card rounded-lg p-6 border border-border">
            <p className="text-muted-foreground text-sm mb-2">Popular Packages</p>
            <p className="font-serif text-4xl font-bold text-primary">{packages.filter((p) => p.popular).length}</p>
          </div>
          <div className="bg-card rounded-lg p-6 border border-border">
            <p className="text-muted-foreground text-sm mb-2">Average Price</p>
            <p className="font-serif text-4xl font-bold text-foreground">
              ${Math.round(packages.reduce((sum, p) => sum + p.price, 0) / packages.length || 0)}
            </p>
          </div>
          <div className="bg-card rounded-lg p-6 border border-border">
            <p className="text-muted-foreground text-sm mb-2">Total Revenue</p>
            <p className="font-serif text-4xl font-bold text-foreground">
              ${packages.reduce((sum, p) => sum + p.price, 0)}
            </p>
          </div>
        </motion.div>

        {/* Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <Input
            type="text"
            placeholder="Search packages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={() => {
              setEditingId(null)
              setShowForm(!showForm)
            }}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            {showForm ? "Cancel" : "Add Package"}
          </Button>
        </motion.div>

        {/* Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-lg border border-border p-8 mb-8"
          >
            <PackageForm
              editingId={editingId}
              onSuccess={() => {
                setShowForm(false)
                setEditingId(null)
              }}
            />
          </motion.div>
        )}

        {/* Packages Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-lg border border-border overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-foreground">Package</th>
                  <th className="text-left px-6 py-4 font-semibold text-foreground">Category</th>
                  <th className="text-left px-6 py-4 font-semibold text-foreground">Price</th>
                  <th className="text-left px-6 py-4 font-semibold text-foreground">Duration</th>
                  <th className="text-left px-6 py-4 font-semibold text-foreground">Popular</th>
                  <th className="text-left px-6 py-4 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPackages.length > 0 ? (
                  filteredPackages.map((pkg) => (
                    <motion.tr
                      key={pkg.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-border hover:bg-secondary/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-foreground">{pkg.title}</p>
                          <p className="text-xs text-muted-foreground">{pkg.subtitle}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">{pkg.category}</td>
                      <td className="px-6 py-4 font-semibold text-primary">${pkg.price}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{pkg.duration}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            pkg.popular ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          {pkg.popular ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingId(pkg.id)
                              setShowForm(true)
                            }}
                            className="gap-1"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(pkg.id)}
                            className="gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <PackageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                      <p className="text-muted-foreground">No packages found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default AdminDashboard
