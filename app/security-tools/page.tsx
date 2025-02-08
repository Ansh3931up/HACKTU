"use client"

import { useState } from "react"
import Header from "@/components/Header"
import SecurityScanner from "@/components/SecurityTools/SecurityScanner"
import DarkWebMonitor from "@/components/SecurityTools/DarkWebMonitor"
import ReportGenerator from "@/components/SecurityTools/ReportGenerator"
import IPReputation from "@/components/SecurityTools/IPReputation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SecurityTools() {
  return (
    <div className="min-h-screen bg-[#EEECEF] dark:bg-[#1F1F1F]">
      <Header 
        title="Security Tools" 
        subtitle="Advanced network security analysis tools"
      />

      <div className="container mx-auto p-6 space-y-6">
        <Tabs defaultValue="vulnerability" className="space-y-6">
          <TabsList>
            <TabsTrigger value="vulnerability">Vulnerability Scanner</TabsTrigger>
            <TabsTrigger value="darkweb">Dark Web Monitor</TabsTrigger>
            <TabsTrigger value="report">Report Generator</TabsTrigger>
            <TabsTrigger value="reputation">IP Reputation</TabsTrigger>
          </TabsList>

          <TabsContent value="vulnerability">
            <SecurityScanner />
          </TabsContent>

          <TabsContent value="darkweb">
            <DarkWebMonitor />
          </TabsContent>

          <TabsContent value="report">
            <ReportGenerator />
          </TabsContent>

          <TabsContent value="reputation">
            <IPReputation />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
