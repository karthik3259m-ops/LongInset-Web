import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { PastPaper } from '../types';
import { Download, Eye, FileText, Filter, Printer, Search, Calendar, ChevronDown, ChevronUp, X, Share2, Loader2 } from 'lucide-react';
import { useStore } from '../store/useStore';

export const PastPapers: React.FC = () => {
  const { user } = useStore();
  
  // Data State
  const [papers, setPapers] = useState<PastPaper[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter State
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedShift, setSelectedShift] = useState('All');
  const [selectedExam, setSelectedExam] = useState('All');
  const [selectedDate, setSelectedDate] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false); // Mobile filter toggle

  // Print Preview State
  const [previewPaper, setPreviewPaper] = useState<PastPaper | null>(null);

  // Initial Data Fetch & Seed
  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('past_papers').select('*');
      
      if (!error && data && data.length > 0) {
        setPapers(data);
      } else {
        // --- SEED DATA LOGIC (Moving from mockData to DB) ---
        console.log("Seeding database with initial past papers...");
        const shifts = ['Morning (9AM - 12PM)', 'Evening (3PM - 6PM)'];
        const years = Array.from({length: 15}, (_, i) => 2024 - i);
        
        const seedData = years.flatMap(year => 
          [1, 2].map(shiftNum => ({
            year: year,
            exam: 'JEE Main', 
            shift: `Shift ${shiftNum}`,
            date: `Jan ${24 + shiftNum}, ${year}`,
            time: shifts[shiftNum - 1],
            download_url: '#'
          }))
        );

        const { data: newData, error: seedError } = await supabase
            .from('past_papers')
            .insert(seedData)
            .select();
        
        if (newData && !seedError) {
            setPapers(newData);
        } else {
            console.error("Failed to seed data:", seedError);
        }
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Derived Filters
  const uniqueExams = ['All', ...Array.from(new Set(papers.map(p => p.exam)))];
  const uniqueYears = ['All', ...Array.from(new Set(papers.map(p => p.year))).sort((a,b) => Number(b) - Number(a))];
  const uniqueDates = ['All', ...Array.from(new Set(papers.map(p => p.date)))];
  const uniqueShifts = ['All', ...Array.from(new Set(papers.map(p => p.shift)))];

  // Filtering Logic
  const filteredPapers = papers.filter(paper => {
    const yearMatch = selectedYear === 'All' || paper.year.toString() === selectedYear.toString();
    const shiftMatch = selectedShift === 'All' || paper.shift === selectedShift;
    const examMatch = selectedExam === 'All' || paper.exam === selectedExam;
    const dateMatch = selectedDate === 'All' || paper.date === selectedDate;
    
    const searchLower = searchQuery.toLowerCase();
    const searchMatch = 
        searchQuery === '' ||
        paper.exam.toLowerCase().includes(searchLower) ||
        paper.date.toLowerCase().includes(searchLower) ||
        paper.shift.toLowerCase().includes(searchLower);

    return yearMatch && shiftMatch && examMatch && dateMatch && searchMatch;
  });

  const handlePrintPreview = (paper: PastPaper) => {
    setPreviewPaper(paper);
    // Add specific print styles dynamically if needed, 
    // but we'll rely on Tailwind 'print:' classes in the render method.
  };

  const executePrint = () => {
    window.print();
  };

  return (
    <>
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-container, .print-container * {
              visibility: visible;
            }
            .print-container {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              margin: 0;
              padding: 0;
              background: white;
            }
            /* Ensure watermark is visible */
            .watermark {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            @page {
                margin: 20mm;
            }
          }
        `}
      </style>

      {/* Main UI (Hidden during print) */}
      <div className="p-4 md:p-8 pb-24 md:pb-8 print:hidden">
        <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Past Year Papers</h1>
            <p className="text-gray-500 mt-1 text-sm md:text-base">
                Repository of <span className="font-semibold text-indigo-600">{papers.length || '...'}</span> verified papers with solutions.
            </p>
        </div>

        {/* Search & Mobile Filter Toggle */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search by exam, date, or shift..."
                    className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <button 
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-xl font-medium text-gray-700 shadow-sm active:bg-gray-50 transition-colors"
            >
                <Filter size={18} />
                Filters
                {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
        </div>

        {/* Filters Section */}
        <div className={`bg-white p-4 md:p-5 rounded-xl border border-gray-200 shadow-sm mb-6 transition-all duration-300 ease-in-out overflow-hidden
            ${showFilters ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 md:max-h-none md:opacity-100 p-0 md:p-5 border-0 md:border'}`}>
            <div className="flex items-center gap-2 text-gray-800 font-bold mb-4">
                <Filter size={18} className="text-indigo-600" />
                <span>Refine Results</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Exam</label>
                    <div className="relative">
                        <select 
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                            value={selectedExam}
                            onChange={(e) => setSelectedExam(e.target.value)}
                        >
                            {uniqueExams.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Year</label>
                    <div className="relative">
                        <select 
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                        >
                            {uniqueYears.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Date</label>
                    <div className="relative">
                        <select 
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        >
                            {uniqueDates.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Shift</label>
                    <div className="relative">
                        <select 
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                            value={selectedShift}
                            onChange={(e) => setSelectedShift(e.target.value)}
                        >
                            {uniqueShifts.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>

        {/* Papers Grid */}
        {loading ? (
             <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 size={40} className="text-indigo-600 animate-spin" />
                <p className="text-gray-500 font-medium">Loading repository...</p>
             </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {filteredPapers.length > 0 ? (
                    filteredPapers.map((paper) => (
                        <div key={paper.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-5 flex flex-col justify-between group">
                            <div className="relative overflow-hidden">
                                <div className="absolute top-0 right-0 -mr-4 -mt-4 w-20 h-20 bg-indigo-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className="p-2.5 bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 text-indigo-600 rounded-xl shadow-sm">
                                        <FileText size={24} />
                                    </div>
                                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-md uppercase border border-gray-200">
                                        {paper.year}
                                    </span>
                                </div>
                                <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1" title={paper.exam}>{paper.exam}</h3>
                                <p className="text-indigo-600 text-sm font-medium mb-4">{paper.shift}</p>
                                
                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-6 border-t border-gray-100 pt-3">
                                    <span className="flex items-center gap-1.5">
                                        <Calendar size={14} /> {paper.date}
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                    <span>{paper.time.split('(')[0]}</span>
                                </div>
                            </div>
                            
                            <div className="flex gap-3 mt-auto">
                                <button 
                                    onClick={() => handlePrintPreview(paper)}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400 transition-all text-sm shadow-sm"
                                >
                                    <Printer size={16} />
                                    PDF
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 hover:shadow-md transition-all text-sm shadow-sm">
                                    <Eye size={16} />
                                    View
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-16 text-center text-gray-500 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                        <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
                            <Search size={24} />
                        </div>
                        <p className="text-lg font-bold text-gray-900">No papers found</p>
                        <p className="text-sm mt-1 max-w-xs mx-auto">Try adjusting your filters or search query to find what you're looking for.</p>
                        <button 
                            onClick={() => {
                                setSelectedExam('All');
                                setSelectedYear('All');
                                setSelectedDate('All');
                                setSelectedShift('All');
                                setSearchQuery('');
                            }}
                            className="mt-4 text-indigo-600 font-semibold text-sm hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        )}
      </div>

      {/* Print Preview Modal */}
      {previewPaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-black/70 backdrop-blur-sm print:bg-white print:p-0 print:static">
           <div className="bg-white w-full h-full md:h-auto md:max-w-4xl md:rounded-2xl shadow-2xl flex flex-col print:shadow-none print:w-full print:max-w-none print:h-auto print:rounded-none overflow-hidden print-container">
              
              {/* Modal Header - Hide on Print */}
              <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 print:hidden">
                 <h2 className="font-bold text-gray-800 flex items-center gap-2">
                    <Printer size={20} className="text-indigo-600" /> Print Preview
                 </h2>
                 <div className="flex gap-2">
                    <button 
                        onClick={executePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <Printer size={16} /> Print Now
                    </button>
                    <button 
                        onClick={() => setPreviewPaper(null)}
                        className="p-2 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                 </div>
              </div>

              {/* Printable Content */}
              <div className="flex-1 overflow-y-auto p-8 md:p-12 relative bg-white min-h-[80vh]">
                 {/* Watermark */}
                 <div className="fixed inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden watermark">
                    <div className="transform -rotate-45 text-gray-100 text-[10vw] md:text-[6rem] font-black whitespace-nowrap opacity-40">
                       ExamGPS OFFICIAL
                    </div>
                 </div>
                 
                 {/* Paper Content */}
                 <div className="relative z-10 max-w-3xl mx-auto border-2 border-gray-900 p-8 min-h-[1000px]">
                    <div className="text-center border-b-2 border-gray-900 pb-6 mb-8">
                        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-wide mb-2">
                            {previewPaper.exam}
                        </h1>
                        <p className="text-xl font-bold text-gray-700 mb-1">{previewPaper.year} Examination</p>
                        <div className="flex justify-center gap-4 text-sm font-mono text-gray-600 mt-2">
                            <span className="border border-gray-400 px-2 py-1">{previewPaper.shift}</span>
                            <span className="border border-gray-400 px-2 py-1">{previewPaper.date}</span>
                            <span className="border border-gray-400 px-2 py-1">Code: {previewPaper.id.split('-')[0].toUpperCase()}</span>
                        </div>
                    </div>

                    <div className="space-y-8 font-serif">
                        <div className="bg-gray-50 p-4 border border-gray-200 text-sm mb-8 italic text-center">
                            This document is generated by ExamGPS for study purposes only. 
                            Contains verifiable questions and official answer keys.
                        </div>

                        {/* Mock Questions for Preview */}
                        <div className="space-y-6">
                            {[1, 2, 3].map((num) => (
                                <div key={num} className="break-inside-avoid">
                                    <div className="flex gap-3">
                                        <span className="font-bold text-lg">Q{num}.</span>
                                        <div className="space-y-3 flex-1">
                                            <p className="text-lg leading-relaxed">
                                                Sample question content placeholder. In a real scenario, the full question text from the database would appear here, formatted specifically for printing.
                                            </p>
                                            <div className="grid grid-cols-2 gap-4 text-base ml-2">
                                                <div>(A) Option One</div>
                                                <div>(B) Option Two</div>
                                                <div>(C) Option Three</div>
                                                <div>(D) Option Four</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 pt-8 border-t border-gray-300 text-center text-xs text-gray-500">
                            Page 1 of 12 • Generated via ExamGPS Portal • {new Date().toLocaleDateString()}
                        </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </>
  );
};