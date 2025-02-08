import axios from 'axios'
const api = axios.create({ 
  baseURL: 'http://localhost:3014/api/v1',
  
})

export interface VulnerabilityScanResult {
  target: string
  vulnerabilities: {
    high: Array<{
      ip: string
      port: string
      service: string
      vulnerability: string
      severity: string
      description: string
      recommendations: string[]
    }>
    medium: Array<any>
    low: Array<any>
  }
  summary: {
    total: number
    high: number
    medium: number
    low: number
  }
}

export interface DarkWebResult {
  email: string
  breaches: Array<{
    name: string
    domain: string
    breachDate: string
    description: string
  }>
}

export interface IPReputationResponse {
  statusCode: number
  data: {
    ipDetails: {
      ip: string
      isPublic: boolean
      ipVersion: number
      isWhitelisted: boolean | null
      abuseConfidenceScore: number
      countryCode: string | null
      usageType: string
      isp: string | null
      domain: string | null
      totalReports: number
      lastReportedAt: string | null
    }
    reports: string[]
    quotaStatus: {
      check: string
      reports: string
    }
    summary: {
      totalReports: number
      confidenceScore: number
      lastReported: string
      riskLevel: string
    }
  }
  message: string
}

export const securityToolsService = {
  async runVulnerabilityScan(target: string): Promise<VulnerabilityScanResult> {
    const response = await api.get(`/vulnerability/scan/${encodeURIComponent(target)}`)
    console.log('Vulnerability Scan Response:', response)
    return response.data.data
  },

  async checkDarkWeb(email: string): Promise<DarkWebResult> {
    const response = await api.get(`/advanced-network/dark-web/${encodeURIComponent(email)}`)
    console.log('Dark Web Check Response:', response)
    return response.data.data
  },

  async generateReport(target: string): Promise<Blob> {
    const config = {
      responseType: 'blob' as const,
      headers: {
        'Accept': 'application/pdf'
      }
    }
    const response = await api.get(`/advanced-network/report/${encodeURIComponent(target)}`, config)
    console.log("response",response);
    return response.data
  },

  async checkIPReputation(ip: string): Promise<IPReputationResponse> {
    const response = await api.get(`/advanced-network/threat-check/${encodeURIComponent(ip)}`)
    console.log('IP Reputation Check Response:', response);
    return response;
  }
} 