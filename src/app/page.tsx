import Image from "next/image";
import {
  ArrowUp,
  ArrowUpRight,
  BookOpen,
  CodeXml,
  FileText,
  Fingerprint,
  GraduationCap,
  Mail,
} from "lucide-react";

import { JapanGallery } from "@/components/japan-gallery";
import { SiteHeader } from "@/components/site-header";
import {
  experience,
  getPublications,
  intro,
  interests,
  news,
  phdOpportunities,
  profile,
  profileLinks,
} from "@/data/site";

function SectionHeading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="section-heading">
      <p className="section-kicker">{kicker}</p>
      <h2 className="section-title">{title}</h2>
    </div>
  );
}

function LinkIcon({ name }: { name: string }) {
  const icons = {
    mail: Mail,
    file: FileText,
    github: CodeXml,
    scholar: GraduationCap,
    openreview: BookOpen,
    orcid: Fingerprint,
  };

  if (name === "x") return <span className="link-letter" aria-hidden="true">X</span>;
  if (name === "linkedin") return <span className="link-letter" aria-hidden="true">in</span>;

  const Icon = icons[name as keyof typeof icons] ?? FileText;
  return <Icon size={17} strokeWidth={1.6} aria-hidden="true" />;
}

function getVenueTone(label: string) {
  const normalized = label.toLowerCase();
  for (const venue of ["iclr", "icml", "cvpr", "acl", "kdd", "arxiv"]) {
    if (normalized.includes(venue)) return venue;
  }
  return "default";
}

function AuthorList({ authors }: { authors: string }) {
  const parts = authors.split(profile.name);
  return parts.map((part, index) => (
    <span key={`${part}-${index}`}>
      {part}
      {index < parts.length - 1 ? <strong>{profile.name}</strong> : null}
    </span>
  ));
}

export default function Home() {
  const publications = getPublications();
  const activeLinks = profileLinks.filter((item) => item.active && item.href);
  const contactLinks = activeLinks.filter((item) => ["mail", "file"].includes(item.icon));
  const socialLinks = activeLinks.filter((item) => !["mail", "file"].includes(item.icon));
  const email = contactLinks.find((item) => item.icon === "mail");

  return (
    <div className="site-page">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <SiteHeader onHome />

      <main id="main-content" className="site-shell">
        <div className="academic-layout">
          <aside className="sidebar-column" aria-label="Profile and contact">
            <div className="portrait-card">
              <div className="portrait-shell">
                <Image
                  src="/avatar-main.jpg"
                  alt={`Portrait of ${profile.name}`}
                  fill
                  priority
                  sizes="(max-width: 899px) 112px, 208px"
                  className="object-cover object-center"
                />
              </div>
            </div>
            <div className="profile-block">
              <h1 className="profile-name">{profile.name}</h1>
              <p className="profile-role">{profile.role}</p>
              <p className="profile-affiliation">{profile.affiliation}</p>
              <p className="profile-line">{profile.line}</p>
            </div>
            <div className="contact-links">
              {contactLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`contact-link ${item.icon === "file" ? "contact-link--cv" : ""}`}
                  target={item.icon === "file" ? "_blank" : undefined}
                  rel={item.icon === "file" ? "noreferrer" : undefined}
                  title={item.icon === "file" ? "Open curriculum vitae (PDF)" : undefined}
                >
                  <LinkIcon name={item.icon} />
                  <span>{item.label}</span>
                  {item.icon === "file" ? <ArrowUpRight size={14} aria-hidden="true" /> : null}
                </a>
              ))}
            </div>
            <div className="link-stack">
              {socialLinks.map((item) => (
                <a key={item.label} href={item.href} className="icon-link" target="_blank" rel="noreferrer">
                  <span className="icon-shell"><LinkIcon name={item.icon} /></span>
                  <span>{item.label}</span>
                  <ArrowUpRight className="social-arrow" size={13} aria-hidden="true" />
                </a>
              ))}
            </div>
          </aside>

          <div className="content-column">
            <section id="about" className="content-section">
              <div className="phd-notice" aria-labelledby="phd-heading">
                <p id="phd-heading" className="phd-heading">Fall 2027 · PhD Opportunities</p>
                <p>{phdOpportunities}</p>
                {email ? (
                  <a href={email.href} className="phd-contact">
                    <Mail size={15} aria-hidden="true" /> Get in touch <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                ) : null}
              </div>
              <SectionHeading kicker="About" title="Research Profile" />
              <p className="intro-copy">{intro}</p>
              <ul className="interest-list" aria-label="Research interests">
                {interests.map((item) => <li key={item} className="interest-item">{item}</li>)}
              </ul>
            </section>

            <section id="news" className="content-section">
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

            <section id="publications" className="content-section">
              <SectionHeading kicker="Research" title="Publications & Manuscripts" />
              <div className="publication-stack">
                {publications.map((item) => {
                  const venue = item.meta || (item.links.some((link) => link.label.toLowerCase().includes("arxiv")) ? "arXiv" : "");
                  return (
                    <article key={item.title} className="publication-card">
                      <div className="publication-cover">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={`${item.title} overview`}
                            fill
                            sizes="(max-width: 599px) 160px, 144px"
                            className={item.imageFit === "contain" ? "object-contain p-2" : "object-cover object-center"}
                          />
                        ) : (
                          <div className="publication-fallback"><span>{item.imageLabel}</span></div>
                        )}
                      </div>
                      <div className="publication-body">
                        <h3 className="publication-title">{item.title}</h3>
                        {item.authors ? <p className="publication-authors"><AuthorList authors={item.authors} /></p> : null}
                        {item.note ? <p className="publication-note">{item.note}</p> : null}
                        <div className="publication-links">
                          {venue ? <span className={`publication-venue publication-venue--${getVenueTone(venue)}`}>{venue}</span> : null}
                          {item.links.map((link) => (
                            <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="publication-link">
                              {link.label}<ArrowUpRight size={12} aria-hidden="true" />
                            </a>
                          ))}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <section id="experience" className="content-section">
              <SectionHeading kicker="Background" title="Experience & Education" />
              <div className="list-block">
                {experience.map((item) => (
                  <article key={`${item.date}-${item.title}`} className="list-row experience-row">
                    <p className="list-date">{item.date}</p>
                    <div>
                      <h3 className="experience-title">{item.title}</h3>
                      <p className="list-text">{item.text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
            <JapanGallery />
          </div>
        </div>
        <footer className="site-footer">
          <p className="profile-note" lang="ja">{profile.note}</p>
          <a href="#about" className="back-to-top" title="Back to top" aria-label="Back to top"><ArrowUp size={18} aria-hidden="true" /></a>
        </footer>
      </main>
    </div>
  );
}
