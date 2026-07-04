"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MAP_HEIGHT,
  MAP_WIDTH,
  type MapEdge,
  type MapNode,
} from "@/lib/graph";
import type { ProjectStatus } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

const STATUS_FILL: Record<ProjectStatus, string> = {
  shipped: "fill-status-shipped",
  "in-progress": "fill-status-progress",
  archived: "fill-status-archived",
};

/** Quadratic arc between two nodes, bowed slightly toward the map center. */
function arcPath(a: MapNode, b: MapNode): string {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  // Pull the control point 12% of the way toward the center for a soft bow.
  const cx = mx + (MAP_WIDTH / 2 - mx) * 0.12;
  const cy = my + (MAP_HEIGHT / 2 - my) * 0.12;
  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
}

interface MapViewProps {
  nodes: MapNode[];
  edges: MapEdge[];
}

export default function MapView({ nodes, edges }: MapViewProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const byId = new Map(nodes.map((n) => [n.project.id, n]));

  // One moment for this section: arcs draw in, then nodes surface.
  // Resting state (and reduced motion) is the fully drawn map.
    useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const arcs = svg.querySelectorAll("[data-arc]");
    const nodes = svg.querySelectorAll("[data-node]");

    // Guard: skip animation if no elements (empty data on first render)
    if (arcs.length === 0 && nodes.length === 0) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: svg, start: "top 80%", once: true },
        defaults: { ease: "power2.out" },
      });
      if (arcs.length > 0) {
        tl.from(arcs, {
          attr: { "stroke-dashoffset": 1 },
          duration: 0.9,
          stagger: 0.08,
        });
      }
      if (nodes.length > 0) {
        tl.from(
          nodes,
          { autoAlpha: 0, duration: 0.4, stagger: 0.05 },
          arcs.length > 0 ? "-=0.4" : 0,
        );
      }
    });
    return () => mm.revert();
  }, [nodes, edges]); // ← add dependencies so it re-runs when data loads
  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      role="img"
      aria-label="Network map of projects; connected projects share tags"
      className="w-full rounded-md border border-border bg-surface-raised"
    >
      {edges.map((edge) => {
        const a = byId.get(edge.from);
        const b = byId.get(edge.to);
        if (!a || !b) return null;
        return (
          <path
            key={`${edge.from}-${edge.to}`}
            data-arc
            d={arcPath(a, b)}
            pathLength={1}
            strokeDasharray={1}
            className="fill-none stroke-border-strong"
            strokeWidth={1}
          >
            <title>{`Shared: ${edge.sharedTags.join(", ")}`}</title>
          </path>
        );
      })}

      {nodes.map((node) => (
        <a
          key={node.project.id}
          data-node
          href={`#${node.project.id}`}
          aria-label={`${node.project.title} — jump to card`}
          className="group focus-visible:outline-none"
        >
          <circle
            cx={node.x}
            cy={node.y}
            r={6}
            className={`${STATUS_FILL[node.project.status]} transition-transform group-hover:scale-[1.35] group-focus-visible:scale-[1.35]`}
            style={{ transformOrigin: `${node.x}px ${node.y}px` }}
          />
          <text
            x={node.x}
            y={node.y + 22}
            textAnchor="middle"
            className="fill-ink-muted font-mono text-[11px] tracking-normal group-hover:fill-ink"
          >
            {node.project.title}
          </text>
        </a>
      ))}
    </svg>
  );
}
