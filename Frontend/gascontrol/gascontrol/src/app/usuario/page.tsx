import styles from './usuario.module.css';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

async function logout() {
  'use server';
  const jar = await cookies();

  jar.delete('basic');
  redirect('/login');
}

export default function UsuarioPage() {
  return (
    <section className={`${styles.wrapper} container mainContainer`}>
      <h1 className="title">Usuário</h1>

      <form action={logout}>
        <button className={styles.logoutBtn} type="submit">
          Logout
        </button>
      </form>
    </section>
  );
}
