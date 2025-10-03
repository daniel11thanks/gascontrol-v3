import Image from 'next/image';
import styles from './footer.module.css';

export default async function Footer() {
  return (
    <footer className={styles.footer}>
      <Image src={'/assets/gas.svg'} alt="Gas" width={28} height={22} />
      <p>Gascontrol. Todos direitos reservados</p>
    </footer>
  );
}
