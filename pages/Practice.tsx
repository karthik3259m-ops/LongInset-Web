import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { ArrowRight, CheckCircle, XCircle, HelpCircle, MessageSquare } from 'lucide-react';

export const Practice: React.FC = () => {
  const { activeQuestion, submitAnswer, nextQuestion, isExamMode, navigate } = useStore();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes per question default

  useEffect(() => {
    if (!isExamMode || !activeQuestion) {
      navigate('/');
    }
  }, [isExamMode, activeQuestion, navigate]);

  // Reset state when question changes
  useEffect(() => {
    setSelectedOption(null);
    setIsSubmitted(false);
    setIsCorrect(false);
    setTimeLeft(120);
  }, [activeQuestion]);

  // Timer
  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted]);

  const handleSubmit = () => {
    if (!selectedOption) return;
    const correct = submitAnswer(selectedOption);
    setIsCorrect(correct);
    setIsSubmitted(true);
  };

  const handleNext = () => {
    nextQuestion();
  };

  const navigateToAI = () => {
     navigate('/ai-tutor', { questionContext: activeQuestion });
  };

  if (!activeQuestion) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 h-full flex flex-col">
      {/* Header / Timer */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                {activeQuestion.type} Question
            </span>
            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase
                ${activeQuestion.difficulty === 'hard' ? 'bg-red-100 text-red-700' : 
                  activeQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                  'bg-green-100 text-green-700'}`}>
                {activeQuestion.difficulty}
            </span>
        </div>
        <div className={`font-mono text-xl font-bold ${timeLeft < 30 ? 'text-red-600' : 'text-gray-700'}`}>
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-10 flex-1">
        <p className="text-xl md:text-2xl font-medium text-gray-900 mb-8 leading-relaxed">
            {activeQuestion.text}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(activeQuestion.options).map(([key, value]) => {
                const isSelected = selectedOption === key;
                const showCorrect = isSubmitted && key === activeQuestion.correctOption;
                const showWrong = isSubmitted && isSelected && !isCorrect;
                const optionValue = value as string;

                return (
                    <button
                        key={key}
                        onClick={() => !isSubmitted && setSelectedOption(key)}
                        disabled={isSubmitted}
                        className={`p-4 rounded-xl border-2 text-left transition-all relative flex items-center justify-between
                            ${showCorrect ? 'border-green-500 bg-green-50' : 
                              showWrong ? 'border-red-500 bg-red-50' :
                              isSelected ? 'border-indigo-600 bg-indigo-50' : 
                              'border-gray-200 hover:border-gray-300'}`}
                    >
                        <div className="flex items-center gap-3">
                            <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm
                                ${showCorrect ? 'bg-green-200 text-green-800' :
                                  showWrong ? 'bg-red-200 text-red-800' :
                                  isSelected ? 'bg-indigo-600 text-white' : 
                                  'bg-gray-100 text-gray-600'}`}>
                                {key}
                            </span>
                            <span className="font-medium text-gray-700">{optionValue}</span>
                        </div>
                        {showCorrect && <CheckCircle className="text-green-600" size={20} />}
                        {showWrong && <XCircle className="text-red-600" size={20} />}
                    </button>
                );
            })}
        </div>

        {/* Explanation Section */}
        {isSubmitted && (
            <div className="mt-8 pt-8 border-t border-gray-100 animate-fade-in">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 mt-1">
                        <HelpCircle size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-2">Explanation</h4>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            {activeQuestion.explanation}
                        </p>
                        <button 
                            onClick={navigateToAI}
                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
                        >
                            <MessageSquare size={16} />
                            Still confused? Ask AI Tutor
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-6 flex justify-end">
        {!isSubmitted ? (
            <button
                onClick={handleSubmit}
                disabled={!selectedOption}
                className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                Submit Answer
            </button>
        ) : (
            <button
                onClick={handleNext}
                className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl shadow-lg hover:bg-black transition-all flex items-center gap-2"
            >
                Next Question <ArrowRight size={20} />
            </button>
        )}
      </div>
    </div>
  );
};