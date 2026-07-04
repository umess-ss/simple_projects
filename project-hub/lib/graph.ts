import type { Project } from "@/lib/types";

export interface MapNode {
  project: Project;
  x: number;
  y: number;
}

export interface MapEdge {
  /** Project ids of the two endpoints. */
  from: string;
  to: string;
  /** Tags the two projects share (edge exists only when non-empty). */
  sharedTags: string[];
}

export const MAP_WIDTH = 800;
export const MAP_HEIGHT = 440;

/** Deterministic hash so node jitter is stable across renders/builds. */
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

/**
 * Lay nodes on an ellipse with per-node radial jitter. Deterministic,
 * dependency-free, and stable when projects are appended (existing
 * nodes shift only by angle, never at random).
 */
export function buildNodes(projects: Project[]): MapNode[] {
  const cx = MAP_WIDTH / 2;
  const cy = MAP_HEIGHT / 2;
  const rx = MAP_WIDTH * 0.36;
  const ry = MAP_HEIGHT * 0.32;

  return projects.map((project, i) => {
    const angle = (i / projects.length) * Math.PI * 2 - Math.PI / 2;
    const jitter = 0.82 + hash(project.id) * 0.28; // 0.82–1.10 of radius
    return {
      project,
      x: Math.round(cx + Math.cos(angle) * rx * jitter),
      y: Math.round(cy + Math.sin(angle) * ry * jitter),
    };
  });
}

/** One edge per project pair that shares at least one tag. */
export function buildEdges(projects: Project[]): MapEdge[] {
  const edges: MapEdge[] = [];
  for (let i = 0; i < projects.length; i++) {
    for (let j = i + 1; j < projects.length; j++) {
      const sharedTags = projects[i].tags.filter((t) =>
        projects[j].tags.includes(t),
      );
      if (sharedTags.length > 0) {
        edges.push({ from: projects[i].id, to: projects[j].id, sharedTags });
      }
    }
  }
  return edges;
}

/** Every distinct tag, in first-seen order — drives the filter bar. */
export function allTags(projects: Project[]): string[] {
  const seen = new Set<string>();
  const tags: string[] = [];
  for (const p of projects) {
    for (const t of p.tags) {
      if (!seen.has(t)) {
        seen.add(t);
        tags.push(t);
      }
    }
  }
  return tags;
}
