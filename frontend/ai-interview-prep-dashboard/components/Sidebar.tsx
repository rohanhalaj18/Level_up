
import React from 'react';
import { NAVIGATION } from '../constants';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 flex flex-col h-screen p-6 fixed left-0 top-0 overflow-y-auto z-10">
      <div className="flex flex-col items-center mb-10 mt-4">
        <div className="relative mb-3">
          <div className="w-20 h-20 rounded-full border-4 border-green-500 p-1 overflow-hidden">
             <img src="https://picsum.photos/seed/alex/200/200" alt="Alex Thompson" className="w-full h-full rounded-full object-cover" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-slate-800">Rohan halaj</h2>
        <p className="text-sm text-slate-400">Full Stack Developer</p>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {NAVIGATION.map((item) => (
            <li key={item.name}>
              <a
                href="#"
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                  item.active 
                    ? 'bg-green-50 text-green-600 font-medium' 
                    : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="mt-auto pt-6">
        <div className="bg-green-50 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white font-bold">JD</div>
            <div>
                <p className="text-xs font-semibold text-slate-800">New Career</p>
                <p className="text-[10px] text-slate-400 underline cursor-pointer">View resume</p>
            </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
