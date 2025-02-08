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

  // Add new functions for system logs
  const fetchSystemLogs = async () => {
    try {
      const response = await fetch('http://172.16.85.30:5000/extract_system_logs?hours=24');
      const logs = await response.json();
      console.log('System Logs from last hour:', logs);
      return logs;
    } catch (error) {
      console.error('Error fetching system logs:', error);
      return [];
    }
  };

  const analyzeSystemLogs = async(logs: any) => {
    try {
      const response = await fetch('http://172.16.85.30:5000/analyze_system_logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ logs })
      });
      const data = await response.json();
      console.log('System Logs Analysis:', data);
    } catch (error) {
      console.error('Error analyzing system logs:', error);
    }
  }

  // Add APT analysis functions
  const extractAptData = async(packet_count: number = 100) => {
    try {
      const response = await fetch(`http://172.16.85.30:5000/extract_apt_data?packet_count=${packet_count}`)
      const responseData = await response.json();
      const data = responseData.data || responseData;
      console.log('APT Data:', data);
      return data;
    } catch (error) {
      console.error('Error extracting apt data:', error);
      return [];
    }
  }

  const predictApt = async(AptData: any) => {
    try {
      const dataArray = AptData.data || AptData;
      const cleanedData = dataArray.map((packet: any) => {
        const cleaned: any = {};
        Object.entries(packet).forEach(([key, value]) => {
          if (key === 'Src IP' || key === 'Dst IP' || typeof value === 'string' && isNaN(Number(value))) {
            cleaned[key] = value;
          } else {
            cleaned[key] = typeof value === 'string' ? Number(value) : value;
          }
        });
        return cleaned;
      });

      const response = await fetch('http://172.16.85.30:5000/predict_apt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cleanedData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(`Server error: ${errorData.error || response.statusText}`);
      }

      const result = await response.json();
      console.log('APT Prediction:', result);
      return result;
    } catch (error) {
      console.error("Error predicting apt:", error);
      return [];
    }
  }

  // Add phishing analysis functions
  const extractPhishingData = async(url: string) => {
    try {
      const response = await fetch('http://172.16.85.30:5000/extract_url_features', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({url})
      })      
      const data = await response.json();
      console.log("Phishing data", data);
      return data;
    } catch (error) {
      console.log("Error while extracting phishing data", error);
      return [];
    }
  }

  const predictPhishing = async(phishingData: any) => {
    try {
      const response = await fetch('http://172.16.85.30:5000/predict_phishing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(phishingData)
      })
      const data = await response.json();
      console.log("Phishing prediction", data);
      return data;
    } catch (error) {
      console.log("Error while predicting phishing", error);
      return [];
    }
  }

  // Add combined analysis functions
  const doublelogs = async() => {
    const aptData = await extractAptData();
    console.log("Started extracting apt data", aptData);
    const prediction = await predictApt(aptData);
    console.log("APT prediction completed", prediction);
    const logs = await fetchSystemLogs();
    console.log("Started analyzing system logs");
    analyzeSystemLogs(logs);
  }

  const doublephishing = async() => {
    const url = "https://www.google.com";
    const phishingData = await extractPhishingData(url);
    console.log("Started extracting phishing data", phishingData);
    const prediction = await predictPhishing(phishingData);
    console.log("Phishing prediction completed", prediction);
  }

  // Add new useEffects
  useEffect(() => {
    doublelogs();
  }, []);

  useEffect(() => {
    doublephishing();
  }, []);

  // Existing useEffect for threat analysis
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


