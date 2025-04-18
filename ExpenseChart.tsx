import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { Transaction } from '../types';

interface ExpenseChartProps {
  transactions: Transaction[];
}

export function ExpenseChart({ transactions }: ExpenseChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || transactions.length === 0) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    const width = 400;
    const height = 400;
    const margin = 40;

    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Add a subtle gradient definition
    const defs = svg.append('defs');
    
    const incomeGradient = defs.append('linearGradient')
      .attr('id', 'incomeGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '100%');

    incomeGradient.append('stop')
      .attr('offset', '0%')
      .attr('style', 'stop-color: #10B981; stop-opacity: 1');

    incomeGradient.append('stop')
      .attr('offset', '100%')
      .attr('style', 'stop-color: #059669; stop-opacity: 1');

    const expenseGradient = defs.append('linearGradient')
      .attr('id', 'expenseGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '100%');

    expenseGradient.append('stop')
      .attr('offset', '0%')
      .attr('style', 'stop-color: #EF4444; stop-opacity: 1');

    expenseGradient.append('stop')
      .attr('offset', '100%')
      .attr('style', 'stop-color: #DC2626; stop-opacity: 1');

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const data = [
      { type: 'Income', value: totalIncome },
      { type: 'Expense', value: totalExpense }
    ];

    const color = d3.scaleOrdinal<string>()
      .domain(['Income', 'Expense'])
      .range(['url(#incomeGradient)', 'url(#expenseGradient)']);

    const pie = d3.pie<any>()
      .value(d => d.value)
      .sort(null)
      .padAngle(0.02);

    const arc = d3.arc()
      .innerRadius(radius * 0.4) // Create a donut chart
      .outerRadius(radius);

    // Add shadow filter
    const filter = defs.append('filter')
      .attr('id', 'shadow')
      .attr('height', '130%');

    filter.append('feGaussianBlur')
      .attr('in', 'SourceAlpha')
      .attr('stdDeviation', 3)
      .attr('result', 'blur');

    filter.append('feOffset')
      .attr('in', 'blur')
      .attr('dx', 1)
      .attr('dy', 1)
      .attr('result', 'offsetBlur');

    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode')
      .attr('in', 'offsetBlur');
    feMerge.append('feMergeNode')
      .attr('in', 'SourceGraphic');

    const arcs = svg.selectAll('arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('filter', 'url(#shadow)');

    // Add the paths with transition
    arcs.append('path')
      .attr('d', arc as any)
      .attr('fill', (d: any) => color(d.data.type))
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .style('opacity', 0)
      .transition()
      .duration(800)
      .style('opacity', 1)
      .attrTween('d', function(d: any) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function(t) {
          return arc(interpolate(t)) as string;
        };
      });

    // Add labels with value
    const labelArc = d3.arc()
      .innerRadius(radius * 0.7)
      .outerRadius(radius * 0.7);

    arcs.append('text')
      .attr('transform', (d: any) => `translate(${labelArc.centroid(d)})`)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .style('fill', 'white')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('opacity', 0)
      .transition()
      .duration(800)
      .style('opacity', 1)
      .text((d: any) => `${d.data.type}\n$${d.data.value.toFixed(2)}`);

    // Add center text
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.5em')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Balance');

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1em')
      .style('font-size', '20px')
      .style('font-weight', 'bold')
      .style('fill', totalIncome - totalExpense >= 0 ? '#10B981' : '#EF4444')
      .text(`$${(totalIncome - totalExpense).toFixed(2)}`);

  }, [transactions]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Income vs Expenses</h3>
      <svg ref={svgRef} className="w-full h-auto"></svg>
    </div>
  );
}