import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface SuccessMeterProps {
  progress: number;
  size?: number;
}

export const SuccessMeter: React.FC<SuccessMeterProps> = ({ progress, size = 200 }) => {
  const data = [
    { name: 'Completed', value: progress },
    { name: 'Remaining', value: 100 - progress },
  ];

  const COLORS = ['#4F46E5', '#E5E7EB']; // Indigo-600 and Gray-200

  return (
    <div style={{ width: '100%', height: '100%', minHeight: size, position: 'relative' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={size / 2 - 15}
            outerRadius={size / 2}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
            cornerRadius={10}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <span className="text-4xl font-bold text-gray-900">{progress}%</span>
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-1">Syllabus<br/>Covered</span>
      </div>
    </div>
  );
};