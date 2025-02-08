"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ShieldCheckIcon, ShieldExclamationIcon } from "@heroicons/react/24/outline"
import { securityToolsService } from "@/services/api/securityToolsService"

export default function IPReputation() {
  const [ip, setIp] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleCheck = async () => {
    try {
      setLoading(true)
      const response = await securityToolsService.checkIPReputation(ip)
      // Ensure we're setting the correct level of the response data
      setResult(response.data.data)
    } catch (error) {
      console.error("IP reputation check failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'safe':
        return 'bg-green-500'
      case 'medium':
        return 'bg-yellow-500'
      case 'high':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>IP Reputation Checker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <Input 
            placeholder="Enter IP address..."
            value={ip}
            onChange={(e) => setIp(e.target.value)}
          />
          <Button 
            onClick={handleCheck}
            disabled={loading}
          >
            {loading ? "Checking..." : "Check IP"}
          </Button>
        </div>

        {result && (
          <div className="space-y-4">
            {/* API Quota Status */}
            {result.quotaStatus && (
              <Card className="bg-gray-50 dark:bg-gray-900">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">API Quota Status</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Checks</p>
                      <p className="font-medium">{result.quotaStatus.check}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Reports</p>
                      <p className="font-medium">{result.quotaStatus.reports}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* IP Details */}
            {result.ipDetails && (
              <Card>
                <CardContent className="p-4">
                  <div className="grid gap-4">
                    {/* Summary Section */}
                    {result.summary && (
                      <div className="flex items-center justify-between border-b pb-4">
                        <div>
                          <h3 className="font-semibold mb-1">Risk Assessment</h3>
                          <div className="flex items-center gap-2">
                            <Badge className={`${getRiskColor(result.summary.riskLevel)} text-white`}>
                              {result.summary.riskLevel}
                            </Badge>
                            <p className="text-sm text-gray-500">
                              Confidence Score: {result.summary.confidenceScore}%
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Last Reported</p>
                          <p className="font-medium">{result.summary.lastReported}</p>
                        </div>
                      </div>
                    )}

                    {/* IP Information */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold mb-1">IP Address</h3>
                        <div className="flex items-center gap-2">
                          <p>{result.ipDetails.ip}</p>
                          <Badge variant="outline">IPv{result.ipDetails.ipVersion}</Badge>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-1">Usage Type</h3>
                        <p>{result.ipDetails.usageType || "N/A"}</p>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-1">ISP</h3>
                        <p>{result.ipDetails.isp || "N/A"}</p>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-1">Domain</h3>
                        <p>{result.ipDetails.domain || "N/A"}</p>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-1">Country</h3>
                        <p>{result.ipDetails.countryCode || "N/A"}</p>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-1">Total Reports</h3>
                        <p>{result.ipDetails.totalReports}</p>
                      </div>
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t">
                      <Badge variant={result.ipDetails.isPublic ? "default" : "secondary"}>
                        {result.ipDetails.isPublic ? "Public IP" : "Private IP"}
                      </Badge>
                      {result.ipDetails.isWhitelisted && (
                        <Badge variant="outline">Whitelisted</Badge>
                      )}
                    </div>

                    {/* Reports Section */}
                    {result.reports && result.reports.length > 0 && (
                      <div className="pt-4 border-t">
                        <h3 className="font-semibold mb-2">Recent Reports</h3>
                        <div className="space-y-2">
                          {result.reports.map((report: any, index: number) => (
                            <div key={index} className="p-2 bg-gray-50 dark:bg-gray-900 rounded">
                              <p className="text-sm">{report}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 