import Link from 'next/link';
import Image from 'next/image';
import styles from './header.module.css';
import { cookies } from 'next/headers';

export default async function Header() {
  const basic = (await cookies()).get('basic')?.value;
  let username: string | null = null;

  if (basic) {
    try {
      const decoded = Buffer.from(basic, 'base64').toString('utf-8');
      username = decoded.split(':')[0] || null;
    } catch {
      username = null;
    }
  }

  const isLogged = Boolean(username);

  return (
    <header className={styles.header}>
      <nav className={`${styles.nav} container`}>
        <Link className={styles.logo} href={'/'}>
          <Image
            src={'/assets/gas.svg'}
            alt="Gas-station"
            width={28}
            height={22}
            priority
          />
        </Link>

        {isLogged && (
          <ul className={styles.centerNav} aria-label="Navegação principal">
            <li>
              <Link href="/relatorios" className={styles.centerLink}>
                Relatórios
              </Link>
            </li>
            <li>
              <Link href="/leituras" className={styles.centerLink}>
                Leituras
              </Link>
            </li>
          </ul>
        )}

        {isLogged ? (
          <Link className={styles.login} href={'/usuario'}>
            {username}
          </Link>
        ) : (
          <Link className={styles.login} href={'/login'}>
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}
