import Link from "next/link";
import type { Project, ProjectStatus } from "@/lib/types";

const STATUS_DOT: Record<ProjectStatus, string> = {
  shipped: "bg-emerald-500",
  "in-progress": "bg-amber-400",
  archived: "bg-slate-400",
};

const STATUS_LABEL: Record<ProjectStatus, string> = {
  shipped: "Shipped",
  "in-progress": "In Progress",
  archived: "Archived",
};

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/project/${project.id}`} className="block group">
      <article className="rounded-md border border-border bg-surface p-5 transition-all hover:shadow-sm hover:border-ink-muted/30">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-h3 font-bold group-hover:text-accent transition-colors">
            {project.title}
          </h3>
          <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-bold text-ink-muted">
            <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[project.status]}`} />
            {STATUS_LABEL[project.status]}
          </span>
        </div>

        <p className="mt-2 text-body text-ink-muted line-clamp-2">{project.summary}</p>

        {project.note && (
          <p className="mt-3 border-l-2 border-border pl-3 text-small italic text-ink-faint">
            {project.note}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border bg-surface-raised px-2.5 py-0.5 text-[11px] text-ink-muted"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-accent">
            View project
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>

          <time
            dateTime={project.builtOn}
            className="font-mono text-mono tracking-normal text-ink-faint"
          >
            {project.builtOn}
          </time>
        </div>
      </article>
    </Link>
  );
}