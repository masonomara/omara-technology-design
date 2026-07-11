import fs from "fs";
import path from "path";
import { marked } from "marked";
import navRaw from "../../content/nav.json";
import type { ContentNode } from "./types";
import { toSlug } from "./slug";

const nav = navRaw as ContentNode[];

export function getWorkItems(): ContentNode[] {
  return nav.find((n) => n.name === "work")?.children ?? [];
}

export function getWorkNode(slug: string): ContentNode | null {
  return getWorkItems().find((item) => toSlug(item.name) === slug) ?? null;
}

export function loadMarkdown(slug: string): string {
  const mdPath = path.join(process.cwd(), "content", "projects", slug, `${slug}.md`);
  try {
    return marked(fs.readFileSync(mdPath, "utf-8")) as string;
  } catch {
    return "";
  }
}

export function loadMarkdownText(slug: string): string {
  const html = loadMarkdown(slug);
  // Strip standalone image paragraphs — images are rendered separately in the masonry grid
  return html.replace(/<p><img[^>]+><\/p>\n?/g, "");
}

const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"]);

function naturalCompare(a: string, b: string): number {
  const aNum = a.match(/^(\d+)/);
  const bNum = b.match(/^(\d+)/);
  const na = aNum ? parseInt(aNum[1], 10) : Infinity;
  const nb = bNum ? parseInt(bNum[1], 10) : Infinity;
  if (na !== Infinity || nb !== Infinity) return na - nb;
  return a.localeCompare(b);
}

// Reads image files from a project's images/ subdirectory, sorted naturally.
function readImagesDir(slug: string): string[] {
  const dir = path.join(process.cwd(), "content", "projects", slug, "images");
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()))
      .sort(naturalCompare)
      .map((f) => `/content/projects/${slug}/images/${f}`);
  } catch {
    return [];
  }
}

export function getImages(slug: string): string[] {
  const node = getWorkNode(slug);
  if (node?.images && node.images.length > 0) {
    return node.images.map((f) =>
      f.startsWith("/") ? f : `/content/projects/${slug}/images/${f}`,
    );
  }
  return readImagesDir(slug);
}

export function getThumbnail(slug: string): string {
  for (const ext of ["png", "webp", "jpg", "jpeg"]) {
    const filePath = path.join(process.cwd(), "content", "projects", slug, `${slug}.${ext}`);
    if (fs.existsSync(filePath)) {
      return `/content/projects/${slug}/${slug}.${ext}`;
    }
  }
  // Fall back to first image in the images/ subdirectory
  return readImagesDir(slug)[0] ?? "";
}
