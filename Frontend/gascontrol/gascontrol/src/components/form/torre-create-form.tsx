// src/components/form/torre-create-form.tsx
import SubmitSuccessButton from '@/components/form/submit-success-button';
import type { Condominio } from '@/query/data-condominios';
import styles from '@/app/cadastros/cadastros.module.css';

export default function TorreCreateForm({
  action,
  condominios,
}: {
  action: (formData: FormData) => Promise<void>;
  condominios: Condominio[];
}) {
  async function actionGuard(formData: FormData) {
    'use server';
    return action(formData);
  }

  const placeholderText =
    condominios.length === 0 ? 'Cadastre um condomínio' : 'Selecione';

  return (
    <form
      action={actionGuard}
      className={styles.form}
      suppressHydrationWarning={true}
    >
      <div className={styles.formRow}>
        <label className={styles.field}>
          Número
          <input
            name="numero"
            type="text"
            className={styles.input}
            placeholder="ex.: Torre A"
            required
          />
        </label>

        <label className={styles.field}>
          Identificação
          <input
            name="identificacao"
            type="text"
            className={styles.input}
            placeholder="ex.: Principal"
            required
          />
        </label>
      </div>

      <div className={styles.formRow}>
        <label className={styles.field}>
          Condomínio
          <select
            name="condominio"
            className={styles.input}
            defaultValue=""
            required
            disabled={condominios.length === 0}
          >
            <option value="" disabled>
              {placeholderText}
            </option>
            {condominios.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.formActions}>
        <SubmitSuccessButton className={styles.buttonPrimary}>
          Criar torre
        </SubmitSuccessButton>
      </div>
    </form>
  );
}
