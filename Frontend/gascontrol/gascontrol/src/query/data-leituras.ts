import type { Leitura } from '@/components/pagination/PaginationLeituras';

export async function getLeituras() {
  const res = await fetch('http://localhost:8000/api/leituras/', {
    // cache: 'no-store', // pode manter se precisar sempre fresh
  });

  // 204 = sem conteúdo -> retorne lista vazia
  if (res.status === 204) return [];

  // Se não for ok e não for um caso esperado de vazio, lance erro
  if (!res.ok && res.status !== 404) {
    throw new Error('Falha ao carregar leituras.');
  }

  // 404 para lista pode ser tratado como vazio
  if (res.status === 404) return [];

  // Tente interpretar o JSON; se não houver corpo, retorne vazio
  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    return [];
  }

  // A API às vezes retorna array puro, às vezes paginado {results: [...]}
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object' && 'results' in (data as Leitura)) {
    return (data as { results: unknown[] }).results ?? [];
  }

  return [];
}
