'use client'

import { useRef, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import * as d3 from 'd3'

interface Device {
  name: string
  ip: string
  status: 'Online' | 'Offline'
  lastSeen: string
  ports?: string[]
  os?: string
}

interface NetworkTopologyProps {
  devices: Device[]
}

type ViewMode = 'devices' | 'ports' | 'services'

const NetworkTopology = ({ devices }: NetworkTopologyProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('devices')
  const [selectedNode, setSelectedNode] = useState<any>(null)

  const generateNodes = () => {
    switch (viewMode) {
      case 'devices':
        return devices.map((device) => ({
          id: device.ip,
          type: 'device',
          data: device,
          label: device.name,
        }))
      case 'ports':
        const portNodes: any[] = []
        devices.forEach((device) => {
          device.ports?.forEach((port) => {
            const [portNumber, service] = port.split('/')
            portNodes.push({
              id: `${device.ip}-${portNumber}`,
              type: 'port',
              data: { port, device },
              label: `Port ${portNumber}`,
            })
          })
        })
        return portNodes
      case 'services':
        const serviceNodes: any[] = []
        devices.forEach((device) => {
          device.ports?.forEach((port) => {
            const [portNumber, service] = port.split('/')
            serviceNodes.push({
              id: `${device.ip}-${service}`,
              type: 'service',
              data: { service, device },
              label: service,
            })
          })
        })
        return serviceNodes
      default:
        return []
    }
  }

  useEffect(() => {
    if (!svgRef.current || devices.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = 600
    const height = 400
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 3

    const nodes = generateNodes()
    const simulation = d3
      .forceSimulation(nodes)
      .force('center', d3.forceCenter(centerX, centerY))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('collide', d3.forceCollide().radius(50))

    // Create container for zoom
    const container = svg.append('g')

    // Add zoom behavior
    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        container.attr('transform', event.transform)
      })

    svg.call(zoom as any)

    // Draw links
    if (viewMode === 'devices') {
      const links = container
        .append('g')
        .selectAll('line')
        .data(nodes)
        .join('line')
        .attr('x1', centerX)
        .attr('y1', centerY)
        .attr('x2', (d) => d.x || centerX)
        .attr('y2', (d) => d.y || centerY)
        .attr('stroke', '#94a3b8')
        .attr('stroke-width', 1)
    }

    // Create node groups
    const nodeGroups = container
      .append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('class', 'node')
      .call(
        d3
          .drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended) as any
      )

    // Add circles for nodes
    nodeGroups
      .append('circle')
      .attr('r', 20)
      .attr('fill', (d) => {
        switch (d.type) {
          case 'device':
            return d.data.status === 'Online' ? '#22c55e' : '#ef4444'
          case 'port':
            return '#3b82f6'
          case 'service':
            return '#8b5cf6'
          default:
            return '#94a3b8'
        }
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)

    // Add labels
    nodeGroups
      .append('text')
      .text((d) => d.label)
      .attr('dy', 35)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-sm text-gray-900 dark:text-gray-100')
      .style('fill', 'currentColor')

    // Add interactive tooltip
    const tooltip = d3
      .select('body')
      .append('div')
      .attr(
        'class',
        'absolute hidden p-2 bg-white dark:bg-gray-800 rounded shadow-lg text-sm'
      )
      .style('pointer-events', 'none')

    nodeGroups
      .on('mouseover', (event, d) => {
        setSelectedNode(d)
        tooltip
          .style('left', event.pageX + 10 + 'px')
          .style('top', event.pageY - 10 + 'px')
          .classed('hidden', false)

        let tooltipContent = ''
        switch (d.type) {
          case 'device':
            tooltipContent = `
              <div class="p-2">
                <p class="font-bold">${d.data.name}</p>
                <p>IP: ${d.data.ip}</p>
                <p>OS: ${d.data.os || 'Unknown'}</p>
                <p>Status: ${d.data.status}</p>
                <p>Ports: ${d.data.ports?.join(', ') || 'None'}</p>
              </div>
            `
            break
          case 'port':
            tooltipContent = `
              <div class="p-2">
                <p class="font-bold">Port: ${d.data.port}</p>
                <p>Device: ${d.data.device.name}</p>
                <p>IP: ${d.data.device.ip}</p>
              </div>
            `
            break
          case 'service':
            tooltipContent = `
              <div class="p-2">
                <p class="font-bold">Service: ${d.data.service}</p>
                <p>Device: ${d.data.device.name}</p>
                <p>IP: ${d.data.device.ip}</p>
              </div>
            `
            break
        }
        tooltip.html(tooltipContent)
      })
      .on('mouseout', () => {
        setSelectedNode(null)
        tooltip.classed('hidden', true)
      })

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      event.subject.fx = event.subject.x
      event.subject.fy = event.subject.y
    }

    function dragged(event: any) {
      event.subject.fx = event.x
      event.subject.fy = event.y
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0)
      event.subject.fx = null
      event.subject.fy = null
    }

    simulation.on('tick', () => {
      nodeGroups.attr('transform', (d) => `translate(${d.x},${d.y})`)
      if (viewMode === 'devices') {
        svg
          .selectAll('line')
          .attr('x2', (d) => d.x)
          .attr('y2', (d) => d.y)
      }
    })

    return () => {
      tooltip.remove()
    }
  }, [devices, viewMode])

  return (
    <Card className="bg-white dark:bg-[#1F1F1F] shadow-md">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <CardTitle className="text-gray-800 dark:text-gray-200">
            Network Topology
          </CardTitle>
          <Select
            value={viewMode}
            onValueChange={(value: ViewMode) => setViewMode(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="View Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="devices">Devices</SelectItem>
              <SelectItem value="ports">Ports</SelectItem>
              <SelectItem value="services">Services</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <svg
          ref={svgRef}
          width="100%"
          height="400"
          viewBox="0 0 600 400"
          className="bg-white dark:bg-[#1F1F1F]"
        />
      </CardContent>
    </Card>
  )
}

export default NetworkTopology
