import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export type Gasometro = {
  id: string;
  codigo: string;
  apartamento: number;
};

export async function getGasometros(): Promise<Gasometro[]> {
  const basic = (await cookies()).get('basic')?.value;
  if (!basic) redirect('/login');

  const url = new URL('http://localhost:8000/api/gasometros/');
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Basic ${basic}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Erro ao buscar gasômetros: ${res.status} ${txt}`);
  }

  const data = (await res.json()) as Gasometro[];
  return data;
}
