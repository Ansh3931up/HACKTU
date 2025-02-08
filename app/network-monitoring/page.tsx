'use client'
import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import NetworkTopology from '@/components/Network_Monitoring/NetworkTopology'
import TrafficAnalysis from '@/components/Network_Monitoring/TrafficAnalysis'
import DeviceList from '@/components/Network_Monitoring/DeviceList'
import SecurityAnalysis from '@/components/Network_Monitoring/SecurityAnalysis'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { toast } from 'sonner'
import { networkApi } from '@/services/api/network'

export default function NetworkMonitoringPage() {
  const [searchIp, setSearchIp] = useState('')
  const [networkIp, setNetworkIp] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [devices, setDevices] = useState([])
  const [networkData, setNetworkData] = useState(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Get current device's IP on initial load
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => {
        setSearchIp(data.ip)
        setNetworkIp(data.ip)
        handleScan(data.ip)
      })
      .catch(err => {
        console.error('IP Detection Error:', err)
        toast.error('Failed to detect device IP')
      })
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchIp) {
      setNetworkIp(searchIp)
      handleScan(searchIp)
    }
  }

  const handleScan = async (ip: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const result = await networkApi.scanNetwork(ip)
      if (result.statusCode === 200 && result.data) {
        setDevices(result.data.devices || [])
        setNetworkData(result.data.networkData || null)
        toast.success('Network Scan Complete')
      }
    } catch (err) {
      console.error('Scan Error:', err)
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
      toast.error('Scan Failed', { description: message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#EEECEF] dark:bg-[#1F1F1F]">
      <Header
        title="Network Monitoring"
        subtitle="Monitor your network traffic and connected devices"
      />
      <div className="space-y-6 p-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter IP address..."
            value={searchIp}
            onChange={(e) => setSearchIp(e.target.value)}
            className="max-w-xs bg-white dark:bg-gray-800"
          />
          <Button
            // onClick={handleSearch}
            type="submit"
            disabled={isLoading}
            className="bg-[#30006C] text-white hover:bg-[#30006C]/90"
          >
            {isLoading ? (
              'Scanning...'
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Scan Network
              </>
            )}
          </Button>
        </form>

        {error && (
          <div className="text-red-500 dark:text-red-400 text-sm">{error}</div>
        )}

        {networkData && devices && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <NetworkTopology devices={devices} />
              <TrafficAnalysis networkData={networkData} />
            </div>
            <SecurityAnalysis ipRange={networkIp} />
          </>
        )}

        {devices && devices.length > 0 && <DeviceList devices={devices} />}
      </div>
    </div>
  )
}
