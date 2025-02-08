'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useEffect, useState } from 'react'

interface Device {
  name: string
  ip: string
  status: 'Online' | 'Offline'
  lastSeen: string
  ports?: string[]
  os?: string
}

interface DeviceListProps {
  devices: Device[]
}

const DeviceList = ({ devices }: DeviceListProps) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const formatDate = (dateString: string) => {
    if (!mounted) {
      return dateString // Return ISO string during SSR
    }

    try {
      const date = new Date(dateString)
      return date.toLocaleString('en-US', {
        dateStyle: 'short',
        timeStyle: 'medium',
      })
    } catch (e) {
      return dateString
    }
  }

  return (
    <Card className="bg-white dark:bg-[#1F1F1F] shadow-md">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="text-gray-800 dark:text-gray-200">
          Connected Devices
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Operating System</TableHead>
              <TableHead>Open Ports</TableHead>
              <TableHead>Last Seen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devices.map((device) => (
              <TableRow key={device.ip}>
                <TableCell>{device.name}</TableCell>
                <TableCell>{device.ip}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      device.status === 'Online'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                    }`}
                  >
                    {device.status}
                  </span>
                </TableCell>
                <TableCell>{device.os || 'Unknown'}</TableCell>
                <TableCell>
                  <div className="max-w-xs overflow-hidden">
                    {device.ports?.join(', ') || 'None'}
                  </div>
                </TableCell>
                <TableCell>{formatDate(device.lastSeen)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default DeviceList
