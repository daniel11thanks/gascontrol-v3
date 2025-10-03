'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export type LoginState = { ok: boolean; message?: string };

export default async function login(
  _: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = String(formData.get('username') || '').trim();
  const password = String(formData.get('password') || '').trim();

  if (!username || !password) {
    return { ok: false, message: 'Usuário e senha são obrigatórios.' };
  }

  const basic = Buffer.from(`${username}:${password}`).toString('base64');

  const probe = await fetch('http://localhost:8000/api/condominios/', {
    headers: { Authorization: `Basic ${basic}` },
    cache: 'no-store',
  });

  if (!probe.ok) {
    return { ok: false, message: 'Usuário ou senha inválidos.' };
  }

  (await cookies()).set({
    name: 'basic',
    value: basic,
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
  });

  redirect('/relatorios');
}
