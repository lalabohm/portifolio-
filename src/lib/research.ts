import { getCollection, type CollectionEntry } from 'astro:content';

export interface ResearchPair {
  slug: string;
  en: CollectionEntry<'research'>;
  pt?: CollectionEntry<'research'>;
}

export async function getResearchPairs(): Promise<ResearchPair[]> {
  const all = await getCollection('research');
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
