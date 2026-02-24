import { useState } from 'react';
import { useAlarmNotifications } from './hooks/useAlarmNotifications';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import Dashboard from './components/Dashboard';
import CalendarView from './components/CalendarView';
import AppointmentList from './components/AppointmentList';
import { Calendar, List, LayoutDashboard } from 'lucide-react';

type View = 'dashboard' | 'calendar' | 'list';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  useAlarmNotifications();

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src="/assets/generated/calendar-icon.dim_128x128.png" 
                  alt="Calendar" 
                  className="h-10 w-10"
                />
                <h1 className="text-2xl font-semibold text-foreground">Appointment Manager</h1>
              </div>
              <nav className="flex gap-2">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'dashboard'
                      ? 'bg-sageGreen text-white'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </button>
                <button
                  onClick={() => setCurrentView('calendar')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'calendar'
                      ? 'bg-sageGreen text-white'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Calendar</span>
                </button>
                <button
                  onClick={() => setCurrentView('list')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'list'
                      ? 'bg-sageGreen text-white'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <List className="h-4 w-4" />
                  <span className="hidden sm:inline">List</span>
                </button>
              </nav>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'calendar' && <CalendarView />}
          {currentView === 'list' && <AppointmentList />}
        </main>

        <footer className="border-t border-border bg-card mt-16">
          <div className="container mx-auto px-4 py-6">
            <p className="text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'appointment-manager'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sageGreen hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </footer>

        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
