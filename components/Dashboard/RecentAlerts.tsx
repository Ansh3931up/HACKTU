"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Alert {
  id: number;
  type: string;
  severity: "High" | "Medium" | "Low";
  source: string;
  timestamp: string;
}

interface RecentAlertsProps {
  alerts: Alert[];
}

// Dummy data
export const dummyAlertData: Alert[] = [
  { 
    id: 1, 
    type: "Suspicious Login", 
    severity: "High", 
    source: "192.168.1.100", 
    timestamp: "2023-06-10 14:30:22" 
  },
  { 
    id: 2, 
    type: "Port Scan Detected", 
    severity: "Medium", 
    source: "10.0.0.5", 
    timestamp: "2023-06-10 13:45:10" 
  },
  { 
    id: 3, 
    type: "Malware Detected", 
    severity: "High", 
    source: "172.16.0.50", 
    timestamp: "2023-06-10 12:15:33" 
  },
  { 
    id: 4, 
    type: "Failed Authentication", 
    severity: "Low", 
    source: "192.168.1.25", 
    timestamp: "2023-06-10 11:20:45" 
  },
]

const RecentAlerts = ({ alerts = dummyAlertData }: RecentAlertsProps) => {
  // Add a check to ensure alerts is an array
  const alertsArray = Array.isArray(alerts) ? alerts : [];
  
  return (
    <Card className="bg-white dark:bg-[#111011] shadow-xl h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-old-money-burgundy text-3xl font-semibold">Recent Alerts</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-old-money-navy-blue">
              <TableHead className="text-gray-800 dark:text-gray-200">Type</TableHead>
              <TableHead className="text-gray-800 dark:text-gray-200">Severity</TableHead>
              <TableHead className="text-gray-800 dark:text-gray-200">Source</TableHead>
              <TableHead className="text-gray-800 dark:text-gray-200">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alertsArray.map((alert) => (
              <TableRow key={alert.id} className="hover:bg-old-money-gold/10">
                <TableCell className="font-medium">{alert.type}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-2 rounded-full text-xs ${
                      alert.severity === "High"
                        ? "bg-old-money-burgundy text-old-money-cream"
                        : alert.severity === "Medium"
                          ? "bg-old-money-gold text-old-money-charcoal"
                          : "bg-old-money-forest-green text-old-money-cream"
                    }`}
                  >
                    {alert.severity}
                  </span>
                </TableCell>
                <TableCell>{alert.source}</TableCell>
                <TableCell>{alert.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default RecentAlerts