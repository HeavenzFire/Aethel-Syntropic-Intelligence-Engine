
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { SyntropicDesign, Stratum } from '../types';

interface Props {
  design: SyntropicDesign;
}

const DesignCanvas: React.FC<Props> = ({ design }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !design.speciesList.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 500;
    const margin = { top: 60, right: 200, bottom: 80, left: 100 };

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X scale: Time (Years)
    const maxYears = Math.max(...design.speciesList.map(s => s.lifeCycleYears), 10);
    const xScale = d3.scaleLinear()
      .domain([0, maxYears])
      .range([0, chartWidth]);

    // Y scale: Strata
    const strataOrder = [Stratum.LOW, Stratum.MEDIUM, Stratum.HIGH, Stratum.EMERGENT];
    const yScale = d3.scalePoint()
      .domain(strataOrder)
      .range([chartHeight, 0])
      .padding(0.7);

    // Color palette - Matrix/Cyberpunk theme
    const colors = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ec4899"];
    const colorScale = d3.scaleOrdinal(colors);

    // Filters
    const defs = svg.append("defs");
    
    // Standard Glow
    const glow = defs.append("filter").attr("id", "glow");
    glow.append("feGaussianBlur").attr("stdDeviation", "2.5").attr("result", "coloredBlur");
    const feMerge = glow.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Emergent Strata Halo (Hyper-glow)
    const hyperGlow = defs.append("filter").attr("id", "hyperGlow");
    hyperGlow.append("feGaussianBlur").attr("stdDeviation", "5").attr("result", "blur");
    const feMergeHyper = hyperGlow.append("feMerge");
    feMergeHyper.append("feMergeNode").attr("in", "blur");
    feMergeHyper.append("feMergeNode").attr("in", "SourceGraphic");

    // Grid lines
    g.append("g")
      .attr("stroke", "rgba(255,255,255,0.03)")
      .attr("stroke-width", 1)
      .call(d3.axisBottom(xScale).tickSize(chartHeight).tickFormat(() => ""));

    g.append("g")
      .attr("stroke", "rgba(255,255,255,0.03)")
      .attr("stroke-width", 1)
      .call(d3.axisLeft(yScale).tickSize(-chartWidth).tickFormat(() => ""));

    // Axes
    const xAxis = g.append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(d3.axisBottom(xScale).ticks(10).tickSize(10));
    
    xAxis.selectAll("text").attr("fill", "#475569").attr("font-family", "JetBrains Mono").attr("font-size", "9px");
    xAxis.select(".domain").attr("stroke", "rgba(255,255,255,0.1)");

    const yAxis = g.append("g").call(d3.axisLeft(yScale));
    yAxis.selectAll("text").attr("fill", "#94a3b8").attr("font-family", "JetBrains Mono").attr("font-size", "10px").attr("font-weight", "bold");
    yAxis.select(".domain").attr("stroke", "rgba(255,255,255,0.1)");

    // Species Bars
    const bars = g.selectAll(".species-bar")
      .data(design.speciesList)
      .enter()
      .append("g")
      .attr("class", "species-bar");

    bars.append("rect")
      .attr("x", 0)
      .attr("y", d => (yScale(d.stratum as Stratum) || 0) - (d.stratum === Stratum.EMERGENT ? 10 : 6))
      .attr("height", d => d.stratum === Stratum.EMERGENT ? 20 : 12)
      .attr("rx", d => d.stratum === Stratum.EMERGENT ? 10 : 6)
      .attr("fill", (d, i) => d.stratum === Stratum.EMERGENT ? "#10b981" : colorScale(i.toString()))
      .attr("opacity", d => d.stratum === Stratum.EMERGENT ? 0.8 : 0.4)
      .style("filter", d => d.stratum === Stratum.EMERGENT ? "url(#hyperGlow)" : "url(#glow)")
      .attr("width", 0)
      .transition()
      .duration(2000)
      .ease(d3.easeExpOut)
      .attr("width", d => xScale(d.lifeCycleYears));

    bars.append("text")
      .attr("x", d => xScale(d.lifeCycleYears) + 15)
      .attr("y", d => (yScale(d.stratum as Stratum) || 0) + 4)
      .text(d => d.name)
      .attr("fill", d => d.stratum === Stratum.EMERGENT ? "#10b981" : "#f1f5f9")
      .attr("font-family", "Inter")
      .attr("font-size", d => d.stratum === Stratum.EMERGENT ? "13px" : "11px")
      .attr("font-weight", d => d.stratum === Stratum.EMERGENT ? "800" : "600")
      .attr("letter-spacing", d => d.stratum === Stratum.EMERGENT ? "0.05em" : "0")
      .attr("opacity", 0)
      .transition()
      .delay(1000)
      .attr("opacity", 1);

    // Stratum Indicators
    if (design.speciesList.some(s => s.stratum === Stratum.EMERGENT)) {
       g.append("text")
        .attr("x", chartWidth)
        .attr("y", yScale(Stratum.EMERGENT) || 0)
        .attr("dy", -25)
        .attr("text-anchor", "end")
        .attr("fill", "#10b981")
        .attr("font-family", "JetBrains Mono")
        .attr("font-size", "10px")
        .attr("font-weight", "bold")
        .attr("class", "animate-pulse")
        .text("CRITICAL_SYSTEM_DRIVERS :: EMERGENT_DOMINANCE");
    }

  }, [design]);

  return (
    <div className="w-full bg-slate-950/80 rounded-3xl p-10 border border-emerald-500/20 backdrop-blur-xl shadow-[0_0_50px_rgba(16,185,129,0.1)] relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
        <svg width="150" height="150" viewBox="0 0 100 100">
           <circle cx="50" cy="50" r="48" stroke="white" strokeWidth="0.2" fill="none" />
           <path d="M50 0 L50 100 M0 50 L100 50" stroke="white" strokeWidth="0.2" />
           <circle cx="50" cy="50" r="20" stroke="white" strokeWidth="0.1" fill="none" />
        </svg>
      </div>
      <div className="mb-10 relative z-10 flex justify-between items-end">
        <div>
          <h3 className="text-3xl font-light text-white mb-2 serif italic tracking-tight">Succession Matrix Projection</h3>
          <p className="text-[10px] text-emerald-500 mono uppercase tracking-[0.5em]">Sector: Point, TX // Stratum Focus: Emergent</p>
        </div>
        <div className="text-right hidden md:block">
           <p className="text-[9px] text-slate-600 mono uppercase mb-1">Timeline Resolution</p>
           <p className="text-[10px] text-slate-400 mono font-bold">1_UNIT = 1_SOLAR_YEAR</p>
        </div>
      </div>
      <div className="overflow-x-auto scrollbar-hide">
        <svg ref={svgRef} width="800" height="500" className="mx-auto"></svg>
      </div>
    </div>
  );
};

export default DesignCanvas;
