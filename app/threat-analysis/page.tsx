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
        title="APT & Phishing Detection Analysis"
        subtitle="Monitor network traffic and analyze URLs for threats"
      />
      <div className="container mx-auto p-6">
        {/* Phishing Analysis Section */}
        <div className="mb-8 bg-white dark:bg-[#111011] rounded-lg shadow-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Phishing URL Analysis</h2>
          <form onSubmit={handlePhishingAnalysis} className="mb-6">
            <div className="flex gap-4">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL to analyze"
                className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                required
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Analyze
              </button>
            </div>
          </form>

          {phishingPrediction && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Prediction Result</h3>
              <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Prediction</p>
                    <p className={`text-lg font-semibold ${
                      phishingPrediction.prediction === "1" 
                        ? "text-red-600 dark:text-red-400"
                        : "text-green-600 dark:text-green-400"
                    }`}>
                      {phishingPrediction.prediction === "1" ? "Phishing" : "Legitimate"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Confidence</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${phishingPrediction.confidence * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">
                        {(phishingPrediction.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {phishingData && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Extracted Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(phishingData.features).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{key}</p>
                    <p className="text-lg font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* APT Analysis Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Network Traffic Data */}
          <div className="bg-white dark:bg-[#111011] rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Network Traffic Data</h2>
            <div className="overflow-auto max-h-[600px]">
              <table className="min-w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-2">Source IP</th>
                    <th className="px-4 py-2">Destination IP</th>
                    <th className="px-4 py-2">Protocol</th>
                    <th className="px-4 py-2">Packets</th>
                  </tr>
                </thead>
                <tbody>
                  {aptData.map((packet, index) => (
                    <tr key={index} className="border-b dark:border-gray-700">
                      <td className="px-4 py-2">{packet['Src IP']}</td>
                      <td className="px-4 py-2">{packet['Dst IP']}</td>
                      <td className="px-4 py-2">{packet.Protocol}</td>
                      <td className="px-4 py-2">
                        Fwd: {packet['Total Fwd Packets']}, Bwd: {packet['Total Bwd Packets']}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Predictions */}
          <div className="bg-white dark:bg-[#111011] rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-4">APT Detection Results</h2>
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Status: {predictions?.status}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Message: {predictions?.message}
              </p>
            </div>
            <div className="overflow-auto max-h-[600px]">
              <table className="min-w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-2">Index</th>
                    <th className="px-4 py-2">Prediction</th>
                    <th className="px-4 py-2">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions?.predictions.map((pred, index) => (
                    <tr key={index} className="border-b dark:border-gray-700">
                      <td className="px-4 py-2">{pred.index}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          pred.prediction === 'NormalTraffic' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {pred.prediction}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${pred.confidence * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {(pred.confidence * 100).toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


