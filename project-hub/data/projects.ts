import { loadProjects } from "@/lib/store";
import type { Project } from "@/lib/types";

/**
 * All site content now comes from localStorage (with seed fallback).
 * The admin page can add/edit/delete projects — no code changes needed.
 */
export const projects: Project[] = loadProjects();