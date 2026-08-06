import Image from "next/image";
import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
import { JapanGallery } from "@/components/japan-gallery";
import { experience, getPublications, intro, interests, navigation, news, profile, profileLinks } from "@/data/site";

type IconName =
  | "mail"
  | "file"
  | "github"
  | "scholar"
  | "openreview"
  | "huggingface"
  | "xiaohongshu"
  | "linkedin"
  | "x"
  | "orcid";

function SectionHeading({
  kicker,
  title,
}: {
  kicker: string;
  title: string;
}) {
  return (
    <div className="section-heading">
      <p className="section-kicker">{kicker}</p>
      <h2 className="section-title">{title}</h2>
    </div>
  );
}

function LinkIcon({ name }: { name: IconName }) {
  const common = "h-[18px] w-[18px] stroke-[1.6] text-[var(--ink-strong)]";

  switch (name) {
    case "mail":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
          <path d="M4 7.5 12 13l8-5.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="4" y="6" width="16" height="12" rx="2.5" stroke="currentColor" />
        </svg>
      );
    case "file":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
          <path d="M8 3.5h6l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 7 19V5A1.5 1.5 0 0 1 8.5 3.5Z" stroke="currentColor" />
          <path d="M14 3.5V8h4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "github":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
          <path
            d="M9.2 18.2c-4 .9-4-2.2-5.6-2.7m11.2 5.4v-2.3a2 2 0 0 0-.6-1.5c2-.2 4.1-1 4.1-4.5A3.5 3.5 0 0 0 17.4 10a3.2 3.2 0 0 0-.1-2.4s-.8-.3-2.6 1A8.8 8.8 0 0 0 12 8.3a8.8 8.8 0 0 0-2.7.3c-1.8-1.3-2.6-1-2.6-1A3.2 3.2 0 0 0 6.6 10a3.5 3.5 0 0 0-.9 2.5c0 3.5 2.1 4.3 4.1 4.5a2 2 0 0 0-.6 1.5v2.3"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "scholar":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
          <path d="m4 9 8-4 8 4-8 4-8-4Z" stroke="currentColor" strokeLinejoin="round" />
          <path d="M7 11.5V15c0 1.7 2.2 3 5 3s5-1.3 5-3v-3.5" stroke="currentColor" strokeLinecap="round" />
        </svg>
      );
    case "openreview":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
          <rect x="5" y="4.5" width="14" height="15" rx="3" stroke="currentColor" />
          <path d="M8.5 8.5h7M8.5 12h7M8.5 15.5h4.5" stroke="currentColor" strokeLinecap="round" />
        </svg>
      );
    case "huggingface":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
          <circle cx="8.5" cy="11" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="15.5" cy="11" r="1.2" fill="currentColor" stroke="none" />
          <path d="M7.5 15c1 .9 2.5 1.5 4.5 1.5s3.5-.6 4.5-1.5" stroke="currentColor" strokeLinecap="round" />
          <path d="M6.5 9c0-2.2 1.9-4 5.5-4s5.5 1.8 5.5 4v4.2c0 2.7-2.2 5-5.5 5s-5.5-2.3-5.5-5Z" stroke="currentColor" />
        </svg>
      );
    case "xiaohongshu":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} aria-hidden="true">
          <rect x="4.5" y="6" width="15" height="12" rx="4" stroke="currentColor" />
          <path d="M9 10.2h2.4M9 13.8h6M14 10.2h1" stroke="currentColor" strokeLinecap="round" />
        </svg>
      );
    case "linkedin":
      return <span className="link-letter" aria-hidden="true">in</span>;
    case "x":
      return <span className="link-letter" aria-hidden="true">X</span>;
    case "orcid":
      return <span className="link-letter" aria-hidden="true">iD</span>;
  }
}

function getVenueTone(label: string) {
  const normalized = label.toLowerCase();

  if (normalized.includes("iclr")) return "iclr";
  if (normalized.includes("icml")) return "icml";
  if (normalized.includes("cvpr")) return "cvpr";
  if (normalized.includes("acl")) return "acl";
  if (normalized.includes("arxiv")) return "arxiv";

  return "default";
}

function AuthorList({ authors }: { authors: string }) {
  const name = profile.name;
  const parts = authors.split(name);

  return (
    <>
      {parts.map((part, index) => (
        <span key={`${part}-${index}`}>
          {part}
          {index < parts.length - 1 ? <strong>{name}</strong> : null}
        </span>
      ))}
    </>
  );
}

