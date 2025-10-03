'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import login, { type LoginState } from '@/action/login';
import styles from './login-form.module.css';

const initialState: LoginState = { ok: true, message: '' };

export default function LoginForm() {
  const [state, formAction] = useActionState(login, initialState);
  const { pending } = useFormStatus();

  return (
    <div className={styles.wrapper}>
      <form action={formAction} className={styles.form}>
        <input
          type="text"
          name="username"
          placeholder="usuário"
          className={styles.input}
          autoComplete="username"
          required
          disabled={pending}
        />
        <input
          type="password"
          name="password"
          placeholder="senha"
          className={styles.input}
          autoComplete="current-password"
          required
          disabled={pending}
        />
        <button className={styles.button} type="submit" disabled={pending}>
          {pending ? 'Entrando...' : 'Entrar'}
        </button>

        <div aria-live="polite" style={{ minHeight: 36, marginTop: 8 }}>
          {!state.ok && state.message && (
            <div className={styles.error}>{state.message}</div>
          )}
        </div>
      </form>
    </div>
  );
}
