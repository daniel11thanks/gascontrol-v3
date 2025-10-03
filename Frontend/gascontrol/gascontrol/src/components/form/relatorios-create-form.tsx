import styles from '@/app/relatorios/relatorios.module.css';
import SubmitSuccessButton from '@/components/form/submit-success-button';

export default function RelatoriosCreateForm({
  action,
}: {
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form action={action} className={styles.form} data-testid="relatorio-form">
      <div className={styles.formRow}>
        <label className={styles.field}>
          Tipo
          <select
            name="tipo"
            defaultValue="TORRE"
            className={styles.select}
            data-testid="tipo-select"
          >
            <option value="TORRE">Torre</option>
            <option value="APARTAMENTO">Apartamento</option>
          </select>
        </label>

        <label className={styles.field}>
          Referência ID
          <input
            name="referencia_id"
            type="number"
            min={0}
            className={styles.input}
            placeholder="ex.: 123"
            required
            data-testid="referencia-input"
          />
        </label>

        <label className={styles.field}>
          Data início
          <input
            name="data_inicio"
            type="date"
            className={styles.input}
            required
            data-testid="inicio-input"
          />
        </label>

        <label className={styles.field}>
          Data fim
          <input
            name="data_fim"
            type="date"
            className={styles.input}
            required
            data-testid="fim-input"
          />
        </label>

        <label className={styles.field}>
          Total consumo
          <input
            name="total_consumo"
            type="number"
            step="0.01"
            min={0}
            className={styles.input}
            placeholder="ex.: 300.00"
            required
            data-testid="consumo-input"
          />
        </label>
      </div>

      <div className={styles.formActions}>
        <SubmitSuccessButton className={styles.buttonPrimary} />
      </div>
    </form>
  );
}
