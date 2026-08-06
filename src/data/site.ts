import fs from "node:fs";
import path from "node:path";

type LinkItem = {
  label: string;
  href?: string;
  icon: string;
  active: boolean;
};

type PublicationLink = {
  label: string;
  href: string;
};

type Publication = {
  title: string;
  meta: string;
  authors: string;
  note: string;
  image?: string;
  imageLabel?: string;
  imageFit?: "cover" | "contain";
  links: PublicationLink[];
};

type Experience = {
  date: string;
  title: string;
  text: string;
};

function readContent(file: string) {
  return fs.readFileSync(path.join(process.cwd(), "content", file), "utf8");
}

const homeMarkdown = readContent("home.md");
const newsMarkdown = readContent("news.md");
const experienceMarkdown = readContent("experience.md");

function getSection(markdown: string, title: string) {
  const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const heading = markdown.match(new RegExp(`^## ${escaped}\\s*\\n`, "m"));

  if (!heading || heading.index === undefined) {
    return "";
  }

  const sectionStart = heading.index + heading[0].length;
  const remaining = markdown.slice(sectionStart);
  const nextHeadingIndex = remaining.search(/^##\s+/m);
  const sectionEnd = nextHeadingIndex === -1 ? markdown.length : sectionStart + nextHeadingIndex;

  return markdown.slice(sectionStart, sectionEnd).trim();
}

function parseFields(block: string) {
  return Object.fromEntries(
    block
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.includes(":"))
      .map((line) => {
        const [key, ...rest] = line.split(":");
        return [key.trim(), rest.join(":").trim()];
      }),
  );
}

function parsePipeList(block: string) {
  return block
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).split("|").map((part) => part.trim()));
}

function parseSimpleList(block: string) {
  return block
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim());
}

function parseLinks(value = "") {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const [label, href] = item.split("|").map((part) => part.trim());
      return { label, href };
    })
    .filter((item): item is PublicationLink => Boolean(item.label && item.href));
}

function parsePublications(markdown: string): Publication[] {
  return markdown
    .split(/^## /m)
    .slice(1)
    .map((block) => {
      const [title = "", ...body] = block.trim().split("\n");
      const fields = parseFields(body.join("\n"));

      return {
        title: title.trim(),
        meta: fields.meta ?? "",
        authors: fields.authors ?? "",
        note: fields.note ?? "",
        image: fields.image,
        imageLabel: fields.imageLabel,
        imageFit: fields.imageFit === "cover" ? "cover" : "contain",
        links: parseLinks(fields.links),
      };
    });
}

const profileFields = parseFields(homeMarkdown.split("## Preface")[0]);
export const navigation = [
  { label: "About", href: "#about" },
  { label: "News", href: "#news" },
  { label: "Publications", href: "#publications" },
  { label: "Japan", href: "#japan" },
  { label: "Experience", href: "#experience" },
];

export const profile = {
  name: homeMarkdown.match(/^# (.+)$/m)?.[1] ?? "Jiaming Wang",
  affiliation: profileFields.affiliation ?? "",
  role: profileFields.role ?? "",
  line: profileFields.line ?? "",
  note: profileFields.note ?? "",
};

export const profileLinks: LinkItem[] = parsePipeList(getSection(homeMarkdown, "Links")).map(([label, href, icon, state]) => ({
  label,
  href,
  icon,
  active: state === "active" && Boolean(href),
}));

export const intro = getSection(homeMarkdown, "About");

export const interests = parseSimpleList(getSection(homeMarkdown, "Research Interests"));

export const news = parsePipeList(newsMarkdown).map(([date, text]) => ({ date, text }));

export function getPublications(): Publication[] {
  return parsePublications(readContent("publications.md"));
}

export const experience: Experience[] = parsePipeList(experienceMarkdown).map(([date, title, text]) => ({
  date,
  title,
  text,
}));
