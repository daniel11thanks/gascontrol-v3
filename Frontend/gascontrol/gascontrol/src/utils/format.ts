export function formatPeriodo(inicio: string, fim: string) {
  const [y1, m1, d1] = inicio.split('-').map(Number);
  const [y2, m2, d2] = fim.split('-').map(Number);
  const dd = (n: number) => String(n).padStart(2, '0');
  return `${dd(d1)}/${dd(m1)}/${y1} - ${dd(d2)}/${dd(m2)}/${y2}`;
}

export function toDecimal(n: string | number) {
  const v = typeof n === 'number' ? n : Number(String(n).replace(',', '.'));
  return Number.isFinite(v) ? v : 0;
}
