"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, AlertTriangle, XCircle } from "lucide-react"

interface ThreatOverviewProps {
  threats: {
    lowRisk: number;
    mediumRisk: number;
    highRisk: number;
  }
}

// Dummy data
export const dummyThreatData = {
  lowRisk: 85,
  mediumRisk: 12,
  highRisk: 3,
}

const ThreatOverview = ({ threats = dummyThreatData }: ThreatOverviewProps) => {
  return (
    <Card className="bg-white dark:bg-[#111011] shadow-xl h-full">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <CardTitle className="text-old-money-burgundy text-3xl font-semibold">
            Threat Overview
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-3 gap-6">
          <div className="flex flex-col items-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
            <Shield className="text-old-money-forest-green mb-3" size={40} />
            <span className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-1">
              {threats.lowRisk}
            </span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Low Risk
            </span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
            <AlertTriangle className="text-old-money-gold mb-3" size={40} />
            <span className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-1">
              {threats.mediumRisk}
            </span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Medium Risk
            </span>
          </div>
          <div className="flex flex-col items-center p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
            <XCircle className="text-old-money-burgundy mb-3" size={40} />
            <span className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-1">
              {threats.highRisk}
            </span>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              High Risk
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ThreatOverview
