"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { securityToolsService, type DarkWebResult } from "@/services/api/securityToolsService"

export default function DarkWebMonitor() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<DarkWebResult | null>(null)

  const handleCheck = async () => {
    try {
      setLoading(true)
      const data = await securityToolsService.checkDarkWeb(email)
      setResults(data)
    } catch (error) {
      console.error("Dark web check failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dark Web Monitor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <Input 
            type="email"
            placeholder="Enter email to check" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button 
            onClick={handleCheck}
            disabled={loading}
          >
            {loading ? "Checking..." : "Check Email"}
          </Button>
        </div>

        {results && (
          <ScrollArea className="h-[400px] rounded-md border p-4">
            <div className="space-y-4">
              {results.breaches.map((breach, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{breach.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {breach.domain} - {breach.breachDate}
                    </p>
                    <p className="text-sm">{breach.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
} 