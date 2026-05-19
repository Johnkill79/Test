"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { THEME_STORAGE_KEY } from "@/lib/themeStorage";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    const dark = stored !== "light";
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  function toggle() {
    const nextDark = !isDark;
    setIsDark(nextDark);
    document.documentElement.classList.toggle("dark", nextDark);
    localStorage.setItem(THEME_STORAGE_KEY, nextDark ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="btn btn-ghost px-3"
      aria-label={isDark ? "Use light theme" : "Use dark theme"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {mounted ? (
        isDark ? (
          <Sun className="h-4 w-4 shrink-0" />
        ) : (
          <Moon className="h-4 w-4 shrink-0" />
        )
      ) : (
        <span className="h-4 w-4 shrink-0 rounded bg-neutral-200 dark:bg-white/20" aria-hidden />
      )}
      <span className="hidden sm:inline">{mounted ? (isDark ? "Light" : "Dark") : ""}</span>
    </button>
  );
}
