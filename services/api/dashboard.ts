import { api } from './api'

export const dashboardApi = {
  getNetworkHealth: async () => {
    try {
      const response = await api.get('/dashboard/network-health')
      return response
    } catch (error) {
      console.error('Failed to fetch network health:', error)
      throw error
    }
  },

  getThreats: async () => {
    try {
      const response = await api.get('/dashboard/threats')
      return response
    } catch (error) {
      console.error('Failed to fetch threats:', error)
      throw error
    }
  },

  getAlerts: async () => {
    try {
      const response = await api.get('/dashboard/alerts')
      return response
    } catch (error) {
      console.error('Failed to fetch alerts:', error)
      throw error
    }
  },

  getSecurityScore: async () => {
    try {
      const response = await api.get('/dashboard/security-score')
      return response
    } catch (error) {
      console.error('Failed to fetch security score:', error)
      throw error
    }
  }
} 