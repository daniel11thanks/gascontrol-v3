'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function gasometroPost(formData: FormData) {
  const basic = (await cookies()).get('basic')?.value;
  if (!basic) throw new Error('Não autenticado.');

  const payload = {
    codigo: String(formData.get('codigo') || '').trim(),
    apartamento: Number(formData.get('apartamento') || 0),
  };

  if (!payload.codigo) throw new Error("Campo 'codigo' é obrigatório.");
  if (Number.isNaN(payload.apartamento))
    throw new Error("Campo 'apartamento' inválido.");

  const res = await fetch('http://localhost:8000/api/gasometros/', {
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
    throw new Error(`Falha ao criar gasômetro: ${res.status} ${txt}`);
  }

  revalidatePath('/gasometros');
}
