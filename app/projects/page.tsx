import { DashboardShell } from "@/components/dashboard-shell"
import { KanbanBoard } from "@/components/kanban-board"

export default function ProjectsPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
        </div>
        <KanbanBoard />
      </div>
    </DashboardShell>
  )
}

