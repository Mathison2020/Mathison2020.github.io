import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = path.join(root, "src", "content", "_migrated-blog");
const targetDir = path.join(root, "src", "content", "posts");

function parseFrontmatter(markdown) {
	const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
	if (!match) {
		throw new Error("Missing frontmatter");
	}

	const data = {};
	for (const line of match[1].split(/\r?\n/)) {
		const separator = line.indexOf(":");
		if (separator < 0) continue;
		const key = line.slice(0, separator).trim();
		const rawValue = line.slice(separator + 1).trim();
		if (rawValue.startsWith("[") || rawValue.startsWith("\"")) {
			data[key] = JSON.parse(rawValue);
		} else {
			data[key] = rawValue;
		}
	}

	return { data, body: match[2].trimStart() };
}

function yamlString(value) {
	return JSON.stringify(value ?? "");
}

function yamlArray(values) {
	return `[${values.map(yamlString).join(", ")}]`;
}

function convertPost(fileName) {
	const source = fs.readFileSync(path.join(sourceDir, fileName), "utf8");
	const { data, body } = parseFrontmatter(source);
	const image = data.cover || "api";
	const frontmatter = [
		"---",
		`title: ${yamlString(data.title)}`,
		`published: ${data.pubDate}`,
		`description: ${yamlString(data.description)}`,
		`image: ${yamlString(image)}`,
		`tags: ${yamlArray(data.tags || [])}`,
		`category: ${yamlString(data.category || "")}`,
		"draft: false",
		"lang: zh-CN",
		"comment: true",
		"---",
		"",
	].join("\n");

	fs.writeFileSync(path.join(targetDir, fileName), `${frontmatter}${body.trimEnd()}\n`, "utf8");
}

fs.rmSync(targetDir, { recursive: true, force: true });
fs.mkdirSync(targetDir, { recursive: true });

const files = fs.readdirSync(sourceDir).filter((fileName) => fileName.endsWith(".md"));
for (const fileName of files) convertPost(fileName);

console.log(`Converted ${files.length} posts to Firefly format.`);
