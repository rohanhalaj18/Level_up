
import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Line
} from 'recharts';
import { APTITUDE_SUBJECTS, APTITUDE_TREND, INDUSTRY_BENCHMARKS } from '../constants';
import { Brain, TrendingUp, Download, CheckCircle2, Award, Info } from 'lucide-react';

const AptitudeProgress: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState(false);

  // Calculate moving average for smoothing
  const dataWithMovingAverage = APTITUDE_TREND.map((item, index, array) => {
    const windowSize = 3;
    const start = Math.max(0, index - Math.floor(windowSize / 2));
    const end = Math.min(array.length, index + Math.ceil(windowSize / 2));
    const slice = array.slice(start, end);
    const avg = slice.reduce((sum, current) => sum + current.score, 0) / slice.length;
    return {
      ...item,
      movingAverage: parseFloat(avg.toFixed(1))
    };
  });

  const overallAvg = Math.round(
    (APTITUDE_SUBJECTS.reduce((acc, curr) => acc + (curr.score / curr.total), 0) / APTITUDE_SUBJECTS.length) * 100
  );

  const handleExportCSV = () => {
    // Prepare Subject Data
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Category,Subject,Score,Total,Percentage\n";
    APTITUDE_SUBJECTS.forEach(s => {
      const row = `Subject,${s.name},${s.score},${s.total},${((s.score/s.total)*100).toFixed(2)}%`;
      csvContent += row + "\n";
    });

    csvContent += "\nCategory,Date,Score,Moving Average\n";
    dataWithMovingAverage.forEach(t => {
      const row = `Trend,${t.testDate},${t.score},${t.movingAverage}`;
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "aptitude_performance_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show success message
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 relative overflow-hidden">
      {/* Success Notification */}
      {showSuccess && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 animate-in fade-in zoom-in slide-in-from-top-4 duration-300">
          <div className="bg-green-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-bold">
            <CheckCircle2 size={16} />
            Report exported successfully!
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Brain className="text-indigo-500" size={24} />
            Aptitude Test Mastery
          </h3>
          <p className="text-sm text-slate-400">Detailed breakdown of your analytical performance</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 px-4 py-2 rounded-2xl text-sm font-bold transition-colors border border-slate-100"
          >
            <Download size={16} />
            Export Data
          </button>
          <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-2xl flex items-center gap-2">
            <TrendingUp size={16} />
            <span className="text-sm font-bold">Improvement: +12%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
        {/* Subject Breakdown */}
        <div>
          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">Subject Performance</h4>
          <div className="space-y-6">
            {APTITUDE_SUBJECTS.map((subject) => {
              const percentage = (subject.score / subject.total) * 100;
              return (
                <div key={subject.name}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-slate-700">{subject.name}</span>
                    <span className="text-sm font-bold text-slate-900">{subject.score}/{subject.total}</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${subject.color} rounded-full transition-all duration-1000`} 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
             <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center font-black text-indigo-600 shadow-sm border border-slate-100">
                  {overallAvg}%
               </div>
               <div>
                 <p className="text-xs font-bold text-slate-800">Overall Proficiency</p>
                 <p className="text-[10px] text-slate-400">Top 15% of candidates in this category</p>
               </div>
             </div>
          </div>
        </div>

        {/* Improvement Trend */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Score History</h4>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                <span className="text-[10px] font-bold text-slate-400">Actual</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-teal-500 border-t border-dashed border-teal-500"></div>
                <span className="text-[10px] font-bold text-slate-400">Trendline</span>
              </div>
            </div>
          </div>
          <div className="flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataWithMovingAverage}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="testDate" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: '600' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                  dot={{ r: 4, fill: '#fff', stroke: '#6366f1', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="movingAverage" 
                  stroke="#14b8a6" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  dot={false}
                  activeDot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* New Section: Industry Benchmarks */}
      <div className="pt-8 border-t border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Award size={18} className="text-yellow-500" />
              Industry Benchmarks
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">How you compare to peer averages in specific roles</p>
          </div>
          <div className="bg-slate-50 p-2 rounded-xl text-slate-400 cursor-help hover:text-slate-600 transition-colors">
            <Info size={14} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {INDUSTRY_BENCHMARKS.map((benchmark) => {
            const difference = overallAvg - benchmark.averageScore;
            const isOutperforming = difference >= 0;

            return (
              <div key={benchmark.role} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="mb-3">
                  <p className="text-xs font-bold text-slate-600 truncate">{benchmark.role}</p>
                  <p className="text-[10px] text-slate-400">Industry Avg: {benchmark.averageScore}%</p>
                </div>
                
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-lg font-black text-slate-800">{overallAvg}%</span>
                    <span className="text-[10px] text-slate-400 ml-1">Your Score</span>
                  </div>
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 ${
                    isOutperforming ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {isOutperforming ? '+' : ''}{difference}%
                  </div>
                </div>

                <div className="w-full h-1.5 bg-slate-200 rounded-full mt-3 relative overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-slate-400 opacity-30 z-0" 
                    style={{ width: `${benchmark.averageScore}%` }}
                  />
                  <div 
                    className={`absolute top-0 left-0 h-full z-10 rounded-full ${isOutperforming ? 'bg-green-500' : 'bg-orange-500'}`} 
                    style={{ width: `${overallAvg}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        
        <p className="mt-6 text-[10px] text-center text-slate-400 italic">
          * Benchmark data is aggregated from 5,000+ verified assessments in the 2024 Tech Hiring Report.
        </p>
      </div>
    </div>
  );
};

export default AptitudeProgress;
