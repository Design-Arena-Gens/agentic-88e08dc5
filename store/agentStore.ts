import { create } from 'zustand'

interface Interaction {
  type: 'chat' | 'workflow'
  timestamp: Date
  model: string
  success: boolean
}

interface AgentStore {
  interactions: Interaction[]
  addInteraction: (interaction: Interaction) => void
  getStats: () => {
    totalInteractions: number
    chatInteractions: number
    workflowExecutions: number
    successRate: number
  }
}

export const useAgentStore = create<AgentStore>((set, get) => ({
  interactions: [],

  addInteraction: (interaction) => {
    set((state) => ({
      interactions: [...state.interactions, interaction]
    }))
  },

  getStats: () => {
    const interactions = get().interactions
    const chatInteractions = interactions.filter(i => i.type === 'chat').length
    const workflowExecutions = interactions.filter(i => i.type === 'workflow').length
    const successfulInteractions = interactions.filter(i => i.success).length
    const successRate = interactions.length > 0
      ? Math.round((successfulInteractions / interactions.length) * 100)
      : 100

    return {
      totalInteractions: interactions.length,
      chatInteractions,
      workflowExecutions,
      successRate
    }
  }
}))
