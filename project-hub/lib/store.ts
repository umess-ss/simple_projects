import type { Project } from "@/lib/types";

const STORAGE_KEY = "project-atlas-data";

/** Seed data — used on first visit or after reset. */
const SEED: Project[] = [
  {
    id: "project-atlas",
    title: "Project Atlas",
    summary: "This site — a map of my mini-projects, how they connect, and what each one taught me.",
    tags: ["TypeScript", "Next.js"],
    status: "shipped",
    builtOn: "2026-07-04",
    repoUrl: "https://github.com/umess-ss/simple_projects",
    note: "learned: SVG network layout without a graph library",
  },
  {
    id: "readme-file-generator",
    title: "README File Generator",
    summary: "Zero-dependency Python CLI that writes a README.md by inspecting a codebase.",
    tags: ["Python", "CLI", "Docs"],
    status: "in-progress",
    builtOn: "2026-07-04",
    repoUrl: "https://github.com/umess-ss/simple_projects/tree/main/readme_file_generator",
  },
  {
    id: "github-stats-dashboard",
    title: "GitHub Stats Dashboard",
    summary: "Dashboard that visualizes GitHub statistics for a user or repo.",
    tags: ["TypeScript", "Dashboard"],
    status: "in-progress",
    builtOn: "2026-07-04",
    repoUrl: "https://github.com/umess-ss/simple_projects/tree/main/github-stats-dashboard",
  },
  {
    id: "csv-cleaner-analyzer",
    title: "CSV Cleaner & Analyzer",
    summary: "Command-line tool for cleaning messy CSV files and summarizing what's inside them.",
    tags: ["Python", "CLI", "Data"],
    status: "in-progress",
    builtOn: "2026-07-04",
    repoUrl: "https://github.com/umess-ss/simple_projects/tree/main/csv-cleaner-analyzer",
  },
  {
    id: "markdown-converter",
    title: "Markdown Converter",
    summary: "Converts Markdown to themed HTML and PDF from the command line.",
    tags: ["Python", "CLI", "Docs"],
    status: "in-progress",
    builtOn: "2026-07-04",
    repoUrl: "https://github.com/umess-ss/simple_projects/tree/main/markdown-converter",
  },
];

/** Load projects from localStorage, or seed if empty. */
export function loadProjects(): Project[] {
  if (typeof window === "undefined") return SEED;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
    return SEED;
  }
  try {
    return JSON.parse(raw) as Project[];
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
    return SEED;
  }
}

/** Save projects to localStorage. */
export function saveProjects(projects: Project[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

/** Add or update a project. */
export function upsertProject(project: Project): void {
  const all = loadProjects();
  const idx = all.findIndex((p) => p.id === project.id);
  if (idx >= 0) {
    all[idx] = project;
  } else {
    all.push(project);
  }
  saveProjects(all);
}

/** Delete a project by id. */
export function deleteProject(id: string): void {
  const all = loadProjects().filter((p) => p.id !== id);
  saveProjects(all);
}

/** Reset to seed data. */
export function resetProjects(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
}

/** Generate a kebab-case id from a title. */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}