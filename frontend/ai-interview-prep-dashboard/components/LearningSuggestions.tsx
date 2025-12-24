
import React from 'react';
import { SUGGESTIONS } from '../constants';

const LearningSuggestions: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {/* HR Invitations */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 relative overflow-hidden">
        <h4 className="text-lg font-bold text-slate-800 mb-2">HR Invitations</h4>
        <p className="text-sm text-slate-500 leading-relaxed">
          Hello Rohan, we'd like to invite you to the final interview round at <span className="text-blue-500 font-bold cursor-pointer">InnoTech Solutions</span>. Please check your dashboard for the schedule. Thanks!
        </p>
        <div className="absolute top-4 right-4 w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center -rotate-12">
           <span className="text-blue-500 text-xl font-bold">@</span>
        </div>
      </div>

      {/* Next Learning */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50">
        <h4 className="text-lg font-bold text-slate-800 mb-4">Next Learning Suggestions</h4>
        <div className="space-y-4">
          {SUGGESTIONS.map((s, idx) => (
            <div key={idx} className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between group hover:bg-green-50 transition-colors">
              <div className="flex-1">
                <h5 className="text-sm font-bold text-slate-800">{s.title}</h5>
                <p className="text-[11px] text-slate-400">{s.topic}</p>
              </div>
              <div className="flex items-center gap-3">
                {s.status === 'Completed' ? (
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                    <span className="text-[10px] font-bold text-green-600">Completed</span>
                  </div>
                ) : (
                   <button className="px-4 py-2 bg-green-500 text-white text-[10px] font-bold rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-100">
                    Enroll
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningSuggestions;
