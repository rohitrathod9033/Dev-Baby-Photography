"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, LogOut, Shield, User } from "lucide-react"
import { useAuth } from "../contexts/auth-context"

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, logout, isAdmin } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Packages", path: "/packages" },
    { name: "Appointments", path: "/appointments" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Help", path: "/ChatbotWidget" },
  ]

  const handleLogout = () => {
    logout()
    router.push("/")
    setIsMobileMenuOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "nav-blur py-3" : "bg-transparent py-5"
        }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
            <span className="font-serif text-2xl md:text-3xl font-semibold text-foreground">Dev</span>
            <span className="font-serif text-2xl md:text-3xl font-light text-primary ml-1">Baby</span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={`relative font-medium text-sm tracking-wide transition-colors duration-300 hover:text-primary ${pathname === link.path ? "text-primary" : "text-foreground/80"
                }`}
            >
              {link.name}
              {pathname === link.path && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                />
              )}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10">
                <User className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{user?.name}</span>
              </div>
              {isAdmin && (
                <Link href="/admin/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-secondary text-sm gap-2 flex items-center"
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                  </motion.button>
                </Link>
              )}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="btn-outline text-sm gap-2 flex items-center"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </motion.button>
            </>
          ) : (
            <>
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Sign In
                </motion.button>
              </Link>
              <Link href="/appointments">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary text-sm"
                >
                  Book a Session
                </motion.button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-foreground p-2">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-t border-border"
          >
            <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-lg font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                {isAuthenticated ? (
                  <div className="space-y-3">
                    {isAdmin && (
                      <Link href="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                        <button className="btn-secondary w-full gap-2 flex items-center justify-center">
                          <Shield className="w-4 h-4" />
                          Admin Dashboard
                        </button>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="btn-outline w-full gap-2 flex items-center justify-center"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="btn-outline w-full">Sign In</button>
                    </Link>
                    <Link href="/appointments" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="btn-primary w-full">Book a Session</button>
                    </Link>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar
