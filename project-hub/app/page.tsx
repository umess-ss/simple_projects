"use client";

import { useState, useEffect } from "react";
import MapView from "@/components/MapView";
import Catalog from "@/components/Catalog";
import { buildNodes, buildEdges } from "@/lib/graph";
import { loadProjects } from "@/lib/store";
import type { Project } from "@/lib/types";

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    setProjects(loadProjects());
  }, []);

  const nodes = buildNodes(projects);
  const edges = buildEdges(projects);

  return (
    <main>
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-8">
        <h1 className="max-w-2xl font-display text-display font-bold tracking-tight">
          Small projects, one map.
        </h1>
        <p className="mt-4 max-w-xl text-body text-ink-muted">
          Every mini-project I build, in one place. Lines on the map mean two
          projects share a tool or a topic. Click a node to jump to its card.
        </p>
      </section>

      <section
        id="map"
        aria-labelledby="map-heading"
        className="mx-auto max-w-5xl px-6 py-8"
      >
        <h2 id="map-heading" className="mb-6 font-display text-h2 font-bold">
          Map
        </h2>
        <MapView nodes={nodes} edges={edges} />
      </section>

      <section
        id="projects"
        aria-labelledby="projects-heading"
        className="mx-auto max-w-5xl px-6 py-8"
      >
        <h2
          id="projects-heading"
          className="mb-6 font-display text-h2 font-bold"
        >
          All projects
        </h2>
        <Catalog projects={projects} />
      </section>
    </main>
  );
}