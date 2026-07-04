"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { loadProjects } from "@/lib/store";
import type { Project, ProjectStatus } from "@/lib/types";

const STATUS_STYLES: Record<ProjectStatus, string> = {
  shipped: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "in-progress": "bg-amber-50 text-amber-700 border-amber-200",
  archived: "bg-slate-100 text-slate-500 border-slate-200",
};

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

export default function ProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const projects = loadProjects();
    const found = projects.find((p) => p.id === id);
    if (found) setProject(found);
  }, [id]);

  if (!project) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-display text-h2 font-bold">Project not found</h1>
        <p className="mt-2 text-body text-ink-muted">
          No project with id <code className="font-mono">{id}</code>.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-md bg-ink px-4 py-2 text-small font-bold text-surface"
        >
          Back to Atlas
        </Link>
      </div>
    );
  }

  const isWebProject = !!project.liveUrl;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      {/* Back + Breadcrumb */}
      <button
        onClick={() => router.push("/")}
        className="flex items-center gap-1 text-small text-ink-muted transition-colors hover:text-ink"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Atlas
      </button>

      {/* Header */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-display font-bold">{project.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold ${STATUS_STYLES[project.status]}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[project.status]}`} />
              {STATUS_LABEL[project.status]}
            </span>
            {project.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-border bg-surface-raised px-2.5 py-0.5 text-[11px] text-ink-muted">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {isWebProject && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-ink px-5 py-2.5 text-small font-bold text-surface transition-colors hover:bg-ink/90"
          >
            Launch App
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17 17 7M7 7h10v10" />
            </svg>
          </a>
        )}
      </div>

      {/* Summary */}
      <p className="mt-6 text-body text-ink-muted leading-relaxed">
        {project.summary}
      </p>

      {/* Note */}
      {project.note && (
        <div className="mt-6 rounded-md border-l-2 border-accent bg-accent-soft/30 p-4">
          <p className="text-small italic text-ink-muted">
            <span className="font-bold not-italic text-ink">Learned:</span> {project.note}
          </p>
        </div>
      )}

      {/* Demo Area */}
      <div className="mt-8">
        {isWebProject ? (
          <div className="overflow-hidden rounded-md border border-border">
            <div className="flex items-center justify-between border-b border-border bg-surface-raised px-4 py-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">Live Preview</span>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-accent hover:underline"
              >
                Open in new tab ↗
              </a>
            </div>
            <iframe
              src={project.liveUrl}
              className="h-[500px] w-full bg-white"
              title={`${project.title} preview`}
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        ) : (
          <div className="rounded-md border border-border bg-surface-raised p-6">
            <h3 className="font-display text-h3 font-bold">Local Project</h3>
            <p className="mt-2 text-body text-ink-muted">
              This is a CLI tool or local script. Run it from your terminal:
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">Navigate</div>
                <code className="mt-1 block rounded-md bg-surface border border-border p-3 font-mono text-mono text-ink">
                  cd {project.id}
                </code>
              </div>

              {project.id === "csv-cleaner-analyzer" && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">Run</div>
                  <code className="mt-1 block rounded-md bg-surface border border-border p-3 font-mono text-mono text-ink">
                    python csv_cleaner.py data.csv --output clean.csv
                  </code>
                </div>
              )}

              {project.id === "markdown-converter" && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">Run</div>
                  <code className="mt-1 block rounded-md bg-surface border border-border p-3 font-mono text-mono text-ink">
                    python md_convert.py input.md --format pdf
                  </code>
                </div>
              )}

              {project.id === "readme-file-generator" && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">Run</div>
                  <code className="mt-1 block rounded-md bg-surface border border-border p-3 font-mono text-mono text-ink">
                    python readme_gen.py /path/to/project
                  </code>
                </div>
              )}

              {project.id === "github-stats-dashboard" && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">Run</div>
                  <code className="mt-1 block rounded-md bg-surface border border-border p-3 font-mono text-mono text-ink">
                    npm run dev
                  </code>
                  <p className="mt-1 text-[11px] text-ink-faint">Then visit http://localhost:3001</p>
                </div>
              )}

              {project.id === "project-atlas" && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">Run</div>
                  <code className="mt-1 block rounded-md bg-surface border border-border p-3 font-mono text-mono text-ink">
                    npm run dev
                  </code>
                  <p className="mt-1 text-[11px] text-ink-faint">You are here.</p>
                </div>
              )}
            </div>

            <div className="mt-6 border-t border-border pt-4">
              <p className="text-[11px] text-ink-faint">
                To make this project launchable from the browser, build it and place the output in{" "}
                <code className="font-mono text-ink-muted">project-hub/public/projects/{project.id}/</code>,
                then set its <strong>Live URL</strong> to{" "}
                <code className="font-mono text-ink-muted">/projects/{project.id}/</code> in the admin.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="mt-8 flex items-center justify-between border-t border-border pt-4 text-[11px] text-ink-faint">
        <span>ID: <code className="font-mono">{project.id}</code></span>
        <time dateTime={project.builtOn}>Built on {project.builtOn}</time>
      </div>
    </div>
  );
}