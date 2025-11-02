'use client'

import { useState } from 'react'
import ChatInterface from '@/components/ChatInterface'
import WorkflowBuilder from '@/components/WorkflowBuilder'
import AgentDashboard from '@/components/AgentDashboard'
import { Bot, Workflow, LayoutDashboard } from 'lucide-react'

type View = 'chat' | 'workflow' | 'dashboard'

export default function Home() {
  const [activeView, setActiveView] = useState<View>('chat')

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Unified AI Agent</h1>
          <p className="text-xs text-gray-500 mt-1">Multi-Model Intelligence Platform</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveView('chat')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeView === 'chat'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Bot className="w-5 h-5" />
            <span className="font-medium">Chat Agent</span>
          </button>

          <button
            onClick={() => setActiveView('workflow')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeView === 'workflow'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Workflow className="w-5 h-5" />
            <span className="font-medium">Workflow Builder</span>
          </button>

          <button
            onClick={() => setActiveView('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeView === 'dashboard'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-gray-700">Connected Models</p>
            <div className="mt-2 space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-soft"></div>
                <span className="text-xs text-gray-600">Claude AI</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-soft"></div>
                <span className="text-xs text-gray-600">GPT-4</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-soft"></div>
                <span className="text-xs text-gray-600">Gemini</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {activeView === 'chat' && <ChatInterface />}
        {activeView === 'workflow' && <WorkflowBuilder />}
        {activeView === 'dashboard' && <AgentDashboard />}
      </div>
    </div>
  )
}
