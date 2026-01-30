import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { User, Save, CheckCircle, Target, Mail } from 'lucide-react';

export const Settings: React.FC = () => {
  const { user, updateProfile } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    examTarget: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        examTarget: user.examTarget
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (successMessage) setSuccessMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const success = await updateProfile({
      name: formData.name,
      examTarget: formData.examTarget
    });

    setIsSaving(false);
    if (success) {
      setSuccessMessage('Settings updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const examOptions = [
    'JEE Main 2025',
    'JEE Advanced 2025',
    'NEET 2025',
    'BITSAT 2025',
    'GATE 2025',
    'UPSC CSE 2025',
    'CAT 2025',
    'Other'
  ];

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-500">Manage your profile and exam preferences.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="font-semibold text-gray-700 flex items-center gap-2">
            <User size={20} />
            Profile Information
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                />
                <Mail className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <p className="mt-1 text-xs text-gray-400">Email cannot be changed.</p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
             <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Target className="text-indigo-600" size={20} />
                Exam Preferences
             </h3>
             
             <div>
              <label htmlFor="examTarget" className="block text-sm font-medium text-gray-700 mb-1">
                Target Exam
              </label>
              <div className="relative">
                <select
                    id="examTarget"
                    name="examTarget"
                    value={formData.examTarget}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-indigo-100 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 bg-indigo-50/50 text-indigo-900 font-bold appearance-none cursor-pointer transition-all hover:bg-indigo-50"
                >
                    {examOptions.map(opt => (
                    <option key={opt} value={opt} className="text-gray-900 font-normal">{opt}</option>
                    ))}
                    {!examOptions.includes(formData.examTarget) && formData.examTarget && (
                    <option value={formData.examTarget} className="text-gray-900 font-normal">{formData.examTarget}</option>
                    )}
                </select>
                <div className="absolute right-4 top-3.5 pointer-events-none text-indigo-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500 flex items-center gap-1">
                <Target size={14} className="text-indigo-500"/>
                Changing this will update your <span className="font-semibold text-indigo-600">AI Tutor's context</span> and study roadmap.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4">
             {successMessage && (
               <div className="flex items-center gap-2 text-green-600 font-medium animate-fade-in text-sm">
                 <CheckCircle size={18} />
                 {successMessage}
               </div>
             )}
             
             <button
               type="submit"
               disabled={isSaving}
               className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm shadow-indigo-200 w-full md:w-auto justify-center"
             >
               {isSaving ? (
                 <>Saving...</>
               ) : (
                 <>
                   <Save size={18} />
                   Save Changes
                 </>
               )}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};