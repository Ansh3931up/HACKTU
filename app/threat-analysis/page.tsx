"use client"

import { useEffect, useState } from "react"
import { threatAnalysisService, type ThreatAnalysisData } from "@/services/api/threatAnalysisService"
// import ThreatMap from "@/components/Threat Analysis/ThreatMap"
// import ThreatTimeline from "@/components/Threat Analysis/ThreatTimeline"
// import ThreatDetails from "@/components/Threat Analysis/ThreatDetails"
// import AdvancedThreatAnalysis from "@/components/Threat Analysis/AdvancedThreatAnalysis"
import Header from "@/components/Header"

interface APTData {
  Src_IP: string;
  Dst_IP: string;
  Src_Port: number;
  Dst_Port: number;
  Protocol: number;
  Flow_Duration: number;
  Total_Fwd_Packets: number;
  Total_Bwd_Packets: number;
  Total_Length_of_Fwd_Packets: number;
  Total_Length_of_Bwd_Packets: number;
  [key: string]: any;
}

interface APTPrediction {
  confidence: number;
  index: number;
  prediction: string;
}

interface APTResponse {
  data_shape: number;
  features_used: string[];
  message: string;
  predictions: APTPrediction[];
  status: string;
}

interface PhishingFeatures {
  directory_length: number;
  domain_google_index: number;
  domain_in_ip: number;
  // ... add other feature fields
}

interface PhishingData {
  features: PhishingFeatures;
  message: string;
  url: string;
}

interface PhishingPrediction {
  confidence: number;
  feature_values: Record<string, number>;
  features_used: string[];
  message: string;
  prediction: string;
}

export default function ThreatAnalysis() {
  const [data, setData] = useState<ThreatAnalysisData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [aptData, setAptData] = useState<APTData[]>([])
  const [predictions, setPredictions] = useState<APTResponse | null>(null)
  const [url, setUrl] = useState<string>("")
  const [phishingData, setPhishingData] = useState<PhishingData | null>(null)
  const [phishingPrediction, setPhishingPrediction] = useState<PhishingPrediction | null>(null)

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
      setAptData(data);
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

      const result = await response.json();
      setPredictions(result);
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

  const handlePhishingAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const extractedData = await extractPhishingData(url);
      setPhishingData(extractedData);
      const prediction = await predictPhishing(extractedData);
      setPhishingPrediction(prediction);
    } catch (error) {
      console.error('Error in phishing analysis:', error);
    }
  };

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
        title="APT Detection Analysis"
        subtitle="Network Traffic Analysis and Predictions"
      />
      <div className="container mx-auto p-6">
        {/* APT Analysis Results */}
        <div className="bg-white dark:bg-[#111011] rounded-lg shadow-xl p-6 mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">APT Detection Results</h2>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              <p>Status: {predictions?.status}</p>
              <p>Message: {predictions?.message}</p>
              <p>Data Shape: {predictions?.data_shape}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left">Index</th>
                  <th className="px-4 py-3 text-left">Source IP</th>
                  <th className="px-4 py-3 text-left">Destination IP</th>
                  <th className="px-4 py-3 text-left">Protocol</th>
                  <th className="px-4 py-3 text-left">Prediction</th>
                  <th className="px-4 py-3 text-left">Confidence</th>
                  <th className="px-4 py-3 text-left">Details</th>
                </tr>
              </thead>
              <tbody>
                {predictions?.predictions.map((pred, index) => {
                  const networkData = aptData[index];
                  return (
                    <tr key={index} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-3">{pred.index}</td>
                      <td className="px-4 py-3">{networkData?.['Src IP']}</td>
                      <td className="px-4 py-3">{networkData?.['Dst IP']}</td>
                      <td className="px-4 py-3">{networkData?.Protocol}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          pred.prediction === 'NormalTraffic' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {pred.prediction}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${pred.confidence * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs">
                            {(pred.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button 
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          onClick={() => {
                            // You can implement a modal or expandable section here
                            console.log('Network Data:', networkData);
                          }}
                        >
                          <div className="group relative">
                            <span>View Details</span>
                            <div className="hidden group-hover:block absolute left-0 top-full mt-2 w-96 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50">
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="col-span-2 font-semibold mb-2">Packet Details:</div>
                                {networkData && Object.entries(networkData)
                                  .filter(([key]) => !['Src IP', 'Dst IP', 'Protocol'].includes(key))
                                  .map(([key, value]) => (
                                    <div key={key} className="flex justify-between">
                                      <span className="text-gray-600 dark:text-gray-400">{key}:</span>
                                      <span className="font-medium">{value}</span>
                                    </div>
                                  ))
                                }
                              </div>
                            </div>
                          </div>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Features Used Section */}
        <div className="bg-white dark:bg-[#111011] rounded-lg shadow-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Features Used in Analysis</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {predictions?.features_used.map((feature, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-3">
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


