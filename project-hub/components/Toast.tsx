"use client";

import { useEffect } from "react";

export interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = "success", onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const styles = {
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    error: "bg-red-50 text-red-800 border-red-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
  };

  const icons = {
    success: "✓",
    error: "✕",
    info: "ℹ",
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-md border px-4 py-3 shadow-lg ${styles[type]}`}>
      <span className="font-bold">{icons[type]}</span>
      <span className="text-small font-bold">{message}</span>
      <button onClick={onClose} className="ml-2 text-ink-muted hover:text-ink">✕</button>
    </div>
  );
}