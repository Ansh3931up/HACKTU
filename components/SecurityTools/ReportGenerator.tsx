"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { securityToolsService } from "@/services/api/securityToolsService"
import { toast } from "sonner"

export default function ReportGenerator() {
  const [target, setTarget] = useState("")
  const [loading, setLoading] = useState(false)

  const handleGenerateReport = async () => {
    if (!target) {
      toast.error("Please enter a target IP or domain")
      return
    }

    try {
      setLoading(true)
      toast.info("Generating report... This may take a few minutes.")
      
      const response = await securityToolsService.generateReport(target)
      
      const url = window.URL.createObjectURL(response)
      const a = document.createElement('a')
      a.href = url
      a.download = `Security_Report_${target.replace(/[\/\\]/g, '_')}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      toast.success("Report generated successfully")
    } catch (error: any) {
      console.error("Report generation failed:", error)
      toast.error(error.message || "Failed to generate report. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Report Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Generate a comprehensive security report for any IP address or domain. 
            This process may take several minutes to complete.
          </p>
          
          <div className="flex gap-4">
            <Input 
              placeholder="Enter target IP or domain" 
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              disabled={loading}
            />
            <Button 
              onClick={handleGenerateReport}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⚡</span>
                  Scanning...
                </>
              ) : (
                "Generate Report"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 