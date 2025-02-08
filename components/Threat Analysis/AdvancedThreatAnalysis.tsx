"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

// Register required components in Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const aptData = [
  { name: "Detected", value: 15 },
  { name: "Mitigated", value: 12 },
  { name: "Ongoing", value: 3 },
]

const zeroData = [
  { name: "Identified", value: 5 },
  { name: "Patched", value: 3 },
  { name: "Exploited", value: 2 },
]

const phishingData = [
  { name: "Attempts", value: 100 },
  { name: "Blocked", value: 95 },
  { name: "Reported", value: 3 },
  { name: "Successful", value: 2 },
]

const AdvancedThreatAnalysis = () => {
  const [activeTab, setActiveTab] = useState("apt")

  const renderChart = (data: { name: string; value: number }[]) => {
    const chartData = {
      labels: data.map((item) => item.name),
      datasets: [
        {
          label: "Threat Data",
          data: data.map((item) => item.value),
          backgroundColor: "#30006C",
          borderColor: "#4F46E5",
          borderWidth: 1,
        },
      ],
    }

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          callbacks: {
            label: (context: any) => `${context.dataset.label}: ${context.raw}`,
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Category",
          },
          grid: {
            display: true, // Keep the grid lines on
            color: "rgba(255, 255, 255, 0.1)",
          },
        },
        y: {
          title: {
            display: true,
            text: "Value",
          },
          grid: {
            display: true, // Keep the grid lines on
            color: "rgba(255, 255, 255, 0.1)",
          },
          beginAtZero: true,
        },
      },
    }

    return (
      <div className="h-72"> {/* Reduced height */}
        <Bar data={chartData} options={chartOptions} />
      </div>
    )
  }

  return (
    <Card className="bg-white dark:bg-[#111011] shadow-xl flex flex-col justify-between">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="text-old-money-burgundy text-3xl font-semibold">Advanced Threat Analysis</CardTitle>
        <CardDescription>Analysis of APTs, Zero-Day Vulnerabilities, and Phishing Attacks</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 gap-2">
            <TabsTrigger
              value="apt"
              className={`border-2 border-[#30006C] p-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === "apt" 
                  ? "bg-transparent text-[#30006C]" 
                  : "bg-[#30006C] text-white hover:bg-[#30006C]/90"
              }`}
            >
              APT
            </TabsTrigger>
            <TabsTrigger
              value="zeroday"
              className={`border-2 border-[#30006C] p-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === "zeroday"
                  ? "bg-transparent text-[#30006C]"
                  : "bg-[#30006C] text-white hover:bg-[#30006C]/90"
              }`}
            >
              Zero-Day
            </TabsTrigger>
            <TabsTrigger
              value="phishing"
              className={`border-2 border-[#30006C] p-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === "phishing"
                  ? "bg-transparent text-[#30006C]"
                  : "bg-[#30006C] text-white hover:bg-[#30006C]/90"
              }`}
            >
              Phishing
            </TabsTrigger>
          </TabsList>
          <TabsContent value="apt">
            <h3 className="text-lg font-semibold mb-2">Advanced Persistent Threats (APTs)</h3>
            <p className="mb-4">Our APT protection uses AI-driven behavior analysis and network segmentation.</p>
            {renderChart(aptData)}
          </TabsContent>
          <TabsContent value="zeroday">
            <h3 className="text-lg font-semibold mb-2">Zero-Day Vulnerabilities</h3>
            <p className="mb-4">We employ machine learning for anomaly detection and rapid patch deployment.</p>
            {renderChart(zeroData)}
          </TabsContent>
          <TabsContent value="phishing">
            <h3 className="text-lg font-semibold mb-2">Phishing Attacks</h3>
            <p className="mb-4">
              Our anti-phishing measures include email filtering, user training, and real-time link analysis.
            </p>
            {renderChart(phishingData)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default AdvancedThreatAnalysis
