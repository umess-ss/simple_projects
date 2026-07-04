"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FilterBar from "@/components/FilterBar";
import ProjectCard from "@/components/ProjectCard";
import { allTags } from "@/lib/graph";
import type { Project } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

export default function Catalog({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const tags = allTags(projects);
  const visible = active
    ? projects.filter((p) => p.tags.includes(active))
    : projects;

  // Cards reveal once on first scroll into view, staggered. Runs on the
  // initial (unfiltered) grid only — filtering re-renders without motion.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(grid.querySelectorAll("[data-card]"), {
        scrollTrigger: { trigger: grid, start: "top 85%", once: true },
        y: 16,
        autoAlpha: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.08,
        clearProps: "all",
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <FilterBar tags={tags} active={active} onChange={setActive} />

      {visible.length === 0 ? (
        <p className="text-body text-ink-muted">
          No projects have this tag yet. Pick another tag, or choose All.
        </p>
      ) : (
        <div ref={gridRef} className="grid gap-4 sm:grid-cols-2">
          {visible.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
