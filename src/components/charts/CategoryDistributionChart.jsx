import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const CATEGORY_DATA = [
  { name: 'Electronics', value: 42, color: '#4F46E5' },
  { name: 'Accessories', value: 28, color: '#8B5CF6' },
  { name: 'ID Cards', value: 24, color: '#06B6D4' },
  { name: 'Keys & Cards', value: 18, color: '#F59E0B' },
  { name: 'Bags & Backpacks', value: 15, color: '#EC4899' },
  { name: 'Clothing', value: 12, color: '#10B981' },
];

export default function CategoryDistributionChart() {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
            formatter={(value) => [`${value} Reports`, 'Count']}
            contentStyle={{
              backgroundColor: '#1E293B',
              borderRadius: '12px',
              border: 'none',
              color: '#FFF',
              fontSize: '12px',
            }}
          />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
          />
          <Pie
            data={CATEGORY_DATA}
            cx="50%"
            cy="45%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
          >
            {CATEGORY_DATA.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
