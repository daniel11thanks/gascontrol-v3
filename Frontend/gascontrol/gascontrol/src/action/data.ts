import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export type Relatorio = {
  id: number;
  tipo: string;
  referencia_id: number;
  data_inicio: string;
  data_fim: string;
  total_consumo: string;
  data_geracao: string;
};

export async function getRelatorios(params: {
  tipo?: string;
  data_inicio?: string;
  data_fim?: string;
}): Promise<Relatorio[]> {
  const basic = (await cookies()).get('basic')?.value;
  if (!basic) redirect('/login');

  const url = new URL('http://localhost:8000/api/relatorios/');
  if (params.tipo && params.tipo !== 'TODOS')
    url.searchParams.set('tipo', params.tipo);
  if (params.data_inicio)
    url.searchParams.set('data_inicio', params.data_inicio);
  if (params.data_fim) url.searchParams.set('data_fim', params.data_fim);

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Basic ${basic}` },
    cache: 'no-store',
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Erro ao buscar relatórios: ${res.status} ${txt}`);
  }

  let data = (await res.json()) as Relatorio[];

  if (params.tipo && params.tipo !== 'TODOS') {
    const t = params.tipo.toUpperCase();
    data = data.filter((d) => d.tipo.toUpperCase() === t);
  }
  if (params.data_inicio)
    data = data.filter((d) => d.data_inicio >= params.data_inicio!);
  if (params.data_fim)
    data = data.filter((d) => d.data_fim <= params.data_fim!);

  return data;
}
