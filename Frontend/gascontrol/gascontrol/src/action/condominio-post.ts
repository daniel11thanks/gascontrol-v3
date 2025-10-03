'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function condominioPost(formData: FormData) {
  const basic = (await cookies()).get('basic')?.value;
  if (!basic) throw new Error('Não autenticado.');

  const payload = {
    nome: String(formData.get('nome') || '').trim(),
    local: String(formData.get('local') || '').trim(),
  };

  if (!payload.nome) throw new Error("Campo 'nome' é obrigatório.");
  if (!payload.local) throw new Error("Campo 'local' é obrigatório.");

  const res = await fetch('http://localhost:8000/api/condominios/', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Falha ao criar condomínio: ${res.status} ${txt}`);
  }

  revalidatePath('/gasometros');
}
