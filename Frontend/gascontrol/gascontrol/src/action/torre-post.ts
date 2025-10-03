'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function torrePost(formData: FormData) {
  const basic = (await cookies()).get('basic')?.value;
  if (!basic) throw new Error('Não autenticado.');

  const payload = {
    numero: String(formData.get('numero') || '').trim(),
    identificacao: String(formData.get('identificacao') || '').trim(),
    condominio: String(formData.get('condominio') || '').trim(),
  };

  if (!payload.numero) throw new Error("Campo 'numero' é obrigatório.");
  if (!payload.identificacao)
    throw new Error("Campo 'identificacao' é obrigatório.");
  if (!payload.condominio) throw new Error('Selecione um condomínio.');

  const res = await fetch('http://localhost:8000/api/torres/', {
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
    throw new Error(`Falha ao criar torre: ${res.status} ${txt}`);
  }

  revalidatePath('/cadastros');
}
