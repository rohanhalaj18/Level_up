
import React, { useState, useRef } from 'react';
import { Upload, ChevronRight, FileCheck, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

const ScoreCards: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadProgress(0);
      setUploadedFile(file.name);

      // Simulate AI Parsing Progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setTimeout(() => setIsUploading(false), 500);
        }
        setUploadProgress(Math.floor(progress));
      }, 400);
    }
  };

  const resumeSummary = {
    skills: ['React', 'TypeScript', 'Node.js', 'LLM Prompting', 'UI/UX'],
    experience: [
      '4+ years in Full Stack Development',
      'Architected 3 production AI-integrated web apps',
      'Optimized performance by 40% for legacy platforms'
    ],
    atsScore: 92
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      {/* Left Column: Upload & Summary */}
      <div className="flex flex-col gap-6">
        {/* Upload Resume Card */}
        <div 
          onClick={handleUploadClick}
          className={`bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 flex items-center gap-4 cursor-pointer transition-all group relative overflow-hidden ${isUploading ? 'pointer-events-none' : 'hover:bg-slate-50'}`}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept=".pdf,.doc,.docx"
          />
          
          {isUploading && (
            <div className="absolute bottom-0 left-0 h-1 bg-green-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
          )}

          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
            uploadedFile && !isUploading ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-green-500 group-hover:text-white'
          }`}>
            {isUploading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : uploadedFile ? (
              <FileCheck size={20} />
            ) : (
              <Upload size={20} />
            )}
          </div>
          
          <div className="flex flex-col">
            <span className="font-bold text-slate-700">
              {isUploading ? `Analyzing... ${uploadProgress}%` : uploadedFile ? 'Resume Updated' : 'Upload Resume'}
            </span>
            {uploadedFile && !isUploading && (
              <span className="text-[10px] text-slate-400 truncate max-w-[120px]">{uploadedFile}</span>
            )}
          </div>
        </div>

        {/* Resume Analysis Summary Card (Conditional) */}
        {uploadedFile && !isUploading && (
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Sparkles size={16} className="text-orange-400" />
                AI Resume Insights
              </h4>
              <div className="bg-green-50 text-green-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
                ATS: {resumeSummary.atsScore}%
              </div>
            </div>

            <div className="mb-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Identified Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {resumeSummary.skills.map((skill) => (
                  <span key={skill} className="px-2 py-1 bg-slate-50 text-slate-600 text-[10px] font-medium rounded-lg border border-slate-100">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Highlights</p>
              <ul className="space-y-2">
                {resumeSummary.experience.map((item, idx) => (
                  <li key={idx} className="flex gap-2 text-[11px] text-slate-600 leading-tight">
                    <CheckCircle2 size={12} className="text-green-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Middle Column: Interview Score */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 h-full flex flex-col justify-center">
        <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Scores</p>
        <p className="text-sm font-bold text-slate-700 mb-1">Last Interview</p>
        <div className="flex items-end gap-1">
          <span className="text-2xl font-black text-green-500">85%</span>
          <span className="text-[10px] text-slate-400 pb-1">Skill Proficiency</span>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-50">
          <p className="text-[10px] text-slate-400">Communication: <span className="font-bold text-slate-700">90%</span></p>
          <p className="text-[10px] text-slate-400">Problem Solving: <span className="font-bold text-slate-700">82%</span></p>
        </div>
      </div>

      {/* Right Column: Mock Test Score */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 h-full flex flex-col justify-between">
        <div>
          <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Mock Test</p>
          <p className="text-sm font-bold text-slate-700 mb-1">Latest Performance:</p>
          <div className="flex items-end gap-1">
            <span className="text-2xl font-black text-green-600">78%</span>
            <span className="text-[10px] text-green-500 font-bold pb-1 cursor-pointer hover:underline flex items-center">
              Accept & Schedule <ChevronRight size={12} />
            </span>
          </div>
        </div>
        <div className="mt-4 bg-indigo-50 p-3 rounded-2xl border border-indigo-100">
           <p className="text-[10px] text-indigo-700 font-semibold leading-tight italic">
             "Great improvement in Logic rounds! Keep focusing on System Design."
           </p>
        </div>
      </div>
    </div>
  );
};

export default ScoreCards;
