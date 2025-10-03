'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function condominioDelete(id: string) {
  const basic = (await cookies()).get('basic')?.value;
  if (!basic) throw new Error('Não autenticado.');

  const res = await fetch(`http://localhost:8000/api/condominios/${id}/`, {
    method: 'DELETE',
    headers: { Authorization: `Basic ${basic}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Falha ao deletar condomínio: ${res.status} ${txt}`);
  }

  revalidatePath('/gasometros');
}
