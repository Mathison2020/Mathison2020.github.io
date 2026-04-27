import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const postsDir = path.join(root, "src", "content", "posts");

function splitByCodeFence(content) {
	const parts = [];
	const fencePattern = /```[\s\S]*?```/g;
	let cursor = 0;
	let match;
	while ((match = fencePattern.exec(content))) {
		if (match.index > cursor) {
			parts.push({ type: "text", value: content.slice(cursor, match.index) });
		}
		parts.push({ type: "code", value: match[0] });
		cursor = match.index + match[0].length;
	}
	if (cursor < content.length) {
		parts.push({ type: "text", value: content.slice(cursor) });
	}
	return parts;
}

function fixMathContent(math) {
	return math
		.replace(/\\\\([a-zA-Z]+)/g, "\\$1")
		.replace(/\\_/g, "_")
		.replace(/\\([[\]])/g, "$1")
		.replace(/\\([{}])/g, "$1")
		.replace(/\\\*/g, "*");
}

function fixMathInText(text) {
	let output = "";
	let cursor = 0;
	while (cursor < text.length) {
		const start = text.indexOf("$", cursor);
		if (start === -1) {
			output += text.slice(cursor);
			break;
		}
		output += text.slice(cursor, start);

		const isBlock = text.startsWith("$$", start);
		const delimiter = isBlock ? "$$" : "$";
		const contentStart = start + delimiter.length;
		const end = text.indexOf(delimiter, contentStart);
		if (end === -1) {
			output += text.slice(start);
			break;
		}

		const math = text.slice(contentStart, end);
		output += delimiter + fixMathContent(math) + delimiter;
		cursor = end + delimiter.length;
	}
	return output;
}

function fixFile(filePath) {
	const original = fs.readFileSync(filePath, "utf8");
	const frontmatter = original.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
	const prefix = frontmatter?.[0] ?? "";
	const body = original.slice(prefix.length);
	const fixedBody = splitByCodeFence(body)
		.map((part) => (part.type === "code" ? part.value : fixMathInText(part.value)))
		.join("");
	const fixed = prefix + fixedBody;

	if (fixed !== original) {
		fs.writeFileSync(filePath, fixed, "utf8");
		return true;
	}
	return false;
}

const changed = fs
	.readdirSync(postsDir)
	.filter((fileName) => fileName.endsWith(".md") || fileName.endsWith(".mdx"))
	.filter((fileName) => fixFile(path.join(postsDir, fileName)));

console.log(`Fixed math escaping in ${changed.length} file(s).`);
for (const fileName of changed) console.log(`- ${fileName}`);
