// src/query/data-pessoas.ts
import { cookies } from 'next/headers';

export type Pessoa = {
  id: string;
  nome: string;
  tipo: 'Dono' | 'Inquilino' | 'Morador';
  apartamento: string; // ID do apartamento
};

export async function getPessoas(): Promise<Pessoa[]> {
  const basic = (await cookies()).get('basic')?.value;
  if (!basic) return [];
  try {
    const res = await fetch('http://localhost:8000/api/pessoas/', {
      headers: { Authorization: `Basic ${basic}` },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
