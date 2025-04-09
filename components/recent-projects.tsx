import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface RecentProjectsProps {
  className?: string
}

export function RecentProjects({ className }: RecentProjectsProps) {
  const projects = [
    {
      name: "E-commerce Dashboard",
      status: "In Progress",
      statusColor: "bg-yellow-500",
      lastUpdated: "2 hours ago",
    },
    {
      name: "API Documentation",
      status: "Completed",
      statusColor: "bg-green-500",
      lastUpdated: "Yesterday",
    },
    {
      name: "Mobile App UI",
      status: "Planning",
      statusColor: "bg-blue-500",
      lastUpdated: "3 days ago",
    },
  ]

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Recent Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.name} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
              <div className="space-y-1">
                <h3 className="font-medium">{project.name}</h3>
                <p className="text-sm text-muted-foreground">Last updated: {project.lastUpdated}</p>
              </div>
              <Badge variant="outline" className={cn("text-white", project.statusColor)}>
                {project.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

