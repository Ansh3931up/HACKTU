"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, AlertTriangle, Shield, Activity, Database, Network, Lock } from "lucide-react"
import { formatDistanceToNow } from 'date-fns'

interface Alert {
  id: string;
  type: string;
  severity: string;
  message: string;
  source: string;
  details: {
    state?: string;
    process?: string;
  };
  timestamp: string;
}

interface AlertsData {
  total: number;
  critical: number;
  warning: number;
  categories: {
    system: number;
    network: number;
    security: number;
    storage: number;
  };
  alerts: Alert[];
}

interface RecentAlertsProps {
  data: AlertsData;
}

// Dummy data
export const dummyAlertData: AlertsData = {
  total: 4,
  critical: 1,
  warning: 1,
  categories: {
    system: 1,
    network: 1,
    security: 1,
    storage: 1,
  },
  alerts: [
    {
      id: "1",
      type: "Suspicious Login",
      severity: "High",
      message: "Login attempt from 192.168.1.100",
      source: "192.168.1.100",
      details: {},
      timestamp: "2023-06-10T14:30:22"
    },
    {
      id: "2",
      type: "Port Scan Detected",
      severity: "Medium",
      message: "Port scan detected from 10.0.0.5",
      source: "10.0.0.5",
      details: {},
      timestamp: "2023-06-10T13:45:10"
    },
    {
      id: "3",
      type: "Malware Detected",
      severity: "High",
      message: "Malware detected on 172.16.0.50",
      source: "172.16.0.50",
      details: {},
      timestamp: "2023-06-10T12:15:33"
    },
    {
      id: "4",
      type: "Failed Authentication",
      severity: "Low",
      message: "Failed authentication attempt from 192.168.1.25",
      source: "192.168.1.25",
      details: {},
      timestamp: "2023-06-10T11:20:45"
    },
  ]
}

const RecentAlerts = ({ data }: RecentAlertsProps) => {
  console.log("data",data);
  const getAlertIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'security':
        return <Lock className="text-yellow-500" size={18} />;
      case 'system':
        return <Activity className="text-blue-500" size={18} />;
      case 'network':
        return <Network className="text-purple-500" size={18} />;
      case 'storage':
        return <Database className="text-green-500" size={18} />;
      default:
        return <AlertCircle className="text-gray-500" size={18} />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getCategoryBadgeColor = (count: number) => {
    if (count === 0) return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400';
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
  };

  return (
    <Card className="bg-white dark:bg-[#111011] shadow-xl">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CardTitle className="text-old-money-burgundy text-xl md:text-2xl font-semibold">
              Recent Alerts
            </CardTitle>
            <span className="text-sm px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
              {data.total} Total
            </span>
          </div>
          <div className="flex gap-3">
            {data.warning > 0 && (
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="text-yellow-500" size={16} />
                <span className="text-sm">{data.warning}</span>
              </div>
            )}
            {data.critical > 0 && (
              <div className="flex items-center gap-1.5">
                <Shield className="text-red-500" size={16} />
                <span className="text-sm">{data.critical}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        {/* Category Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {Object.entries(data.categories).map(([category, count]) => (
            <div 
              key={category}
              className={`p-2 rounded-lg flex items-center justify-between ${getCategoryBadgeColor(count)}`}
            >
              <div className="flex items-center gap-2">
                {getAlertIcon(category)}
                <span className="text-xs md:text-sm capitalize">{category}</span>
              </div>
              <span className="text-xs md:text-sm font-medium">{count}</span>
            </div>
          ))}
        </div>

        {/* Alerts List */}
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          {data.alerts.map((alert, index) => (
            <div
              key={`${alert.id}-${index}`}
              className="p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg space-y-2 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getAlertIcon(alert.type)}
                  <span className="text-sm font-medium">{alert.source}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(alert.severity)}`}>
                  {alert.severity}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {alert.message}
              </p>
              
              {alert.details && Object.entries(alert.details).some(([_, value]) => value) && (
                <div className="text-xs text-gray-500 dark:text-gray-500 flex gap-3">
                  {Object.entries(alert.details).map(([key, value]) => (
                    value && (
                      <span key={key} className="flex items-center gap-1">
                        <span className="font-medium capitalize">{key}:</span>
                        <span>{value}</span>
                      </span>
                    )
                  ))}
                </div>
              )}
              
              <div className="text-xs text-gray-400">
                {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default RecentAlerts