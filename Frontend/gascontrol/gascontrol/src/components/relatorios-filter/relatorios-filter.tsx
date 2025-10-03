'use client';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import styles from './relatorios-filter.module.css';

export default function RelatoriosFilters({
  defaultTipo,
  defaultInicio,
  defaultFim,
}: {
  defaultTipo: string;
  defaultInicio: string;
  defaultFim: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(name, value);
      else params.delete(name);
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  return (
    <div className={styles.filters}>
      <label className={styles.field}>
        Tipo
        <select
          className={styles.select}
          defaultValue={defaultTipo || 'TODOS'}
          onChange={(e) => setParam('tipo', e.target.value.toUpperCase())}
        >
          <option value="TODOS">Todos</option>
          <option value="TORRE">Torre</option>
          <option value="APARTAMENTO">Apartamento</option>
        </select>
      </label>

      <label className={styles.field}>
        Data início
        <input
          className={styles.input}
          type="date"
          defaultValue={defaultInicio}
          onChange={(e) => setParam('data_inicio', e.target.value)}
        />
      </label>

      <label className={styles.field}>
        Data fim
        <input
          className={styles.input}
          type="date"
          defaultValue={defaultFim}
          onChange={(e) => setParam('data_fim', e.target.value)}
        />
      </label>
    </div>
  );
}
