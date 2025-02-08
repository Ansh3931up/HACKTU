"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as d3 from "d3";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import { Topology, GeometryCollection } from "topojson-specification";

interface Threat {
  type: string;
  severity: "Low" | "Medium" | "High";
  source: string; // Expected format: "longitude,latitude"
  timestamp: string;
}

interface ThreatMapProps {
  threats: Threat[];
}

const ThreatMap = ({ threats }: ThreatMapProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 450;

    svg.selectAll("*").remove();

    const projection = geoMercator()
      .scale(130)
      .translate([width / 2, height / 1.4]);

    const path = geoPath().projection(projection);

    const g = svg.append("g");

    // Load world map data
    d3.json<Topology>("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then((data) => {
        if (!data) throw new Error("Failed to load world map data");

        const countries = feature(data, data.objects.countries as GeometryCollection);

        g.selectAll("path")
          .data(countries.features)
          .enter()
          .append("path")
          .attr("d", path)
          .attr("fill", "hsl(var(--muted))")
          .attr("stroke", "hsl(var(--border))")
          .attr("stroke-width", 0.5);

        // Plot threats on the map
        threats.forEach((threat) => {
          const [long, lat] = threat.source.split(",").map(Number);

          if (!isNaN(long) && !isNaN(lat)) {
            const projected = projection([long, lat]);

            if (projected) {
              g.append("circle")
                .attr("cx", projected[0])
                .attr("cy", projected[1])
                .attr("r", 5)
                .attr("fill", threat.severity === "High" ? "red" : threat.severity === "Medium" ? "orange" : "yellow")
                .attr("opacity", 0.7)
                .append("title")
                .text(`${threat.type} (${threat.severity})`);
            }
          }
        });
      })
      .catch((error) => {
        console.error("Error loading the world map data:", error);
      });
  }, [threats]);

  return (
    <Card className="bg-white dark:bg-[#111011] shadow-xl flex flex-col justify-between">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="text-old-money-burgundy text-3xl font-semibold">Global Threat Map</CardTitle>
      </CardHeader>
      <CardContent>
        <svg ref={svgRef} width="100%" height="450" />
      </CardContent>
    </Card>
  );
};

export default ThreatMap;