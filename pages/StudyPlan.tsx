import React from 'react';
import { STUDY_STRATEGY } from '../services/mockData';
import { Calendar, Clock, Book, Target, Zap, Activity, Brain, Layers, Briefcase, Wrench, Trophy } from 'lucide-react';
import { useStore } from '../store/useStore';

export const StudyPlan: React.FC = () => {
  const { user } = useStore();

  // Helper to determine the relevant category keyword from the user's target
  const getRelevantCategory = (target: string) => {
    const t = target.toLowerCase();
    if (t.includes('jee') || t.includes('bitsat') || t.includes('gate') || t.includes('engineering')) return 'JEE';
    if (t.includes('neet') || t.includes('medical')) return 'NEET';
    if (t.includes('upsc') || t.includes('cse')) return 'UPSC';
    if (t.includes('ssc') || t.includes('rrb') || t.includes('railway')) return 'SSC';
    if (t.includes('bank') || t.includes('ibps') || t.includes('sbi')) return 'Banking';
    return ''; // Default
  };

  const relevantCategory = user ? getRelevantCategory(user.examTarget) : '';

  // Filter Specialty Subjects
  const relevantSpecialties = STUDY_STRATEGY.integratedSyllabus.specialty.filter(
    item => relevantCategory === '' || item.exam.includes(relevantCategory)
  );

  // Fallback if no specific match, show all but maybe collapsed in real app, here show all if no match
  const displaySpecialties = relevantSpecialties.length > 0 ? relevantSpecialties : STUDY_STRATEGY.integratedSyllabus.specialty;

  // Filter Pro Tips
  const relevantTips = STUDY_STRATEGY.proTips.filter(
    item => relevantCategory === '' || item.type.includes(relevantCategory)
  );
  
  const displayTips = relevantTips.length > 0 ? relevantTips : STUDY_STRATEGY.proTips;


  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Strategic Study Planner</h1>
            <p className="text-gray-500 mt-2 text-lg">
                Targeting <span className="font-bold text-indigo-600 px-2 py-0.5 bg-indigo-50 rounded-lg border border-indigo-100">{user?.examTarget || 'General'}</span> using the <span className="font-semibold text-gray-700">7-2-1 Method</span>.
            </p>
        </div>
      </div>

      {/* Section 1: Integrated Syllabus Map */}
      <section>
        <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg"><Layers size={24} /></div>
            <h2 className="text-2xl font-bold text-gray-900">The "Integrated Syllabus" Map</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* The Core */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Layers size={120} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                    The Core (Common to All)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {STUDY_STRATEGY.integratedSyllabus.core.map((item, idx) => (
                        <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <h4 className="font-bold text-gray-900 mb-1">{item.subject}</h4>
                            <p className="text-sm text-gray-600">{item.detail}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* The Specialty */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Target size={120} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                    The Specialty (Target Specific)
                </h3>
                <div className="grid grid-cols-1 gap-3">
                    {displaySpecialties.map((item, idx) => (
                        <div key={idx} className="p-3 rounded-lg border bg-purple-50 border-purple-200 shadow-sm transition-all">
                            <div className="flex justify-between items-start">
                                <span className="font-bold text-gray-900 w-1/3">{item.exam}</span>
                                <span className="text-sm text-gray-600 w-2/3">{item.focus}</span>
                            </div>
                        </div>
                    ))}
                    {relevantSpecialties.length === 0 && (
                        <p className="text-sm text-gray-400 italic mt-2">
                            Select a specific exam target in Settings to see specialized topics.
                        </p>
                    )}
                </div>
            </div>
        </div>
      </section>

      {/* Section 2: 7-2-1 Daily Planner */}
      <section>
        <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg"><Clock size={24} /></div>
            <h2 className="text-2xl font-bold text-gray-900">Your Daily 7-2-1 Routine</h2>
        </div>

        <div className="space-y-6">
            {STUDY_STRATEGY.dailyRoutine.map((slot, idx) => (
                <div key={idx} className={`bg-white rounded-2xl border-l-8 shadow-sm overflow-hidden flex flex-col md:flex-row
                    ${slot.color === 'indigo' ? 'border-indigo-500' : slot.color === 'purple' ? 'border-purple-500' : 'border-green-500'}`}>
                    
                    {/* Slot Info */}
                    <div className={`p-6 md:w-64 flex-shrink-0 flex flex-col justify-center
                        ${slot.color === 'indigo' ? 'bg-indigo-50' : slot.color === 'purple' ? 'bg-purple-50' : 'bg-green-50'}`}>
                        <span className={`text-xs font-bold uppercase tracking-wider mb-1
                             ${slot.color === 'indigo' ? 'text-indigo-600' : slot.color === 'purple' ? 'text-purple-600' : 'text-green-600'}`}>
                            {slot.slot}
                        </span>
                        <h3 className="text-2xl font-bold text-gray-900">{slot.name}</h3>
                        <div className="flex items-center gap-2 mt-2 font-medium text-gray-600">
                            <Clock size={16} /> {slot.duration}
                        </div>
                    </div>

                    {/* Activities */}
                    <div className="p-6 flex-1 flex flex-col justify-center gap-3">
                        {slot.activities.map((act, i) => (
                            <div key={i} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="min-w-[120px] font-bold text-gray-700 flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${slot.color === 'indigo' ? 'bg-indigo-400' : slot.color === 'purple' ? 'bg-purple-400' : 'bg-green-400'}`}></div>
                                    {act.time}
                                </div>
                                <div className="text-gray-600 font-medium">{act.task}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* Section 3: Weekly Battle Plan & Pro Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Weekly Plan */}
        <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-100 text-orange-700 rounded-lg"><Calendar size={24} /></div>
                <h2 className="text-2xl font-bold text-gray-900">Weekly "Battle Plan"</h2>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-100">
                    {STUDY_STRATEGY.weeklyPlan.map((day, idx) => (
                        <div key={idx} className="p-6 flex items-start gap-4">
                            <div className="p-3 bg-gray-50 rounded-xl text-gray-500">
                                {day.icon === 'Calendar' && <Calendar size={24} />}
                                {day.icon === 'Wrench' && <Wrench size={24} />}
                                {day.icon === 'Trophy' && <Trophy size={24} />}
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-gray-900">{day.days}</h4>
                                <p className="text-gray-600 mt-1 font-medium">{day.focus}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Pro Tips */}
        <div className="lg:col-span-1">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-yellow-100 text-yellow-700 rounded-lg"><Zap size={24} /></div>
                <h2 className="text-2xl font-bold text-gray-900">Power Hub Tips</h2>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-lg p-6 text-white space-y-6">
                {displayTips.map((tip, idx) => (
                    <div key={idx} className="bg-white/10 rounded-xl p-4 border border-white/10 backdrop-blur-sm">
                        <div className="text-xs font-bold uppercase tracking-wider text-yellow-400 mb-2">
                            {tip.type}
                        </div>
                        <p className="font-medium leading-relaxed">
                            {tip.tip}
                        </p>
                    </div>
                ))}
                <div className="pt-4 border-t border-white/10 text-center">
                    <p className="text-sm text-gray-400 italic">"Consistency is the only cheat code."</p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};