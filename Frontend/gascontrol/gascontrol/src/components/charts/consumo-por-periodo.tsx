'use client';

import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
} from 'recharts';
import styles from './consumo-por-periodo.module.css';

type Relatorio = {
  tipo: string;
  data_inicio: string;
  data_fim: string;
  total_consumo: string;
};

export default function ConsumoPorPeriodo({
  data,
  cor = '#60d39f',
}: {
  data: Relatorio[];
  cor?: string;
}) {
  const rows = data.map((d) => ({
    periodo: `${d.data_inicio}→${d.data_fim}`,
    consumo: Number.parseFloat(d.total_consumo),
    tipo: d.tipo,
  }));

  return (
    <div className={styles.wrapper}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={rows}
          margin={{ top: 8, right: 12, bottom: 8, left: 16 }}
          barCategoryGap="20%"
          barGap={8}
        >
          <CartesianGrid strokeDasharray="4 2" />
          <XAxis dataKey="periodo" />
          <YAxis width={48} tickMargin={4} allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="consumo" name="Consumo" fill={cor} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
