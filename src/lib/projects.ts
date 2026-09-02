import { getCollection, type CollectionEntry } from 'astro:content';

export interface ProjectPair {
  slug: string;
  en: CollectionEntry<'projects'>;
  pt?: CollectionEntry<'projects'>;
}

export const STATUS_LABEL: Record<string, { en: string; pt: string }> = {
  'in progress': { en: 'in progress', pt: 'em andamento' },
  completed: { en: 'completed', pt: 'concluído' },
  paused: { en: 'paused', pt: 'pausado' },
};

export async function getProjectPairs(): Promise<ProjectPair[]> {
  const all = await getCollection('projects');
  const en = all.filter((entry) => !entry.slug.startsWith('pt/'));
  const pt = all.filter((entry) => entry.slug.startsWith('pt/'));

  return en
    .map((entry) => ({
      slug: entry.slug,
      en: entry,
      pt: pt.find((p) => p.slug === `pt/${entry.slug}`),
    }))
    .sort((a, b) => b.en.data.date.valueOf() - a.en.data.date.valueOf());
}
