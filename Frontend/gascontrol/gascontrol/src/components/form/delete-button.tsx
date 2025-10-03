'use client';
import { useFormStatus } from 'react-dom';

export default function DeleteButton({
  className,
  confirmText = 'Tem certeza que deseja excluir este relatório?',
  children = 'Excluir',
}: {
  className?: string;
  confirmText?: string;
  children?: React.ReactNode;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={className}
      disabled={pending}
      onClick={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
    >
      {pending ? 'Excluindo...' : children}
    </button>
  );
}
