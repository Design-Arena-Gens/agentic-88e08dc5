'use client'

import { useState } from 'react'
import { Plus, Play, Save, Trash2, Settings, Zap, MessageSquare, Database, Mail, Globe, FileText, GitBranch } from 'lucide-react'
import { useAgentStore } from '@/store/agentStore'

interface WorkflowNode {
  id: string
  type: 'trigger' | 'action' | 'condition' | 'ai'
  label: string
  icon: any
  config: any
  position: { x: number; y: number }
}

interface Workflow {
  id: string
  name: string
  nodes: WorkflowNode[]
  connections: { from: string; to: string }[]
  status: 'active' | 'inactive'
}

const nodeTypes = [
  { type: 'trigger', label: 'Webhook Trigger', icon: Zap, color: 'bg-green-100 text-green-700' },
  { type: 'ai', label: 'AI Processing', icon: MessageSquare, color: 'bg-purple-100 text-purple-700' },
  { type: 'action', label: 'Database Query', icon: Database, color: 'bg-blue-100 text-blue-700' },
  { type: 'action', label: 'Send Email', icon: Mail, color: 'bg-red-100 text-red-700' },
  { type: 'action', label: 'API Request', icon: Globe, color: 'bg-yellow-100 text-yellow-700' },
  { type: 'condition', label: 'Condition', icon: FileText, color: 'bg-orange-100 text-orange-700' },
]

