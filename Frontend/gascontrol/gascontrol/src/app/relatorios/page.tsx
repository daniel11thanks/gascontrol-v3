import styles from './relatorios.module.css';
import { getRelatorios, type Relatorio } from '@/action/data';
import { relatorioPost } from '@/action/relatorio-post';
import { relatorioDelete } from '@/action/relatorio-delete';
import RelatoriosFilters from '@/components/relatorios-filter/relatorios-filter';
import ConsumoPorPeriodo from '@/components/charts/consumo-por-periodo';
import RelatoriosCreateForm from '@/components/form/relatorios-create-form';
import Pagination from '@/components/pagination/pagination';
import ExportCsv from '@/components/CSV/export-csv';

export default async function RelatoriosPage({
  searchParams,
}: {
  searchParams: Promise<{
    tipo?: string;
    data_inicio?: string;
    data_fim?: string;
  }>;
}) {
  const params = await searchParams; // <- await aqui

  const all = await getRelatorios(params);

  const headers: (keyof Relatorio)[] = [
    'id',
    'tipo',
    'referencia_id',
    'data_inicio',
    'data_fim',
    'total_consumo',
    'data_geracao',
  ];

  return (
    <section className={`${styles.wrapper} container mainContainer`}>
      <h1 className="title">Relatórios</h1>

      <h2 className={styles.sectionTitle}>Adicionar novo relatório</h2>
      <RelatoriosCreateForm action={relatorioPost} />

      <h2 className={styles.sectionTitle}>Relatórios disponíveis</h2>
      <div className={styles.filtersBar}>
        <RelatoriosFilters
          defaultTipo={params.tipo ?? 'TODOS'}
          defaultInicio={params.data_inicio ?? ''}
          defaultFim={params.data_fim ?? ''}
        />
      </div>

      {all.length > 0 && (
        <div className={styles.chartWrapper}>
          <div className={styles.chartInner}>
            <ConsumoPorPeriodo data={all} />
          </div>
        </div>
      )}

      <div className={styles.actionsBar}>
        <ExportCsv<Relatorio>
          rows={all}
          headers={headers}
          filename="relatorios.csv"
          label="Exportar CSV"
          className={styles.buttonPrimary}
        />
      </div>

      {all.length === 0 && <p>Não há relatórios.</p>}

      <Pagination items={all} pageSize={5} onDeleteAction={relatorioDelete} />
    </section>
  );
}
