import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Threat {
  type: string
  severity: "Low" | "Medium" | "High"
  source: string
  timestamp: string
}

interface ThreatDetailsProps {
  threats: Threat[]
}

const ThreatDetails = ({ threats }: ThreatDetailsProps) => {
  return (
    <Card className="bg-white dark:bg-[#111011] shadow-xl flex flex-col justify-between">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="text-old-money-burgundy text-3xl font-semibold">Threat Details</CardTitle>
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
            {threats.map((threat, index) => (
              <TableRow key={index}>
                <TableCell>{threat.type}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-2 rounded-full text-xs ${
                      threat.severity === "High"
                        ? "bg-red-100 text-red-800"
                        : threat.severity === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {threat.severity}
                  </span>
                </TableCell>
                <TableCell>{threat.source}</TableCell>
                <TableCell>{new Date(threat.timestamp).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default ThreatDetails

