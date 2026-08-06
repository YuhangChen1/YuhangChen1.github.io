"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return "dark";
    }

    const saved = window.localStorage.getItem("theme") as Theme | null;
    return saved ?? "light";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("theme", nextTheme);
    setTheme(nextTheme);
  };

  return (
    <button
      type="button"
      className={`theme-toggle ${theme === "light" ? "is-light" : "is-dark"}`}
      onClick={toggleTheme}
      aria-label="Toggle color theme"
    >
      <span className="theme-track" aria-hidden="true">
        <span className="theme-cloud theme-cloud-a" />
        <span className="theme-cloud theme-cloud-b" />
        <span className="theme-stars" />
      </span>
      <span className="theme-thumb" aria-hidden="true">
        <span className="theme-thumb-core" />
      </span>
    </button>
  );
}
