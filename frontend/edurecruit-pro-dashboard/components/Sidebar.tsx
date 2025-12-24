
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  School, 
  CheckSquare, 
  Calendar, 
  Settings, 
  LogOut,
  ChevronRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'candidates', label: 'Top Talent', icon: Users },
    { id: 'colleges', label: 'Partner Colleges', icon: School },
    { id: 'tasks', label: 'Task Bar', icon: CheckSquare },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
  ];

  return (
    <aside className="w-64 bg-white h-screen flex flex-col fixed left-0 top-0 text-slate-600 border-r border-slate-100 z-40">
      <div className="p-6 flex flex-col h-full">
        {/* Branding */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-600/20">
            <School size={24} />
          </div>
          <div>
            <h1 className="text-slate-900 font-extrabold text-lg leading-tight tracking-tight">EduRecruit</h1>
            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Global Partner</span>
          </div>
        </div>

        {/* Profile Section */}
        <div className="mb-8 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <img 
                src="https://picsum.photos/seed/elena/100/100" 
                className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-sm" 
                alt="Profile"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="overflow-hidden">
              <p className="text-slate-800 text-sm font-bold truncate">Elena Rodriguez</p>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Sr. Recruiter</p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 bg-white p-2 rounded-xl border border-emerald-100/30 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Availability</span>
            <div className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-black rounded-full uppercase">
              Online
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 flex-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Main Menu</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 group ${
                activeTab === item.id 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 translate-x-1' 
                  : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} className={activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-emerald-600'} />
                <span className="text-sm font-bold">{item.label}</span>
              </div>
              <ChevronRight size={14} className={`transition-transform duration-300 ${activeTab === item.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`} />
            </button>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="mt-auto pt-6 space-y-4">
          <div className="p-4 bg-slate-900 rounded-2xl relative overflow-hidden group cursor-pointer">
             <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
                <Sparkles size={32} className="text-emerald-400" />
             </div>
             <p className="text-[10px] font-bold text-emerald-400 uppercase mb-1">AI Upgrade</p>
             <p className="text-xs font-bold text-white mb-2">Unlock Pro Tools</p>
             <div className="w-full bg-emerald-600 h-1.5 rounded-full overflow-hidden">
                <div className="bg-white w-3/4 h-full rounded-full"></div>
             </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all" title="Settings">
              <Settings size={20} />
            </button>
            <a href="../pages/main.html" className="flex items-center gap-2 px-3 py-2 text-sm text-rose-500 font-bold hover:bg-rose-50 rounded-xl transition-all" title="Logout">
              <span className="text-xs">Sign Out</span>
              <LogOut size={18} />
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
