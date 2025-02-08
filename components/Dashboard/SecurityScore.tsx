"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { Shield, Network, HardDrive, Activity, AlertCircle, Database, Lock } from "lucide-react"

ChartJS.register(ArcElement, Tooltip, Legend)

interface SecurityDetails {
  score: number;
  status: string;
  issues?: number;
  openPorts?: number;
  activeConnections?: number;
  criticalDisks?: number;
}

interface SecurityScoreData {
  score: number;
  secure: number;
  atRisk: number;
  details: {
    system: SecurityDetails;
    network: SecurityDetails;
    storage: SecurityDetails;
  };
  recommendations: string[];
  timestamp: string;
}

interface SecurityScoreProps {
  data: SecurityScoreData;
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
  console.log('d1',data);
  if (!data || !data.details) {
    return (
      <Card className="bg-white dark:bg-[#111011] shadow-xl">
        <CardContent className="p-6">
          <div className="text-center text-gray-500">No data available</div>
        </CardContent>
      </Card>
    );
  }

  const chartData = {
    labels: ["Secure", "At Risk"],
    datasets: [
      {
        data: [data.secure, data.atRisk],
        backgroundColor: ["#2E7D32", "#C62828"],
        hoverBackgroundColor: ["#1B5E20", "#8E0000"],
        borderWidth: 0,
      },
    ],
  };

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
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'excellent':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'good':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'fair':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      default:
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
    }
  };

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
          {/* Score Doughnut */}
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

          {/* Category Summary */}
          <div className="col-span-1 md:col-span-2 space-y-2 md:space-y-4">
            {data.details && Object.entries(data.details).map(([category, details]) => (
              <div key={category} className="flex items-center justify-between p-2 md:p-3 rounded-lg bg-gray-50 dark:bg-gray-800/30">
                <div className="flex items-center gap-2 md:gap-3">
                  {getAlertIcon(category)}
                  <div>
                    <div className="text-sm md:text-base font-medium capitalize">{category}</div>
                    <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                      {category === 'network' && details.openPorts !== undefined && details.activeConnections !== undefined
                        ? `${details.openPorts} ports • ${details.activeConnections} connections`
                        : category === 'system' && details.issues !== undefined
                        ? `${details.issues} issues`
                        : category === 'storage' && details.criticalDisks !== undefined
                        ? `${details.criticalDisks} critical disks`
                        : 'No data'}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-2 py-1 rounded-full text-xs md:text-sm ${getStatusColor(details.status)}`}>
                    {details.status}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    {details.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        {data.recommendations.length > 0 && (
          <div className="mt-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/30">
            <div className="text-sm font-medium mb-2">Recommendations</div>
            <ul className="space-y-1">
              {data.recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Helper function to get icon for category
const getAlertIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'system':
      return <Activity className="text-blue-500" size={20} />;
    case 'network':
      return <Network className="text-purple-500" size={20} />;
    case 'security':
      return <Lock className="text-red-500" size={20} />;
    case 'storage':
      return <Database className="text-green-500" size={20} />;
    default:
      return <AlertCircle className="text-gray-500" size={20} />;
  }
};

export default SecurityScore;
