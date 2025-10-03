'use client';

type RowGeneric = Record<string, unknown>;

function toCsv<T extends RowGeneric>(rows: T[], headers?: (keyof T)[]): string {
  if (!rows.length) return '';
  const cols =
    headers && headers.length ? headers : (Object.keys(rows[0]) as (keyof T)[]);

  const esc = (val: unknown) => {
    if (val === null || val === undefined) return '';
    const str = String(val);
    const needsQuotes = /"|,|\n|\r/.test(str);
    const safe = str.replace(/"/g, '""');
    return needsQuotes ? `"${safe}"` : safe;
  };

  const head = cols.map((c) => esc(String(c))).join(',');

  const body = rows.map((r) => cols.map((c) => esc(r[c])).join(',')).join('\n');

  return [head, body].filter(Boolean).join('\n');
}

export default function ExportCsv<T extends RowGeneric>({
  rows,
  filename = 'relatorios.csv',
  headers,
  label = 'Exportar CSV',
  className,
}: {
  rows: T[];
  filename?: string;
  headers?: (keyof T)[];
  label?: string;
  className?: string;
}) {
  const onClick = () => {
    if (!rows?.length) return;
    const csv = toCsv(rows, headers);
    const BOM = '\uFEFF'; // garante UTF-8 no Excel
    const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <button type="button" onClick={onClick} className={className}>
      {label}
    </button>
  );
}
