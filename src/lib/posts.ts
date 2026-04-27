import type { CollectionEntry } from "astro:content";

export function sortPosts(posts: CollectionEntry<"blog">[]) {
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function countBy(values: string[]) {
  return values.reduce<Record<string, number>>((counts, value) => {
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
}
