
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Video, Presentation } from 'lucide-react';
import { SCHEDULE_ITEMS } from '../constants';

const CalendarWidget: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Calendar Logic
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const days = [];
  // Empty slots for days of previous month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-8"></div>);
  }
  // Days of current month
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;
    days.push(
      <div 
        key={d} 
        className={`flex items-center justify-center h-8 w-8 text-xs font-semibold rounded-lg cursor-pointer transition-all ${
          isToday 
            ? 'bg-green-500 text-white shadow-lg shadow-green-200 scale-110' 
            : 'text-slate-500 hover:bg-slate-50 hover:text-green-600'
        }`}
      >
        {d}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 w-full lg:w-[400px]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-sm font-bold text-slate-800">{monthNames[month]}</h4>
          <p className="text-[10px] text-slate-400">{year}</p>
        </div>
        <div className="flex gap-1">
          <button onClick={prevMonth} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
            <ChevronLeft size={16} />
          </button>
          <button onClick={nextMonth} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
            <ChevronRight size={16} />
          </button>
          <button className="ml-2 px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-lg flex items-center gap-1 hover:bg-green-100 transition-colors">
            <Plus size={14} /> New
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-y-1 mb-6">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-slate-300 uppercase py-2">{d}</div>
        ))}
        {days}
      </div>

      {/* Agenda */}
      <div className="pt-4 border-t border-slate-50">
        <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Today's Agenda</h5>
        <div className="space-y-4">
          {SCHEDULE_ITEMS.map((item) => (
            <div key={item.id} className="flex items-center gap-3 group cursor-pointer hover:translate-x-1 transition-transform">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                item.type === 'interview' ? 'bg-blue-100 text-blue-600' : 
                item.type === 'workshop' ? 'bg-green-100 text-green-600' : 'bg-indigo-100 text-indigo-600'
              }`}>
                {item.type === 'interview' ? <Video size={16} /> : 
                 item.type === 'workshop' ? <Presentation size={16} /> : <CalendarIcon size={16} />}
              </div>
              <div className="flex-1">
                <h5 className="text-xs font-bold text-slate-700">{item.title}</h5>
                <p className="text-[10px] text-slate-400">{item.time}</p>
              </div>
              <ChevronRight size={14} className="text-slate-200 group-hover:text-slate-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarWidget;
