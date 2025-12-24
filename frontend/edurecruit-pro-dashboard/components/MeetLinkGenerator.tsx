
import React, { useState } from 'react';
import { Video, Copy, Check, Sparkles, Loader2 } from 'lucide-react';
import { generateMeetingAgenda } from '../services/geminiService';

const MeetLinkGenerator: React.FC = () => {
  const [meetingTitle, setMeetingTitle] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agenda, setAgenda] = useState('');

  const handleCreateLink = async () => {
    if (!meetingTitle) return;
    setLoading(true);
    
    // Simulate API call and use Gemini for agenda
    const aiAgenda = await generateMeetingAgenda(meetingTitle);
    setAgenda(aiAgenda);
    
    setTimeout(() => {
      const randomId = Math.random().toString(36).substring(2, 5) + '-' + 
                       Math.random().toString(36).substring(2, 6) + '-' + 
                       Math.random().toString(36).substring(2, 5);
      setGeneratedLink(`https://meet.google.com/yya-kqnr-quq`);
      setLoading(false);
    }, 1200);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
          <Video size={20} />
        </div>
        <h3 className="font-bold text-slate-800">Quick Meet Generator</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Meeting Title</label>
          <input 
            type="text" 
            value={meetingTitle}
            onChange={(e) => setMeetingTitle(e.target.value)}
            placeholder="e.g., Tech Interview with Alex"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
          />
        </div>

        <button 
          onClick={handleCreateLink}
          disabled={!meetingTitle || loading}
          className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>Create Google Meet Link</span>
            </>
          )}
        </button>

        {generatedLink && !loading && (
          <div className="mt-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-emerald-600 uppercase">Your Link is Ready</span>
              <button 
                onClick={copyToClipboard}
                className="text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            <p className="text-sm font-mono text-emerald-800 truncate mb-3">{generatedLink}</p>
            
            {agenda && (
              <div className="pt-3 border-t border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-600 uppercase block mb-2">AI-Generated Agenda</span>
                <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                  {agenda}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetLinkGenerator;
