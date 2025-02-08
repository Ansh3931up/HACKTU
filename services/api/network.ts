const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3014/api/v1'

export interface Device {
  name: string
  ip: string
  status: 'Online' | 'Offline'
  lastSeen: string
  ports?: string[]
  os?: string
}

export interface NetworkResponse {
  statusCode: number
  message: string
  data: {
    devices: Device[]
    networkData: {
      trafficData: {
        inbound: number[]
        outbound: number[]
      }
    }
    detailedAnalysis?: {
      vulnerabilities: Array<{
        ip: string
        criticalVulns: Array<{
          type: string
          details: string
          fix: string
          cve?: string
        }>
        highVulns: Array<{
          type: string
          details: string
          fix: string
          service?: string
        }>
        mediumVulns: Array<{
          type: string
          details: string
          fix: string
        }>
      }>
      threats: Array<{
        type: string
        device: string
        details: string
        riskLevel: string
        mitigation: string
      }>
      recommendations: Array<{
        device: string
        issue: string
        recommendation: string
        priority: string
        steps: string[]
      }>
    }
  }
}

export const networkApi = {
  async scanNetwork(ipAddress: string): Promise<NetworkResponse> {
    try {
      const response = await fetch(
        `${API_URL}/network/scan/${encodeURIComponent(ipAddress)}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Network scan failed')
      }

      return response.json()
    } catch (error) {
      console.error('Network scan failed:', error)
      throw error
    }
  },

  async getTrafficAnalysis(): Promise<NetworkResponse> {
    try {
      const response = await fetch(`${API_URL}/network/traffic`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to get traffic analysis')
      }

      return response.json()
    } catch (error) {
      console.error('Failed to get traffic analysis:', error)
      throw error
    }
  },

  async getSecurityAnalysis(ipRange: string): Promise<NetworkResponse> {
    try {
      const response = await fetch(
        `${API_URL}/network/analysis/${encodeURIComponent(ipRange)}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.message || 'Failed to fetch security analysis'
        )
      }

      const data = await response.json()
      console.log('Security Analysis Response:', data)
      return data
    } catch (error) {
      console.error('Security analysis failed:', error)
      throw error
    }
  },
}
