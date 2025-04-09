import { DashboardShell } from "@/components/dashboard-shell"
import { CodeEditor } from "@/components/code-editor"

export default function SnippetsPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Code Snippets</h2>
        </div>
        <CodeEditor />
      </div>
    </DashboardShell>
  )
}

