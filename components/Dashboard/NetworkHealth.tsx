"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { formatBytes } from "@/lib/utils"

interface NetworkHealthProps {
  networkData: {
    uptime: {
      days: string
      percentage: string
      lastReboot: string
    }
    latency: {
      current: number
      average: number
    }
    network: {
      bytesReceived: number
      bytesSent: number
      packetsReceived: number
      packetsSent: number
      errors: number
      dropped: number
    }
    speed: {
      download: number
      interface: number
      duplex: string
    }
    connections: {
      active: number
      total: number
    }
    interface: {
      name: string
      ip: string
      mac: string
      type: string
      mtu: number
    }
    status: {
      isOnline: boolean
      health: {
        score: number
        label: string
      }
      lastChecked: string
    }
  }
}

export default function NetworkHealth({ networkData }: NetworkHealthProps) {
  return (
    <Card className="bg-white dark:bg-[#111011]">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">Network Health</CardTitle>
          <Badge variant={networkData.status.isOnline ? "success" : "destructive"}>
            {networkData.status.isOnline ? "Online" : "Offline"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Health Score */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Health Score</span>
            <span className="text-sm">{networkData.status.health.label}</span>
          </div>
          <Progress value={networkData.status.health.score} className="h-2" />
        </div>

        {/* Uptime & Latency */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-500">Uptime</span>
            <div className="text-xl font-semibold mt-1">{networkData.uptime.days} days</div>
            <span className="text-xs text-gray-400">
              Last reboot: {new Date(networkData.uptime.lastReboot).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="text-sm text-gray-500">Latency</span>
            <div className="text-xl font-semibold mt-1">{networkData.latency.current} ms</div>
            <span className="text-xs text-gray-400">Average: {networkData.latency.average} ms</span>
          </div>
        </div>

        {/* Network Traffic */}
        <div>
          <span className="text-sm text-gray-500 block mb-2">Network Traffic</span>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-gray-400">Received</span>
              <div className="text-sm font-semibold">{formatBytes(networkData.network.bytesReceived)}</div>
            </div>
            <div>
              <span className="text-xs text-gray-400">Sent</span>
              <div className="text-sm font-semibold">{formatBytes(networkData.network.bytesSent)}</div>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">Active Connections</span>
            <span className="text-sm font-semibold">
              {networkData.connections.active} / {networkData.connections.total}
            </span>
          </div>
          <Progress 
            value={(networkData.connections.active / networkData.connections.total) * 100} 
            className="h-2" 
          />
        </div>

        {/* Interface Details */}
        <div className="space-y-2">
          <span className="text-sm text-gray-500 block">Interface Details</span>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-400">Name:</span>
              <span className="ml-2">{networkData.interface.name}</span>
            </div>
            <div>
              <span className="text-gray-400">Type:</span>
              <span className="ml-2 capitalize">{networkData.interface.type}</span>
            </div>
            <div>
              <span className="text-gray-400">IP:</span>
              <span className="ml-2">{networkData.interface.ip}</span>
            </div>
            <div>
              <span className="text-gray-400">Speed:</span>
              <span className="ml-2">{networkData.speed.interface} Mbps</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

