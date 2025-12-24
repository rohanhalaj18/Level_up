
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import CandidateCard from './components/CandidateCard';
import MeetLinkGenerator from './components/MeetLinkGenerator';
import TaskBoard from './components/TaskBoard';
import CalendarView from './components/CalendarView';
import CollegesList from './components/CollegesList';
import { 
  Search, 
  Bell, 
  Filter, 
  Plus, 
  Sparkles, 
  Trophy, 
  Download, 
  ExternalLink,
  Users,
  Zap,
  TrendingUp,
  LayoutGrid,
  List,
  // Added ChevronRight to fix missing import error
  ChevronRight
} from 'lucide-react';
import { Candidate } from './types';

// Updated mock candidates from the screenshot
const mockCandidates: Candidate[] = [
  { 
    id: '1', 
    name: 'Rohan halaj', 
    avatar: 'Rh', 
    role: 'Backend Developer', 
    matchScore: 88, 
    skills: ['Node.js', 'PostgreSQL', 'Python', 'AWS'],
    status: 'Applied'
  },
  { 
    id: '2', 
    name: 'Arjun Verma', 
    avatar: 'AV', 
    role: 'Frontend Developer', 
    matchScore: 94, 
    skills: ['React', 'TypeScript', 'Tailwind', 'Next.js'],
    status: 'Interview'
  },
  { 
    id: '3', 
    name: 'saish', 
    avatar: 'S', 
    role: 'Fullstack Developer', 
    matchScore: 85, 
    skills: ['MongoDB', 'Express', 'React', 'Node'],
    status: 'Applied'
  }
];

const extraCandidates: Candidate[] = [
  { id: '4', name: 'Vikram Joshi', avatar: 'VJ', role: 'ML Engineer', matchScore: 91, skills: ['PyTorch', 'Scikit-learn', 'Docker'], status: 'Interview' },
  { id: '5', name: 'Neha Gupta', avatar: 'NG', role: 'UI/UX Designer', matchScore: 92, skills: ['Figma', 'Adobe XD', 'Prototyping'], status: 'Offered' },
  { id: '6', name: 'Raj Patel', avatar: 'RP', role: 'DevOps Lead', matchScore: 89, skills: ['Kubernetes', 'CI/CD', 'Terraform'], status: 'Hired' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-12 gap-6 animate-in fade-in duration-500">
            {/* Top Statistics Cards */}
            <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Candidates</p>
                  <h4 className="text-3xl font-black text-slate-800">124</h4>
                  <div className="flex items-center gap-1 text-emerald-600 mt-1">
                    <TrendingUp size={12} />
                    <span className="text-[10px] font-bold">+12% this week</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <Users size={24} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Avg Match Score</p>
                  <h4 className="text-3xl font-black text-slate-800">82%</h4>
                  <p className="text-[10px] font-bold text-slate-400 mt-1">Global pool average</p>
                </div>
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                  <Zap size={24} />
                </div>
              </div>
              <div className="bg-emerald-600 p-6 rounded-[2rem] shadow-lg shadow-emerald-600/20 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest mb-1 text-opacity-80">Interviews Held</p>
                  <h4 className="text-3xl font-black text-white">48</h4>
                  <p className="text-[10px] font-bold text-emerald-100 mt-1">32 pending for today</p>
                </div>
                <div className="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Sparkles size={24} />
                </div>
              </div>
            </div>

            {/* Main Candidates List */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                   <TrendingUp className="text-emerald-600" size={20} />
                   Recent Applications
                </h2>
                <button 
                  onClick={() => setActiveTab('candidates')}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
                >
                  View all Talent
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockCandidates.map(candidate => (
                  <CandidateCard key={candidate.id} candidate={candidate} />
                ))}
              </div>
            </div>

            {/* Right Sidebar Widgets */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              {/* Quick Actions Widget */}
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50 rounded-bl-[2rem] -mr-8 -mt-8" />
                <h3 className="font-bold text-slate-800 mb-2 relative z-10">Recruiter Toolkit</h3>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed relative z-10">
                  Accelerate your workflow with AI-powered candidate sorting and automated scheduling.
                </p>
                <div className="flex flex-col gap-2 relative z-10">
                  <button className="w-full bg-emerald-600 text-white text-xs font-bold py-3 rounded-xl hover:bg-emerald-700 transition-all shadow-md active:scale-95">
                    Sync Talent Pool
                  </button>
                  <button className="w-full bg-slate-50 text-slate-600 text-xs font-bold py-3 rounded-xl border border-slate-200 hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                    <Download size={14} />
                    Export Analytics
                  </button>
                </div>
              </div>

              <MeetLinkGenerator />
              <TaskBoard />
            </div>
          </div>
        );
      case 'colleges':
        return <CollegesList />;
      case 'candidates':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
             {/* Talent Pool Header */}
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-16 -mt-16 opacity-50" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
                      <Users size={20} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900">Elite Talent Pool</h2>
                  </div>
                  <p className="text-sm text-slate-500">Accessing 1,240 verified professionals from partner institutions.</p>
                </div>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="flex items-center bg-slate-50 border border-slate-100 p-1 rounded-xl">
                    <button className="p-2 text-emerald-600 bg-white shadow-sm rounded-lg"><LayoutGrid size={18} /></button>
                    <button className="p-2 text-slate-400 hover:text-emerald-500 rounded-lg"><List size={18} /></button>
                  </div>
                  <button className="px-5 py-3 bg-emerald-600 text-white font-bold rounded-2xl text-xs transition-all shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 flex items-center gap-2">
                    <Plus size={16} />
                    Add Talent
                  </button>
                </div>
             </div>

             {/* Talent Pool Controls */}
             <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search by name, role, or specific tech stacks..." 
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 text-sm outline-none transition-all"
                  />
                </div>
                <button className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm">
                   <Filter size={20} />
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...mockCandidates, ...extraCandidates].map((c) => (
                  <CandidateCard key={c.id} candidate={c} />
                ))}
             </div>
          </div>
        );
      case 'tasks':
        return <div className="max-w-2xl mx-auto"><TaskBoard /></div>;
      case 'calendar':
        return <div className="max-w-4xl mx-auto"><CalendarView /></div>;
      default:
        return <div>View not implemented</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-64 p-8 min-h-screen">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Dashboard</h1>
            <span className="text-slate-300">/</span>
            <span className="text-sm font-bold text-slate-800 capitalize">{activeTab}</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-sm border border-slate-100">
              <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all relative">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="w-[1px] h-4 bg-slate-100 mx-1"></div>
              <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all">
                <Filter size={20} />
              </button>
            </div>
            
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right">
                <p className="text-sm font-black text-slate-800">Elena R.</p>
                <div className="flex items-center gap-1 justify-end">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                   <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Active</p>
                </div>
              </div>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                <img src="https://picsum.photos/seed/elena/100/100" alt="Avatar" className="object-cover w-full h-full" />
              </div>
            </div>
          </div>
        </header>

        {renderContent()}

        {/* Floating AI Helper Toggle */}
        <button className="fixed bottom-10 right-10 w-16 h-16 bg-slate-900 text-white rounded-[2rem] shadow-2xl flex items-center justify-center hover:scale-110 transition-all hover:bg-emerald-600 group z-50 border-4 border-white">
          <Sparkles size={28} className="group-hover:animate-pulse" />
        </button>
      </main>
    </div>
  );
};

export default App;
