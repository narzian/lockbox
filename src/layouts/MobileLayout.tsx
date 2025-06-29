
import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Home, Plus, Settings, Lock, CreditCard, Search } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const MobileLayout: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-background">
      {/* App Header */}
      <header className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm shadow-sm border-b border-border px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" aria-hidden="true" />
          <h1 className="text-lg font-semibold font-sans tracking-normal">LockBox</h1>
        </div>
        <ThemeToggle />
      </header>
      
      {/* Main content area with error boundary */}
      <main className="flex-1 px-4 py-4 overflow-auto" role="main">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      
      {/* Bottom Navigation */}
      <nav 
        className="sticky bottom-0 z-10 bg-card/95 backdrop-blur-sm shadow-inner border-t border-border safe-area-pb"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-around h-16 px-2">
          <Link 
            to="/dashboard" 
            className={`bottom-nav-item group ${
              isActive('/dashboard') ? 'text-primary' : 'text-muted-foreground'
            }`}
            aria-current={isActive('/dashboard') ? 'page' : undefined}
          >
            <Home className="h-5 w-5 transition-transform group-active:scale-95" aria-hidden="true" />
            <span className="text-xs mt-1 font-sans">Home</span>
          </Link>
          
          <Link 
            to="/search" 
            className={`bottom-nav-item group ${
              isActive('/search') ? 'text-primary' : 'text-muted-foreground'
            }`}
            aria-current={isActive('/search') ? 'page' : undefined}
          >
            <Search className="h-5 w-5 transition-transform group-active:scale-95" aria-hidden="true" />
            <span className="text-xs mt-1 font-sans">Search</span>
          </Link>
          
          {/* Centered Add button */}
          <div className="relative flex flex-col items-center justify-center" role="presentation">
            <Link 
              to="/add" 
              className="bottom-nav-item group"
              aria-label="Add new password"
            >
              <div className="bg-primary rounded-full p-3 absolute -top-6 shadow-lg transition-all group-active:scale-95 group-hover:shadow-xl">
                <Plus className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
              </div>
              <span className="text-xs mt-9 font-sans text-muted-foreground">Add</span>
            </Link>
          </div>
          
          <Link 
            to="/financials" 
            className={`bottom-nav-item group ${
              isActive('/financials') ? 'text-primary' : 'text-muted-foreground'
            }`}
            aria-current={isActive('/financials') ? 'page' : undefined}
          >
            <CreditCard className="h-5 w-5 transition-transform group-active:scale-95" aria-hidden="true" />
            <span className="text-xs mt-1 font-sans">Cards</span>
          </Link>
          
          <Link 
            to="/settings" 
            className={`bottom-nav-item group ${
              isActive('/settings') ? 'text-primary' : 'text-muted-foreground'
            }`}
            aria-current={isActive('/settings') ? 'page' : undefined}
          >
            <Settings className="h-5 w-5 transition-transform group-active:scale-95" aria-hidden="true" />
            <span className="text-xs mt-1 font-sans">Settings</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};
