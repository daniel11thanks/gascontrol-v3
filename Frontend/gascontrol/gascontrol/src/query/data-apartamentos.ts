import { cookies } from 'next/headers';

export type Apartamento = {
  id: number;
  nome?: string;
  numero?: string;
  torre: number; // referência à torre
};

export async function getApartamentos(): Promise<Apartamento[]> {
  const basic = (await cookies()).get('basic')?.value;
  if (!basic) throw new Error('Não autenticado: cookie basic ausente.');

  const res = await fetch('http://localhost:8000/api/apartamentos/', {
    headers: { Authorization: `Basic ${basic}` },
    cache: 'no-store',
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Erro ao buscar apartamentos: ${res.status} ${txt}`);
  }
  return (await res.json()) as Apartamento[];
}
