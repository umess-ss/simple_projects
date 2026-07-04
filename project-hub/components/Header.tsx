"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const GITHUB_URL = "https://github.com/umess-ss/simple_projects";

export default function Header() {
  const ref = useRef<HTMLElement>(null);

  // Entrance: one quiet slide-down on load. Skipped entirely for
  // prefers-reduced-motion (matchMedia reverts to the CSS resting state).
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(ref.current, {
        y: -12,
        autoAlpha: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <header
      ref={ref}
      className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur"
    >
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-display text-h3 font-bold tracking-tight"
        >
          Project Atlas
        </Link>

        <nav aria-label="Main" className="flex items-center gap-6">
          <Link
            href="/"
            className="text-small text-ink-muted transition-colors hover:text-ink"
          >
            Home
          </Link>
          <Link
            href="/admin"
            className="text-small text-ink-muted transition-colors hover:text-ink"
          >
            Admin
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub repository"
            className="text-ink-muted transition-colors hover:text-ink"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.42 7.42 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
            </svg>
          </a>
        </nav>
      </div>
    </header>
  );
}
