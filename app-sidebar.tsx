"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Code,
  FileText,
  Home,
  LayoutDashboard,
  Network,
  Plus,
  Settings,
  User,
  Menu,
  X
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "./theme-toggle"

export function AppSidebar() {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)
  
  // Check if we're on desktop or mobile/tablet
  const [isDesktop, setIsDesktop] = React.useState(false)
  
  // Detect screen size changes and handle responsiveness
  React.useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const checkIsDesktop = () => {
      const desktop = window.innerWidth >= 1024
      setIsDesktop(desktop)
      
      // Auto-open sidebar on desktop, keep current state on mobile
      if (desktop) {
        setIsSidebarOpen(true)
      }
    }
    
    // Check on initial load
    checkIsDesktop()
    
    // Listen for window resize events
    window.addEventListener('resize', checkIsDesktop)
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIsDesktop)
  }, [])
  
  // Handle content padding based on sidebar state
  React.useEffect(() => {
    // Get the main content element
    const mainContent = document.getElementById('main-content')
    if (!mainContent) return;
    
    // Apply padding based on sidebar state and screen size
    if (isDesktop) {
      // Always give space for sidebar on desktop
      mainContent.style.paddingLeft = '16rem'
    } else {
      // On mobile, adjust padding based on sidebar open state
      mainContent.style.paddingLeft = isSidebarOpen ? '16rem' : '1rem'
    }
    
    // Add transition for smooth padding changes
    mainContent.style.transition = 'padding-left 300ms ease-in-out'
  }, [isDesktop, isSidebarOpen])

  // Function to toggle sidebar
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev)

  // Routes for the sidebar
  const routes = [
    { title: "Dashboard", icon: Home, href: "/" },
    { title: "Projects", icon: LayoutDashboard, href: "/projects" },
    { title: "Code Snippets", icon: Code, href: "/snippets" },
    { title: "Flow Charts", icon: Network, href: "/flowcharts" },
    { title: "Resources", icon: FileText, href: "/resources" },
    { title: "Settings", icon: Settings, href: "/settings" },
  ]

  return (
    <>
      {/* Fixed hamburger menu button for mobile/tablet */}
      <button
        aria-label={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-30 p-2 rounded-md bg-background shadow-md lg:hidden"
      >
        {isSidebarOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Sidebar */}
      <div className="h-full">
        <div 
          className={`fixed inset-y-0 left-0 w-64 bg-background border-r border-sidebar-border shadow-lg transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } z-20 lg:translate-x-0`}
        >
          {/* Sidebar Header */}
          <div className="h-16 border-b border-sidebar-border px-4 flex items-center">
            <div className="flex items-center gap-2">
              <Network className="h-6 w-6" />
              <span className="font-semibold">DevDash</span>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="h-[calc(100vh-8rem)] overflow-y-auto py-4">
            <div className="space-y-1 px-3">
              {routes.map((route) => (
                <Link 
                  key={route.href} 
                  href={route.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                    pathname === route.href 
                      ? "bg-muted text-foreground" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  } transition-all duration-200`}
                >
                  <route.icon className="h-5 w-5" />
                  <span>{route.title}</span>
                </Link>
              ))}
            </div>

            <div className="my-4 border-t border-sidebar-border"></div>

            <div className="px-3">
              <button className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-muted transition-all duration-200">
                <Plus className="h-5 w-5" />
                <span>New Project</span>
              </button>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 w-full border-t border-sidebar-border p-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-left">
                <span className="text-sm font-medium">John Doe</span>
                <span className="text-xs text-muted-foreground">john@example.com</span>
              </div>
              <ThemeToggle className="ml-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile/tablet */}
      {isSidebarOpen && !isDesktop && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
        />
      )}
    </>
  )
}