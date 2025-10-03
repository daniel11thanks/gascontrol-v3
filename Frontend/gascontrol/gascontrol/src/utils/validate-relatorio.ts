export function validateRelatorio(input: {
  tipo?: string;
  data_inicio?: string;
  data_fim?: string;
}) {
  const errors: string[] = [];
  if (!input.tipo || input.tipo === 'TODOS') errors.push('Tipo é obrigatório.');
  if (!input.data_inicio) errors.push('Data início é obrigatória.');
  if (!input.data_fim) errors.push('Data fim é obrigatória.');
  if (
    input.data_inicio &&
    input.data_fim &&
    input.data_inicio > input.data_fim
  ) {
    errors.push('Data início não pode ser maior que data fim.');
  }
  return errors;
}
