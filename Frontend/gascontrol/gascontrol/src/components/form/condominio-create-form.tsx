import SubmitSuccessButton from '@/components/form/submit-success-button';
import styles from '@/app/cadastros/cadastros.module.css';

export default function CondominioCreateForm({
  action,
}: {
  action: (formData: FormData) => Promise<void>;
}) {
  async function actionGuard(formData: FormData) {
    'use server';
    return action(formData);
  }

  return (
    <form
      action={actionGuard}
      className={styles.form}
      suppressHydrationWarning={true}
    >
      <div className={styles.formRow}>
        <label className={styles.field}>
          Nome
          <input
            name="nome"
            type="text"
            className={styles.input}
            placeholder="ex.: Residencial Bela Vista"
            required
          />
        </label>

        <label className={styles.field}>
          Local
          <input
            name="local"
            type="text"
            className={styles.input}
            placeholder="ex.: Bairro Centro"
            required
          />
        </label>
      </div>

      <div className={styles.formActions}>
        <SubmitSuccessButton className={styles.buttonPrimary}>
          Criar condomínio
        </SubmitSuccessButton>
      </div>
    </form>
  );
}
