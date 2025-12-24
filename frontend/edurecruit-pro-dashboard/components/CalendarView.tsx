
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Video, 
  User, 
  Clock, 
  Plus, 
  MoreVertical, 
  Sparkles,
  FileText,
  Trash2,
  Loader2,
  X,
  Calendar as CalendarIcon,
  RefreshCw,
  Globe,
  Check
} from 'lucide-react';
import { generateMeetingAgenda } from '../services/geminiService';
import { Meeting } from '../types';

const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    time: '',
    candidateName: '',
    syncToGoogle: true
  });

  const [meetings, setMeetings] = useState<Meeting[]>([
    { 
      id: '1', 
      title: 'Tech Round: System Design', 
      time: '09:00 AM', 
      candidateName: 'Rohan halaj', 
      link: 'https://meet.google.com/yya-kqnr-quq',
      source: 'internal'
    },
    { 
      id: '2', 
      title: 'HR Cultural Fit', 
      time: '02:30 PM', 
      candidateName: 'Arjun Verma',
      source: 'internal'
    },
    { 
      id: 'g-1', 
      title: 'Weekly Team Sync', 
      time: '11:00 AM', 
      candidateName: 'Engineering Team',
      source: 'google',
      description: 'Review weekly progress and blockers'
    }
  ]);

  const handleSync = () => {
    setIsSyncing(true);
    // Simulate API delay for Google Calendar sync
    setTimeout(() => {
      const gEvents: Meeting[] = [
        { 
          id: 'g-' + Math.random(), 
          title: 'Product Roadmap Review', 
          time: '01:00 PM', 
          candidateName: 'Product Team', 
          source: 'google' 
        },
        { 
          id: 'g-' + Math.random(), 
          title: 'Lunch Break', 
          time: '12:00 PM', 
          candidateName: 'Personal', 
          source: 'google' 
        }
      ];
      
      setMeetings(prev => {
        const nonGoogle = prev.filter(m => m.source !== 'google');
        // Keep some existing google events + new ones for simulation
        const existingGoogle = prev.filter(m => m.source === 'google').slice(0, 1);
        return [...nonGoogle, ...existingGoogle, ...gEvents];
      });
      setIsSyncing(false);
    }, 2000);
  };

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const handleGenerateLink = async (meetingId: string, title: string) => {
    setIsLoading(meetingId);
    try {
      await generateMeetingAgenda(title);
      
      setTimeout(() => {
        const randomId = Math.random().toString(36).substring(2, 5) + '-' + 
                         Math.random().toString(36).substring(2, 6) + '-' + 
                         Math.random().toString(36).substring(2, 5);
        
        setMeetings(prev => prev.map(m => 
          m.id === meetingId ? { ...m, link: 'https://meet.google.com/yya-kqnr-quq' } : m
        ));
        setIsLoading(null);
      }, 1500);
    } catch (error) {
      console.error("Link generation failed", error);
      setIsLoading(null);
    }
  };

  const handleAddMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeeting.title || !newMeeting.time || !newMeeting.candidateName) return;

    const meeting: Meeting = {
      id: Date.now().toString(),
      title: newMeeting.title,
      time: newMeeting.time,
      candidateName: newMeeting.candidateName,
      source: newMeeting.syncToGoogle ? 'google' : 'internal'
    };

    setMeetings(prev => [meeting, ...prev]);
    setNewMeeting({ title: '', time: '', candidateName: '', syncToGoogle: true });
    setShowAddForm(false);
  };

  const removeMeeting = (id: string) => {
    setMeetings(meetings.filter(m => m.id !== id));
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 w-full overflow-hidden flex flex-col">
      {/* Header Section */}
      <div className="p-5 border-b border-slate-100 bg-slate-50/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-600/20">
              <CalendarIcon size={18} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Recruitment Calendar</h3>
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Sync Active</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleSync}
              disabled={isSyncing}
              className={`p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all ${isSyncing ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Sync with Google Calendar"
            >
              <RefreshCw size={14} className={`text-slate-500 ${isSyncing ? 'animate-spin' : ''}`} />
            </button>
            <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
              <button onClick={prevMonth} className="p-1 hover:bg-slate-50 rounded-lg transition-colors text-slate-400">
                <ChevronLeft size={14} />
              </button>
              <span className="text-[11px] font-bold text-slate-700 min-w-[85px] text-center">
                {monthNames[currentDate.getMonth()].slice(0, 3)} {currentDate.getFullYear()}
              </span>
              <button onClick={nextMonth} className="p-1 hover:bg-slate-50 rounded-lg transition-colors text-slate-400">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
            <div key={d} className="text-[9px] font-bold text-slate-400 text-center py-1 uppercase">{d}</div>
          ))}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} className="h-7" />)}
          {Array.from({ length: daysInMonth(currentDate.getFullYear(), currentDate.getMonth()) }).map((_, i) => {
            const day = i + 1;
            const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();
            const isSelected = day === selectedDate.getDate() && currentDate.getMonth() === selectedDate.getMonth();
            const dayMeetings = day === 1 || day === 2 || day === 3 || day === 4;

            return (
              <div 
                key={day} 
                onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                className={`text-[10px] h-7 w-full flex items-center justify-center rounded-lg cursor-pointer transition-all font-bold relative group ${
                  isSelected 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : isToday 
                      ? 'bg-emerald-50 text-emerald-600' 
                      : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                {day}
                {dayMeetings && !isSelected && (
                  <div className="absolute bottom-1 w-0.5 h-0.5 bg-blue-400 rounded-full" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Events Section */}
      <div className="flex-1 p-5 space-y-4 max-h-[450px] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between sticky top-0 bg-white z-10 pb-2">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Schedule for {selectedDate.getDate()} {monthNames[selectedDate.getMonth()]}</h4>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className={`p-1.5 rounded-lg transition-all ${showAddForm ? 'bg-rose-50 text-rose-500 rotate-45' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
          >
            <Plus size={14} />
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddMeeting} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200 mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">New Interview</span>
              <button type="button" onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600">
                <X size={14} />
              </button>
            </div>
            <input 
              type="text" 
              placeholder="Meeting Title"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              value={newMeeting.title}
              onChange={e => setNewMeeting({...newMeeting, title: e.target.value})}
              required
            />
            <input 
              type="text" 
              placeholder="Candidate Name"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              value={newMeeting.candidateName}
              onChange={e => setNewMeeting({...newMeeting, candidateName: e.target.value})}
              required
            />
            <input 
              type="text" 
              placeholder="Time (e.g. 10:00 AM)"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              value={newMeeting.time}
              onChange={e => setNewMeeting({...newMeeting, time: e.target.value})}
              required
            />
            <div className="flex items-center gap-2 px-1">
              <button 
                type="button"
                onClick={() => setNewMeeting(prev => ({ ...prev, syncToGoogle: !prev.syncToGoogle }))}
                className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${newMeeting.syncToGoogle ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300'}`}
              >
                {newMeeting.syncToGoogle && <Check size={10} strokeWidth={4} />}
              </button>
              <span className="text-[10px] font-medium text-slate-600">Add to Google Calendar</span>
            </div>
            <button 
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-sm"
            >
              Schedule
            </button>
          </form>
        )}

        {meetings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 opacity-40">
            <Clock size={24} className="text-slate-300 mb-2" />
            <p className="text-[10px] font-medium text-slate-500">Free day!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {meetings.map((meeting) => (
              <div 
                key={meeting.id} 
                className={`group bg-white border rounded-2xl p-3 hover:shadow-sm transition-all ${meeting.source === 'google' ? 'border-blue-100 hover:border-blue-300' : 'border-slate-100 hover:border-emerald-200'}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl shrink-0 ${meeting.source === 'google' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {meeting.source === 'google' ? <Globe size={14} /> : (meeting.title.toLowerCase().includes('tech') ? <FileText size={14} /> : <User size={14} />)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <h5 className="text-[12px] font-bold text-slate-800 truncate">{meeting.title}</h5>
                        {meeting.source === 'google' && (
                          <span className="px-1 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-bold rounded uppercase shrink-0">G-Cal</span>
                        )}
                      </div>
                      <button className="text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0" onClick={() => removeMeeting(meeting.id)}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-3">
                      <span className="flex items-center gap-1 font-semibold truncate">
                        <Clock size={10} className="text-slate-400" />
                        {meeting.time}
                      </span>
                      <span className="w-1 h-1 bg-slate-200 rounded-full shrink-0"></span>
                      <span className="flex items-center gap-1 font-semibold truncate">
                        <User size={10} className="text-slate-400" />
                        {meeting.candidateName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {meeting.link ? (
                        <a 
                          href={`https://meet.google.com/yya-kqnr-quq`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white py-1.5 px-3 rounded-lg text-[10px] font-bold hover:bg-emerald-700 transition-all shadow-sm"
                        >
                          <Video size={12} />
                          Join Meet
                        </a>
                      ) : (
                        <button 
                          onClick={() => handleGenerateLink(meeting.id, meeting.title)}
                          disabled={isLoading === meeting.id}
                          className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-[10px] font-bold transition-all disabled:opacity-70 ${meeting.source === 'google' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
                        >
                          {isLoading === meeting.id ? (
                            <>
                              <Loader2 size={12} className="animate-spin" />
                              <span>Wait...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles size={12} className="text-emerald-400" />
                              <span>Gen Link</span>
                            </>
                          )}
                        </button>
                      )}
                      <button className="p-1.5 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg transition-colors">
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sync Status Footer */}
      <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Live with Edu-Workspace</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            <span className="text-[9px] text-slate-400 font-bold uppercase">Google</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-[9px] text-slate-400 font-bold uppercase">Internal</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
