"use client";

interface FilterBarProps {
  tags: string[];
  active: string | null;
  onChange: (tag: string | null) => void;
}

export default function FilterBar({ tags, active, onChange }: FilterBarProps) {
  const chip = (selected: boolean) =>
    selected
      ? "rounded-full border border-accent bg-accent-soft px-3 py-1 text-small text-accent"
      : "rounded-full border border-border px-3 py-1 text-small text-ink-muted transition-colors hover:border-border-strong hover:text-ink";

  return (
    <div
      role="group"
      aria-label="Filter projects by tag"
      className="flex flex-wrap gap-2"
    >
      <button
        type="button"
        onClick={() => onChange(null)}
        aria-pressed={active === null}
        className={chip(active === null)}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => onChange(tag === active ? null : tag)}
          aria-pressed={active === tag}
          className={chip(active === tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
