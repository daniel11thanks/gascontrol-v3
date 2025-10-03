// src/action/pessoa-post.ts
'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function pessoaPost(formData: FormData) {
  const basic = (await cookies()).get('basic')?.value;
  if (!basic) throw new Error('Não autenticado.');

  const payload = {
    nome: String(formData.get('pessoa_nome') || '').trim(),
    tipo: String(formData.get('pessoa_tipo') || '').trim(),
    apartamento: String(formData.get('apartamento') || '').trim(),
  };

  if (!payload.nome) throw new Error("Campo 'nome' é obrigatório.");
  if (!payload.tipo) throw new Error("Campo 'tipo' é obrigatório.");
  if (!payload.apartamento)
    throw new Error('Selecione ou crie um apartamento.');

  const res = await fetch('http://localhost:8000/api/pessoas/', {
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
    throw new Error(`Falha ao criar pessoa: ${res.status} ${txt}`);
  }

  revalidatePath('/cadastros');
}
