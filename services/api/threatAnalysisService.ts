import { api } from './api'

export interface ThreatAnalysisData {
  networkData: {
    threats: Array<{
      id: number
      type: string
      severity: string
      source: string
      timestamp: string
      details: string
      status: string
    }>
    trafficData: {
      inbound: number[]
      outbound: number[]
      timestamps: string[]
    }
  }
  devices: Array<{
    id: number
    name: string
    ip: string
    status: string
    lastSeen: string
    type: string
    risk: string
  }>
  securityScore: {
    secure: number
    atRisk: number
    lastUpdated: string
  }
  threatMetrics: {
    lowRisk: number
    mediumRisk: number
    highRisk: number
    total: number
    trend: {
      daily: string
      weekly: string
      monthly: string
    }
  }
  networkHealth: {
    uptime: number
    latency: number
    packetLoss: number
    bandwidthUsage: number
    timestamp: string
  }
}

export const threatAnalysisService = {
  async getAllThreatData(): Promise<ThreatAnalysisData> {
    try {
      const response = await api.get('/threat-analysis')
      
      console.log('Threat Analysis Response:', response)

      if (!response.data || response.statusCode !== 200) {
        throw new Error('Failed to fetch threat analysis data')
      }

      const threatAnalysisData = response.data.data

      if (!threatAnalysisData.networkData || 
          !threatAnalysisData.devices || 
          !threatAnalysisData.securityScore || 
          !threatAnalysisData.threatMetrics || 
          !threatAnalysisData.networkHealth) {
        throw new Error('Invalid data structure received from server')
      }

      return threatAnalysisData

    } catch (error) {
      console.error('Error fetching threat analysis data:', error)
      throw error
    }
  }
} 