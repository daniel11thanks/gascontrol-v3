import { describe, it, expect } from 'vitest';
import { formatPeriodo, toDecimal } from '@/utils/format';

describe('formatPeriodo', () => {
  it('formata intervalo dd/mm/yyyy - dd/mm/yyyy', () => {
    expect(formatPeriodo('2025-08-10', '2025-09-10')).toBe(
      '10/08/2025 - 10/09/2025',
    );
  });
});

describe('toDecimal', () => {
  it('converte string com vírgula para número', () => {
    expect(toDecimal('12,50')).toBe(12.5);
  });
  it('retorna 0 para inválidos', () => {
    expect(toDecimal('abc')).toBe(0);
  });
});
