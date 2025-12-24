
import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, MessageSquare, Briefcase, Mail, Zap, ChevronRight } from 'lucide-react';
import { generateInterviewBrief } from '../services/geminiService';
import { Candidate } from '../types';

interface CandidateCardProps {
  candidate: Candidate;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate }) => {
  const [brief, setBrief] = useState<string>('');
  const [loadingBrief, setLoadingBrief] = useState(false);

  // Derive email based on the screenshot data pattern
  const email = candidate.id === '1' ? 'rohanhalaj@gmail.com' : 
                candidate.id === '2' ? 'arjun@example.com' : 
                candidate.id === '3' ? 'saish@gmail.com' : `${candidate.name.toLowerCase().replace(' ', '')}@example.com`;

  const getBrief = async () => {
    setLoadingBrief(true);
    const result = await generateInterviewBrief(candidate.name, candidate.role);
    setBrief(result);
    setLoadingBrief(false);
  };

  useEffect(() => {
    getBrief();
  }, []);

  const getStatusStyle = (status: Candidate['status']) => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Interview':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Offered':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Hired':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  return (
    <div className="bg-white p-5 rounded-[2rem] border border-slate-100 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 group relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[4rem] -mr-12 -mt-12 group-hover:bg-emerald-50 transition-colors z-0" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            {/* Initials Avatar Box */}
            <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-black text-lg shrink-0 shadow-lg shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              {candidate.avatar}
            </div>
            
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h4 className="font-extrabold text-slate-900 text-lg leading-tight truncate group-hover:text-emerald-700 transition-colors">
                  {candidate.name}
                </h4>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${getStatusStyle(candidate.status)}`}>
                  {candidate.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Briefcase size={12} className="text-slate-400" />
                {candidate.role}
              </p>
            </div>
          </div>

          <div className="text-right">
             <div className="flex items-center gap-1 justify-end">
                <Zap size={12} className="text-amber-500 fill-amber-500" />
                <span className="text-sm font-black text-slate-800">{candidate.matchScore}%</span>
             </div>
             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Match Score</p>
          </div>
        </div>

        {/* Skills Section */}
        <div className="flex flex-wrap gap-2 mb-4">
          {candidate.skills.slice(0, 3).map(skill => (
            <span key={skill} className="px-2.5 py-1 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-lg border border-slate-100 group-hover:bg-white group-hover:border-emerald-100 transition-colors">
              {skill}
            </span>
          ))}
          {candidate.skills.length > 3 && (
             <span className="px-2.5 py-1 bg-slate-50 text-slate-400 text-[10px] font-bold rounded-lg">+{candidate.skills.length - 3} more</span>
          )}
        </div>

        {/* AI Brief section */}
        <div className="bg-emerald-50/30 p-3 rounded-2xl border border-emerald-50/50 mb-5 group-hover:bg-emerald-50 transition-colors">
           <div className="flex items-center gap-1.5 mb-1.5">
              <Sparkles size={12} className="text-emerald-500" />
              <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Recruiter Brief</span>
           </div>
           <p className="text-[10px] text-slate-600 leading-relaxed line-clamp-2 italic">
              {loadingBrief ? "Syncing intelligence..." : brief || "Ready for deep-dive assessment."}
           </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex-1 py-2.5 bg-slate-900 text-white text-[11px] font-bold rounded-xl hover:bg-slate-800 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2">
            Full Profile
            <ChevronRight size={14} />
          </button>
          <button className="px-4 py-2.5 bg-emerald-50 text-emerald-600 text-[11px] font-bold rounded-xl hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100 active:scale-95 flex items-center gap-2">
            <Mail size={14} />
            Invite
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
