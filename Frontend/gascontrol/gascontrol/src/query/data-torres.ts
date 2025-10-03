import { cookies } from 'next/headers';

export type Torre = {
  id: string;
  numero: string;
  identificacao: string;
  condominio: string; // ID do condomínio
};

export async function getTorres(): Promise<Torre[]> {
  const basic = (await cookies()).get('basic')?.value;
  if (!basic) return [];

  try {
    const res = await fetch('http://localhost:8000/api/torres/', {
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
