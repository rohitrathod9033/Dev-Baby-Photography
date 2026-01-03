"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Plus, Trash2, Edit2, LogOut, PackageIcon, LayoutDashboard } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { usePackages } from "@/contexts/packages-context"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import PackageForm from "@/components/PackageForm"
import GalleryForm from "@/components/GalleryForm"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function AdminDashboardPage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { packages, deletePackage } = usePackages()
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState("packages")
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const [users, setUsers] = useState<any[]>([])
  const [queries, setQueries] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [galleryItems, setGalleryItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/admin-login")
    }
  }, [user, router])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        if (activeTab === "users") {
          const res = await fetch("/api/admin/users")
          if (res.ok) setUsers(await res.json())
        } else if (activeTab === "queries") {
          const res = await fetch("/api/admin/contacts")
          if (res.ok) setQueries(await res.json())
        } else if (activeTab === "bookings") {
          const res = await fetch("/api/admin/bookings")
          if (res.ok) setBookings(await res.json())
        } else if (activeTab === "gallery") {
          const res = await fetch("/api/gallery")
          if (res.ok) setGalleryItems(await res.json())
        }
      } catch (error) {
        console.error("Failed to fetch data", error)
        toast({ title: "Error", description: "Failed to fetch data", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }

    if (activeTab !== "packages") {
      fetchData()
    }
  }, [activeTab, toast])

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    } as any)
    router.push("/")
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
        <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-start"
          >
            <div className="p-2 bg-primary/10 rounded-lg">
              <LayoutDashboard className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">Manage your photography business</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-end border-t md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0 border-border/50"
          >
            <div className="text-center md:text-right">
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

        {/* Tabs Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-1">
          {["packages", "users", "queries", "bookings", "gallery"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium capitalize text-sm transition-colors relative ${activeTab === tab
                ? "text-primary border-b-2 border-primary -mb-1.5"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {tab === "bookings" ? "Payments / Bookings" : tab}
            </button>
          ))}
        </div>

        {/* Packages Tab */}
        {activeTab === "packages" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <div className="bg-card rounded-lg p-6 border border-border">
                <p className="text-muted-foreground text-sm mb-2">Total Packages</p>
                <p className="font-serif text-4xl font-bold text-foreground">{packages.length}</p>
              </div>
              <div className="bg-card rounded-lg p-6 border border-border">
                <p className="text-muted-foreground text-sm mb-2">Popular Packages</p>
                <p className="font-serif text-4xl font-bold text-primary">{packages.filter((p) => p.popular).length}</p>
              </div>
              {/* Removed Revenue as it depends on bookings */}
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
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
            </div>

            {/* Form */}
            {showForm && (
              <div className="bg-card rounded-lg border border-border p-8 mb-8">
                <PackageForm
                  editingId={editingId}
                  onSuccess={() => {
                    setShowForm(false)
                    setEditingId(null)
                  }}
                />
              </div>
            )}

            {/* Packages Table */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
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
                        <tr key={pkg.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
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
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${pkg.popular ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                              {pkg.popular ? "Yes" : "No"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => { setEditingId(pkg.id); setShowForm(true); }} className="gap-1">
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDelete(pkg.id)} className="gap-1">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center"><p className="text-muted-foreground">No packages found</p></td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-xl font-bold mb-4 font-serif">Registered Users</h2>
            {loading ? <LoadingSpinner message="Loading users..." size="md" /> : (
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-secondary/50 border-b border-border">
                    <tr>
                      <th className="text-left px-6 py-4 font-semibold text-foreground">Name</th>
                      <th className="text-left px-6 py-4 font-semibold text-foreground">Email</th>
                      <th className="text-left px-6 py-4 font-semibold text-foreground">Role</th>
                      <th className="text-left px-6 py-4 font-semibold text-foreground">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u: any) => (
                      <tr key={u._id} className="border-b border-border">
                        <td className="px-6 py-4">{u.name}</td>
                        <td className="px-6 py-4">{u.email}</td>
                        <td className="px-6 py-4 capitalize">{u.role}</td>
                        <td className="px-6 py-4">{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        {/* Queries Tab */}
        {activeTab === "queries" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-xl font-bold mb-4 font-serif">User Queries</h2>
            {loading ? <LoadingSpinner message="Loading queries..." size="md" /> : (
              <div className="grid gap-4">
                {queries.map((q: any) => (
                  <div key={q._id} className="bg-card p-6 rounded-lg border border-border">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">{q.subject || "No Subject"}</h3>
                        <p className="text-sm text-muted-foreground">From: {q.name} ({q.email})</p>
                        {q.mobile && <p className="text-sm text-muted-foreground">Mobile: {q.mobile}</p>}
                      </div>
                      <span className="text-xs text-muted-foreground">{new Date(q.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-foreground mt-2">{q.message}</p>
                  </div>
                ))}
                {queries.length === 0 && <p className="text-muted-foreground">No queries found.</p>}
              </div>
            )}
          </motion.div>
        )}

        {/* Bookings/Payments Tab */}
        {activeTab === "bookings" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-xl font-bold mb-4 font-serif">Payments & Bookings</h2>
            {loading ? <LoadingSpinner message="Loading bookings..." size="md" /> : (
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-secondary/50 border-b border-border">
                    <tr>
                      <th className="text-left px-6 py-4 font-semibold text-foreground">User</th>
                      <th className="text-left px-6 py-4 font-semibold text-foreground">Package</th>
                      <th className="text-left px-6 py-4 font-semibold text-foreground">Amount</th>
                      <th className="text-left px-6 py-4 font-semibold text-foreground">Status</th>
                      <th className="text-left px-6 py-4 font-semibold text-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b: any) => (
                      <tr key={b._id} className="border-b border-border">
                        <td className="px-6 py-4">
                          <p className="font-medium">{b.userId?.name || "Unknown"}</p>
                          <p className="text-xs text-muted-foreground">{b.userId?.email}</p>
                        </td>
                        <td className="px-6 py-4">{b.packageId?.title || "Unknown Package"}</td>
                        <td className="px-6 py-4 font-medium text-primary">${b.packageId?.price}</td>
                        <td className="px-6 py-4 capitalize">
                          <span className={`inline-block px-2 py-1 rounded text-xs ${b.status === "completed" || b.status === "confirmed" ? "bg-green-100 text-green-800" :
                            b.status === "cancelled" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                            }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">{new Date(b.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {bookings.length === 0 && (
                      <tr><td colSpan={5} className="px-6 py-8 text-center">No bookings found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        {/* Gallery Tab */}
        {activeTab === "gallery" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold font-serif">Gallery Management</h2>
              <Button
                onClick={() => {
                  setEditingId(null)
                  setShowForm(!showForm)
                }}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                {showForm ? "Cancel" : "Add Item"}
              </Button>
            </div>

            {/* Add Gallery Form */}
            {showForm && (
              <div className="bg-card rounded-lg border border-border p-8 mb-8">
                <GalleryForm
                  onSuccess={() => {
                    setShowForm(false)
                    fetch("/api/gallery").then(res => res.json()).then(setGalleryItems)
                  }}
                />
              </div>
            )}

            {/* Gallery List */}
            {loading ? <LoadingSpinner message="Loading gallery items..." size="md" /> : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {galleryItems.map((item) => (
                  <div key={item._id} className="bg-card rounded-lg border border-border overflow-hidden group relative">
                    <div className="aspect-square relative">
                      {item.type === 'photo' ? (
                        <img src={item.src} alt={item.alt} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full relative">
                          <img src={item.thumbnail || item.src} alt={item.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center">
                              <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1"></div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={async () => {
                            if (confirm('Delete this item?')) {
                              await fetch(`/api/gallery/${item._id}`, { method: 'DELETE' })
                              setGalleryItems(items => items.filter(i => i._id !== item._id))
                              toast({ title: "Deleted", description: "Gallery item deleted" })
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="font-medium truncate">{item.title || "Untitled"}</p>
                      <p className="text-xs text-muted-foreground capitalize">{item.type} • {item.category || "General"}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {galleryItems.length === 0 && !loading && (
              <p className="text-muted-foreground text-center py-10">No gallery items found.</p>
            )}
          </motion.div>
        )}

      </main>
    </div>
  )
}

