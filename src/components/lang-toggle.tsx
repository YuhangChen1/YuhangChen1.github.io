"use client";

import { useSyncExternalStore } from "react";

type Lang = "en" | "zh";

function getLang(): Lang {
  return document.documentElement.dataset.lang === "zh" ? "zh" : "en";
}

function subscribe(onChange: () => void) {
  window.addEventListener("langchange", onChange);
  return () => window.removeEventListener("langchange", onChange);
}

// Both languages are rendered into the static HTML; the toggle only flips which one CSS shows.
export function LangToggle() {
  const lang = useSyncExternalStore(subscribe, getLang, () => "en");
  const setLang = (nextLang: Lang) => {
    document.documentElement.dataset.lang = nextLang;
    try {
      window.localStorage.setItem("lang", nextLang);
    } catch {
      // The toggle still works when browser storage is unavailable.
    }
    window.dispatchEvent(new Event("langchange"));
  };

  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      <button type="button" aria-pressed={lang === "en"} onClick={() => setLang("en")}>EN</button>
      <button type="button" aria-pressed={lang === "zh"} onClick={() => setLang("zh")} lang="zh-CN">中文</button>
    </div>
  );
}
