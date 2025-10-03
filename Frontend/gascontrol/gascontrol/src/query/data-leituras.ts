// src/query/data-leituras.ts
export async function getLeituras() {
  const res = await fetch('http://localhost:8000/api/leituras/', {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Falha ao carregar leituras.');
  const data = await res.json();
  // Se vier um array puro, retorna data; se for paginado, retorna data.results
  return Array.isArray(data) ? data : data.results;
}
