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

const trajetoria = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    org: z.string(),
    type: z.enum(['profissional', 'pesquisa', 'extensao']),
    role: z.string(),
    dateStart: z.date(),
    dateEnd: z.date().nullable().optional(), // null/ausente = "atual"
    summary: z.string(),
    link: z.string().url().optional(),
  }),
});

export const collections = { projects, writeups, trajetoria };