export default function Home() {
  const publications = getPublications();

  return (
    <div className="site-page">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="topbar-brand">
            <span className="topbar-name">{profile.name}</span>
            <span className="topbar-role">academic homepage</span>
          </div>
          <nav className="topbar-nav">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="topbar-link">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <div className="theme-floating">
        <ThemeToggle />
      </div>

      <main className="site-shell">
        <div className="academic-layout">
          <aside className="sidebar-column">
            <div className="portrait-card">
              <div className="portrait-shell">
                <Image
                  src="/avatar-main.jpg"
                  alt={`Portrait of ${profile.name}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 34vw, 208px"
                  className="object-cover object-center"
                />
              </div>
            </div>

            <div className="profile-block">
              <h1 className="profile-name">{profile.name}</h1>
              <p className="profile-role">
                {profile.role}, {profile.affiliation}
              </p>
              <p className="profile-line">{profile.line}</p>
            </div>

            <div className="link-stack">
              {profileLinks.map((item) =>
                item.active && item.href ? (
                  <a key={item.label} href={item.href} className="icon-link" target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noreferrer" : undefined}>
                    <span className="icon-shell">
                      <LinkIcon name={item.icon as IconName} />
                    </span>
                    <span>{item.label}</span>
                  </a>
                ) : (
                  <div key={item.label} className="icon-link is-muted" aria-disabled="true">
                    <span className="icon-shell">
                      <LinkIcon name={item.icon as IconName} />
                    </span>
                    <span>{item.label}</span>
                    <span className="profile-link-hint">add link</span>
                  </div>
                ),
              )}
            </div>

            <p className="profile-note">{profile.note}</p>
          </aside>

          <div className="content-column">
            <section id="about" className="content-section scroll-mt-24">
              <SectionHeading kicker="About" title="Research Profile" />
              <p className="intro-copy">{intro}</p>
              <div className="interest-list" aria-label="Research interests">
                {interests.map((item) => (
                  <span key={item} className="interest-item">
                    {item}
                  </span>
                ))}
              </div>
            </section>

            <section id="news" className="content-section scroll-mt-24">
              <SectionHeading kicker="News" title="Recent Updates" />
              <div className="list-block">
                {news.map((item) => (
                  <article key={`${item.date}-${item.text}`} className="list-row">
                    <p className="list-date">{item.date}</p>
                    <p className="list-text">{item.text}</p>
                  </article>
                ))}
              </div>
            </section>

            <section id="publications" className="content-section scroll-mt-24">
              <SectionHeading kicker="Selected Publications" title="Papers and Projects" />
              <div className="publication-stack">
                {publications.map((item) => {
                  const venue = item.meta || (item.links.some((link) => link.label.toLowerCase().includes("arxiv")) ? "arXiv" : "");

                  return (
                    <article key={item.title} className="publication-card">
                      <div className="publication-cover">
                        {item.image ? (
                          <Image
                          src={item.image}
                          alt={`${item.title} cover`}
                          fill
                          sizes="(max-width: 1024px) 120px, 140px"
                          className={item.imageFit === "contain" ? "object-contain p-2" : "object-cover object-center"}
                        />
                      ) : (
                        <div className="publication-fallback">
                          <span>{item.imageLabel}</span>
                        </div>
                      )}
                    </div>
                    <div className="publication-body">
                      <h2 className="publication-title">{item.title}</h2>
                      {item.authors ? (
                        <p className="publication-authors">
                          <AuthorList authors={item.authors} />
                        </p>
                      ) : null}
                      {item.note ? <p className="publication-note">{item.note}</p> : null}
                      {venue || item.links.length ? (
                        <div className="publication-links">
                          {venue ? <span className={`publication-venue publication-venue--${getVenueTone(venue)}`}>{venue}</span> : null}
                          {item.links.map((link) => (
                            <a
                              key={link.label}
                              href={link.href}
                              target={link.href.startsWith("http") && link.href !== "#" ? "_blank" : undefined}
                              rel={link.href.startsWith("http") && link.href !== "#" ? "noreferrer" : undefined}
                              className={`publication-link ${link.href === "#" ? "is-disabled" : ""}`}
                              aria-disabled={link.href === "#"}
                            >
                              {link.label}
                            </a>
                          ))}
                        </div>
                        ) : null}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <JapanGallery />

            <section id="experience" className="content-section scroll-mt-24">
              <SectionHeading kicker="Experience" title="Research Experience" />
              <div className="list-block">
                {experience.map((item) => (
                  <article key={`${item.date}-${item.title}`} className="list-row">
                    <p className="list-date">{item.date}</p>
                    <div>
                      <h3 className="experience-title">{item.title}</h3>
                      <p className="list-text">{item.text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
