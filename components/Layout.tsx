import React from 'react';
import { BookOpen, LayoutDashboard, LineChart, LogOut, MessageSquare, Settings, FileText, Landmark, User as UserIcon, Github, Linkedin, Code } from 'lucide-react';
import { useStore } from '../store/useStore';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentRoute, navigate, logout, isAuthenticated, user } = useStore();

  // If not authenticated or on auth pages, render just the children
  if (!isAuthenticated || ['/login', '/register', '/forgot-password', '/update-password'].includes(currentRoute.path)) {
    return <>{children}</>;
  }

  const navItems = [
    { icon: LayoutDashboard, label: 'Home', path: '/' },
    { icon: BookOpen, label: 'Practice', path: '/practice' },
    { icon: LineChart, label: 'Plan', path: '/plan' },
    { icon: MessageSquare, label: 'AI Coach', path: '/ai-tutor' },
  ];

  const secondaryNavItems = [
    { icon: FileText, label: 'Past Papers', path: '/past-papers' },
    { icon: Landmark, label: 'Governance', path: '/governance' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 shadow-sm z-10">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 text-indigo-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xl font-bold tracking-tight">LongInset</span>
          </div>
        </div>

        <div className="px-6 py-4">
             <div className="text-sm font-medium text-gray-500">Signed in as</div>
             <div className="text-sm font-bold text-gray-900 truncate">{user?.name}</div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {[...navItems, ...secondaryNavItems].map((item) => {
            const isActive = currentRoute.path === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-1">
          <button
            onClick={() => navigate('/settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                currentRoute.path === '/settings' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Settings size={20} />
            Settings
          </button>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>

        {/* Developer Credit */}
        <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col gap-2">
                <div className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                    <Code size={12} /> Developed by
                </div>
                <div className="font-bold text-gray-800 text-sm">Keyan Groups</div>
                <div className="flex gap-3 mt-1">
                    <a href="https://github.com/KarthikeyanS2006" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors">
                        <Github size={16} />
                    </a>
                    <a href="https://www.linkedin.com/in/karthikeyans2006/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                        <Linkedin size={16} />
                    </a>
                </div>
            </div>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-20 px-4 h-16 flex items-center justify-between shadow-sm">
         <div className="flex items-center gap-2 text-indigo-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-bold text-lg">LongInset</span>
         </div>
         <button onClick={() => navigate('/settings')} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
            <Settings size={24} />
         </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden pt-16 md:pt-0 pb-20 md:pb-0 bg-gray-50 w-full">
        <div className="max-w-7xl mx-auto w-full">
            {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 pb-safe-area">
        <div className="flex justify-around items-center h-16">
          {[...navItems, {icon: UserIcon, label: 'More', path: '/governance'}].map((item) => {
            // For the "More" tab, active if path is governance or past-papers
            const isMoreTab = item.label === 'More';
            const isActive = isMoreTab 
                ? ['/governance', '/past-papers', '/settings'].includes(currentRoute.path)
                : currentRoute.path === item.path;
            
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                  isActive ? 'text-indigo-600' : 'text-gray-400'
                }`}
              >
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};