"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  loadProjects,
  saveProjects,
  deleteProject,
  upsertProject,
  slugify,
  resetProjects,
} from "@/lib/store";
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

const EMPTY_FORM: Omit<Project, "id"> & { id: string } = {
  id: "",
  title: "",
  summary: "",
  tags: [],
  status: "in-progress",
  builtOn: new Date().toISOString().split("T")[0],
  repoUrl: "",
  liveUrl: "",
  note: "",
};

export default function AdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [tagInput, setTagInput] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<ProjectStatus | "all">("all");
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Load on mount
  useEffect(() => {
    setProjects(loadProjects());
  }, []);

  const refresh = useCallback(() => {
    setProjects(loadProjects());
  }, []);

  const openNew = () => {
    setForm(EMPTY_FORM);
    setTagInput("");
    setEditingId(null);
    setIsFormOpen(true);
  };

  const openEdit = (project: Project) => {
    setForm({ ...project });
    setTagInput(project.tags.join(", "));
    setEditingId(project.id);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setTagInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.summary.trim()) return;

    const id = editingId || slugify(form.title);
    // Ensure unique id on create
    const finalId = editingId ? id : ensureUniqueId(id, projects);

    const project: Project = {
      ...form,
      id: finalId,
      tags: tagInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      builtOn: form.builtOn || new Date().toISOString().split("T")[0],
    };

    upsertProject(project);
    refresh();
    closeForm();
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    deleteProject(id);
    refresh();
  };

  const handleReset = () => {
    resetProjects();
    refresh();
    setShowResetConfirm(false);
  };

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.summary.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = filterStatus === "all" || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-h2 font-bold">Admin</h1>
          <p className="mt-2 text-body text-ink-muted">
            Manage all projects. Changes are saved locally and will persist across
            reloads.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="rounded-md border border-border px-4 py-2 text-small text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink"
          >
            Reset Data
          </button>
          <button
            onClick={openNew}
            className="rounded-md bg-ink px-4 py-2 text-small font-bold text-surface transition-colors hover:bg-ink/90"
          >
            + New Project
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-md border border-border bg-surface px-4 py-2 text-small text-ink placeholder:text-ink-faint outline-none focus:border-ink-muted"
        />
        <div className="flex gap-2">
          {(["all", "shipped", "in-progress", "archived"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`rounded-full px-3 py-1 text-small capitalize transition-colors ${
                filterStatus === s
                  ? "bg-ink text-surface"
                  : "border border-border text-ink-muted hover:bg-surface-raised"
              }`}
            >
              {s === "all" ? "All" : s.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-4">
        <StatCard label="Total" value={projects.length} />
        <StatCard
          label="Shipped"
          value={projects.filter((p) => p.status === "shipped").length}
        />
        <StatCard
          label="In Progress"
          value={projects.filter((p) => p.status === "in-progress").length}
        />
        <StatCard
          label="Archived"
          value={projects.filter((p) => p.status === "archived").length}
        />
      </div>

      {/* Table */}
      <div className="mt-8 overflow-hidden rounded-md border border-border">
        <table className="w-full text-left text-small">
          <thead>
            <tr className="border-b border-border bg-surface-raised text-ink-muted">
              <th className="px-4 py-3 font-bold">Project</th>
              <th className="px-4 py-3 font-bold">Status</th>
              <th className="px-4 py-3 font-bold hidden sm:table-cell">Tags</th>
              <th className="px-4 py-3 font-bold hidden md:table-cell">Built</th>
              <th className="px-4 py-3 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center text-ink-muted"
                >
                  No projects match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-border last:border-0 transition-colors hover:bg-surface-raised/50"
                >
                  <td className="px-4 py-3">
                    <div className="font-bold text-ink">{p.title}</div>
                    <div className="mt-0.5 max-w-[240px] truncate text-ink-muted">
                      {p.summary}
                    </div>
                    {p.note && (
                      <div className="mt-1 text-[11px] italic text-ink-faint">
                        {p.note}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${STATUS_STYLES[p.status]}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[p.status]}`}
                      />
                      {p.status.replace("-", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-border bg-surface px-2 py-0.5 text-[11px] text-ink-muted"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <time
                      dateTime={p.builtOn}
                      className="font-mono text-mono tracking-normal text-ink-muted"
                    >
                      {p.builtOn}
                    </time>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {p.repoUrl && (
                        <a
                          href={p.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-ink-muted transition-colors hover:text-accent"
                          title="Repository"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                          >
                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.42 7.42 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
                          </svg>
                        </a>
                      )}
                      <button
                        onClick={() => openEdit(p)}
                        className="text-ink-muted transition-colors hover:text-accent"
                        title="Edit"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-ink-muted transition-colors hover:text-red-500"
                        title="Delete"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/40 backdrop-blur-sm p-4 pt-16 sm:pt-24">
          <div className="w-full max-w-lg rounded-lg border border-border bg-surface p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-h3 font-bold">
                {editingId ? "Edit Project" : "New Project"}
              </h2>
              <button
                onClick={closeForm}
                className="text-ink-muted hover:text-ink"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-small font-bold text-ink">
                  Title
                </label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-small text-ink outline-none focus:border-ink-muted"
                  placeholder="Project name"
                />
              </div>

              <div>
                <label className="block text-small font-bold text-ink">
                  Summary
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.summary}
                  onChange={(e) =>
                    setForm({ ...form, summary: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-small text-ink outline-none focus:border-ink-muted resize-none"
                  placeholder="1-2 sentences describing the project"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-small font-bold text-ink">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: e.target.value as ProjectStatus,
                      })
                    }
                    className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-small text-ink outline-none focus:border-ink-muted"
                  >
                    <option value="shipped">Shipped</option>
                    <option value="in-progress">In Progress</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block text-small font-bold text-ink">
                    Built On
                  </label>
                  <input
                    type="date"
                    required
                    value={form.builtOn}
                    onChange={(e) =>
                      setForm({ ...form, builtOn: e.target.value })
                    }
                    className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-small text-ink outline-none focus:border-ink-muted"
                  />
                </div>
              </div>

              <div>
                <label className="block text-small font-bold text-ink">
                  Tags <span className="font-normal text-ink-faint">(comma separated)</span>
                </label>
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-small text-ink outline-none focus:border-ink-muted"
                  placeholder="TypeScript, Next.js, CLI"
                />
                {tagInput && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {tagInput
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean)
                      .map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-border bg-surface-raised px-2 py-0.5 text-[11px] text-ink-muted"
                        >
                          {t}
                        </span>
                      ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-small font-bold text-ink">
                    Repo URL
                  </label>
                  <input
                    type="url"
                    value={form.repoUrl}
                    onChange={(e) =>
                      setForm({ ...form, repoUrl: e.target.value })
                    }
                    className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-small text-ink outline-none focus:border-ink-muted"
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <label className="block text-small font-bold text-ink">
                    Live URL
                  </label>
                  <input
                    type="text"
                    value={form.liveUrl}
                    onChange={(e) =>
                      setForm({ ...form, liveUrl: e.target.value })
                    }
                    className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-small text-ink outline-none focus:border-ink-muted"
                    placeholder="/projects/calculator/ or https://..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-small font-bold text-ink">
                  Note <span className="font-normal text-ink-faint">(optional)</span>
                </label>
                <input
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-small text-ink outline-none focus:border-ink-muted"
                  placeholder="learned: something interesting"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 rounded-md border border-border px-4 py-2 text-small font-bold text-ink-muted transition-colors hover:bg-surface-raised"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-md bg-ink px-4 py-2 text-small font-bold text-surface transition-colors hover:bg-ink/90"
                >
                  {editingId ? "Save Changes" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Confirmation */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-6 text-center shadow-xl">
            <h3 className="font-display text-h3 font-bold">Reset All Data?</h3>
            <p className="mt-2 text-body text-ink-muted">
              This will restore the original 5 projects and delete any changes
              you made.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 rounded-md border border-border px-4 py-2 text-small font-bold text-ink-muted transition-colors hover:bg-surface-raised"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 rounded-md bg-red-500 px-4 py-2 text-small font-bold text-white transition-colors hover:bg-red-600"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-border bg-surface p-4">
      <div className="font-mono text-2xl font-bold text-ink">{value}</div>
      <div className="mt-1 text-[11px] font-bold uppercase tracking-wider text-ink-muted">
        {label}
      </div>
    </div>
  );
}

function ensureUniqueId(base: string, projects: Project[]): string {
  if (!projects.find((p) => p.id === base)) return base;
  let i = 1;
  while (projects.find((p) => p.id === `${base}-${i}`)) i++;
  return `${base}-${i}`;
}