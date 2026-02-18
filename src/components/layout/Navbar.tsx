"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, BookOpen, GraduationCap, Settings, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

export function Navbar() {
  const pathname = usePathname()

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
    <nav className="border-b bg-background">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <div className="font-bold text-xl mr-8">StudyFlow</div>
        <div className="flex items-center space-x-4 lg:space-x-6 flex-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary flex items-center",
                route.active
                  ? "text-black dark:text-white"
                  : "text-muted-foreground"
              )}
            >
              <route.icon className="mr-2 h-4 w-4" />
              {route.label}
            </Link>
          ))}
        </div>
        <div className="ml-auto flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/login" })}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
            </Button>
        </div>
      </div>
    </nav>
  )
}
