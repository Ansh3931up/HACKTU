"use client"

import { useEffect, useState } from "react"
import { threatAnalysisService, type ThreatAnalysisData } from "@/services/api/threatAnalysisService"
import ThreatMap from "@/components/Threat Analysis/ThreatMap"
import ThreatTimeline from "@/components/Threat Analysis/ThreatTimeline"
import ThreatDetails from "@/components/Threat Analysis/ThreatDetails"
import AdvancedThreatAnalysis from "@/components/Threat Analysis/AdvancedThreatAnalysis"
import Header from "@/components/Header"

export default function ThreatAnalysis() {
  const [data, setData] = useState<ThreatAnalysisData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchThreatAnalysisData = async () => {
    try {
      setError(null)
      const result = await threatAnalysisService.getAllThreatData()
      console.log("Threat Analysis Response:", result)
      
      if (result) {
        setData(result)
        console.log("Updated Threat Analysis Data:", result)
      }
    } catch (err) {
      console.error('Error fetching threat analysis data:', err)
      const message = err instanceof Error ? err.message : 'Failed to fetch threat analysis data'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchThreatAnalysisData()
    const interval = setInterval(fetchThreatAnalysisData, 5000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#EEECEF] dark:bg-[#1F1F1F] flex items-center justify-center">
        <div className="text-xl">Loading threat analysis data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#EEECEF] dark:bg-[#1F1F1F] flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    )
  }

  if (!data) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#EEECEF] dark:bg-[#1F1F1F]">
      <Header
        title="Threat Analysis"
        subtitle="Monitor your network traffic and connected devices"
      />
      <div className="container mx-auto p-6 bg-[#EEECEF] dark:bg-[#1F1F1F]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ThreatMap threats={data.networkData.threats} />
          <ThreatTimeline events={data.networkData.threats} />
        </div>
        <div className="mb-8">
          <AdvancedThreatAnalysis 
            networkStatus={data.networkHealth}
            threatMetrics={data.threatMetrics}
          />
        </div>
        <div>
          <ThreatDetails 
            threats={data.networkData.threats}
            devices={data.devices} 
          />
        </div>
      </div>
    </div>
  )
}


