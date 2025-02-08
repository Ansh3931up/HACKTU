"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ExclamationTriangleIcon, ShieldCheckIcon } from "@heroicons/react/24/outline"
import { securityToolsService } from "@/services/api/securityToolsService"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function VulnerabilityScanner() {
  const [target, setTarget] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)

  const handleScan = async () => {
    try {
      setLoading(true)
      const data = await securityToolsService.runVulnerabilityScan(target)
      setResults(data.data)
    } catch (error) {
      console.error("Scan failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'bg-red-500'
      case 'medium':
        return 'bg-yellow-500'
      case 'low':
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vulnerability Scanner</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Input
              placeholder="Enter IP address or hostname"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            />
            <Button onClick={handleScan} disabled={loading}>
              {loading ? "Scanning..." : "Start Scan"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Scan Results
              <div className="flex space-x-4">
                <Badge variant="destructive">High: {results.data.summary.high}</Badge>
                <Badge variant="warning">Medium: {results.data.summary.medium}</Badge>
                <Badge variant="secondary">Low: {results.data.summary.low}</Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] pr-4">
              <Accordion type="single" collapsible className="space-y-4">
                {/* High Severity Vulnerabilities */}
                <AccordionItem value="high">
                  <AccordionTrigger className="text-red-500 font-semibold">
                    High Severity Vulnerabilities ({results.data.vulnerabilities.high.length})
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      {results.data.vulnerabilities.high.map((vuln: any, index: number) => (
                        <Alert key={index} variant="destructive">
                          <ExclamationTriangleIcon className="h-4 w-4" />
                          <AlertTitle>Port {vuln.port} ({vuln.service})</AlertTitle>
                          <AlertDescription>
                            <div className="mt-2 space-y-2">
                              <p><strong>Script:</strong> {vuln.scriptId}</p>
                              <p><strong>State:</strong> {vuln.state}</p>
                              <div className="mt-2">
                                <strong>Recommendations:</strong>
                                <ul className="list-disc pl-6 mt-1">
                                  {vuln.recommendations.map((rec: string, idx: number) => (
                                    <li key={idx}>{rec}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Medium Severity Vulnerabilities */}
                <AccordionItem value="medium">
                  <AccordionTrigger className="text-yellow-500 font-semibold">
                    Medium Severity Vulnerabilities ({results.data.vulnerabilities.medium.length})
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      {results.data.vulnerabilities.medium.map((vuln: any, index: number) => (
                        <Alert key={index} variant="warning">
                          <ExclamationTriangleIcon className="h-4 w-4" />
                          <AlertTitle>Port {vuln.port} ({vuln.service})</AlertTitle>
                          <AlertDescription>
                            <div className="mt-2 space-y-2">
                              <p><strong>Script:</strong> {vuln.scriptId}</p>
                              <p><strong>State:</strong> {vuln.state}</p>
                              <div className="mt-2">
                                <strong>Recommendations:</strong>
                                <ul className="list-disc pl-6 mt-1">
                                  {vuln.recommendations.map((rec: string, idx: number) => (
                                    <li key={idx}>{rec}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Low Severity Vulnerabilities */}
                <AccordionItem value="low">
                  <AccordionTrigger className="text-blue-500 font-semibold">
                    Low Severity Vulnerabilities ({results.data.vulnerabilities.low.length})
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      {results.data.vulnerabilities.low.map((vuln: any, index: number) => (
                        <Alert key={index}>
                          <ShieldCheckIcon className="h-4 w-4" />
                          <AlertTitle>Port {vuln.port} ({vuln.service})</AlertTitle>
                          <AlertDescription>
                            <div className="mt-2 space-y-2">
                              <p><strong>Script:</strong> {vuln.scriptId}</p>
                              <p><strong>State:</strong> {vuln.state}</p>
                              <div className="mt-2">
                                <strong>Recommendations:</strong>
                                <ul className="list-disc pl-6 mt-1">
                                  {vuln.recommendations.map((rec: string, idx: number) => (
                                    <li key={idx}>{rec}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 