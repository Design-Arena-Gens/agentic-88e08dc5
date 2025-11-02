'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, Zap, Code, FileText, Image as ImageIcon } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { useAgentStore } from '@/store/agentStore'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  model?: string
  timestamp: Date
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your unified AI agent combining the power of Claude, GPT-4, and Gemini. I can help you with conversations, code generation, workflow automation, data analysis, and creative tasks. How can I assist you today?',
      model: 'Claude',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState<'auto' | 'claude' | 'gpt4' | 'gemini'>('auto')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { addInteraction } = useAgentStore()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getModelForTask = (message: string): string => {
    if (selectedModel !== 'auto') {
      return selectedModel.charAt(0).toUpperCase() + selectedModel.slice(1)
    }

    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes('code') || lowerMessage.includes('program') || lowerMessage.includes('function')) {
      return 'Claude'
    } else if (lowerMessage.includes('creative') || lowerMessage.includes('story') || lowerMessage.includes('write')) {
      return 'GPT-4'
    } else if (lowerMessage.includes('analyze') || lowerMessage.includes('data') || lowerMessage.includes('research')) {
      return 'Gemini'
    }

    return 'Claude'
  }

  const generateResponse = async (userMessage: string, model: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

    const responses: { [key: string]: string[] } = {
      'Claude': [
        `I'll help you with that. Based on your request, here's my analysis:\n\n**Key Points:**\n- ${userMessage.split(' ').slice(0, 3).join(' ')} requires careful consideration\n- I can break this down into actionable steps\n- Let me provide a structured approach\n\n**Implementation:**\n\`\`\`javascript\nfunction handleTask() {\n  // Solution implementation\n  return "Optimized result";\n}\n\`\`\`\n\nWould you like me to elaborate on any aspect?`,
        `Great question! Let me provide a comprehensive answer:\n\n1. **Analysis**: ${userMessage.length > 20 ? 'This is a complex query' : 'This query'} involves multiple considerations\n2. **Approach**: I recommend a systematic methodology\n3. **Outcome**: Expected results will be precise and actionable\n\nI can also help you build a workflow to automate this process.`
      ],
      'GPT-4': [
        `Absolutely! Here's a creative perspective on "${userMessage}":\n\nImagine we approach this from multiple angles. The beauty of this challenge lies in its complexity. Let me craft a solution that's both elegant and effective.\n\n**Creative Solution:**\n- Innovation through iteration\n- Collaborative problem-solving\n- Adaptive strategies\n\nThis approach ensures flexibility while maintaining focus on your goals.`,
        `I love this question! Let's explore it together.\n\n"${userMessage.slice(0, 50)}${userMessage.length > 50 ? '...' : ''}"\n\nThis opens up fascinating possibilities. Think of it as building blocks - each piece connects to create something greater. I can help you refine this into concrete actions.`
      ],
      'Gemini': [
        `Analyzing your request: "${userMessage}"\n\n**Data-Driven Insights:**\n- Pattern recognition suggests multiple optimization paths\n- Cross-referencing best practices\n- Predictive modeling indicates high success probability\n\n**Recommendations:**\n1. Implement systematic validation\n2. Establish metrics for measuring success\n3. Iterate based on feedback loops\n\nI can help you set up analytics tracking for this.`,
        `Excellent query! Let me break down the analysis:\n\n**Research Findings:**\n- Current best practices align with your objective\n- Statistical models support this approach\n- Efficiency gains estimated at 40-60%\n\n**Next Steps:**\nI recommend starting with a pilot implementation and measuring results against baseline metrics.`
      ]
    }

    const modelResponses = responses[model] || responses['Claude']
    return modelResponses[Math.floor(Math.random() * modelResponses.length)]
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    const model = getModelForTask(input)
    const response = await generateResponse(input, model)

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      model: model,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, assistantMessage])
    setIsLoading(false)

    addInteraction({
      type: 'chat',
      timestamp: new Date(),
      model: model,
      success: true
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">AI Chat Agent</h2>
            <p className="text-sm text-gray-500">Multi-model conversational intelligence</p>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="auto">Auto-Select Model</option>
              <option value="claude">Claude AI</option>
              <option value="gpt4">GPT-4</option>
              <option value="gemini">Gemini</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white rounded-2xl rounded-br-sm'
                  : 'bg-white border border-gray-200 rounded-2xl rounded-bl-sm'
              } px-6 py-4 shadow-sm`}
            >
              {message.role === 'assistant' && message.model && (
                <div className="flex items-center space-x-2 mb-2 pb-2 border-b border-gray-100">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span className="text-xs font-medium text-gray-600">{message.model}</span>
                </div>
              )}
              <div className={`${message.role === 'assistant' ? 'markdown-content text-gray-800' : ''}`}>
                {message.role === 'assistant' ? (
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                ) : (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-6 py-4 shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2 overflow-x-auto">
          <button
            onClick={() => setInput('Write a Python function to process data')}
            className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            <Code className="w-4 h-4" />
            <span>Code Helper</span>
          </button>
          <button
            onClick={() => setInput('Analyze the following data and provide insights')}
            className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            <Zap className="w-4 h-4" />
            <span>Data Analysis</span>
          </button>
          <button
            onClick={() => setInput('Help me write creative content about')}
            className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            <FileText className="w-4 h-4" />
            <span>Creative Writing</span>
          </button>
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-6">
        <div className="flex items-end space-x-4">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything... I can help with code, analysis, creative tasks, and more!"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            <Send className="w-5 h-5" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  )
}
