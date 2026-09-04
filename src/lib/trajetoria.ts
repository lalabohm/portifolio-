import { getCollection, type CollectionEntry } from 'astro:content';

export interface TrajetoriaPair {
  slug: string;
  en: CollectionEntry<'trajetoria'>;
  pt?: CollectionEntry<'trajetoria'>;
}

export async function getTrajetoriaPairs(): Promise<TrajetoriaPair[]> {
  const all = await getCollection('trajetoria');
  const en = all.filter((entry) => !entry.slug.startsWith('pt/'));
  const pt = all.filter((entry) => entry.slug.startsWith('pt/'));

  return en
    .map((entry) => ({
      slug: entry.slug,
      en: entry,
      pt: pt.find((p) => p.slug === `pt/${entry.slug}`),
    }))
    .sort((a, b) => b.en.data.dateStart.valueOf() - a.en.data.dateStart.valueOf());
}

export const TYPE_LABEL: Record<string, { en: string; pt: string }> = {
  profissional: { en: 'Professional', pt: 'Profissional' },
  pesquisa: { en: 'Research', pt: 'Pesquisa' },
  extensao: { en: 'Extension', pt: 'Extensão' },
  voluntariado: { en: 'Volunteering', pt: 'Voluntariado' },
};

const MONTHS_PT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatDate(d: Date, lang: 'en' | 'pt', precision: 'month' | 'year' = 'month'): string {
  if (precision === 'year') return `${d.getUTCFullYear()}`;
  const months = lang === 'pt' ? MONTHS_PT : MONTHS_EN;
  return `${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export const CURRENT_LABEL = { en: 'Current', pt: 'Atual' };
