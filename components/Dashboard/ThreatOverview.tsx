"use client"
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, AlertTriangle, XCircle, Wifi, WifiOff, Bluetooth, Signal, ChevronDown, ChevronUp } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface NetworkInterface {
  name: string;
  type: string;
  state: string;
  speed: number;
  ip: string;
  mac: string;
}

interface ThreatOverviewProps {
  response: {
    statusCode: number;
    data: {
      summary: {
        lowRisk: number;
        mediumRisk: number;
        highRisk: number;
        total: number;
      };
      details: {
        connections: Array<{
          interface: string;
          state?: string;
          risk: string;
          upload?: number;
          download?: number;
        }>;
        wireless: Array<{
          type: string;
          name: string;
          signal?: number;
          security?: string;
          address?: string;
          connected?: boolean;
          risk: string;
        }>;
        processes: Array<any>;
      };
      connections: {
        ethernet: number;
        wifi: number;
        bluetooth: number;
      };
      timestamp: string;
      networkInterfaces: NetworkInterface[];
    };
    message: string;
  };
}

const ThreatOverview = ({ response }: ThreatOverviewProps) => {
  const [isNetworkOpen, setIsNetworkOpen] = useState(false);
  const [isWirelessOpen, setIsWirelessOpen] = useState(false);
  const [isBluetoothOpen, setIsBluetoothOpen] = useState(false);

  console.log("response",response);
  if (!response || !response.data) {
    return (
      <Card className="bg-white dark:bg-[#111011] shadow-xl h-full">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <span className="text-gray-500">Loading...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const data = response.data;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-old-money-forest-green';
      case 'medium':
        return 'text-old-money-gold';
      case 'high':
        return 'text-old-money-burgundy';
      default:
        return 'text-gray-500';
    }
  };

  // Group Bluetooth devices by type
  const bluetoothDevices = data.details.wireless.filter(device => device.type === 'Bluetooth');
  const wifiDevices = data.details.wireless.filter(device => device.type === 'WiFi');

  return (
    <Card className="bg-white dark:bg-[#111011] shadow-xl">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CardTitle className="text-old-money-burgundy text-xl font-semibold">
              Threat Overview
            </CardTitle>
            <span className="text-sm px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
              {data.summary.total} Total
            </span>
          </div>
          <span className="text-sm text-gray-500">
            {new Date(data.timestamp).toLocaleString()}
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Risk Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex items-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
            <Shield className="text-old-money-forest-green mr-2" size={24} />
            <div>
              <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
                {data.summary.lowRisk}
              </span>
              <span className="text-sm block text-gray-600 dark:text-gray-400">Low Risk</span>
            </div>
          </div>
          <div className="flex items-center p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
            <AlertTriangle className="text-old-money-gold mr-2" size={24} />
            <div>
              <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
                {data.summary.mediumRisk}
              </span>
              <span className="text-sm block text-gray-600 dark:text-gray-400">Medium Risk</span>
            </div>
          </div>
          <div className="flex items-center p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
            <XCircle className="text-old-money-burgundy mr-2" size={24} />
            <div>
              <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
                {data.summary.highRisk}
              </span>
              <span className="text-sm block text-gray-600 dark:text-gray-400">High Risk</span>
            </div>
          </div>
        </div>

        {/* Connection Summary */}
        <div className="flex gap-3 text-sm bg-gray-50 dark:bg-gray-800/30 p-2 rounded-lg">
          <span className="text-gray-500">Active Connections:</span>
          <span className="font-medium">
            {data.connections.ethernet} ETH
          </span>
          <span>•</span>
          <span className="font-medium">
            {data.connections.wifi} WiFi
          </span>
          <span>•</span>
          <span className="font-medium">
            {data.connections.bluetooth} BT
          </span>
        </div>

        {/* Network Interfaces Collapsible */}
        <Collapsible open={isNetworkOpen} onOpenChange={setIsNetworkOpen}>
          <CollapsibleTrigger className="flex w-full items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors">
            <span className="font-medium">Network Interfaces</span>
            {isNetworkOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="max-h-[200px] overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              {data.networkInterfaces.map((interface_, index) => (
                <div 
                  key={index}
                  className="p-3 bg-gray-50 dark:bg-gray-800/20 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Wifi className="text-old-money-forest-green" size={16} />
                      <span className="font-medium">{interface_.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      interface_.state === 'up' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {interface_.state}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-gray-600 dark:text-gray-400">
                      <div>Speed: {interface_.speed} Mbps</div>
                      <div>IP: {interface_.ip}</div>
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      <div>Type: {interface_.type}</div>
                      <div>MAC: {interface_.mac}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* WiFi Devices Collapsible */}
        <Collapsible open={isWirelessOpen} onOpenChange={setIsWirelessOpen}>
          <CollapsibleTrigger className="flex w-full items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors">
            <span className="font-medium">WiFi Networks</span>
            {isWirelessOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="max-h-[200px] overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              {wifiDevices.map((device, index) => (
                <div 
                  key={index}
                  className="p-3 bg-gray-50 dark:bg-gray-800/20 rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Signal size={16} className={getRiskColor(device.risk)} />
                    <div>
                      <div className="text-sm font-medium">{device.name}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Signal: {Math.abs(device.signal)}dBm • Security: {Array.isArray(device.security) ? device.security.join(', ') : device.security}
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    device.risk === 'low' ? 'bg-green-100 text-green-800' :
                    device.risk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {device.risk}
                  </span>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Bluetooth Devices Collapsible */}
        <Collapsible open={isBluetoothOpen} onOpenChange={setIsBluetoothOpen}>
          <CollapsibleTrigger className="flex w-full items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors">
            <div className="flex items-center gap-2">
              <span className="font-medium">Bluetooth Devices</span>
              <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                {bluetoothDevices.length}
              </span>
            </div>
            {isBluetoothOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              <div className="grid grid-cols-2 gap-2">
                {bluetoothDevices.map((device, index) => (
                  <div 
                    key={index}
                    className="p-2 bg-gray-50 dark:bg-gray-800/20 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Bluetooth size={16} className={getRiskColor(device.risk)} />
                      <div>
                        <div className="text-sm font-medium truncate">{device.name}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {device.connected ? 'Connected' : 'Disconnected'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}

export default ThreatOverview

