import SubmitSuccessButton from '@/components/form/submit-success-button';
import styles from '@/app/leituras/leituras.module.css';
import type { Apartamento } from '@/query/data-apartamentos';

export default function GasometroCreateForm({
  action,
  apartamentos,
  apartamentosUsados,
}: {
  action: (formData: FormData) => Promise<void>;
  apartamentos: Apartamento[];
  apartamentosUsados: Set<number>;
}) {
  async function actionGuard(formData: FormData) {
    'use server';
    return action(formData);
  }

  return (
    <form action={actionGuard} className={styles.form}>
      <div className={styles.formRow}>
        <label className={styles.field}>
          Código
          <input
            name="codigo"
            type="text"
            className={styles.input}
            placeholder="ex.: G-APT-12A"
            required
          />
        </label>

        <label className={styles.field}>
          Apartamento
          <select
            name="apartamento"
            className={styles.input}
            required
            defaultValue=""
          >
            <option value="" disabled>
              Selecione
            </option>
            {apartamentos.map((a) => {
              const id = Number(a.id);
              const ocupado = apartamentosUsados.has(id);
              return (
                <option key={id} value={id} disabled={ocupado}>
                  {(a.numero || a.nome || `Apartamento ${id}`) +
                    (ocupado ? ' — já possui gasômetro' : '')}
                </option>
              );
            })}
          </select>
        </label>
      </div>

      <div className={styles.formActions}>
        <SubmitSuccessButton className={styles.buttonPrimary}>
          Criar gasômetro
        </SubmitSuccessButton>
      </div>
    </form>
  );
}
