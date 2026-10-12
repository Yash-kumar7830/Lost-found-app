import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const MONTHLY_DATA = [
  { month: 'May', lost: 18, found: 14, returned: 12 },
  { month: 'Jun', lost: 24, found: 21, returned: 18 },
  { month: 'Jul', lost: 15, found: 16, returned: 14 },
  { month: 'Aug', lost: 38, found: 32, returned: 29 }, // Campus reopens!
  { month: 'Sep', lost: 45, found: 41, returned: 36 },
  { month: 'Oct', lost: 31, found: 28, returned: 25 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 p-3 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 text-xs">
        <p className="font-bold text-slate-900 dark:text-white mb-2">{label} Campus Reports</p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4 py-0.5">
            <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}:
            </span>
            <span className="font-bold text-slate-900 dark:text-white">{entry.value} items</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function MonthlyTrendsChart({ type = 'area' }) {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        {type === 'area' ? (
          <AreaChart data={MONTHLY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorLost" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorFound" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorReturned" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
            <XAxis dataKey="month" tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
              formatter={(value) => <span className="text-slate-600 dark:text-slate-300 capitalize">{value}</span>}
            />
            <Area
              type="monotone"
              dataKey="lost"
              name="Lost Reported"
              stroke="#F43F5E"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorLost)"
            />
            <Area
              type="monotone"
              dataKey="found"
              name="Found Turned-In"
              stroke="#4F46E5"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorFound)"
            />
            <Area
              type="monotone"
              dataKey="returned"
              name="Reunited"
              stroke="#10B981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorReturned)"
            />
          </AreaChart>
        ) : (
          <BarChart data={MONTHLY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
            <XAxis dataKey="month" tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
            <Bar dataKey="lost" name="Lost Reported" fill="#F43F5E" radius={[6, 6, 0, 0]} />
            <Bar dataKey="found" name="Found Turned-In" fill="#4F46E5" radius={[6, 6, 0, 0]} />
            <Bar dataKey="returned" name="Reunited" fill="#10B981" radius={[6, 6, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
