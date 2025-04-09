"use client"

import type React from "react"

import { useCallback, useRef, useState } from "react"
import ReactFlow, {
  addEdge,
  Background,
  type Connection,
  Controls,
  type Edge,
  MiniMap,
  type Node,
  Panel,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow"
import "reactflow/dist/style.css"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2 } from "lucide-react"

// Node types
const NODE_TYPES = {
  input: "Start",
  default: "Process",
  output: "End",
}

// Initial nodes and edges
const initialNodes: Node[] = [
  {
    id: "1",
    type: "input",
    data: { label: "Start" },
    position: { x: 250, y: 5 },
  },
  {
    id: "2",
    data: { label: "Process" },
    position: { x: 250, y: 100 },
  },
  {
    id: "3",
    type: "output",
    data: { label: "End" },
    position: { x: 250, y: 200 },
  },
]

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3" },
]

function FlowChartEditorInner() {
  const reactFlowInstance = useReactFlow()
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [nodeName, setNodeName] = useState("")
  const [nodeType, setNodeType] = useState<string>("default")
  
  // Use ref to track the next node ID
  const nextNodeId = useRef(nodes.length + 1)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)), 
    [setEdges]
  )

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
    setNodeName(node.data.label)
    setNodeType(node.type || "default")
  }, [])

  const updateNodeName = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNode.id) {
            return {
              ...node,
              data: {
                ...node.data,
                label: nodeName,
              },
              type: nodeType,
            }
          }
          return node
        }),
      )
    }
  }, [selectedNode, nodeName, nodeType, setNodes])

  const addNewNode = useCallback(() => {
    const id = `${nextNodeId.current}`
    nextNodeId.current += 1
    
    const newNode: Node = {
      id,
      type: nodeType,
      data: { label: "New Node" },
      position: {
        x: Math.random() * 300 + 100,
        y: Math.random() * 300 + 100,
      },
    }
    setNodes((nds) => [...nds, newNode])
    // Auto-select the new node
    setSelectedNode(newNode)
    setNodeName(newNode.data.label)
  }, [nodeType, setNodes])

  const deleteSelectedNode = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id))
      // Remove any connected edges
      setEdges((eds) => 
        eds.filter(
          (edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id
        )
      )
      setSelectedNode(null)
    }
  }, [selectedNode, setNodes, setEdges])

  const centerView = useCallback(() => {
    reactFlowInstance.fitView({ padding: 0.2 })
  }, [reactFlowInstance])

  const handleNodeTypeChange = useCallback((value: string) => {
    setNodeType(value)
    if (selectedNode) {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNode.id) {
            return {
              ...node,
              type: value,
            }
          }
          return node
        }),
      )
    }
  }, [selectedNode, setNodes])

  const clearCanvas = useCallback(() => {
    if (window.confirm("Are you sure you want to clear the canvas?")) {
      setNodes([])
      setEdges([])
      setSelectedNode(null)
    }
  }, [setNodes, setEdges])

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <Tabs defaultValue="editor" className="flex flex-col h-full">
        <div className="border-b px-4">
          <TabsList className="my-2">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="editor" className="flex-1 p-0 data-[state=active]:flex flex-col">
          <div className="flex-1 w-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              deleteKeyCode={["Backspace", "Delete"]}
              fitView
            >
              <Controls />
              <MiniMap />
              <Background gap={12} size={1} />
              
              <Panel position="top-right" className="bg-background/90 p-2 rounded-md shadow-sm">
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={centerView}>
                    Center View
                  </Button>
                  <Button size="sm" variant="destructive" onClick={clearCanvas}>
                    Clear All
                  </Button>
                </div>
              </Panel>
            </ReactFlow>
          </div>
          <div className="p-4 border-t flex justify-between gap-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="node-type-select">Node Type:</Label>
              <Select value={nodeType} onValueChange={handleNodeTypeChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select node type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="input">Start</SelectItem>
                  <SelectItem value="default">Process</SelectItem>
                  <SelectItem value="output">End</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={addNewNode}>
                Add Node
              </Button>
              <Button 
                variant="destructive" 
                onClick={deleteSelectedNode}
                disabled={!selectedNode}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Node
              </Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="properties" className="p-4 data-[state=active]:flex flex-col gap-4">
          {selectedNode ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="node-name">Node Name</Label>
                <Input 
                  id="node-name" 
                  value={nodeName} 
                  onChange={(e) => setNodeName(e.target.value)} 
                />
              </div>
              <div>
                <Label htmlFor="node-type">Node Type</Label>
                <Select value={nodeType} onValueChange={handleNodeTypeChange}>
                  <SelectTrigger id="node-type">
                    <SelectValue placeholder="Select node type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="input">Start</SelectItem>
                    <SelectItem value="default">Process</SelectItem>
                    <SelectItem value="output">End</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-2 flex gap-2">
                <Button onClick={updateNodeName}>Update</Button>
                <Button 
                  variant="destructive" 
                  onClick={deleteSelectedNode}
                >
                  Delete Node
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Select a node to edit its properties</p>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  )
}

// Export the component wrapped with ReactFlowProvider
export function FlowChartEditor() {
  return (
    <ReactFlowProvider>
      <FlowChartEditorInner />
    </ReactFlowProvider>
  )
}