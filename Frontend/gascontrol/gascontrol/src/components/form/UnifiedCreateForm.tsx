// src/components/form/UnifiedCreateForm.tsx
'use client';

import { useState, FormEvent, useMemo, useEffect } from 'react';
import ConnectedSelect from './ConnectedSelect';
import SubmitSuccessButton from '@/components/form/submit-success-button';
import type { Condominio } from '@/query/data-condominios';
import type { Torre } from '@/query/data-torres';
import type { Apartamento } from '@/query/data-apartamentos';
import type { Gasometro } from '@/query/data-gasometros';
import styles from '@/app/leituras/leituras.module.css';

export default function UnifiedCreateForm({
  condominios,
  torres,
  apartamentos,
  gasometros,
  onSubmit,
}: {
  condominios: Condominio[];
  torres: Torre[];
  apartamentos: Apartamento[];
  gasometros: Gasometro[];
  onSubmit: (fd: FormData) => Promise<void>;
}) {
  const [state, setState] = useState<Record<string, string>>({});
  const [creatingCondominio, setCreatingCondominio] = useState(false);
  const [creatingTorre, setCreatingTorre] = useState(false);
  const [creatingApartamento, setCreatingApartamento] = useState(false);
  const [creatingGasometro, setCreatingGasometro] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);

  function setField(name: string, value: string) {
    setState((s) => ({ ...s, [name]: value }));
  }

  // Limpa dependentes ao mudar seleção
  useEffect(
    () =>
      setState((s) => ({ ...s, torre: '', apartamento: '', gasometro: '' })),
    [state.condominio],
  );
  useEffect(
    () => setState((s) => ({ ...s, apartamento: '', gasometro: '' })),
    [state.torre],
  );
  useEffect(
    () => setState((s) => ({ ...s, gasometro: '' })),
    [state.apartamento],
  );

  const filteredTorres = useMemo(
    () => torres.filter((t) => String(t.condominio) === state.condominio),
    [state.condominio, torres],
  );
  const filteredApartamentos = useMemo(
    () => apartamentos.filter((a) => String(a.torre) === state.torre),
    [state.torre, apartamentos],
  );
  const filteredGasometros = useMemo(
    () => gasometros.filter((g) => String(g.apartamento) === state.apartamento),
    [state.apartamento, gasometros],
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.set('creating_torre', String(creatingTorre));
    fd.set('creating_apartamento', String(creatingApartamento));
    fd.set('creating_gasometro', String(creatingGasometro));
    Object.entries(state).forEach(([k, v]) => fd.set(k, v));
    console.group('🔍 FormData to cadastrosMultiPost');
    for (const [key, value] of fd.entries()) {
      console.log(key, '=', value);
    }
    console.groupEnd();
    await onSubmit(fd);
    setState({});
    setCreatingCondominio(false);
    setCreatingTorre(false);
    setCreatingApartamento(false);
    setCreatingGasometro(false);
    setResetTrigger((t) => t + 1);
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* Condomínio */}
      <label className={styles.field}>
        Condomínio
        <ConnectedSelect
          name="condominio"
          options={condominios.map((c) => ({ id: c.id, label: c.nome || '' }))}
          placeholder="Selecione condomínio"
          newPlaceholder="Nome do condomínio"
          value={state.condominio || ''}
          onChange={(v) => setField('condominio', v)}
          onCreateModeChange={setCreatingCondominio}
          resetTrigger={resetTrigger}
        />
      </label>
      {creatingCondominio && (
        <label className={styles.field}>
          Local do condomínio
          <input
            name="condominio_local"
            className={styles.input}
            value={state.condominio_local || ''}
            onChange={(e) => setField('condominio_local', e.target.value)}
            placeholder="Ex.: Rua Principal, 123"
            required
          />
        </label>
      )}

      {/* Torre */}
      {creatingTorre ? (
        <>
          <label className={styles.field}>
            Número da torre
            <input
              name="torre_numero"
              className={styles.input}
              value={state.torre_numero || ''}
              onChange={(e) => setField('torre_numero', e.target.value)}
              placeholder="Ex.: 2a"
              required
            />
          </label>
          <label className={styles.field}>
            Identificação da torre
            <input
              name="torre_identificacao"
              className={styles.input}
              value={state.torre_identificacao || ''}
              onChange={(e) => setField('torre_identificacao', e.target.value)}
              placeholder="Ex.: Torre A"
              required
            />
          </label>
        </>
      ) : (
        <label className={styles.field}>
          Torre
          <ConnectedSelect
            name="torre"
            options={filteredTorres.map((t) => ({
              id: t.id,
              label: t.identificacao || '',
            }))}
            placeholder="Selecione torre"
            newPlaceholder="Número da torre"
            value={state.torre || ''}
            onChange={(v) => setField('torre', v)}
            onCreateModeChange={state.condominio ? setCreatingTorre : () => {}}
            resetTrigger={resetTrigger}
          />
        </label>
      )}

      {/* Apartamento */}
      <label className={styles.field}>
        Apartamento
        {creatingApartamento ? (
          <input
            name="apartamento_numero"
            className={styles.input}
            value={state.apartamento_numero || ''}
            onChange={(e) => setField('apartamento_numero', e.target.value)}
            placeholder="Número do apartamento"
            required
          />
        ) : (
          <ConnectedSelect
            name="apartamento"
            options={filteredApartamentos.map((a) => ({
              id: String(a.id),
              label: a.numero || '',
            }))}
            placeholder="Selecione apartamento"
            newPlaceholder="Criar novo apartamento"
            value={state.apartamento || ''}
            onChange={(v) => setField('apartamento', v)}
            onCreateModeChange={
              (creatingTorre &&
                state.torre_numero &&
                state.torre_identificacao) ||
              state.torre
                ? setCreatingApartamento
                : () => {}
            }
            resetTrigger={resetTrigger}
          />
        )}
      </label>
      {/* Gasômetro */}
      {creatingGasometro ? (
        <label className={styles.field}>
          Código do gasômetro
          <input
            name="gasometro_codigo"
            className={styles.input}
            value={state.gasometro_codigo || ''}
            onChange={(e) => setField('gasometro_codigo', e.target.value)}
            placeholder="Ex.: G-123"
            required
          />
        </label>
      ) : (
        <label className={styles.field}>
          Gasômetro
          <ConnectedSelect
            name="gasometro"
            options={filteredGasometros.map((g) => ({
              id: String(g.id),
              label: g.codigo || '',
            }))}
            placeholder="Selecione gasômetro"
            newPlaceholder="Número do gasômetro"
            value={state.gasometro || ''}
            onChange={(v) => setField('gasometro', v)}
            onCreateModeChange={
              (creatingApartamento && state.apartamento_numero) ||
              state.apartamento
                ? setCreatingGasometro
                : () => {}
            }
            resetTrigger={resetTrigger}
          />
        </label>
      )}

      {/* Pessoa */}
      <label className={styles.field}>
        Nome da pessoa
        <input
          name="pessoa_nome"
          className={styles.input}
          value={state.pessoa_nome || ''}
          onChange={(e) => setField('pessoa_nome', e.target.value)}
          placeholder="João"
          required
        />
      </label>

      <label className={styles.field}>
        Tipo de pessoa
        <select
          name="pessoa_tipo"
          className={styles.input}
          value={state.pessoa_tipo || ''}
          onChange={(e) => setField('pessoa_tipo', e.target.value)}
          required
        >
          <option value="" disabled>
            Selecione tipo
          </option>
          <option value="DONO">Dono</option>
          <option value="INQUILINO">Inquilino</option>
          <option value="MORADOR">Morador</option>
        </select>
      </label>

      {/* Leitura */}
      <label className={styles.field}>
        Data da leitura
        <input
          name="data_leitura"
          type="date"
          className={styles.input}
          value={state.data_leitura || ''}
          onChange={(e) => setField('data_leitura', e.target.value)}
          required
        />
      </label>

      <label className={styles.field}>
        Consumo (m³)
        <input
          name="consumo_m3"
          type="number"
          className={styles.input}
          min={0}
          value={state.consumo_m3 || ''}
          onChange={(e) => setField('consumo_m3', e.target.value)}
          required
        />
      </label>

      <label className={styles.field}>
        Periodicidade
        <select
          name="periodicidade"
          className={styles.input}
          value={state.periodicidade || ''}
          onChange={(e) => setField('periodicidade', e.target.value)}
          required
        >
          <option value="" disabled>
            Selecione periodicidade
          </option>
          <option value="SEMANAL">Semanal</option>
          <option value="MENSAL">Mensal</option>
          <option value="BIMESTRAL">Bimestral</option>
          <option value="SEMESTRAL">Semestral</option>
        </select>
      </label>

      <div className={styles.formActions}>
        <SubmitSuccessButton className={styles.buttonPrimary}>
          Enviar todos cadastros
        </SubmitSuccessButton>
      </div>
    </form>
  );
}
