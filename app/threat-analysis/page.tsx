"use client"

import { useEffect, useState } from "react"
import { threatAnalysisService, type ThreatAnalysisData } from "@/services/api/threatAnalysisService"
// import ThreatMap from "@/components/Threat Analysis/ThreatMap"
// import ThreatTimeline from "@/components/Threat Analysis/ThreatTimeline"
// import ThreatDetails from "@/components/Threat Analysis/ThreatDetails"
// import AdvancedThreatAnalysis from "@/components/Threat Analysis/AdvancedThreatAnalysis"
import Header from "@/components/Header"
import { Tab } from '@headlessui/react'
import { ChartBarIcon, TableCellsIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

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
  const [selectedTab, setSelectedTab] = useState(0)
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
        title="Network Security Analysis"
        subtitle="Advanced Threat Detection & Analysis"
      />
      
      <div className="container mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {/* Analysis Summary Cards - Improved mobile layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-4 sm:mb-8">
          <div className="bg-white dark:bg-[#111011] rounded-lg shadow-md sm:shadow-xl p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <ChartBarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold">Total Packets</h3>
                <p className="text-xl sm:text-2xl font-bold">{aptData?.length || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#111011] rounded-lg shadow-md sm:shadow-xl p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <ShieldCheckIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold">Normal Traffic</h3>
                <p className="text-xl sm:text-2xl font-bold">
                  {predictions?.predictions.filter(p => p.prediction === "NormalTraffic").length || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#111011] rounded-lg shadow-md sm:shadow-xl p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <TableCellsIcon className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold">Suspicious Traffic</h3>
                <p className="text-xl sm:text-2xl font-bold">
                  {predictions?.predictions.filter(p => p.prediction !== "NormalTraffic").length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* URL Phishing Analysis - Further mobile optimizations */}
        <div className="bg-white dark:bg-[#111011] rounded-lg shadow-md sm:shadow-xl p-3 sm:p-6 mb-4 sm:mb-8">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">URL Phishing Analysis</h3>
          <form onSubmit={handlePhishingAnalysis} className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 sm:mb-6">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL to analyze"
              className="w-full flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Analyze
            </button>
          </form>

          {phishingPrediction && (
            <div className="space-y-3 sm:space-y-4">
              {/* Result Badge - More compact on mobile */}
              <div className="flex flex-wrap items-center gap-2">
                <div className={`w-full sm:w-auto px-3 py-1.5 sm:py-2 rounded-lg text-sm ${
                  phishingPrediction.prediction === "0" 
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                }`}>
                  <div className="flex items-center justify-between sm:justify-start">
                    <span className="font-semibold">
                      {phishingPrediction.prediction === "0" ? "Safe Website" : "Potential Phishing"}
                    </span>
                    <span className="ml-2 text-xs sm:text-sm">
                      ({(phishingPrediction.confidence * 100).toFixed(1)}% confidence)
                    </span>
                  </div>
                </div>
              </div>

              {/* Analysis Details - Improved mobile layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
                <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-3 sm:p-4">
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">Key Features</h4>
                  <div className="space-y-1.5 sm:space-y-2">
                    {Object.entries(phishingPrediction.feature_values)
                      .slice(0, 10)
                      .map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center text-xs sm:text-sm">
                          <span className="text-gray-600 dark:text-gray-400 truncate mr-2">
                            {key.replace(/_/g, ' ')}:
                          </span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                  </div>
                </div>

                {phishingData && (
                  <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-3 sm:p-4">
                    <h4 className="font-semibold mb-2 text-sm sm:text-base">URL Analysis</h4>
                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="flex flex-col text-xs sm:text-sm">
                        <span className="text-gray-600 dark:text-gray-400">URL:</span>
                        <span className="font-medium break-all mt-1">{phishingData.url}</span>
                      </div>
                      {Object.entries(phishingData.features)
                        .slice(0, 10)
                        .map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center text-xs sm:text-sm">
                            <span className="text-gray-600 dark:text-gray-400 truncate mr-2">
                              {key.replace(/_/g, ' ')}:
                            </span>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Tab Group - Enhanced mobile experience */}
        <Tab.Group>
          <Tab.List className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1 rounded-xl bg-white dark:bg-[#111011] p-1.5 sm:p-2 mb-4 sm:mb-6 overflow-x-auto">
            <Tab
              className={({ selected }) =>
                `w-full sm:w-auto whitespace-nowrap px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors duration-200
                 ${selected 
                   ? 'bg-blue-600 text-white shadow'
                   : 'text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                 }`
              }
            >
              Combined Analysis
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full sm:w-auto whitespace-nowrap px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors duration-200
                 ${selected 
                   ? 'bg-blue-600 text-white shadow'
                   : 'text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                 }`
              }
            >
              Network Details
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full sm:w-auto whitespace-nowrap px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors duration-200
                 ${selected 
                   ? 'bg-blue-600 text-white shadow'
                   : 'text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                 }`
              }
            >
              Features Analysis
            </Tab>
          </Tab.List>

          <Tab.Panels>
            <Tab.Panel>
              <div className="bg-white dark:bg-[#111011] rounded-lg shadow-md sm:shadow-xl p-2 sm:p-6">
                <div className="overflow-x-auto -mx-2 sm:mx-0">
                  <table className="min-w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-medium">Index</th>
                        <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-medium">Source IP</th>
                        <th className="hidden sm:table-cell px-4 py-2 text-left text-sm font-medium">Destination IP</th>
                        <th className="hidden sm:table-cell px-4 py-2 text-left text-sm font-medium">Protocol</th>
                        <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-medium">Type</th>
                        <th className="hidden sm:table-cell px-4 py-2 text-left text-sm font-medium">Confidence</th>
                        <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {predictions?.predictions.map((pred, index) => {
                        const networkData = aptData[index];
                        return (
                          <tr key={index} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                            <td className="px-2 sm:px-4 py-2 sm:py-3">{pred.index + 1}</td>
                            <td className="px-2 sm:px-4 py-2 sm:py-3">{networkData?.['Src IP']}</td>
                            <td className="hidden sm:table-cell px-4 py-3">{networkData?.['Dst IP']}</td>
                            <td className="hidden sm:table-cell px-4 py-3">
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs">
                                {networkData?.Protocol}
                              </span>
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                pred.prediction === 'NormalTraffic'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                              }`}>
                                {pred.prediction}
                              </span>
                            </td>
                            <td className="hidden sm:table-cell px-4 py-3">
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
                            <td className="px-2 sm:px-4 py-2 sm:py-3">
                              <button 
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                              >
                                <div className="group relative">
                                  <span>View Details</span>
                                  <div className="hidden group-hover:block absolute right-0 top-full mt-2 w-[32rem] p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="font-semibold mb-2">Network Metrics</h4>
                                        <div className="space-y-2">
                                          {networkData && Object.entries(networkData)
                                            .filter(([key]) => 
                                              ['Flow Duration', 'Flow Bytes/s', 'Flow Packets/s'].includes(key)
                                            )
                                            .map(([key, value]) => (
                                              <div key={key} className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">{key}:</span>
                                                <span className="font-medium">{value}</span>
                                              </div>
                                            ))
                                          }
                                        </div>
                                      </div>
                                      <div>
                                        <h4 className="font-semibold mb-2">Packet Analysis</h4>
                                        <div className="space-y-2">
                                          {networkData && Object.entries(networkData)
                                            .filter(([key]) => 
                                              key.includes('Packet Length') || key.includes('Total')
                                            )
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
            </Tab.Panel>

            <Tab.Panel>
              <div className="bg-white dark:bg-[#111011] rounded-lg shadow-md sm:shadow-xl p-2 sm:p-6">
                <div className="grid gap-4 sm:gap-6">
                  {aptData?.map((data, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-3 sm:p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {Object.entries(data).map(([key, value]) => (
                          <div key={key} className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">{key}</p>
                            <p className="text-lg font-semibold">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Tab.Panel>

            <Tab.Panel>
              <div className="bg-white dark:bg-[#111011] rounded-lg shadow-md sm:shadow-xl p-2 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Features Used in Analysis</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {predictions?.features_used.map((feature, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-3">
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  )
}


