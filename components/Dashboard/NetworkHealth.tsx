"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { formatBytes } from "@/lib/utils"

interface NetworkHealthProps {
  networkData: {
    latency: {
      current: number
      historicalAverage: number
    }
    bandwidth: {
      usagePercentage: number
      currentUsage: {
        upload: number
        download: number
      }
      capacity: number
    }
    speedTest: {
      download: string
      units: string
    }
    interfaceStatus: {
      name: string
      ip: string
      connectionType: string
      duplex: string
      isConnected: boolean
    }
    connections: {
      ethernet: number
      wifi: number
    }
    healthStatus: {
      score: number
      components: {
        latency: number
        bandwidth: number
      }
      label: string
    }
  }
}

export default function NetworkHealth({ networkData }: NetworkHealthProps) {
  return (
    <Card className="bg-white dark:bg-[#111011]">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">Network Health</CardTitle>
          <Badge variant={networkData.interfaceStatus.isConnected ? "success" : "destructive"}>
            {networkData.interfaceStatus.isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Health Score */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Health Score</span>
            <span className="text-sm">{networkData.healthStatus.label}</span>
          </div>
          <Progress value={networkData.healthStatus.score} className="h-2" />
        </div>

        {/* Latency & Bandwidth */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-500">Current Latency</span>
            <div className="text-xl font-semibold mt-1">{networkData.latency.current} ms</div>
            <span className="text-xs text-gray-400">
              Avg: {networkData.latency.historicalAverage} ms
            </span>
          </div>
          <div>
            <span className="text-sm text-gray-500">Bandwidth Usage</span>
            <div className="text-xl font-semibold mt-1">{networkData.bandwidth.usagePercentage}%</div>
            <span className="text-xs text-gray-400">
              Capacity: {networkData.bandwidth.capacity} Mbps
            </span>
          </div>
        </div>

        {/* Network Usage */}
        <div>
          <span className="text-sm text-gray-500 block mb-2">Current Usage</span>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-gray-400">Upload</span>
              <div className="text-sm font-semibold">{formatBytes(networkData.bandwidth.currentUsage.upload)}/s</div>
            </div>
            <div>
              <span className="text-xs text-gray-400">Download</span>
              <div className="text-sm font-semibold">{formatBytes(networkData.bandwidth.currentUsage.download)}/s</div>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">Active Connections</span>
            <span className="text-sm font-semibold">
              Ethernet: {networkData.connections.ethernet}, WiFi: {networkData.connections.wifi}
            </span>
          </div>
        </div>

        {/* Interface Details */}
        <div className="space-y-2">
          <span className="text-sm text-gray-500 block">Interface Details</span>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-400">Name:</span>
              <span className="ml-2">{networkData.interfaceStatus.name}</span>
            </div>
            <div>
              <span className="text-gray-400">Type:</span>
              <span className="ml-2 capitalize">{networkData.interfaceStatus.connectionType}</span>
            </div>
            <div>
              <span className="text-gray-400">IP:</span>
              <span className="ml-2">{networkData.interfaceStatus.ip}</span>
            </div>
            <div>
              <span className="text-gray-400">Speed:</span>
              <span className="ml-2">
                {networkData.speedTest.download} {networkData.speedTest.units}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

