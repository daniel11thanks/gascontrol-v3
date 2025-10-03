'use client';

import { useState } from 'react';
import type { Torre } from '@/query/data-torres';
import styles from './pagination-condominios.module.css';

export default function PaginationTorres({
  items,
  pageSize,
  onDeleteAction,
}: {
  items: Torre[];
  pageSize: number;
  onDeleteAction: (id: string) => Promise<void>;
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentItems = items.slice(startIndex, startIndex + pageSize);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleDelete = async (id: string, numero: string) => {
    if (window.confirm(`Deseja realmente deletar a torre "${numero}"?`)) {
      await onDeleteAction(id);
    }
  };

  if (items.length === 0) {
    return <p>Não há torres cadastradas.</p>;
  }

  return (
    <div className={styles.paginationWrapper}>
      <div className={styles.itemsGrid}>
        {currentItems.map((t) => (
          <div key={t.id} className={styles.itemCard}>
            <div className={styles.itemHeader}>
              <h3 className={styles.itemTitle}>{t.numero}</h3>
              <button
                type="button"
                onClick={() => handleDelete(t.id, t.numero)}
                className={styles.deleteButton}
              >
                Delete
              </button>
            </div>
            <div className={styles.itemDetails}>
              <p>
                <strong>Identificação:</strong> {t.identificacao}
              </p>
              <p>
                <strong>Condomínio:</strong> {t.condominio}
              </p>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className={styles.paginationControls}>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={styles.pageButton}
          >
            Anterior
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`${styles.pageButton} ${
                currentPage === page ? styles.activePage : ''
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={styles.pageButton}
          >
            Próxima
          </button>
        </div>
      )}
      <div className={styles.pageInfo}>
        Página {currentPage} de {totalPages} (Total: {items.length} torres)
      </div>
    </div>
  );
}
