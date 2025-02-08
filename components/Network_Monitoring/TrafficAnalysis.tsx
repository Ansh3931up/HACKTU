'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface TrafficData {
  networkData: {
    trafficData: {
      inbound: number[]
      outbound: number[]
    }
  }
}

const TrafficAnalysis = ({ networkData }: TrafficData) => {
  const data = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    datasets: [
      {
        label: 'Inbound Traffic',
        data: networkData.trafficData.inbound,
        fill: false,
        borderColor: '#2563eb',
        backgroundColor: '#2563eb',
        tension: 0.4,
      },
      {
        label: 'Outbound Traffic',
        data: networkData.trafficData.outbound,
        fill: false,
        borderColor: '#7c3aed',
        backgroundColor: '#7c3aed',
        tension: 0.4,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(156, 163, 175)',
          boxWidth: 10,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgb(75, 85, 99, 0.2)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
      },
    },
  }

  return (
    <Card className="bg-white dark:bg-[#1F1F1F] shadow-md">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="text-gray-800 dark:text-gray-200">
          Traffic Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Line data={data} options={options} />
      </CardContent>
    </Card>
  )
}

export default TrafficAnalysis
