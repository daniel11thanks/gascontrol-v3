// src/app/cadastros/page.tsx
import styles from './leituras.module.css';

import { getGasometros } from '@/query/data-gasometros';
import { getApartamentos } from '@/query/data-apartamentos';
import { getCondominios } from '@/query/data-condominios';
import { getTorres } from '@/query/data-torres';
import { getLeituras } from '@/query/data-leituras';

import { cadastrosMultiPost } from '@/action/cadastros-multi-post';
import { gasometroDelete } from '@/action/gasometro-delete';
import { leituraDelete } from '@/action/leitura-delete';

import UnifiedCreateForm from '@/components/form/UnifiedCreateForm';
import PaginationGasometros, {
  GasometroCompleto,
} from '@/components/pagination/pagination-gasometros';
import PaginationLeituras, {
  Leitura,
} from '@/components/pagination/PaginationLeituras';

export default async function CadastrosPage() {
  const [gasometros, apartamentos, condominios, torres, maybeLeituras] =
    await Promise.all([
      getGasometros(),
      getApartamentos(),
      getCondominios(),
      getTorres(),
      getLeituras(),
    ]);

  const leituras: Leitura[] = Array.isArray(maybeLeituras) ? maybeLeituras : [];

  const enrichedGasometros: GasometroCompleto[] = gasometros.map((g) => {
    const apt = apartamentos.find(
      (a) => String(a.id) === String(g.apartamento),
    );
    const torre = torres.find((t) => String(t.id) === String(apt?.torre));
    const cond = condominios.find(
      (c) => String(c.id) === String(torre?.condominio),
    );
    return {
      id: typeof g.id === 'string' ? Number(g.id) : g.id,
      codigo: g.codigo,
      apartamento:
        typeof g.apartamento === 'string'
          ? Number(g.apartamento)
          : g.apartamento,
      apartamento_numero: apt?.numero,
      torre_identificacao: torre?.identificacao,
      condominio_nome: cond?.nome,
    };
  });

  return (
    <section className={`${styles.wrapper} container mainContainer`}>
      <h1 className="title">Gasometros e Leituras </h1>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Cadastrar Leitura</h2>
        <UnifiedCreateForm
          condominios={condominios}
          torres={torres}
          apartamentos={apartamentos}
          gasometros={gasometros}
          onSubmit={cadastrosMultiPost}
        />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Lista de gasômetros</h2>
        {gasometros.length === 0 ? (
          <p>Não há gasômetros cadastrados.</p>
        ) : (
          <PaginationGasometros
            items={enrichedGasometros}
            onDeleteAction={gasometroDelete}
          />
        )}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Lista de Leituras</h2>
        {leituras.length === 0 ? (
          <p>Nenhuma leitura cadastrada.</p>
        ) : (
          <PaginationLeituras items={leituras} onDeleteAction={leituraDelete} />
        )}
      </div>
    </section>
  );
}
