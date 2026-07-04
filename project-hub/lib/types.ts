export type ProjectStatus = "shipped" | "in-progress" | "archived";

export interface Project {
  /** Unique kebab-case slug; also used as the card anchor id. */
  id: string;
  title: string;
  /** 1–2 plain sentences. */
  summary: string;
  /** Shared tags create edges on the map — reuse existing tags when possible. */
  tags: string[];
  status: ProjectStatus;
  /** ISO date (YYYY-MM-DD). */
  builtOn: string;
  repoUrl?: string;
  liveUrl?: string;
  /** Optional "learned:" note shown on the card. */
  note?: string;
}
