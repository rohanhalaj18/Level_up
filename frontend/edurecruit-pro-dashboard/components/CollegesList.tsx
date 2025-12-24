
import React, { useState } from 'react';
import { 
  School, 
  Users, 
  MapPin, 
  ExternalLink, 
  Mail, 
  Search, 
  Plus, 
  Filter, 
  MoreVertical,
  GraduationCap,
  Building2
} from 'lucide-react';

const initialColleges = [
  { id: '1', name: 'KLE Technological Universities, Dr. M. S. Sheshgiri Campus', location: 'Belagavi KA', logo: 'https://media.licdn.com/dms/image/v2/D4E03AQHFnS0pSF3JsQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1727947255182?e=2147483647&v=beta&t=ZxFETeDaJZN_RqY59RE5qvfLw9jAVibWwZs5_BzbgCY', contact: 'Dr. Sarah Wilson', students: 200, type: 'University' },
  { id: '2', name: 'KLE Technological University', location: ' Hubballi ,KA', logo: 'https://media.licdn.com/dms/image/v2/D4E03AQHFnS0pSF3JsQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1727947255182?e=2147483647&v=beta&t=ZxFETeDaJZN_RqY59RE5qvfLw9jAVibWwZs5_BzbgCY', contact: 'Prof. James Chen', students: 289, type: 'University' },
  { id: '3', name: 'KLS Gogte Institute of Technology', location: 'Belagavi KA', logo: 'https://git.edu/wp-content/uploads/2023/12/GIT-new-1-1-1024x1024-1.png', contact: 'Elena Gilbert', students: 56, type: 'College' },
  { id: '4', name: 'VTU', location: 'Belagavi KA', logo: 'https://i0.wp.com/sjbit.edu.in/wp-content/uploads/2021/07/VTU-Logo-250x250-1.png?ssl=1', contact: 'Prof. Hans Weber', students: 142, type: 'University' },
  { id: '5', name: 'IIT Bombay', location: 'Mumbai, India', logo: 'https://picsum.photos/seed/iit/120/120', contact: 'Rajesh Khanna', students: 210, type: 'University' },
  { id: '6', name: 'Oxford Academy', location: 'Oxford, UK', logo: 'https://picsum.photos/seed/oxford/120/120', contact: 'Dr. Alan Smith', students: 78, type: 'Academy' },
  
];

const CollegesList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredColleges = initialColleges.filter(college => 
    college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
        <div>
          <h3 className="font-extrabold text-slate-900 text-xl flex items-center gap-2">
            <Building2 className="text-emerald-500" size={24} />
            Partner Institutions
          </h3>
          <p className="text-sm text-slate-500 mt-1">Managing {initialColleges.length} global educational alliances</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search institutions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all w-full md:w-64"
            />
          </div>
          <button className="p-2 bg-slate-50 text-slate-500 hover:text-emerald-500 rounded-xl border border-slate-100 transition-colors">
            <Filter size={18} />
          </button>
          <button className="px-5 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2 whitespace-nowrap">
            <Plus size={16} />
            <span>New Partner</span>
          </button>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredColleges.map((college) => (
          <div key={college.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group flex flex-col relative overflow-hidden">
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-[4rem] -mr-12 -mt-12 group-hover:bg-emerald-100 transition-colors" />
            
            <div className="flex items-start justify-between mb-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img 
                    src={college.logo} 
                    className="w-50 h-20 rounded-2xl shadow-sm group-hover:scale-105 transition-transform border border-slate-50 bg-white p-1" 
                    alt={college.name} 
                  />
                  <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-lg shadow-sm border border-slate-100">
                    <GraduationCap size={12} className="text-emerald-500" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 leading-tight group-hover:text-emerald-700 transition-colors">{college.name}</h4>
                  <div className="flex items-center gap-1 text-slate-400 text-[11px] font-medium mt-1 uppercase tracking-wider">
                    <MapPin size={10} className="text-rose-400" />
                    <span>{college.location}</span>
                  </div>
                </div>
              </div>
              <button className="text-slate-300 hover:text-slate-600 transition-colors">
                <MoreVertical size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full uppercase tracking-tighter">
                  {college.type}
                </span>
                <span className="w-1 h-1 bg-slate-200 rounded-full" />
                <span className="text-[10px] text-slate-400 font-bold uppercase">Partner since 2023</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100 flex flex-col justify-center">
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">Point of Contact</p>
                  <p className="text-xs font-bold text-slate-700 truncate">{college.contact}</p>
                </div>
                <div className="bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100 flex flex-col justify-center">
                  <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest mb-1">Referred</p>
                  <div className="flex items-center gap-1.5">
                    <Users size={12} className="text-emerald-500" />
                    <p className="text-xs font-black text-emerald-700">{college.students}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-50 flex items-center gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-2xl text-xs font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95">
                <Mail size={14} />
                Contact Rep
              </button>
              <button className="w-12 h-12 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100 active:scale-95">
                <ExternalLink size={18} />
              </button>
            </div>
          </div>
        ))}

        {filteredColleges.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <School size={32} className="text-slate-300" />
            </div>
            <h4 className="text-lg font-bold text-slate-800">No institutions found</h4>
            <p className="text-sm text-slate-500">Try adjusting your search query</p>
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-4 text-emerald-600 font-bold text-sm hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollegesList;
