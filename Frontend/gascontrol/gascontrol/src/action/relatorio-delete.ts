'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function relatorioDelete(formData: FormData) {
  const id = String(formData.get('id') || '').trim();
  if (!id) throw new Error('ID ausente.');

  const basic = (await cookies()).get('basic')?.value;
  if (!basic) throw new Error('Não autenticado.');

  const res = await fetch(`http://localhost:8000/api/relatorios/${id}/`, {
    method: 'DELETE',
    headers: { Authorization: `Basic ${basic}` },
    cache: 'no-store',
  });

  // Alguns backends retornam 204 sem corpo; trate ambos como sucesso
  if (!res.ok && res.status !== 204) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Falha ao excluir relatório: ${res.status} ${txt}`);
  }

  revalidatePath('/relatorios');
}
