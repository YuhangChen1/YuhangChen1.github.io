import type { ReactNode } from "react";

// Inline text in both languages; CSS hides the inactive one (see .lang-en / .lang-zh in globals.css).
export function T({ en, zh }: { en: ReactNode; zh: ReactNode }) {
  return (
    <>
      <span className="lang-en" lang="en">{en}</span>
      <span className="lang-zh" lang="zh-CN">{zh}</span>
    </>
  );
}

// Block content in both languages, e.g. several paragraphs or a list.
export function Bi({ en, zh }: { en: ReactNode; zh: ReactNode }) {
  return (
    <>
      <div className="lang-en" lang="en">{en}</div>
      <div className="lang-zh" lang="zh-CN">{zh}</div>
    </>
  );
}
