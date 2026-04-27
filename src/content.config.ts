import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    category: z.string(),
    tags: z.array(z.string()),
    oldPath: z.string(),
    cover: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const collections = { blog };
