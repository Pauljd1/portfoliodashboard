import type { ReactNode } from "react"
import { AppSidebar } from "./app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

interface DashboardShellProps {
  children: ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <main className="flex-1 p-4 md:p-6">
            <div className="mx-auto max-w-7xl space-y-6">{children}</div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

