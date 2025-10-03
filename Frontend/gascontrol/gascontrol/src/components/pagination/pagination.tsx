'use client';

import { useMemo, useState } from 'react';
import styles from './pagination.module.css';
import DeleteButton from '@/components/form/delete-button';

type Relatorio = {
  id: number;
  tipo: string;
  referencia_id: number;
  data_inicio: string;
  data_fim: string;
  total_consumo: string;
  data_geracao: string;
};

export default function Pagination({
  items,
  pageSize = 5,
  onDeleteAction,
}: {
  items: Relatorio[];
  pageSize?: number;
  onDeleteAction: (formData: FormData) => Promise<void>;
}) {
  const [page, setPage] = useState(1);

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  const placeholders = Math.max(0, pageSize - pageItems.length);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  const goto = (p: number) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  if (total === 0) return null;

  return (
    <div className={styles.wrapper}>
      <ul className={styles.list}>
        {pageItems.map((r) => (
          <li key={r.id} className={styles.item}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 8,
              }}
            >
              <div>
                <div>ID: {r.id}</div>
                <div>Tipo: {r.tipo}</div>
                <div>Referência: {r.referencia_id}</div>
                <div>
                  Período: {r.data_inicio} → {r.data_fim}
                </div>
                <div>Total consumo: {r.total_consumo}</div>
                <div>
                  Gerado em: {new Date(r.data_geracao).toLocaleString()}
                </div>
              </div>

              <form action={onDeleteAction} style={{ alignSelf: 'flex-start' }}>
                <input type="hidden" name="id" value={r.id} />
                <DeleteButton className={styles.deleteBtn}>
                  Excluir
                </DeleteButton>
              </form>
            </div>
          </li>
        ))}
        {Array.from({ length: placeholders }).map((_, i) => (
          <li
            key={`ph-${i}`}
            className={`${styles.item} ${styles.placeholder}`}
            aria-hidden="true"
          />
        ))}
      </ul>

      <nav className={styles.pagination} aria-label="Paginação">
        <button
          className={`${styles.navBtn} ${!canPrev ? styles.disabled : ''}`}
          onClick={() => goto(page - 1)}
          disabled={!canPrev}
        >
          ←
        </button>

        <ul className={styles.pages}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <li key={p}>
              <button
                className={`${styles.pageBtn} ${
                  p === page ? styles.active : ''
                }`}
                onClick={() => goto(p)}
                aria-current={p === page ? 'page' : undefined}
              >
                {p}
              </button>
            </li>
          ))}
        </ul>

        <button
          className={`${styles.navBtn} ${!canNext ? styles.disabled : ''}`}
          onClick={() => goto(page + 1)}
          disabled={!canNext}
        >
          →
        </button>
      </nav>
    </div>
  );
}
