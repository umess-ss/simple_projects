"use client";

interface FilterBarProps {
  tags: string[];
  activeTag: string | null;
  onTagChange: (tag: string | null) => void;
  search: string;
  onSearchChange: (s: string) => void;
}

export default function FilterBar({ tags, activeTag, onTagChange, search, onSearchChange }: FilterBarProps) {
  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Search projects..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full rounded-md border border-border bg-surface px-4 py-2 text-small text-ink placeholder:text-ink-faint outline-none focus:border-ink-muted"
      />
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onTagChange(null)}
          className={`rounded-full border px-3 py-1 text-small transition-colors ${
            !activeTag
              ? "border-ink bg-ink text-surface"
              : "border-border text-ink-muted hover:bg-surface-raised"
          }`}
        >
          All
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagChange(tag === activeTag ? null : tag)}
            className={`rounded-full border px-3 py-1 text-small transition-colors ${
              tag === activeTag
                ? "border-accent bg-accent-soft text-accent"
                : "border-border text-ink-muted hover:bg-surface-raised"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}