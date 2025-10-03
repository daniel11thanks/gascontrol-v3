'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function relatorioPost(formData: FormData) {
  const basic = (await cookies()).get('basic')?.value;
  if (!basic) throw new Error('Não autenticado.');

  const payload = {
    tipo: String(formData.get('tipo') || '').toUpperCase(),
    referencia_id: Number(formData.get('referencia_id') || 0),
    data_inicio: String(formData.get('data_inicio') || ''),
    data_fim: String(formData.get('data_fim') || ''),
    total_consumo: String(formData.get('total_consumo') || '0'),
  };

  if (!payload.tipo || !payload.data_inicio || !payload.data_fim) {
    throw new Error('Campos obrigatórios ausentes.');
  }

  const res = await fetch('http://localhost:8000/api/relatorios/', {
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
    throw new Error(`Falha ao criar relatório: ${res.status} ${txt}`);
  }

  revalidatePath('/relatorios');
}
