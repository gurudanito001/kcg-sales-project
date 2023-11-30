import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import formatMonth from '@/services/formatMonth';

const data1 = [
  { label: 'Current Achievement', value: 8 },
  { label: 'Pending Achievement', value: 12 }
];

const data2 = [
  { label: `Total Target for ${formatMonth(new Date().getMonth())} ${new Date().getFullYear()}`, value: 20 },
];

export default function AppPieChart() {
  return (
    <PieChart
      series={[
        {
          innerRadius: 0,
          outerRadius: 80,
          data: data1,
        },
        {
          innerRadius: 100,
          outerRadius: 120,
          data: data2,
        },
      ]}
      width={350}
      height={120}
      slotProps={{
        legend: { hidden: true },
      }}
    />
  );
}