'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function leituraDelete(formData: FormData) {
  const id = Number(formData.get('id'));
  if (isNaN(id)) throw new Error('ID ausente.');

  const basic = (await cookies()).get('basic')?.value;
  if (!basic) throw new Error('Não autenticado.');

  const res = await fetch(`http://localhost:8000/api/leituras/${id}/`, {
    method: 'DELETE',
    headers: { Authorization: `Basic ${basic}` },
    cache: 'no-store',
  });
  if (!res.ok && res.status !== 204) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Falha ao excluir leitura: ${res.status} ${txt}`);
  }

  revalidatePath('/cadastros');
}
