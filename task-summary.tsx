import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface TaskSummaryProps {
  className?: string
}

export function TaskSummary({ className }: TaskSummaryProps) {
  const tasks = [
    { name: "Dashboard UI", progress: 80 },
    { name: "API Integration", progress: 45 },
    { name: "Documentation", progress: 20 },
    { name: "Testing", progress: 60 },
  ]

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Task Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{task.name}</span>
                <span className="text-sm text-muted-foreground">{task.progress}%</span>
              </div>
              <Progress value={task.progress} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

