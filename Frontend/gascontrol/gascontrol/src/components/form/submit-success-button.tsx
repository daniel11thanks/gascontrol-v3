'use client';
import { useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';

export default function SubmitSuccessButton({
  className,
  children = 'Criar relatório',
  message = 'Relatório incluso com sucesso',
}: {
  className?: string;
  children?: React.ReactNode;
  message?: string;
}) {
  const { pending } = useFormStatus();
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending) {
      setTimeout(() => alert(message), 0);
    }
    wasPending.current = pending;
  }, [pending, message]);

  return (
    <button type="submit" className={className} disabled={pending}>
      {pending ? 'Enviando...' : children}
    </button>
  );
}
