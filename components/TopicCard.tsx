import React from 'react';
import { PriorityLabel, TopicMastery } from '../types';
import { AlertTriangle, TrendingUp, Target } from 'lucide-react';

interface TopicCardProps {
  topic: TopicMastery;
  onPractice: (id: string) => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({ topic, onPractice }) => {
  const getPriorityColor = (label: PriorityLabel) => {
    switch (label) {
      case PriorityLabel.Critical: return 'bg-red-100 text-red-800 border-red-200';
      case PriorityLabel.High: return 'bg-orange-100 text-orange-800 border-orange-200';
      case PriorityLabel.Medium: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case PriorityLabel.Low: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">{topic.topicName}</h3>
          <div className="flex items-center gap-2 mt-1">
             <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${getPriorityColor(topic.priorityLabel)}`}>
               {topic.priorityLabel} Priority
             </span>
             {topic.isWeakSpot && (
               <span className="flex items-center gap-1 text-xs text-red-600 font-medium">
                 <AlertTriangle size={12} />
                 Weak Spot
               </span>
             )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{topic.accuracy}%</div>
          <div className="text-xs text-gray-500">Accuracy</div>
        </div>
      </div>

      <div className="space-y-3 mb-5">
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${topic.accuracy < 50 ? 'bg-red-500' : topic.accuracy < 80 ? 'bg-yellow-500' : 'bg-green-500'}`} 
            style={{ width: `${topic.accuracy}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
           <span className="flex items-center gap-1"><Target size={14} /> Score: {topic.priorityScore}</span>
           <span className="flex items-center gap-1"><TrendingUp size={14} /> {topic.questionsAttempted} Qs</span>
        </div>
      </div>

      <button 
        onClick={() => onPractice(topic.topicId)}
        className="w-full py-2.5 bg-indigo-50 text-indigo-600 font-medium rounded-lg hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
      >
        Practice Now
      </button>
    </div>
  );
};