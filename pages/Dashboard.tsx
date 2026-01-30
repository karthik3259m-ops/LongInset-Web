import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { SuccessMeter } from '../components/SuccessMeter';
import { TopicCard } from '../components/TopicCard';
import { Flame, Trophy, Calendar, AlertTriangle, Target, PenTool } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, mastery, startSession, navigate, updateQuickNotes } = useStore();
  const [notes, setNotes] = useState('');

  // Sync local state with store when user loads
  useEffect(() => {
    if (user) {
      setNotes(user.quickNotes || '');
    }
  }, [user]);

  if (!user) return null;

  // Derived stats
  const masteredCount = mastery.filter(t => t.masteryLevel === 'mastered').length;
  const overallProgress = Math.round((masteredCount / mastery.length) * 100) || 45; // Default for demo
  const weakSpots = mastery.filter(t => t.isWeakSpot);
  const priorityTopics = [...mastery].sort((a, b) => b.priorityScore - a.priorityScore).slice(0, 3);

  const handlePractice = (topicId: string) => {
    startSession(topicId);
    navigate('/practice');
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  const handleNotesBlur = () => {
    updateQuickNotes(notes);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome back, {user.name.split(' ')[0]} 👋</h1>
          <p className="text-gray-500 mt-1">Target: <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{user.examTarget}</span></p>
        </div>
        
        <div className="grid grid-cols-2 md:flex gap-3 md:gap-4">
          <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
              <Flame size={20} fill="currentColor" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Streak</p>
              <p className="text-lg font-bold text-gray-900 leading-none">{user.streak} Days</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
              <Trophy size={20} fill="currentColor" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Points</p>
              <p className="text-lg font-bold text-gray-900 leading-none">{user.points}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* Success Meter & Notes Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col items-center">
            <h2 className="text-lg font-bold text-gray-900 self-start mb-4">Success Meter</h2>
            {/* Explicit Height Container for Recharts */}
            <div className="w-full h-[250px] flex items-center justify-center relative">
               <SuccessMeter progress={overallProgress} size={220} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 w-full">
               <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                 <p className="text-2xl font-bold text-gray-900">{masteredCount}</p>
                 <p className="text-xs text-gray-500 font-medium">Topics Mastered</p>
               </div>
               <div className="text-center p-3 bg-red-50 rounded-lg border border-red-100">
                 <p className="text-2xl font-bold text-red-600">{weakSpots.length}</p>
                 <p className="text-xs text-red-600 font-medium">Weak Spots</p>
               </div>
            </div>
          </div>

          {/* Quick Notes Widget */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col">
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-gray-900 font-bold">
                    <div className="p-1.5 bg-yellow-100 rounded text-yellow-600">
                        <PenTool size={16} />
                    </div>
                    <h3>Quick Notes</h3>
                </div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">Auto-saves</span>
             </div>
             <textarea 
               className="w-full h-40 p-4 bg-yellow-50 border border-yellow-100 rounded-xl resize-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-gray-700 text-sm leading-relaxed placeholder-gray-400 outline-none transition-all"
               placeholder="Jot down formulas, reminders, or scratchpad ideas here..."
               value={notes}
               onChange={handleNotesChange}
               onBlur={handleNotesBlur}
             />
          </div>
        </div>

        {/* Priorities Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Weak Spots Alert */}
          {weakSpots.length > 0 && (
            <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-xl flex items-start gap-4 shadow-sm">
              <div className="p-2 bg-red-100 rounded-full text-red-600 mt-1 shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="font-bold text-red-900 text-lg">Attention Required</h3>
                <p className="text-red-700 mt-1 text-sm md:text-base leading-relaxed">
                  You have <span className="font-bold">{weakSpots.length} weak spots</span> slowing down your progress. 
                  Focus on these to boost your score efficiently.
                </p>
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Target className="text-indigo-600" />
                High Priority Topics
              </h2>
              <button onClick={() => navigate('/plan')} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">View All</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {priorityTopics.map(topic => (
                <TopicCard key={topic.topicId} topic={topic} onPractice={handlePractice} />
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">
             <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white rounded-full opacity-10"></div>
             <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 bg-white rounded-full opacity-10"></div>
             <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
               <div>
                 <h3 className="text-xl font-bold mb-2">Upcoming Mock Test</h3>
                 <div className="flex items-center gap-2 text-indigo-100 mb-4 bg-white/10 w-fit px-3 py-1 rounded-full text-sm">
                    <Calendar size={14} />
                    <span>Friday, 10:00 AM • 3 Hours</span>
                 </div>
                 <button className="w-full sm:w-auto px-5 py-2.5 bg-white text-indigo-900 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-sm">
                   Set Reminder
                 </button>
               </div>
               <div className="hidden sm:block text-6xl opacity-20 rotate-12">📝</div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};