import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    stack: z.array(z.string()),
    status: z.enum(['in progress', 'completed', 'paused']),
    metrics: z.array(z.string()).optional(), // quantified results
    repoUrl: z.string().url().optional(),
    date: z.date(),
    featured: z.boolean().default(false),
  }),
});

const writeups = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    event: z.string(),        // ex: "CTF Cariri — BSides Fortaleza"
    category: z.enum(['crypto', 'web', 'pwn', 'stego', 'osint', 'misc']),
    team: z.string().default('Pangeia'),
    result: z.string().optional(), // ex: "2º lugar"
    date: z.date(),
  }),
});

export const collections = { projects, writeups };
