import { describe, it, expect } from 'vitest';
import { validateRelatorio } from '@/utils/validate-relatorio';

describe('validateRelatorio', () => {
  it('exige tipo e datas', () => {
    const errs = validateRelatorio({});
    expect(errs).toContain('Tipo é obrigatório.');
    expect(errs).toContain('Data início é obrigatória.');
    expect(errs).toContain('Data fim é obrigatória.');
  });

  it('não permite início > fim', () => {
    const errs = validateRelatorio({
      tipo: 'MENSAL',
      data_inicio: '2025-09-10',
      data_fim: '2025-09-01',
    });
    expect(errs).toContain('Data início não pode ser maior que data fim.');
  });
});
