import { DashboardShell } from "@/components/dashboard-shell"
import { GreetingCard } from "@/components/greeting-card"
import { RecentProjects } from "@/components/recent-projects"
import { StatsCards } from "@/components/stats-cards"
import { TaskSummary } from "@/components/task-summary"

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <GreetingCard className="col-span-full md:col-span-2" />
        <StatsCards />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <TaskSummary className="md:col-span-1" />
        <RecentProjects className="md:col-span-1 lg:col-span-2" />
      </div>
    </DashboardShell>
  )
}

