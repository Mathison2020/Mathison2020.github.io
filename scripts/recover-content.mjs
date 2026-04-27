import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";
import TurndownService from "turndown";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = fs.existsSync(path.join(root, "legacy")) ? path.join(root, "legacy") : root;
const blogDir = path.join(root, "src", "content", "blog");
const dataDir = path.join(root, "src", "data");

const postPathPattern = /^(\d{4})[\\/](\d{2})[\\/](\d{2})[\\/]([^\\/]+)[\\/]index\.html$/;
const coverMap = extractHomepageCovers();

const turndown = new TurndownService({
  codeBlockStyle: "fenced",
  fence: "```",
  headingStyle: "atx",
});

turndown.addRule("fencedCodeBlock", {
  filter: (node) => node.nodeName === "PRE" && node.firstChild?.nodeName === "CODE",
  replacement: (_content, node) => {
    const code = node.firstChild;
    const className = code.getAttribute("class") || "";
    const rawLanguage = className.match(/language-([^\s]+)/)?.[1] || "";
    const language = rawLanguage === "nasm" ? "text" : rawLanguage;
    return `\n\n\`\`\`${language}\n${code.textContent.replace(/\n+$/g, "")}\n\`\`\`\n\n`;
  },
});

turndown.addRule("strikethrough", {
  filter: ["del", "s"],
  replacement: (content) => `~~${content}~~`,
});

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    return fullPath;
  });
}

function cleanText(value) {
  return value.replace(/\s+/g, " ").trim();
}

function yamlString(value) {
  return JSON.stringify(value ?? "");
}

function yamlArray(values) {
  return `[${values.map(yamlString).join(", ")}]`;
}

function slugifyFilename(value) {
  return value
    .normalize("NFKD")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function normalizeArticleHtml($, article) {
  article.find("a.headerlink, span.line-numbers-rows").remove();
  article.find("[aria-hidden='true']").remove();
  article.find("img").each((_, img) => {
    const src = $(img).attr("src");
    if (src) $(img).attr("src", src);
    if (!$(img).attr("alt")) $(img).attr("alt", "");
  });
  return article.html() || "";
}

function assetExists(src) {
  if (!src || /^https?:\/\//.test(src)) return Boolean(src);
  if (src.startsWith("/medias/")) return false;
  return fs.existsSync(path.join(sourceRoot, src.replace(/^\//, "")));
}

function extractHomepageCovers() {
  const filePath = path.join(sourceRoot, "index.html");
  if (!fs.existsSync(filePath)) return new Map();

  const $ = cheerio.load(fs.readFileSync(filePath, "utf8"), { decodeEntities: true });
  const map = new Map();
  $("#articles .article .card").each((_, node) => {
    const card = $(node);
    const href = card.find("a").first().attr("href");
    const cover = card.find("img.responsive-img").first().attr("src");
    if (href && assetExists(cover)) map.set(decodeURIComponent(href), cover);
  });
  return map;
}

function extractPost(filePath) {
  const relative = path.relative(sourceRoot, filePath);
  const match = relative.match(postPathPattern);
  if (!match) return null;

  const [, year, month, day, rawSlug] = match;
  const html = fs.readFileSync(filePath, "utf8");
  const $ = cheerio.load(html, { decodeEntities: true });
  const info = $("#artDetail .article-info").first();
  const title = cleanText($("h1.post-title").first().text()) || cleanText($("title").text().split("|")[0]);
  const pubDate = info.find(".post-info").text().match(/\d{4}-\d{2}-\d{2}/)?.[0] || `${year}-${month}-${day}`;
  const category = cleanText(info.find(".post-cate .post-category").first().text());
  const tags = [...new Set(info.find(".article-tag .chip")
    .map((_, tag) => cleanText($(tag).text()))
    .get()
    .filter(Boolean))];
  const article = $("#articleContent").first().clone();
  const markdown = turndown.turndown(normalizeArticleHtml($, article)).trim();
  const oldPath = `/${year}/${month}/${day}/${decodeURIComponent(rawSlug)}/`;
  const cover = coverMap.get(oldPath) || "";
  const summary = cleanText($("meta[name='description']").attr("content") || article.text()).slice(0, 160);
  const filenameSlug = slugifyFilename(`${pubDate}-${decodeURIComponent(rawSlug)}`) || `${pubDate}-${rawSlug}`;

  return {
    filename: `${filenameSlug}.md`,
    title,
    pubDate,
    category,
    tags,
    cover,
    description: summary,
    markdown,
  };
}

function extractFriends() {
  const filePath = path.join(sourceRoot, "friends", "index.html");
  if (!fs.existsSync(filePath)) return [];

  const $ = cheerio.load(fs.readFileSync(filePath, "utf8"), { decodeEntities: true });
  return $(".friend-div")
    .map((_, node) => {
      const card = $(node);
      return {
        name: cleanText(card.find(".friend-name").first().text()),
        description: cleanText(card.find("p").first().text()),
        url: card.find(".friend-button a").first().attr("href") || "",
        avatar: card.find("img").first().attr("src") || "",
        cta: cleanText(card.find(".friend-button a").first().text()),
      };
    })
    .get()
    .filter((friend) => friend.name && friend.url);
}

function writePost(post) {
  const frontmatter = [
    "---",
    `title: ${yamlString(post.title)}`,
    `pubDate: ${post.pubDate}`,
    `category: ${yamlString(post.category)}`,
    `tags: ${yamlArray(post.tags)}`,
    `cover: ${yamlString(post.cover)}`,
    `description: ${yamlString(post.description)}`,
    "---",
    "",
  ].join("\n");

  fs.writeFileSync(path.join(blogDir, post.filename), `${frontmatter}${post.markdown}\n`, "utf8");
}

fs.rmSync(blogDir, { recursive: true, force: true });
fs.mkdirSync(blogDir, { recursive: true });
fs.mkdirSync(dataDir, { recursive: true });

const posts = walk(sourceRoot)
  .map(extractPost)
  .filter(Boolean)
  .sort((a, b) => b.pubDate.localeCompare(a.pubDate) || a.title.localeCompare(b.title));

for (const post of posts) writePost(post);

const friends = extractFriends();
fs.writeFileSync(path.join(dataDir, "friends.json"), `${JSON.stringify(friends, null, 2)}\n`, "utf8");

console.log(`Recovered ${posts.length} posts and ${friends.length} friend links.`);
