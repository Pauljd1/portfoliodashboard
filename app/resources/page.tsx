import { DashboardShell } from "@/components/dashboard-shell"
import { ResourcesGrid } from "@/components/resources-grid"

export default function ResourcesPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Resources</h2>
        </div>
        <ResourcesGrid />
      </div>
    </DashboardShell>
  )
}

