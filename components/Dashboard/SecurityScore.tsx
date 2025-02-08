"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend)

interface SecurityScoreProps {
  scores: {
    secure: number;
    atRisk: number;
  }
}

// Dummy data
export const dummySecurityData = {
  secure: 85,
  atRisk: 15,
}

const SecurityScore = ({ scores = dummySecurityData }: SecurityScoreProps) => {
  const data = {
    labels: ["Secure", "At Risk"],
    datasets: [
      {
        data: [scores.secure, scores.atRisk],
        backgroundColor: ["#2E7D32", "#C62828"],
        hoverBackgroundColor: ["#1B5E20", "#8E0000"],
        borderWidth: 0,
      },
    ],
  }

  const options = {
    cutout: "75%",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 20,
          color: "#36454F",
          font: {
            size: 14,
            weight: 'bold' as const,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.raw}%`;
          }
        }
      }
    },
  }

  return (
    <Card className="bg-white dark:bg-[#111011] shadow-xl h-full">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <CardTitle className="text-old-money-burgundy text-3xl font-semibold">
            Security Score
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative h-64 py-4">
          <Doughnut data={data} options={options} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-4xl font-bold text-gray-800 dark:text-gray-200">
              {scores.secure}%
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Secure
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              {scores.secure}%
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Secure Assets
            </div>
          </div>
          <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              {scores.atRisk}%
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              At Risk Assets
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SecurityScore
