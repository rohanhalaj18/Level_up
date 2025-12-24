
import React from 'react';
import * as Icons from 'lucide-react';
import { SKILLS } from '../constants';

const SkillsOverview: React.FC = () => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-slate-800 mb-6">Skills Learned</h3>
      <div className="flex flex-wrap gap-6 items-center">
        {SKILLS.map((skill) => {
          // Dynamic icon resolution
          const IconComponent = (Icons as any)[skill.icon] || Icons.HelpCircle;
          
          return (
            <div key={skill.name} className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${skill.color} shadow-sm transition-transform group-hover:scale-110`}>
                <IconComponent size={24} />
              </div>
              <span className="text-[11px] font-medium text-slate-500">{skill.name}</span>
              <span className={`text-xs font-bold ${skill.percentage > 50 ? 'text-green-600' : 'text-orange-500'}`}>
                {skill.percentage}%
              </span>
            </div>
          );
        })}
      </div>
      <div className="w-full h-1.5 bg-slate-100 rounded-full mt-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 h-full bg-green-500 rounded-full" style={{ width: '25%' }}></div>
      </div>
    </div>
  );
};

export default SkillsOverview;
