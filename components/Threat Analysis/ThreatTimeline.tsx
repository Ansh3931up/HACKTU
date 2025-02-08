import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ThreatEvent {
  type: string
  severity: "Low" | "Medium" | "High"
  source: string
  timestamp: string
}

interface ThreatTimelineProps {
  events: ThreatEvent[]
}

const ThreatTimeline = ({ events }: ThreatTimelineProps) => {
  return (
    <Card className="bg-white dark:bg-[#111011] shadow-xl flex flex-col justify-between">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="text-old-money-burgundy text-3xl font-semibold">Threat Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4 pt-4">
          <div className="space-y-8">
            {events.map((event, index) => (
              <div key={index} className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full border ${
                      event.severity === "High"
                        ? "bg-red-100 border-red-500"
                        : event.severity === "Medium"
                          ? "bg-yellow-100 border-yellow-500"
                          : "bg-green-100 border-green-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < events.length - 1 && <div className="w-px h-full bg-gray-200"></div>}
                </div>
                <div className="pb-8">
                  <div className="flex items-center mb-1">
                    <div className="text-sm font-semibold">{new Date(event.timestamp).toLocaleString()}</div>
                    <div
                      className={`ml-2 text-xs font-medium px-2 py-1 rounded-full ${
                        event.severity === "High"
                          ? "bg-red-100 text-red-800"
                          : event.severity === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {event.severity}
                    </div>
                  </div>
                  <p className="text-gray-500">
                    {event.type} from {event.source}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default ThreatTimeline

