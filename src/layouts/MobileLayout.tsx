
import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Home, Plus, Settings, Lock, CreditCard } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export const MobileLayout: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-background">
      {/* App Header */}
      <header className="sticky top-0 z-10 bg-card shadow-sm border-b border-border px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-semibold">Vault Keeper</h1>
        </div>
        <ThemeToggle />
      </header>
      
      {/* Main content area */}
      <main className="flex-1 px-4 py-4 overflow-auto">
        <Outlet />
      </main>
      
      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 z-10 bg-card shadow-inner border-t border-border">
        <div className="flex items-center justify-around h-16">
          <Link to="/dashboard" className={`bottom-nav-item ${isActive('/dashboard') ? 'text-primary' : 'text-muted-foreground'}`}>
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          
          <Link to="/financials" className={`bottom-nav-item ${isActive('/financials') ? 'text-primary' : 'text-muted-foreground'}`}>
            <CreditCard className="h-5 w-5" />
            <span className="text-xs mt-1">Cards</span>
          </Link>
          
          <Link to="/add" className={`bottom-nav-item ${isActive('/add') ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className="bg-primary rounded-full p-3 -mt-6 shadow-md">
              <Plus className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xs mt-1">Add</span>
          </Link>
          
          <Link to="/settings" className={`bottom-nav-item ${isActive('/settings') ? 'text-primary' : 'text-muted-foreground'}`}>
            <Settings className="h-5 w-5" />
            <span className="text-xs mt-1">Settings</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};
