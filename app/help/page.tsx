'use client'
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"


export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#EEECEF] dark:bg-[#1F1F1F]">
      <Header 
        title="Help" 
        subtitle="We are here to help you"
      />
      <div className="container mx-auto p-4">
        <Card className="max-w-7xl h-auto mx-auto bg-white dark:bg-[#111011] shadow-xl">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="text-gray-900 dark:text-gray-100">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300">
                  How do I interpret the threat analysis results?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 dark:text-gray-300">
                  The threat analysis results provide an overview of potential security risks. Pay attention to high-risk
                  threats and follow the recommended actions to mitigate them.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300">
                  What should I do if I detect a security breach?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 dark:text-gray-300">
                  If you detect a security breach, immediately isolate the affected systems, change all passwords, and
                  contact our support team for further assistance.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300">
                  How often should I run security scans?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 dark:text-gray-300">
                  We recommend running comprehensive security scans at least once a week. However, real-time monitoring
                  should be enabled at all times for immediate threat detection.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
