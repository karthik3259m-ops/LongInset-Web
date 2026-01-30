import React, { useState } from 'react';
import { GOVERNANCE_STRUCTURE, CAREER_GROUPS, STATE_EXAM_GROUPS, LEADERSHIP_DATA } from '../services/mockData';
import { supabase } from '../services/supabase';
import { CareerGroup } from '../types';
import { Landmark, Briefcase, ChevronRight, User, X, Search, FileText, Calendar, Building, MapPin, Target, Users, Crown, BookOpen, Lightbulb, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

type Tab = 'structure' | 'careers' | 'state-groups' | 'leadership';

interface ExamDetailData {
  exam_name: string;
  description: string;
  syllabus_highlights: string[];
  prep_tips: string[];
}

export const Governance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('structure');
  const [selectedGroup, setSelectedGroup] = useState<CareerGroup | null>(null);
  const [examSearch, setExamSearch] = useState('');
  
  // Exam Detail Modal State
  const [selectedExamDetail, setSelectedExamDetail] = useState<ExamDetailData | null>(null);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [isLoadingExam, setIsLoadingExam] = useState(false);

  const filteredExams = selectedGroup?.examsList.filter(exam => 
    exam.name.toLowerCase().includes(examSearch.toLowerCase()) || 
    exam.fullName.toLowerCase().includes(examSearch.toLowerCase())
  );

  const handleExamClick = async (examName: string) => {
    setIsLoadingExam(true);
    setIsExamModalOpen(true);
    setSelectedExamDetail(null); // Reset previous data

    try {
      // 1. Try to fetch from DB
      const { data: existingData } = await supabase
          .from('exam_details')
          .select('*')
          .ilike('exam_name', examName) // Flexible matching
          .maybeSingle();
      
      if (existingData) {
          setSelectedExamDetail(existingData);
      } else {
          // 2. Not found in DB? Generate with AI (Train the DB)
          console.log(`Exam '${examName}' not found in DB. Generating with AI...`);
          
          const apiKey = process.env.API_KEY;
          if (!apiKey) {
             // Fallback if no API key
             throw new Error("API Key missing");
          }

          const ai = new GoogleGenAI({ apiKey });
          const prompt = `
            You are an expert on Indian competitive exams.
            Generate a JSON object for the exam: "${examName}".
            Strictly follow this JSON schema:
            {
              "description": "A concise overview of the exam (max 50 words).",
              "syllabus_highlights": ["Topic 1", "Topic 2", "Topic 3", "Topic 4"],
              "prep_tips": ["Tip 1", "Tip 2", "Tip 3"]
            }
          `;

          const result = await ai.models.generateContent({
             model: 'gemini-2.5-flash-latest',
             contents: prompt,
             config: {
                responseMimeType: 'application/json'
             }
          });

          if (result.text) {
              const aiData = JSON.parse(result.text);
              const newExamEntry = {
                  exam_name: examName,
                  description: aiData.description,
                  syllabus_highlights: aiData.syllabus_highlights,
                  prep_tips: aiData.prep_tips
              };

              // 3. Update/Train the DB
              const { data: insertedData, error: insertError } = await supabase
                  .from('exam_details')
                  .insert([newExamEntry])
                  .select()
                  .single();
              
              if (insertedData && !insertError) {
                  setSelectedExamDetail(insertedData);
              } else {
                  console.warn("Could not cache to DB, showing AI data directly:", insertError);
                  setSelectedExamDetail(newExamEntry);
              }
          } else {
              throw new Error("AI returned empty response");
          }
      }
    } catch (err) {
      console.error("Failed to fetch/generate exam details:", err);
      // Fallback UI
      setSelectedExamDetail({
          exam_name: examName,
          description: "Detailed information for this exam is currently unavailable. Please try again later.",
          syllabus_highlights: [],
          prep_tips: []
      });
    } finally {
      setIsLoadingExam(false);
    }
  };

  const getDifficultyColor = (diff?: string) => {
    switch(diff) {
        case 'Hard': return 'bg-red-100 text-red-700 border-red-200';
        case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case 'Easy': return 'bg-green-100 text-green-700 border-green-200';
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Governance & Career Paths</h1>
        <p className="text-gray-500 mt-1">Explore the administrative structure, exams, and leadership of India.</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
        <button
            onClick={() => setActiveTab('structure')}
            className={`pb-4 px-6 font-medium text-sm whitespace-nowrap transition-colors relative ${
                activeTab === 'structure' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
            }`}
        >
            <div className="flex items-center gap-2">
                <Landmark size={18} /> Administrative Structure
            </div>
        </button>
        <button
            onClick={() => setActiveTab('careers')}
            className={`pb-4 px-6 font-medium text-sm whitespace-nowrap transition-colors relative ${
                activeTab === 'careers' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
            }`}
        >
             <div className="flex items-center gap-2">
                <Briefcase size={18} /> Central Exams (UPSC/SSC)
            </div>
        </button>
        <button
            onClick={() => setActiveTab('state-groups')}
            className={`pb-4 px-6 font-medium text-sm whitespace-nowrap transition-colors relative ${
                activeTab === 'state-groups' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
            }`}
        >
             <div className="flex items-center gap-2">
                <Users size={18} /> State Groups (1-4)
            </div>
        </button>
        <button
            onClick={() => setActiveTab('leadership')}
            className={`pb-4 px-6 font-medium text-sm whitespace-nowrap transition-colors relative ${
                activeTab === 'leadership' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'
            }`}
        >
             <div className="flex items-center gap-2">
                <Crown size={18} /> Leaders (CM/Gov)
            </div>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'structure' && (
          <div className="max-w-5xl animate-fade-in">
             <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-8">
                 <h3 className="font-bold text-indigo-900 mb-2">Did you know?</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="text-xl font-bold text-indigo-600">28 / 8</div>
                        <div className="text-xs text-gray-500">States / UTs</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="text-xl font-bold text-indigo-600">780+</div>
                        <div className="text-xs text-gray-500">Districts</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="text-xl font-bold text-indigo-600">6,600+</div>
                        <div className="text-xs text-gray-500">Blocks</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="text-xl font-bold text-indigo-600">6.4L+</div>
                        <div className="text-xs text-gray-500">Villages</div>
                    </div>
                 </div>
             </div>

             <div className="relative border-l-2 border-indigo-100 pl-8 ml-4 space-y-8">
                {GOVERNANCE_STRUCTURE.map((item, index) => (
                    <div key={index} className="relative group">
                        <div className="absolute -left-[41px] top-1 w-6 h-6 rounded-full bg-white border-4 border-indigo-500 z-10"></div>
                        
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{item.level}</h3>
                                    <p className="text-indigo-600 font-medium text-sm">{item.hindiName}</p>
                                </div>
                                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded font-medium">
                                    Count: {item.count}
                                </span>
                            </div>
                            
                            <p className="text-gray-600 text-sm mb-4 border-b border-gray-100 pb-4">{item.description}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Briefcase size={16} /></div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold">Admin Head</p>
                                        <p className="font-medium text-gray-900">{item.adminHead}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><User size={16} /></div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold">Political Head</p>
                                        <p className="font-medium text-gray-900">{item.politicalHead}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
             </div>
          </div>
      )}

      {activeTab === 'careers' && (
          <div className="grid grid-cols-1 gap-6 animate-fade-in">
              {CAREER_GROUPS.map((group, index) => (
                  <div 
                    key={index} 
                    onClick={() => setSelectedGroup(group)}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer group"
                  >
                      <div className="p-6">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                              <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-indigo-50 group-hover:bg-indigo-100 transition-colors rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg">
                                      {group.name.substring(0, 1)}
                                  </div>
                                  <div>
                                      <h3 className="text-xl font-bold text-gray-900">{group.name}</h3>
                                      <p className="text-sm text-gray-500 font-medium">{group.fullForm}</p>
                                  </div>
                              </div>
                              <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100 self-start">
                                  {group.authorityLevel.split(' - ')[0]}
                              </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 bg-gray-50 rounded-xl p-5 border border-gray-100">
                              <div>
                                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                                      <Briefcase size={12} /> Target Roles
                                  </h4>
                                  <p className="text-gray-900 font-medium text-sm leading-relaxed line-clamp-2">{group.positions}</p>
                              </div>
                              <div className="flex items-end justify-between">
                                  <div>
                                     <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                                        <MapPin size={12} /> Posting Level
                                     </h4>
                                     <p className="text-indigo-600 font-medium text-sm">{group.postingLevel}</p>
                                  </div>
                                  <div className="text-indigo-600 bg-white p-2 rounded-full shadow-sm"><ChevronRight size={16} /></div>
                              </div>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      )}

      {activeTab === 'state-groups' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              {STATE_EXAM_GROUPS.map((group, idx) => (
                  <div key={idx} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col h-full hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-bold text-gray-900">{group.name}</h3>
                          <div className="flex gap-2">
                             <span className={`text-xs font-bold px-2 py-1 rounded border ${getDifficultyColor(group.difficulty)}`}>{group.difficulty}</span>
                             <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-1 rounded">{group.label}</span>
                          </div>
                      </div>
                      <p className="text-sm text-gray-500 mb-6 flex-1">{group.description}</p>
                      
                      <div className="space-y-4 text-sm">
                          <div className="flex gap-3">
                              <Briefcase size={16} className="text-gray-400 shrink-0 mt-0.5" />
                              <div>
                                  <span className="block font-bold text-gray-700">Positions</span>
                                  <span className="text-gray-600">{group.positions}</span>
                              </div>
                          </div>
                          <div className="flex gap-3">
                              <Target size={16} className="text-gray-400 shrink-0 mt-0.5" />
                              <div>
                                  <span className="block font-bold text-gray-700">Selection</span>
                                  <span className="text-gray-600">{group.selection}</span>
                              </div>
                          </div>
                           <div className="flex gap-3">
                              <Crown size={16} className="text-gray-400 shrink-0 mt-0.5" />
                              <div>
                                  <span className="block font-bold text-gray-700">Authority</span>
                                  <span className="text-gray-600">{group.authority}</span>
                              </div>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      )}

      {activeTab === 'leadership' && (
          <div className="animate-fade-in space-y-8">
             <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                <h4 className="font-bold text-yellow-800 mb-1">Current Updates (2026)</h4>
                <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                    <li><strong>Manipur:</strong> Under President's Rule.</li>
                    <li><strong>Female CMs:</strong> Only Mamata Banerjee (WB) and Rekha Gupta (Delhi).</li>
                    <li><strong>Maharashtra:</strong> Deputy CM post in transition.</li>
                </ul>
             </div>

             <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-bold text-gray-900">State Leadership (CM & Governor)</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-600 font-bold">
                            <tr>
                                <th className="px-6 py-3">State</th>
                                <th className="px-6 py-3">Chief Minister</th>
                                <th className="px-6 py-3">Governor</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {LEADERSHIP_DATA.states.map((s, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="px-6 py-3 font-medium text-gray-900">{s.state}</td>
                                    <td className="px-6 py-3 text-indigo-700 font-medium">{s.cm}</td>
                                    <td className="px-6 py-3 text-gray-600">{s.gov}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             </div>

             <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-bold text-gray-900">Union Territories (UTs)</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-600 font-bold">
                            <tr>
                                <th className="px-6 py-3">Union Territory</th>
                                <th className="px-6 py-3">Chief Minister / Head</th>
                                <th className="px-6 py-3">Governor / Administrator</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                             {LEADERSHIP_DATA.uts.map((u, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="px-6 py-3 font-medium text-gray-900">{u.ut}</td>
                                    <td className="px-6 py-3 text-indigo-700 font-medium">{u.head}</td>
                                    <td className="px-6 py-3 text-gray-600">{u.admin}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             </div>
          </div>
      )}

      {/* Detail Modal for Central Careers (Group Level) */}
      {selectedGroup && !isExamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
           <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-xl flex flex-col overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-indigo-600 text-white">
                 <div>
                    <h2 className="text-2xl font-bold">{selectedGroup.name}</h2>
                    <p className="text-indigo-100 text-sm mt-1">{selectedGroup.fullForm}</p>
                 </div>
                 <button 
                    onClick={() => { setSelectedGroup(null); setExamSearch(''); }}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                 >
                    <X size={24} />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                 <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">Overview</h3>
                    <p className="text-gray-600 leading-relaxed">{selectedGroup.description}</p>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                         <div className="bg-gray-50 p-4 rounded-lg">
                            <span className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                                <Target size={12} /> Goal / Career
                            </span>
                            <span className="font-medium text-gray-900">{selectedGroup.goal}</span>
                         </div>
                         <div className="bg-gray-50 p-4 rounded-lg">
                            <span className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                                <Briefcase size={12} /> Positions
                            </span>
                            <span className="font-medium text-gray-900">{selectedGroup.positions}</span>
                         </div>
                         <div className="bg-gray-50 p-4 rounded-lg">
                            <span className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1">
                                <Landmark size={12} /> Authority
                            </span>
                            <span className="font-medium text-gray-900">{selectedGroup.authorityLevel}</span>
                         </div>
                    </div>
                 </div>

                 <div>
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                       <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                          <Calendar size={20} className="text-indigo-600"/> Exam Calendar
                       </h3>
                       <div className="relative w-full sm:w-auto">
                          <input 
                             type="text" 
                             placeholder="Search exams..." 
                             className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 w-full"
                             value={examSearch}
                             onChange={(e) => setExamSearch(e.target.value)}
                          />
                          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                       </div>
                    </div>

                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                       <table className="w-full text-sm text-left">
                          <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                             <tr>
                                <th className="px-4 py-3">Exam</th>
                                <th className="px-4 py-3 hidden sm:table-cell">Difficulty</th>
                                <th className="px-4 py-3 hidden sm:table-cell">Target Roles</th>
                                <th className="px-4 py-3">Tentative Date</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                             {filteredExams && filteredExams.length > 0 ? (
                                filteredExams.map((exam, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleExamClick(exam.name)}>
                                        <td className="px-4 py-3">
                                            <div className="font-bold text-indigo-600 hover:text-indigo-800">{exam.name}</div>
                                            <div className="text-xs text-gray-500 sm:hidden">{exam.fullName}</div>
                                        </td>
                                        <td className="px-4 py-3 hidden sm:table-cell">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${getDifficultyColor(exam.difficulty)}`}>
                                                {exam.difficulty}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{exam.roles}</td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {exam.tentativeDate}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                             ) : (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                                        No exams found matching "{examSearch}"
                                    </td>
                                </tr>
                             )}
                          </tbody>
                       </table>
                    </div>
                 </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-3">
                 <button className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-sm">
                    <FileText size={20} />
                    Download Syllabus PDF
                 </button>
                 <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 px-4 rounded-xl transition-colors">
                     <Building size={20} />
                     Visit Official Website
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Nested Modal for Exam Details (DB Powered) */}
      {isExamModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[85vh]">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-900 text-white">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <BookOpen size={20} className="text-indigo-400" />
                        {selectedExamDetail ? selectedExamDetail.exam_name : 'Loading...'}
                    </h2>
                    <button 
                        onClick={() => setIsExamModalOpen(false)}
                        className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoadingExam ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            <div className="flex flex-col items-center">
                                <p className="text-gray-900 font-bold animate-pulse">Consulting AI Knowledge Base...</p>
                                <p className="text-xs text-gray-500 mt-1">Generating & Caching Study Plan</p>
                            </div>
                        </div>
                    ) : selectedExamDetail ? (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Description</h3>
                                <p className="text-gray-700 leading-relaxed text-sm">
                                    {selectedExamDetail.description}
                                </p>
                            </div>

                            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                                <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                                    <FileText size={16} /> Syllabus Highlights
                                </h3>
                                <ul className="space-y-2">
                                    {selectedExamDetail.syllabus_highlights?.length > 0 ? (
                                        selectedExamDetail.syllabus_highlights.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-indigo-800">
                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0"></span>
                                                {item}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-sm text-indigo-400 italic">No highlights available</li>
                                    )}
                                </ul>
                            </div>

                            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                                <h3 className="text-sm font-bold text-yellow-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                                    <Lightbulb size={16} /> Preparation Tips
                                </h3>
                                <ul className="space-y-2">
                                    {selectedExamDetail.prep_tips?.length > 0 ? (
                                        selectedExamDetail.prep_tips.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-yellow-900">
                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-yellow-600 flex-shrink-0"></span>
                                                {item}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-sm text-yellow-600 italic">No tips available</li>
                                    )}
                                </ul>
                            </div>
                            
                            <div className="flex items-center gap-2 justify-center pt-2">
                                <Sparkles size={14} className="text-indigo-400" />
                                <span className="text-xs text-indigo-400 font-medium">Powered by Gemini AI & ExamGPS DB</span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                            Failed to load data. Please try again.
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50 text-right">
                    <button 
                        onClick={() => setIsExamModalOpen(false)}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg text-sm transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
          </div>
      )}
    </div>
  );
};