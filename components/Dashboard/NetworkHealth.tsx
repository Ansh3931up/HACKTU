"use client"
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { FormattedDateTime } from '@/components/ui/FormattedDateTime'

interface NetworkHealthProps {
  networkData: {
    uptime: number;
    latency: number;
    packetLoss: number;
    bandwidthUsage: number;
    timestamp: string;
  }
}

const NetworkHealth = ({ networkData }: NetworkHealthProps) => {
  console.log(networkData,"data")
  return (
    <Card className="bg-white dark:bg-[#111011] shadow-xl flex flex-col justify-between">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="text-old-money-burgundy text-3xl font-semibold">
          Network Health
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 flex-grow flex flex-col justify-center">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-3">
              <span className="text-gray-800 dark:text-gray-200">Uptime</span>
              <span className="text-gray-800 dark:text-gray-200">{networkData.uptime}%</span>
            </div>
            <Progress value={networkData.uptime} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between mb-3">
              <span className="text-gray-800 dark:text-gray-200">Latency</span>
              <span className="text-gray-800 dark:text-gray-200">{networkData.latency} ms</span>
            </div>
            <Progress value={(100 - networkData.latency) * 2} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between mb-3">
              <span className="text-gray-800 dark:text-gray-200">Packet Loss</span>
              <span className="text-gray-800 dark:text-gray-200">{networkData.packetLoss}%</span>
            </div>
            <Progress value={100 - networkData.packetLoss} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between mb-3">
              <span className="text-gray-800 dark:text-gray-200">Bandwidth Usage</span>
              <span className="text-gray-800 dark:text-gray-200">{networkData.bandwidthUsage}%</span>
            </div>
            <Progress value={networkData.bandwidthUsage} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between mb-3">
              <span className="text-gray-800 dark:text-gray-200">Last Updated</span>
              <FormattedDateTime timestamp={networkData.timestamp} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default NetworkHealth

