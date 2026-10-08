"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

function getTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function subscribe(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === "theme" || event.key === null) {
      document.documentElement.dataset.theme = event.newValue === "dark" ? "dark" : "light";
      onChange();
    }
  };
  window.addEventListener("themechange", onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener("themechange", onChange);
    window.removeEventListener("storage", onStorage);
  };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "light");
  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    try {
      window.localStorage.setItem("theme", nextTheme);
    } catch {
      // The toggle still works when browser storage is unavailable.
    }
    window.dispatchEvent(new Event("themechange"));
  };

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Dark mode"
      aria-pressed={theme === "dark"}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
    </button>
  );
}
