"use client"

import { useState, useCallback, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Plus, MoreVertical, Edit2, Trash2, X, Check, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

// Define types for better type safety
type Task = {
  id: string
  content: string
  description?: string
  createdAt: number
  tags?: string[]
  priority?: 'low' | 'medium' | 'high'
}

type Column = {
  id: string
  title: string
  taskIds: string[]
  color?: string
}

type Columns = {
  [key: string]: Column
}

type Tasks = {
  [key: string]: Task
}

// Initial board data
const initialColumns: Columns = {
  todo: {
    id: "todo",
    title: "To Do",
    taskIds: ["task-1", "task-2", "task-3"],
    color: "bg-blue-500/10 border-blue-500/20",
  },
  inProgress: {
    id: "inProgress",
    title: "In Progress",
    taskIds: ["task-4", "task-5"],
    color: "bg-amber-500/10 border-amber-500/20",
  },
  review: {
    id: "review",
    title: "Review",
    taskIds: ["task-6"],
    color: "bg-purple-500/10 border-purple-500/20",
  },
  done: {
    id: "done",
    title: "Done",
    taskIds: ["task-7", "task-8"],
    color: "bg-green-500/10 border-green-500/20",
  },
}

const initialTasks: Tasks = {
  "task-1": { 
    id: "task-1", 
    content: "Create dashboard layout",
    description: "Design a responsive dashboard layout with sidebar navigation",
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    tags: ["design", "frontend"],
    priority: "high"
  },
  "task-2": { 
    id: "task-2", 
    content: "Implement authentication", 
    description: "Set up user authentication with JWT and refresh tokens",
    createdAt: Date.now() - 6 * 24 * 60 * 60 * 1000,
    tags: ["security", "backend"],
    priority: "high"
  },
  "task-3": { 
    id: "task-3", 
    content: "Design database schema", 
    description: "Create ERD and define database schema for the application",
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    tags: ["database", "planning"],
    priority: "medium"
  },
  "task-4": { 
    id: "task-4", 
    content: "Build API endpoints", 
    description: "Implement RESTful API endpoints for the application",
    createdAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
    tags: ["backend", "api"],
    priority: "medium"
  },
  "task-5": { 
    id: "task-5", 
    content: "Create user profile page", 
    description: "Design and implement the user profile page with edit functionality",
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    tags: ["frontend", "ui"],
    priority: "low"
  },
  "task-6": { 
    id: "task-6", 
    content: "Implement dark mode", 
    description: "Add dark mode support with theme toggle",
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    tags: ["ui", "enhancement"],
    priority: "low"
  },
  "task-7": { 
    id: "task-7", 
    content: "Setup project structure", 
    description: "Initialize the project with proper folder structure and configuration",
    createdAt: Date.now() - 8 * 24 * 60 * 60 * 1000,
    tags: ["setup", "devops"],
    priority: "high"
  },
  "task-8": { 
    id: "task-8", 
    content: "Write documentation", 
    description: "Create comprehensive documentation for the API and setup instructions",
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    tags: ["documentation"],
    priority: "medium"
  },
}

const columnOrder = ["todo", "inProgress", "review", "done"]

// Priority colors
const priorityColors = {
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  medium: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

export function FlowChartEditor() {
  // Initialize with default state first
  const [columns, setColumns] = useState<Columns>(initialColumns)
  const [tasks, setTasks] = useState<Tasks>(initialTasks)
  
  const [newTaskContent, setNewTaskContent] = useState<string>("")
  const [newTaskDescription, setNewTaskDescription] = useState<string>("")
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [newTaskTags, setNewTaskTags] = useState<string>("")
  const [addingToColumn, setAddingToColumn] = useState<string | null>(null)
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [editTaskContent, setEditTaskContent] = useState<string>("")
  const [editTaskDescription, setEditTaskDescription] = useState<string>("")
  const [editTaskPriority, setEditTaskPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [editTaskTags, setEditTaskTags] = useState<string>("")
  const [isClient, setIsClient] = useState(false)
  
  // Check if we're on the client and load data from localStorage
  useEffect(() => {
    setIsClient(true)
    
    // Now it's safe to use localStorage
    const savedColumns = localStorage.getItem('kanban-columns')
    const savedTasks = localStorage.getItem('kanban-tasks')
    
    if (savedColumns) {
      try {
        setColumns(JSON.parse(savedColumns))
      } catch (e) {
        console.error('Error parsing saved columns:', e)
      }
    }
    
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks))
      } catch (e) {
        console.error('Error parsing saved tasks:', e)
      }
    }
  }, [])

  // Save state to localStorage when it changes, but only on the client side
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('kanban-columns', JSON.stringify(columns))
      localStorage.setItem('kanban-tasks', JSON.stringify(tasks))
    }
  }, [columns, tasks, isClient])

  const handleDragEnd = useCallback((result: any) => {
    const { destination, source, draggableId } = result

    // If there's no destination or the item was dropped back in its original position
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    // Get source and destination columns
    const sourceColumn = columns[source.droppableId]
    const destColumn = columns[destination.droppableId]

    // If moving within the same column
    if (sourceColumn.id === destColumn.id) {
      const newTaskIds = Array.from(sourceColumn.taskIds)
      newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, draggableId)

      const newColumn = {
        ...sourceColumn,
        taskIds: newTaskIds,
      }

      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      })
      return
    }

    // Moving from one column to another
    const sourceTaskIds = Array.from(sourceColumn.taskIds)
    sourceTaskIds.splice(source.index, 1)

    const destTaskIds = Array.from(destColumn.taskIds)
    destTaskIds.splice(destination.index, 0, draggableId)

    setColumns({
      ...columns,
      [sourceColumn.id]: {
        ...sourceColumn,
        taskIds: sourceTaskIds,
      },
      [destColumn.id]: {
        ...destColumn,
        taskIds: destTaskIds,
      },
    })
  }, [columns])

  const addNewTask = useCallback((columnId: string) => {
    if (!newTaskContent.trim()) return

    // Process tags
    const tags = newTaskTags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    // Create new task
    const newTaskId = `task-${Date.now()}`
    const newTask = {
      id: newTaskId,
      content: newTaskContent,
      description: newTaskDescription,
      createdAt: Date.now(),
      tags,
      priority: newTaskPriority,
    }

    // Add task to tasks object
    setTasks(prev => ({
      ...prev,
      [newTaskId]: newTask,
    }))

    // Add task ID to column
    const column = columns[columnId]
    setColumns(prev => ({
      ...prev,
      [columnId]: {
        ...column,
        taskIds: [...column.taskIds, newTaskId],
      },
    }))

    // Reset form
    setNewTaskContent("")
    setNewTaskDescription("")
    setNewTaskPriority("medium")
    setNewTaskTags("")
    setAddingToColumn(null)
  }, [newTaskContent, newTaskDescription, newTaskPriority, newTaskTags, columns])

  const deleteTask = useCallback((taskId: string) => {
    // Find which column contains this task
    let columnId: string | null = null
    
    Object.keys(columns).forEach(colId => {
      if (columns[colId].taskIds.includes(taskId)) {
        columnId = colId
      }
    })

    if (!columnId) return

    // Remove task from column
    const column = columns[columnId]
    const newTaskIds = column.taskIds.filter(id => id !== taskId)
    
    setColumns(prev => ({
      ...prev,
      [columnId]: {
        ...column,
        taskIds: newTaskIds,
      },
    }))

    // Delete task from tasks object
    const newTasks = { ...tasks }
    delete newTasks[taskId]
    setTasks(newTasks)
  }, [columns, tasks])

  const startEditingTask = useCallback((taskId: string) => {
    const task = tasks[taskId]
    setEditingTask(taskId)
    setEditTaskContent(task.content)
    setEditTaskDescription(task.description || "")
    setEditTaskPriority(task.priority || "medium")
    setEditTaskTags(task.tags?.join(", ") || "")
  }, [tasks])

  const saveEditedTask = useCallback((taskId: string) => {
    if (!editTaskContent.trim()) return

    // Process tags
    const tags = editTaskTags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    // Update task
    setTasks(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        content: editTaskContent,
        description: editTaskDescription,
        priority: editTaskPriority,
        tags,
      }
    }))

    setEditingTask(null)
  }, [editTaskContent, editTaskDescription, editTaskPriority, editTaskTags])

  const cancelEditing = useCallback(() => {
    setEditingTask(null)
  }, [])

  const addNewColumn = useCallback(() => {
    const newColumnId = `column-${Date.now()}`
    const newColumn = {
      id: newColumnId,
      title: "New Column",
      taskIds: [],
      color: "bg-slate-500/10 border-slate-500/20"
    }

    setColumns(prev => ({
      ...prev,
      [newColumnId]: newColumn
    }))

    // Add to column order
    columnOrder.push(newColumnId)
  }, [])

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    })
  }

  return (
    <div className="h-full overflow-x-auto">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 pb-4">
          {columnOrder.map((columnId) => {
            const column = columns[columnId]
            const columnTasks = column.taskIds.map((taskId) => tasks[taskId]).filter(Boolean)

            return (
              <div key={column.id} className="flex-shrink-0 w-80">
                <Card className={cn("border-t-4", column.color)}>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium flex justify-between items-center">
                      {column.title}
                      <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
                        {columnTasks.length}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 pb-3 pt-0">
                    <Droppable droppableId={column.id}>
                      {(provided) => (
                        <div 
                          {...provided.droppableProps} 
                          ref={provided.innerRef} 
                          className="min-h-[200px]"
                        >
                          {columnTasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={cn(
                                    "mb-3 p-3 bg-card border rounded-md shadow-sm",
                                    snapshot.isDragging && "shadow-md",
                                    editingTask === task.id ? "ring-2 ring-primary" : ""
                                  )}
                                >
                                  {editingTask === task.id ? (
                                    <div className="space-y-3">
                                      <Input
                                        value={editTaskContent}
                                        onChange={(e) => setEditTaskContent(e.target.value)}
                                        placeholder="Task title"
                                        className="w-full font-medium"
                                      />
                                      <Textarea
                                        value={editTaskDescription}
                                        onChange={(e) => setEditTaskDescription(e.target.value)}
                                        placeholder="Description (optional)"
                                        className="w-full text-sm resize-none min-h-[60px]"
                                      />
                                      <div className="space-y-2">
                                        <div className="flex gap-2 text-xs text-muted-foreground">
                                          <span>Priority:</span>
                                          <div className="flex gap-1">
                                            {(['low', 'medium', 'high'] as const).map(priority => (
                                              <Badge 
                                                key={priority} 
                                                variant="outline"
                                                className={cn(
                                                  "cursor-pointer",
                                                  editTaskPriority === priority && "ring-1 ring-primary"
                                                )}
                                                onClick={() => setEditTaskPriority(priority)}
                                              >
                                                {priority}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                        <Input
                                          value={editTaskTags}
                                          onChange={(e) => setEditTaskTags(e.target.value)}
                                          placeholder="Tags (comma separated)"
                                          className="w-full text-xs"
                                        />
                                      </div>
                                      <div className="flex justify-end gap-2 mt-2">
                                        <Button size="sm" variant="ghost" onClick={cancelEditing}>
                                          <X className="h-4 w-4 mr-1" />
                                          Cancel
                                        </Button>
                                        <Button size="sm" onClick={() => saveEditedTask(task.id)}>
                                          <Check className="h-4 w-4 mr-1" />
                                          Save
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="flex justify-between items-start">
                                        <div className="font-medium">{task.content}</div>
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                              <MoreVertical className="h-4 w-4" />
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => startEditingTask(task.id)}>
                                              <Edit2 className="h-4 w-4 mr-2" />
                                              Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                              className="text-destructive focus:text-destructive"
                                              onClick={() => deleteTask(task.id)}
                                            >
                                              <Trash2 className="h-4 w-4 mr-2" />
                                              Delete
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </div>
                                      {task.description && (
                                        <div className="mt-2 text-sm text-muted-foreground line-clamp-2">
                                          {task.description}
                                        </div>
                                      )}
                                      <div className="mt-3 flex justify-between items-center">
                                        <div className="flex gap-1 flex-wrap">
                                          {task.tags?.slice(0, 2).map(tag => (
                                            <Badge key={tag} variant="secondary" className="text-xs">
                                              {tag}
                                            </Badge>
                                          ))}
                                          {(task.tags?.length || 0) > 2 && (
                                            <Badge variant="outline" className="text-xs">
                                              +{task.tags!.length - 2}
                                            </Badge>
                                          )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                          {task.priority && (
                                            <Badge 
                                              className={cn(
                                                "text-xs",
                                                priorityColors[task.priority]
                                              )}
                                            >
                                              {task.priority}
                                            </Badge>
                                          )}
                                          <span className="text-xs text-muted-foreground">
                                            {formatDate(task.createdAt)}
                                          </span>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}

                          {addingToColumn === column.id ? (
                            <div className="mt-3 space-y-3 p-3 border rounded-md bg-muted/20">
                              <Input
                                value={newTaskContent}
                                onChange={(e) => setNewTaskContent(e.target.value)}
                                placeholder="Task title"
                                className="w-full font-medium"
                                autoFocus
                              />
                              <Textarea
                                value={newTaskDescription}
                                onChange={(e) => setNewTaskDescription(e.target.value)}
                                placeholder="Description (optional)"
                                className="w-full text-sm resize-none min-h-[60px]"
                              />
                              <div className="space-y-2">
                                <div className="flex gap-2 text-xs text-muted-foreground">
                                  <span>Priority:</span>
                                  <div className="flex gap-1">
                                    {(['low', 'medium', 'high'] as const).map(priority => (
                                      <Badge 
                                        key={priority} 
                                        variant="outline"
                                        className={cn(
                                          "cursor-pointer",
                                          newTaskPriority === priority && "ring-1 ring-primary"
                                        )}
                                        onClick={() => setNewTaskPriority(priority)}
                                      >
                                        {priority}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <Input
                                  value={newTaskTags}
                                  onChange={(e) => setNewTaskTags(e.target.value)}
                                  placeholder="Tags (comma separated)"
                                  className="w-full text-xs"
                                />
                              </div>
                              <div className="flex justify-end gap-2 mt-3">
                                <Button size="sm" variant="ghost" onClick={() => setAddingToColumn(null)}>
                                  Cancel
                                </Button>
                                <Button size="sm" onClick={() => addNewTask(column.id)}>
                                  Add Task
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full mt-2 justify-start text-muted-foreground"
                              onClick={() => setAddingToColumn(column.id)}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add task
                            </Button>
                          )}
                        </div>
                      )}
                    </Droppable>
                  </CardContent>
                </Card>
              </div>
            )
          })}

          {/* Add new column button */}
          <div className="flex-shrink-0 w-80">
            <Button 
              variant="outline" 
              className="border-dashed border-2 w-full h-14 mt-[48px]"
              onClick={addNewColumn}
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Add Column
            </Button>
          </div>
        </div>
      </DragDropContext>
    </div>
  )
}