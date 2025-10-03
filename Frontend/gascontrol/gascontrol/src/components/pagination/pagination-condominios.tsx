'use client';

import { useState } from 'react';
import type { Condominio } from '@/query/data-condominios';
import styles from './pagination-condominios.module.css';

export default function PaginationCondominios({
  items,
  pageSize,
  onDeleteAction,
}: {
  items: Condominio[];
  pageSize: number;
  onDeleteAction: (id: string) => Promise<void>;
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentItems = items.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDelete = async (id: string, nome: string) => {
    if (window.confirm(`Deseja realmente deletar o condomínio "${nome}"?`)) {
      try {
        await onDeleteAction(id);
      } catch (error) {
        alert(
          'Erro ao deletar condomínio: ' +
            (error instanceof Error ? error.message : 'Erro desconhecido'),
        );
      }
    }
  };

  if (items.length === 0) {
    return <p>Não há condomínios cadastrados.</p>;
  }

  return (
    <div className={styles.paginationWrapper}>
      <div className={styles.itemsGrid}>
        {currentItems.map((condominio) => (
          <div key={condominio.id} className={styles.itemCard}>
            <div className={styles.itemHeader}>
              <h3 className={styles.itemTitle}>{condominio.nome}</h3>
              <button
                type="button"
                onClick={() => handleDelete(condominio.id, condominio.nome)}
                className={styles.deleteButton}
                title="Deletar condomínio"
              >
                Delete
              </button>
            </div>
            <div className={styles.itemDetails}>
              <p>
                <strong>Local:</strong> {condominio.local}
              </p>
              <p>
                <strong>ID:</strong> {condominio.id}
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

          <div className={styles.pageNumbers}>
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
          </div>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={styles.pageButton}
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}
