import { api } from './api'

export const aptAnalysisService = {
  async startMonitoring() {
    try {
      const response = await api.post('/apt/monitoring/start',{})
      return response.data
    } catch (error) {
      console.error('Error starting monitoring:', error)
      throw error
    }
  },

  async getAllThreatData() {
    try {
      const response = await api.get('/apt/monitoring/all')
      return response.data
    } catch (error) {
      console.error('Error fetching threat analysis data:', error)
      throw error
    }
  },

  async stopMonitoring() {
    try {
      const response = await api.post('/apt/monitoring/stop',{})
      return response.data
    } catch (error) {
      console.error('Error stopping monitoring:', error)
      throw error
    }
  },

  async capturePackets() {
    try {
      const response = await api.post('/apt/capture/packets',{})
      return response.data
    } catch (error) {
      console.error('Error capturing packets:', error)
      throw error
    }
  }
} 