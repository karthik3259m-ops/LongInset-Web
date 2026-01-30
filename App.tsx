import React, { useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Practice } from './pages/Practice';
import { StudyPlan } from './pages/StudyPlan';
import { AiTutor } from './pages/AiTutor';
import { PastPapers } from './pages/PastPapers';
import { Governance } from './pages/Governance';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { UpdatePassword } from './pages/UpdatePassword';
import { Settings } from './pages/Settings';
import { useStore } from './store/useStore';

const App: React.FC = () => {
  const { currentRoute, initializeAuth, isAuthenticated, isAuthInitialized, navigate } = useStore();

  useEffect(() => {
    initializeAuth();
  }, []);

  // Simple route guard effect
  useEffect(() => {
    // Only run guard logic if auth is initialized
    if (!isAuthInitialized) return;

    // Whitelist public routes
    const publicRoutes = ['/login', '/register', '/forgot-password', '/update-password'];
    
    if (!isAuthenticated && !publicRoutes.includes(currentRoute.path)) {
      navigate('/login');
    }
  }, [isAuthenticated, isAuthInitialized, currentRoute.path, navigate]);

  if (!isAuthInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading ExamGPS...</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    if (!isAuthenticated) {
        if (currentRoute.path === '/register') return <Register />;
        if (currentRoute.path === '/forgot-password') return <ForgotPassword />;
        if (currentRoute.path === '/update-password') return <UpdatePassword />;
        // If not authenticated and attempting to access protected route (and guard hasn't redirected yet), show Login
        return <Login />;
    }

    switch (currentRoute.path) {
      case '/':
        return <Dashboard />;
      case '/practice':
        return <Practice />;
      case '/plan':
        return <StudyPlan />;
      case '/past-papers':
        return <PastPapers />;
      case '/governance':
        return <Governance />;
      case '/ai-tutor':
        return <AiTutor />;
      case '/settings':
        return <Settings />;
      case '/update-password':
        return <UpdatePassword />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout>
      {renderPage()}
    </Layout>
  );
};

export default App;