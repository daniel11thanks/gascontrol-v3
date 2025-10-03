import { cookies } from 'next/headers';

export type Condominio = {
  id: string;
  nome: string;
  local: string;
};

export async function getCondominios(): Promise<Condominio[]> {
  const basic = (await cookies()).get('basic')?.value;
  if (!basic) return [];

  try {
    const res = await fetch('http://localhost:8000/api/condominios/', {
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
