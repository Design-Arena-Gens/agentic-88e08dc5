'use client'

import { useEffect, useState } from 'react'
import { Activity, TrendingUp, Zap, MessageSquare, BarChart3, Clock } from 'lucide-react'
import { useAgentStore } from '@/store/agentStore'
import { format } from 'date-fns'

export default function AgentDashboard() {
  const { interactions, getStats } = useAgentStore()
  const [stats, setStats] = useState({
    totalInteractions: 0,
    chatInteractions: 0,
    workflowExecutions: 0,
    successRate: 100
  })

  useEffect(() => {
    setStats(getStats())
  }, [interactions, getStats])

  const recentActivity = interactions.slice(-10).reverse()

  const modelDistribution = [
    { name: 'Claude', value: 45, color: 'bg-purple-500' },
    { name: 'GPT-4', value: 35, color: 'bg-blue-500' },
    { name: 'Gemini', value: 20, color: 'bg-green-500' },
  ]

  const performanceMetrics = [
    { label: 'Avg Response Time', value: '1.2s', trend: '+5%', icon: Clock },
    { label: 'Tasks Completed', value: stats.totalInteractions.toString(), trend: '+12%', icon: TrendingUp },
    { label: 'Success Rate', value: `${stats.successRate}%`, trend: '+2%', icon: Zap },
    { label: 'Active Workflows', value: '4', trend: '+1', icon: Activity },
  ]

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Agent Dashboard</h2>
          <p className="text-gray-600">Monitor your AI agent's performance and activity</p>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {performanceMetrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-green-600 text-sm font-medium">{metric.trend}</span>
                </div>
                <p className="text-gray-600 text-sm mb-1">{metric.label}</p>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Model Usage Distribution */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Model Usage Distribution</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-4">
              {modelDistribution.map((model, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{model.name}</span>
                    <span className="text-sm text-gray-600">{model.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`${model.color} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${model.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-4">Usage Statistics</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{stats.chatInteractions}</p>
                  <p className="text-xs text-gray-600 mt-1">Chat Messages</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{stats.workflowExecutions}</p>
                  <p className="text-xs text-gray-600 mt-1">Workflows Run</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{stats.totalInteractions}</p>
                  <p className="text-xs text-gray-600 mt-1">Total Actions</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <MessageSquare className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'chat' ? 'bg-purple-100' : 'bg-blue-100'
                    }`}>
                      {activity.type === 'chat' ? (
                        <MessageSquare className="w-4 h-4 text-purple-600" />
                      ) : (
                        <Zap className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.type === 'chat' ? 'Chat Interaction' : 'Workflow Execution'}
                      </p>
                      <p className="text-xs text-gray-600 truncate">{activity.model}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(activity.timestamp, 'MMM d, h:mm a')}
                      </p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${
                      activity.success ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No activity yet</p>
                  <p className="text-xs text-gray-400 mt-1">Start chatting or run a workflow</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse-soft"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">All Systems Operational</p>
                <p className="text-xs text-gray-600">Last checked: just now</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">API Response Time</p>
                <p className="text-xs text-gray-600">Average: 1.2s</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Model Availability</p>
                <p className="text-xs text-gray-600">3/3 models online</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
