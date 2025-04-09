import { DashboardShell } from "@/components/dashboard-shell"
import { FlowChartEditor } from "@/components/flow-chart-editor"

export default function FlowChartsPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Flow Charts</h2>
        </div>
        <FlowChartEditor />
      </div>
    </DashboardShell>
  )
}

