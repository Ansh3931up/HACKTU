"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { Shield, Network, HardDrive } from "lucide-react"

ChartJS.register(ArcElement, Tooltip, Legend)

interface SecurityScoreProps {
  data: {
    score: number;
    details: {
      system: {
        issues: number;
        status: string;
        score: number;
      };
      network: {
        openPorts: number;
        activeConnections: number;
        status: string;
        score: number;
      };
      storage: {
        criticalDisks: number;
        status: string;
        score: number;
      };
    };
    recommendations: string[];
    timestamp: string;
  }
}

// Dummy data
export const dummySecurityData = {
  score: 85,
  details: {
    system: {
      issues: 2,
      status: "Secure",
      score: 95,
    },
    network: {
      openPorts: 10,
      activeConnections: 5,
      status: "Secure",
      score: 90,
    },
    storage: {
      criticalDisks: 1,
      status: "Secure",
      score: 90,
    },
  },
  recommendations: ["Consider adding more security measures"],
  timestamp: "2024-04-01T12:00:00",
}

const SecurityScore = ({ data }: SecurityScoreProps) => {
  const chartData = {
    labels: ["Secure", "At Risk"],
    datasets: [
      {
        data: [data.score, 100 - data.score],
        backgroundColor: ["#2E7D32", "#C62828"],
        hoverBackgroundColor: ["#1B5E20", "#8E0000"],
        borderWidth: 0,
      },
    ],
  }

  const options = {
    cutout: "70%",
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Secure":
        return "bg-green-50 text-green-500"
      case "At Risk":
        return "bg-red-50 text-red-500"
      default:
        return "bg-gray-50 text-gray-500"
    }
  }

  return (
    <Card className="bg-white dark:bg-[#111011] shadow-xl">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <CardTitle className="text-old-money-burgundy text-xl md:text-2xl font-semibold">
            Security Score
          </CardTitle>
          <span className="text-xs md:text-sm text-gray-500">
            {new Date(data.timestamp).toLocaleString()}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-4 md:pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Score Doughnut - Responsive container */}
          <div className="col-span-1 flex justify-center items-center">
            <div className="relative w-32 h-32 md:w-48 md:h-48">
              <Doughnut data={chartData} options={options} />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="text-2xl md:text-4xl font-bold text-gray-800 dark:text-gray-200">
                  {data.score}%
                </div>
                <div className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">
                  Overall Score
                </div>
              </div>
            </div>
          </div>

          {/* Details - Now more compact on mobile */}
          <div className="col-span-1 md:col-span-2 space-y-2 md:space-y-4">
            {/* System Status */}
            <div className="flex items-center justify-between p-2 md:p-3 rounded-lg bg-gray-50 dark:bg-gray-800/30">
              <div className="flex items-center gap-2 md:gap-3">
                <Shield className="text-old-money-forest-green" size={16} />
                <div>
                  <div className="text-sm md:text-base font-medium">System Security</div>
                  <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                    {data.details.system.issues} issues found
                  </div>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs md:text-sm ${getStatusColor(data.details.system.status)}`}>
                {data.details.system.score}%
              </span>
            </div>

            {/* Network Status */}
            <div className="flex items-center justify-between p-2 md:p-3 rounded-lg bg-gray-50 dark:bg-gray-800/30">
              <div className="flex items-center gap-2 md:gap-3">
                <Network className="text-old-money-gold" size={16} />
                <div>
                  <div className="text-sm md:text-base font-medium">Network Security</div>
                  <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                    {data.details.network.openPorts} ports • {data.details.network.activeConnections} conn.
                  </div>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs md:text-sm ${getStatusColor(data.details.network.status)}`}>
                {data.details.network.score}%
              </span>
            </div>

            {/* Storage Status */}
            <div className="flex items-center justify-between p-2 md:p-3 rounded-lg bg-gray-50 dark:bg-gray-800/30">
              <div className="flex items-center gap-2 md:gap-3">
                <HardDrive className="text-old-money-burgundy" size={16} />
                <div>
                  <div className="text-sm md:text-base font-medium">Storage Security</div>
                  <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                    {data.details.storage.criticalDisks} critical disks
                  </div>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs md:text-sm ${getStatusColor(data.details.storage.status)}`}>
                {data.details.storage.score}%
              </span>
            </div>
          </div>
        </div>

        {/* Recommendations - More compact on mobile */}
        {data.recommendations.length > 0 && (
          <div className="mt-4 md:mt-6">
            <div className="flex items-center gap-2 mb-2 md:mb-3">
              <AlertCircle size={14} className="text-old-money-gold" />
              <h3 className="text-sm md:text-base font-medium">Recommendations</h3>
            </div>
            <ul className="space-y-1 md:space-y-2">
              {data.recommendations.map((rec, index) => (
                <li 
                  key={index}
                  className="text-xs md:text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2"
                >
                  <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-old-money-gold rounded-full"></span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default SecurityScore