export default function WorkflowBuilder() {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: '1',
      name: 'Customer Support Automation',
      nodes: [
        { id: 'n1', type: 'trigger', label: 'Email Received', icon: Mail, config: {}, position: { x: 50, y: 100 } },
        { id: 'n2', type: 'ai', label: 'Analyze Sentiment', icon: MessageSquare, config: { model: 'claude' }, position: { x: 300, y: 100 } },
        { id: 'n3', type: 'condition', label: 'Is Urgent?', icon: FileText, config: {}, position: { x: 550, y: 100 } },
        { id: 'n4', type: 'action', label: 'Send to Support', icon: Mail, config: {}, position: { x: 800, y: 50 } },
        { id: 'n5', type: 'action', label: 'Auto-Reply', icon: Mail, config: {}, position: { x: 800, y: 150 } },
      ],
      connections: [
        { from: 'n1', to: 'n2' },
        { from: 'n2', to: 'n3' },
        { from: 'n3', to: 'n4' },
        { from: 'n3', to: 'n5' },
      ],
      status: 'active'
    },
    {
      id: '2',
      name: 'Content Generation Pipeline',
      nodes: [
        { id: 'n1', type: 'trigger', label: 'Schedule Trigger', icon: Zap, config: {}, position: { x: 50, y: 100 } },
        { id: 'n2', type: 'ai', label: 'Generate Content', icon: MessageSquare, config: { model: 'gpt4' }, position: { x: 300, y: 100 } },
        { id: 'n3', type: 'action', label: 'Save to Database', icon: Database, config: {}, position: { x: 550, y: 100 } },
      ],
      connections: [
        { from: 'n1', to: 'n2' },
        { from: 'n2', to: 'n3' },
      ],
      status: 'inactive'
    }
  ])
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(workflows[0]?.id || null)
  const [isCreating, setIsCreating] = useState(false)
  const [newWorkflowName, setNewWorkflowName] = useState('')
  const { addInteraction } = useAgentStore()

  const currentWorkflow = workflows.find(w => w.id === selectedWorkflow)

  const createWorkflow = () => {
    if (!newWorkflowName.trim()) return

    const newWorkflow: Workflow = {
      id: Date.now().toString(),
      name: newWorkflowName,
      nodes: [],
      connections: [],
      status: 'inactive'
    }

    setWorkflows([...workflows, newWorkflow])
    setSelectedWorkflow(newWorkflow.id)
    setIsCreating(false)
    setNewWorkflowName('')
  }

  const executeWorkflow = (workflowId: string) => {
    addInteraction({
      type: 'workflow',
      timestamp: new Date(),
      model: 'Workflow Engine',
      success: true
    })

    alert('Workflow executed successfully! Check the dashboard for results.')
  }

  const toggleWorkflowStatus = (workflowId: string) => {
    setWorkflows(workflows.map(w =>
      w.id === workflowId
        ? { ...w, status: w.status === 'active' ? 'inactive' : 'active' }
        : w
    ))
  }

  const deleteWorkflow = (workflowId: string) => {
    setWorkflows(workflows.filter(w => w.id !== workflowId))
    if (selectedWorkflow === workflowId) {
      setSelectedWorkflow(workflows[0]?.id || null)
    }
  }

  return (
    <div className="flex h-full">
      {/* Workflow List Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => setIsCreating(true)}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>New Workflow</span>
          </button>
        </div>

        {isCreating && (
          <div className="p-4 border-b border-gray-200 bg-blue-50">
            <input
              type="text"
              value={newWorkflowName}
              onChange={(e) => setNewWorkflowName(e.target.value)}
              placeholder="Workflow name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex space-x-2">
              <button
                onClick={createWorkflow}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Create
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {workflows.map((workflow) => (
            <div
              key={workflow.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedWorkflow === workflow.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedWorkflow(workflow.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-gray-900">{workflow.name}</h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    workflow.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {workflow.status}
                </span>
              </div>
              <p className="text-sm text-gray-500">{workflow.nodes.length} nodes</p>

              <div className="flex items-center space-x-2 mt-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    executeWorkflow(workflow.id)
                  }}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                >
                  <Play className="w-3 h-3" />
                  <span>Run</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleWorkflowStatus(workflow.id)
                  }}
                  className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300"
                >
                  {workflow.status === 'active' ? 'Pause' : 'Activate'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteWorkflow(workflow.id)
                  }}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Available Nodes</h4>
          <div className="space-y-2">
            {nodeTypes.map((nodeType, index) => {
              const Icon = nodeType.icon
              return (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-2 rounded-lg ${nodeType.color} cursor-move`}
                  draggable
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{nodeType.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Workflow Canvas */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {currentWorkflow?.name || 'Select a workflow'}
            </h2>
            {currentWorkflow && (
              <p className="text-sm text-gray-500">
                {currentWorkflow.nodes.length} nodes, {currentWorkflow.connections.length} connections
              </p>
            )}
          </div>
          {currentWorkflow && (
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button
                onClick={() => executeWorkflow(currentWorkflow.id)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>Execute</span>
              </button>
            </div>
          )}
        </div>

        {currentWorkflow ? (
          <div className="flex-1 bg-gray-50 p-8 overflow-auto">
            <div className="relative min-h-full">
              {/* Render nodes */}
              {currentWorkflow.nodes.map((node) => {
                const Icon = node.icon
                return (
                  <div
                    key={node.id}
                    className="absolute workflow-node"
                    style={{ left: node.position.x, top: node.position.y }}
                  >
                    <div className="bg-white border-2 border-gray-300 rounded-lg p-4 shadow-md w-48">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`p-2 rounded-lg ${node.type === 'trigger' ? 'bg-green-100' : node.type === 'ai' ? 'bg-purple-100' : node.type === 'condition' ? 'bg-orange-100' : 'bg-blue-100'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{node.label}</p>
                          <p className="text-xs text-gray-500 capitalize">{node.type}</p>
                        </div>
                      </div>
                      <button className="w-full mt-2 px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs hover:bg-gray-200 flex items-center justify-center space-x-1">
                        <Settings className="w-3 h-3" />
                        <span>Configure</span>
                      </button>
                    </div>
                  </div>
                )
              })}

              {/* Render connections */}
              <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
                {currentWorkflow.connections.map((conn, index) => {
                  const fromNode = currentWorkflow.nodes.find(n => n.id === conn.from)
                  const toNode = currentWorkflow.nodes.find(n => n.id === conn.to)
                  if (!fromNode || !toNode) return null

                  const x1 = fromNode.position.x + 192
                  const y1 = fromNode.position.y + 40
                  const x2 = toNode.position.x
                  const y2 = toNode.position.y + 40

                  return (
                    <line
                      key={index}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      className="workflow-connection"
                      markerEnd="url(#arrowhead)"
                    />
                  )
                })}
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="10"
                    refX="9"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3, 0 6" fill="#3b82f6" />
                  </marker>
                </defs>
              </svg>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <GitBranch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No workflow selected</h3>
              <p className="text-gray-500">Select a workflow from the sidebar or create a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
