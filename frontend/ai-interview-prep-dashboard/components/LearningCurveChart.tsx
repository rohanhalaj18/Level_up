
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LEARNING_CURVE_DATA } from '../constants';

const LearningCurveChart: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 flex-1">
      <h4 className="text-lg font-bold text-slate-800 mb-6">Learning Curve</h4>
      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={LEARNING_CURVE_DATA}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 12 }} 
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} 
            />
            <Line 
              type="monotone" 
              dataKey="coding" 
              stroke="#22c55e" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#fff', stroke: '#22c55e', strokeWidth: 2 }}
              activeDot={{ r: 6 }} 
            />
            <Line 
              type="monotone" 
              dataKey="aptitude" 
              stroke="#3b82f6" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#fff', stroke: '#3b82f6', strokeWidth: 2 }}
              activeDot={{ r: 6 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LearningCurveChart;
