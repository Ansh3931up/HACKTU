'use client'

import Header from '@/components/Header'
import NetworkHealth from '@/components/Dashboard/NetworkHealth'
import ThreatOverview from '@/components/Dashboard/ThreatOverview'
import RecentAlerts from '@/components/Dashboard/RecentAlerts'
import SecurityScore from '@/components/Dashboard/SecurityScore'
import { useEffect, useState } from 'react'
import { dashboardApi } from '@/services/api/dashboard'
// import { aptAnalysisService } from '@/services/api/aptAnalysis'
// import { phishingAnalysisService } from '@/services/api/phishingAnalysis'
// import { zeroDayAnalysisService } from '@/services/api/zeroDayAnalysis'

export default function Dashboard() {
  const [networkData, setNetworkData] = useState(null)
  const [threatData, setThreatData] = useState(null)
  const [alertData, setAlertData] = useState(null)
  const [securityData, setSecurityData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // const [aptData, setAptData] = useState(null);
  // const [phishingData, setPhishingData] = useState(null);
  // const [zeroDayData, setZeroDayData] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setError(null)

      // Fetch network health data
      const networkResult = await dashboardApi.getNetworkHealth()
      if (networkResult.statusCode === 200 && networkResult.data) {
        console.log("networkResult", networkResult.data)
        setNetworkData(networkResult.data.data)
      }

      // Fetch threat overview data
      const threatResult = await dashboardApi.getThreats()
      if (threatResult.statusCode === 200 && threatResult.data) {
        console.log("threatResult", threatResult.data)
        setThreatData(threatResult.data)
      }

      // Fetch recent alerts data
      const alertsResult = await dashboardApi.getAlerts()
      if (alertsResult.statusCode === 200 && alertsResult.data) {
        console.log("alertsResult", alertsResult.data)
        setAlertData(alertsResult.data.data)
      }

      // Fetch security score data
      const securityResult = await dashboardApi.getSecurityScore()
      if (securityResult.statusCode === 200 && securityResult.data) {
        console.log("securityResult", securityResult.data)
        setSecurityData(securityResult.data)
      }

      // Fetch phishing data
      // const phishingResult = await phishingAnalysisService.getAllPhishingData({
      //   url: "https://www.google.com",
      //   domain: "google.com",
      //   html : '<html><body><a href="https://www.google.com">Google</a></body></html>'
      // });
      // if (phishingResult.statusCode === 200 && phishingResult.data) {
      //   console.log("phishingResult", phishingResult.data)
      //   setPhishingData(phishingResult.data.data)
      // }

      // // Fetch zero day data
      // const zeroDayResult = await zeroDayAnalysisService.getAllZeroDayData();
      // console.log("zeroDayResult", zeroDayResult)
      // if (zeroDayResult.statusCode === 200 && zeroDayResult.data) {
      //   console.log("zeroDayResult", zeroDayResult.data)
      //   setZeroDayData(zeroDayResult.data.data)
      // }


      // // Fetch apt analysis data


      // const aptResult1 = await aptAnalysisService.startMonitoring();
      // if (aptResult1.statusCode === 200 && aptResult1.data) {
      //   setAptData(aptResult1.data.data)
      // }



      // Fetch apt analysis data
      // const aptResult = await aptAnalysisService.getAllThreatData();

      // if (aptResult.statusCode === 200 && aptResult.data) {
      //   console.log("aptResult", aptResult.data)
      //   setAptData(aptResult.data.data)
      // }

      // Fetch apt analysis data
      // const aptResult2 = await aptAnalysisService.stopMonitoring();
      // if (aptResult2.statusCode === 200 && aptResult2.data) {
      //   setAptData(aptResult2.data.data)
      // }



    } catch (err) {

      console.error('Error fetching dashboard data:', err)


      const message = err instanceof Error ? err.message : 'Failed to fetch dashboard data'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchDashboardData()

    // Set up polling every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000)

    // Cleanup interval on component unmount
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#EEECEF] dark:bg-[#1F1F1F] flex items-center justify-center">
        <div className="text-xl">Loading dashboard data...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#EEECEF] dark:bg-[#1F1F1F]">
      <Header title="Dashboard" subtitle="Welcome back to your dashboard" />

      {error && (
        <div className="p-6">
          <div className="text-red-500 dark:text-red-400 text-sm">{error}</div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <NetworkHealth networkData={networkData} />
        <ThreatOverview response={threatData} />
        <RecentAlerts alerts={alertData} />
        <SecurityScore data={securityData.data} />
      </div>
    </div>
  )
}



