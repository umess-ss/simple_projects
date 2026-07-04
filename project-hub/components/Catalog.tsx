"use client";

import { useState, useMemo } from "react";
import ProjectCard from "./ProjectCard";
import FilterBar from "./FilterBar";
import { allTags } from "@/lib/graph";
import type { Project } from "@/lib/types";

interface CatalogProps {
  projects: Project[];
}

export default function Catalog({ projects }: CatalogProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const tags = useMemo(() => allTags(projects), [projects]);

  const filtered = useMemo(() => {
    let result = projects;
    if (activeTag) {
      result = result.filter((p) => p.tags.includes(activeTag));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [projects, activeTag, search]);

  return (
    <div>
      <FilterBar
        tags={tags}
        activeTag={activeTag}
        onTagChange={setActiveTag}
        search={search}
        onSearchChange={setSearch}
      />
      {filtered.length === 0 ? (
        <p className="mt-8 text-center text-ink-muted">
          No projects match your search.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}