import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { ChatMessage, Question } from '../types';
import { Send, Bot, User, Sparkles, AlertCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export const AiTutor: React.FC = () => {
  const { currentRoute, user, mastery } = useStore();
  const contextQuestion = currentRoute.state?.questionContext as Question | undefined;
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize Chat
  useEffect(() => {
    const weakSpots = mastery.filter(t => t.isWeakSpot).map(t => t.topicName).join(', ');
    const mastered = mastery.filter(t => t.masteryLevel === 'mastered').map(t => t.topicName).join(', ');

    const initialGreeting = contextQuestion 
        ? `Hello ${user?.name.split(' ')[0]}! I see you're working on a **${contextQuestion.difficulty}** question about **${contextQuestion.topicId === 't1' ? 'Thermodynamics' : 'Physics'}**. Specifically: *"${contextQuestion.text.substring(0, 50)}..."*\n\nHow can I help you break this down?`
        : `Hi ${user?.name.split(' ')[0]}! I'm your AI Coach for **${user?.examTarget}**.\n\nI see you're doing great in **${mastered || 'some topics'}**, but we might need to focus on **${weakSpots || 'your next milestone'}**.\n\nWhat are we studying today?`;

    setMessages([
        {
            id: 'init',
            role: 'assistant',
            content: initialGreeting,
            timestamp: new Date()
        }
    ]);
  }, [user, contextQuestion, mastery]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setError(null);

    try {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            throw new Error("API Key not found. Please check configuration.");
        }

        const ai = new GoogleGenAI({ apiKey });
        
        // Build System Context
        const weakSpots = mastery.filter(t => t.isWeakSpot).map(t => t.topicName).join(', ');
        const systemPrompt = `
            You are an elite exam preparation coach specializing in ${user?.examTarget}. 
            User Profile:
            - Name: ${user?.name}
            - Target Exam: ${user?.examTarget} (Assume standard syllabus for this exam).
            - Current Weak Areas: ${weakSpots || "None detected yet"}.
            - Current Streak: ${user?.streak} days.
            
            Guidelines:
            1. Be encouraging but direct. Focus on high-yield concepts.
            2. If the user asks about a specific question, explain the underlying concept first, then the solution.
            3. Keep responses concise and mobile-friendly (short paragraphs, bullet points).
            4. Use bolding for key terms.
            5. If they are struggling with a weak spot, offer a specific mnemonic or shortcut.
            ${contextQuestion ? `Current Context Question: ${JSON.stringify(contextQuestion)}` : ''}
        `;

        // We use generateContent for a single turn response here to keep it simple and stateless for this demo,
        // but passing previous history would be better for full chat. 
        // For this implementation, we will pass the last few messages as context manually.
        const recentHistory = messages.slice(-4).map(m => `${m.role === 'user' ? 'User' : 'Coach'}: ${m.content}`).join('\n');
        const fullPrompt = `${systemPrompt}\n\nRecent Conversation:\n${recentHistory}\nUser: ${input}\nCoach:`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-latest',
            contents: fullPrompt,
        });

        const aiText = response.text;

        const aiResponse: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: aiText || "I'm having trouble connecting to my knowledge base right now. Let's try again.",
            timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);

    } catch (err: any) {
        console.error("AI Error:", err);
        setError("I'm having trouble connecting right now. Please check your internet or try again later.");
        // Add a visual error message to chat
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'assistant',
            content: "⚠️ *Connection Error:* I couldn't reach the server. Please try again.",
            timestamp: new Date()
        }]);
    } finally {
        setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] md:h-screen bg-white">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white z-10 shadow-sm">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-lg text-white shadow-indigo-200">
                <Sparkles size={20} />
            </div>
            <div>
                <h2 className="font-bold text-gray-900 leading-tight">AI Coach</h2>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    Gemini 2.5 Flash • {user?.examTarget}
                </p>
            </div>
        </div>
      </div>

      {/* Context Banner */}
      {contextQuestion && (
         <div className="bg-indigo-50 p-3 border-b border-indigo-100 flex justify-between items-center px-4 md:px-6">
            <p className="text-xs md:text-sm text-indigo-800 truncate max-w-2xl font-medium">
                <span className="font-bold bg-indigo-100 px-1.5 py-0.5 rounded text-indigo-900 mr-2">Context</span> 
                {contextQuestion.text}
            </p>
         </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 md:space-y-6 bg-gray-50 scroll-smooth">
        {messages.map((msg) => (
            <div 
                key={msg.id} 
                className={`flex gap-3 md:gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm
                    ${msg.role === 'assistant' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-600'}`}>
                    {msg.role === 'assistant' ? <Bot size={18} /> : <User size={18} />}
                </div>
                
                <div className={`max-w-[85%] md:max-w-[80%] rounded-2xl p-3 md:p-4 shadow-sm whitespace-pre-wrap text-sm md:text-base leading-relaxed
                    ${msg.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'}`}>
                    {msg.content}
                    <span className={`text-[10px] block mt-1.5 opacity-70 text-right ${msg.role === 'user' ? 'text-indigo-200' : 'text-gray-400'}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>
        ))}
        
        {isTyping && (
            <div className="flex gap-4 animate-fade-in">
                 <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
                    <Bot size={18} />
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-2 h-10 md:h-auto">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 md:p-4 bg-white border-t border-gray-200 pb-safe-area">
        <div className="max-w-4xl mx-auto relative">
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask your coach anything..."
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-3 pr-12 resize-none scrollbar-hide focus:outline-none transition-all shadow-inner"
                rows={1}
                style={{ minHeight: '48px', maxHeight: '120px' }}
            />
            <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="absolute right-2 bottom-1.5 p-2 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:shadow-none"
            >
                <Send size={18} />
            </button>
        </div>
      </div>
    </div>
  );
};