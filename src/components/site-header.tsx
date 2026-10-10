import { ThemeToggle } from "@/components/theme-toggle";
import { navigation, profile } from "@/data/site";

// On pages other than the home page, section anchors such as "#news" must point back to "/#news".
export function SiteHeader({ onHome = false }: { onHome?: boolean }) {
  const resolve = (href: string) => (href.startsWith("#") && !onHome ? `/${href}` : href);

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <a href={resolve("#about")} className="topbar-brand">
          <span className="topbar-name">{profile.name}</span>
          <span className="topbar-role">Research</span>
        </a>
        <nav className="topbar-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <a key={item.href} href={resolve(item.href)} className="topbar-link">{item.label}</a>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
