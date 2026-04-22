"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, BookOpen, GraduationCap, Settings, LogOut, Menu, X } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { useEffect, useRef, useState } from "react"
import gsap from "gsap"

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const navRef = useRef<HTMLElement>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Hide on auth pages
  if (pathname === "/login" || pathname === "/register") {
    return null
  }

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      href: "/assignments",
      label: "Assignments",
      icon: BookOpen,
      active: pathname === "/assignments" || pathname?.startsWith("/assignments/"),
    },
    {
      href: "/courses",
      label: "Courses",
      icon: GraduationCap,
      active: pathname === "/courses" || pathname?.startsWith("/courses/"),
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
      active: pathname === "/settings",
    }
  ]

  return (
    <nav 
      ref={navRef}
      className="bg-background sticky top-0 z-50 transition-all duration-300"
    >
      <div className="flex h-[72px] items-center px-4 md:px-8 max-w-7xl mx-auto">
        {/* Logo */}
        <Link 
          href={session ? "/dashboard" : "/"} 
          className="font-semibold text-lg md:text-xl mr-8 text-foreground tracking-tight"
        >
          StudyFlow.
        </Link>
        
        {session ? (
          <>
            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2 flex-1">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "text-[15px] px-3 py-2 rounded-md transition-all duration-200 flex items-center",
                    route.active
                      ? "text-foreground bg-[rgba(28,28,28,0.04)] font-medium"
                      : "text-[#5f5f5d] hover:text-foreground hover:bg-[rgba(28,28,28,0.04)]"
                  )}
                >
                  <route.icon className="mr-2 h-[18px] w-[18px] stroke-[1.5px]" />
                  {route.label}
                </Link>
              ))}
            </div>

            {/* Desktop Logout */}
            <div className="hidden md:flex ml-auto items-center space-x-4">
              <button 
                className="text-[15px] font-normal text-[#5f5f5d] hover:text-foreground transition-all duration-200 flex items-center px-3 py-2 rounded-md hover:bg-[rgba(28,28,28,0.04)]" 
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                <LogOut className="mr-2 h-[18px] w-[18px]" />
                Log Out
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden ml-auto p-2 rounded-md text-foreground hover:bg-[rgba(28,28,28,0.04)] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </>
        ) : (
          <div className="ml-auto flex items-center space-x-2">
            <Link href="/login" className="lovable-btn-secondary text-[15px]">
              Log In
            </Link>
            <Link href="/register" className="lovable-btn-primary text-[15px]">
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {session && mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 pb-4 space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "text-[15px] px-3 py-3 rounded-md transition-all duration-200 flex items-center",
                route.active
                  ? "text-foreground bg-[rgba(28,28,28,0.04)] font-medium"
                  : "text-[#5f5f5d] hover:text-foreground hover:bg-[rgba(28,28,28,0.04)]"
              )}
            >
              <route.icon className="mr-3 h-[18px] w-[18px] stroke-[1.5px]" />
              {route.label}
            </Link>
          ))}
          <button 
            className="w-full text-[15px] font-normal text-[#5f5f5d] hover:text-foreground transition-all duration-200 flex items-center px-3 py-3 rounded-md hover:bg-[rgba(28,28,28,0.04)]" 
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="mr-3 h-[18px] w-[18px]" />
            Log Out
          </button>
        </div>
      )}
    </nav>
  )
}
