export interface NetworkData {
  threats: Threat[]
  trafficData: {
    inbound: number[]
    outbound: number[]
  }
}

export interface Threat {
  type: string
  severity: 'Low' | 'Medium' | 'High'
  source: string
  timestamp: string
}

export interface Device {
  name: string
  ip: string
  status: 'Online' | 'Offline'
  lastSeen: string
}

// Dummy data
export const dummyNetworkData: NetworkData = {
  trafficData: {
    inbound: [40, 59, 80, 81, 56, 55],
    outbound: [33, 48, 50, 79, 70, 45],
  },
  threats: [
    {
      type: 'Malware Detected',
      severity: 'High',
      source: '192.168.1.101',
      timestamp: new Date().toISOString(),
    },
    {
      type: 'Suspicious Login',
      severity: 'Medium',
      source: '192.168.1.2',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      type: 'Port Scan',
      severity: 'Low',
      source: '203.0.113.0',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
  ],
}

export const dummyDevices: Device[] = [
  {
    name: 'Main Router',
    ip: '192.168.1.1',
    status: 'Online',
    lastSeen: '2025-02-03T09:00:00.000Z',
  },
  {
    name: 'Desktop PC',
    ip: '192.168.1.100',
    status: 'Online',
    lastSeen: '2025-02-03T09:00:00.000Z',
  },
  {
    name: 'Laptop',
    ip: '192.168.1.101',
    status: 'Offline',
    lastSeen: '2025-02-03T08:00:00.000Z',
  },
  {
    name: 'Smart TV',
    ip: '192.168.1.102',
    status: 'Online',
    lastSeen: '2025-02-03T09:00:00.000Z',
  },
]

export function getNetworkData(): NetworkData {
  // In a real application, this would fetch data from an API
  // For now, we'll return the default data with some randomization
  return {
    ...dummyNetworkData,
    threats: [
      ...dummyNetworkData.threats,
      {
        type: 'Random Threat',
        severity: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)] as
          | 'Low'
          | 'Medium'
          | 'High',
        source: `203.0.113.${Math.floor(Math.random() * 255)}`,
        timestamp: new Date().toISOString(),
      },
    ],
  }
}
