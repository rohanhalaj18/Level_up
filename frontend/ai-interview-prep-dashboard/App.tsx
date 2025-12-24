
import React from 'react';
import Sidebar from './components/Sidebar';
import SkillsOverview from './components/SkillsOverview';
import LearningCurveChart from './components/LearningCurveChart';
import CalendarWidget from './components/CalendarWidget';
import ScoreCards from './components/ScoreCards';
import LearningSuggestions from './components/LearningSuggestions';
import AptitudeProgress from './components/AptitudeProgress';

const App: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-[1400px] mx-auto">
          
          {/* Top Section: Skills */}
          <section className="animate-in fade-in duration-700 slide-in-from-top-4">
            <SkillsOverview />
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
            {/* Left: Chart Area */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              <section className="animate-in fade-in duration-1000 slide-in-from-left-4">
                <LearningCurveChart />
              </section>
              
              <section className="animate-in fade-in duration-1000 delay-200 slide-in-from-bottom-4">
                <ScoreCards />
              </section>
            </div>

            {/* Right: Calendar/Activity */}
            <div className="lg:col-span-4">
              <section className="animate-in fade-in duration-1000 slide-in-from-right-4">
                <CalendarWidget />
              </section>
            </div>
          </div>

          {/* New Section: Dedicated Aptitude Tracking */}
          <section className="mb-8 animate-in fade-in duration-1000 delay-150 slide-in-from-bottom-6">
            <AptitudeProgress />
          </section>

          {/* Bottom Section: Invitations and Suggestions */}
          <section className="animate-in fade-in duration-1000 delay-300 slide-in-from-bottom-6">
            <LearningSuggestions />
          </section>

          <footer className="mt-12 py-6 border-t border-slate-200 text-center text-xs text-slate-400">
            &copy; 2024 AI Interview Preparation Dashboard. All rights reserved.
          </footer>
        </div>
      </main>
    </div>
  );
};

export default App;
