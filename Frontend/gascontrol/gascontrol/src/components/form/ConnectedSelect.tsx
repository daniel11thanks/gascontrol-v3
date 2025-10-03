// src/components/form/ConnectedSelect.tsx
'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import styles from '@/app/leituras/leituras.module.css';

type Option = { id: string; label: string };

export default function ConnectedSelect({
  name,
  options,
  placeholder,
  newPlaceholder,
  value,
  onChange,
  onCreateModeChange,
  resetTrigger,
}: {
  name: string;
  options: Option[];
  placeholder: string;
  newPlaceholder: string;
  value: string;
  onChange: (value: string) => void;
  onCreateModeChange: (creating: boolean) => void;
  resetTrigger: number;
}) {
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    setCreating(false);
    onCreateModeChange(false);
  }, [resetTrigger, onCreateModeChange]);

  function handleSelect(e: ChangeEvent<HTMLSelectElement>) {
    const v = e.target.value;
    if (v === '__new__') {
      setCreating(true);
      onCreateModeChange(true);
      onChange('');
    } else {
      setCreating(false);
      onCreateModeChange(false);
      onChange(v);
    }
  }

  function handleNewInput(e: ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value);
  }

  return creating ? (
    <input
      name={name}
      type="text"
      className={styles.input}
      placeholder={newPlaceholder}
      value={value}
      onChange={handleNewInput}
      required
    />
  ) : (
    <select
      name={name}
      className={styles.input}
      value={value}
      onChange={handleSelect}
      required
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((o) => (
        <option key={o.id} value={o.id}>
          {o.label}
        </option>
      ))}
      <option value="__new__">+ Criar novo</option>
    </select>
  );
}
