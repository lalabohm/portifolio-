export const TYPE_LABEL: Record<string, string> = {
  profissional: 'Profissional',
  pesquisa: 'Pesquisa',
  extensao: 'Extensão',
};

const MONTHS_PT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export function formatDate(d: Date): string {
  return `${MONTHS_PT[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}
