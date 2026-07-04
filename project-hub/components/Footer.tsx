const GITHUB_URL = "https://github.com/umess-ss/simple_projects";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-8">
        <p className="text-small text-ink-muted">
          Built by Umesh Rajbanshi. Content lives in{" "}
          <code className="font-mono text-mono tracking-normal">
            data/projects.ts
          </code>
          .
        </p>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          className="text-small text-ink-muted underline decoration-border-strong underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
        >
          Source on GitHub
        </a>
      </div>
    </footer>
  );
}
