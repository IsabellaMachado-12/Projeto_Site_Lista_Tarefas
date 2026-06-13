import React from 'react';
import { TodoProvider, useTodos } from './context/TodoContext';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { TasksPage } from './pages/TasksPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { CalendarPage } from './pages/CalendarPage';
import { FinancePage } from './pages/FinancePage';
import './App.css';

const MainAppContent: React.FC = () => {
  const { user, activeTab } = useTodos();

  // If user is not authenticated, show login page
  if (!user) {
    return <LoginPage />;
  }

  // Render correct page view based on active tab
  const renderActiveView = () => {
    switch (activeTab) {
      case 'tasks':
        return <TasksPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'calendar':
        return <CalendarPage />;
      case 'finance':
        return <FinancePage />;
      default:
        return <TasksPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans transition-colors duration-200 relative">
      {/* Elementos Decorativos de Fundo */}
      <div className="blob-container" aria-hidden="true">
        <div className="blob-1"></div>
        <div className="blob-2"></div>
        <div className="blob-3"></div>
      </div>

      <Navbar />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <main className="flex-1 w-full">
          {renderActiveView()}
        </main>
        <footer className="py-6 text-center text-xs text-slate-400 font-medium font-sans opacity-60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p>© {new Date().getFullYear()} FLOWFY. Design premium e produtividade inteligente.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

function App() {
  return (
    <TodoProvider>
      <MainAppContent />
    </TodoProvider>
  );
}

export default App;
