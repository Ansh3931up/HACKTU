"use client"
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Shield, Clock } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { networkApi } from '@/services/api/network'

interface SecurityAnalysisProps {
  ipRange: string;
}

const SecurityAnalysis = ({ ipRange }: SecurityAnalysisProps) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        const result = await networkApi.getSecurityAnalysis(ipRange);
        setAnalysis(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load security analysis');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [ipRange]);

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) return <div>Loading analysis...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!analysis) return null;

  return (
    <div className="space-y-4 px-2 sm:px-4 w-full max-w-full overflow-x-hidden">
      <Card className="w-full">
        <CardHeader className="p-4">
          <CardTitle className="flex flex-col gap-2 text-base">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">Security Analysis Report</span>
            </div>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(analysis.timestamp).toLocaleString()}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4">
          <div className="grid grid-cols-2 gap-2 mb-4">
            <Card className="p-2">
              <CardContent className="p-2">
                <div className="text-base sm:text-lg font-bold">{analysis.summary.totalVulnerabilities}</div>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Total Issues</p>
              </CardContent>
            </Card>
            <Card className="p-2">
              <CardContent className="p-2">
                <div className="text-2xl font-bold text-red-500">{analysis.summary.criticalCount}</div>
                <p className="text-xs text-muted-foreground">Critical</p>
              </CardContent>
            </Card>
            <Card className="p-2">
              <CardContent className="p-2">
                <div className="text-2xl font-bold text-orange-500">{analysis.summary.highCount}</div>
                <p className="text-xs text-muted-foreground">High</p>
              </CardContent>
            </Card>
            <Card className="p-2">
              <CardContent className="p-2">
                <div className="text-2xl font-bold text-yellow-500">{analysis.summary.mediumCount}</div>
                <p className="text-xs text-muted-foreground">Medium</p>
              </CardContent>
            </Card>
          </div>

          <Accordion type="single" collapsible className="space-y-2">
            <AccordionItem value="vulnerabilities" className="border-none">
              <AccordionTrigger className="text-xs sm:text-sm py-2 px-3">
                Vulnerabilities Found
              </AccordionTrigger>
              <AccordionContent className="px-1">
                {analysis.vulnerabilities.map((vuln: any, idx: number) => (
                  <Alert key={idx} className="mb-2 p-2 text-xs">
                    <div className="flex flex-wrap items-center gap-1 mb-1">
                      <Badge className={`${getSeverityColor(vuln.severity)} text-[10px] px-1 py-0`}>
                        {vuln.severity}
                      </Badge>
                      <span className="text-xs font-medium break-all">{vuln.host}:{vuln.port}</span>
                    </div>
                    <AlertTitle className="text-xs">{vuln.service} - {vuln.vulnerability}</AlertTitle>
                    <AlertDescription className="mt-1 text-[10px] sm:text-xs break-words">
                      {vuln.description}
                    </AlertDescription>
                  </Alert>
                ))}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="recommendations" className="border-none">
              <AccordionTrigger className="text-xs sm:text-sm py-2 px-3">
                Recommendations
              </AccordionTrigger>
              <AccordionContent className="px-1">
                {analysis.recommendations.map((rec: any, idx: number) => (
                  <Alert key={idx} className="mb-2 p-2">
                    <div className="flex flex-col gap-2">
                      <AlertTitle className="flex flex-wrap items-center gap-1 text-xs">
                        <Badge className={`${getSeverityColor(rec.priority)} text-[10px] px-1 py-0`}>
                          {rec.priority}
                        </Badge>
                        <span className="break-words">{rec.service}</span>
                      </AlertTitle>

                      <div className="text-[10px] sm:text-xs">
                        <span className="font-semibold">Reason: </span>
                        <span className="break-words">{rec.reason}</span>
                      </div>

                      <div className="text-[10px] sm:text-xs">
                        <span className="font-semibold">Action: </span>
                        <span className="break-words">{rec.action}</span>
                      </div>

                      <AlertDescription>
                        <div className="font-semibold text-[10px] sm:text-xs mb-1">Implementation Details:</div>
                        <ul className="list-disc ml-3 text-[10px] sm:text-xs space-y-1">
                          {rec.details.map((detail: string, dIdx: number) => (
                            <li key={dIdx} className="break-words">{detail}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </div>
                  </Alert>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityAnalysis; 