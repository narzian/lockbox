
import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Home, Plus, Settings, Lock } from 'lucide-react';

export const MobileLayout: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-background">
      {/* App Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-border px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-vault-black" />
          <h1 className="text-lg font-semibold">Vault Keeper</h1>
        </div>
      </header>
      
      {/* Main content area */}
      <main className="flex-1 px-4 py-4 overflow-auto">
        <Outlet />
      </main>
      
      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 z-10 bg-white border-t border-border">
        <div className="flex items-center justify-around h-16">
          <Link to="/" className={`bottom-nav-item ${isActive('/') ? 'text-vault-black' : 'text-vault-gray'}`}>
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          
          <Link to="/add" className={`bottom-nav-item ${isActive('/add') ? 'text-vault-black' : 'text-vault-gray'}`}>
            <div className="bg-vault-black rounded-full p-3 -mt-6 shadow-md">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <span className="text-xs mt-1">Add</span>
          </Link>
          
          <Link to="/settings" className={`bottom-nav-item ${isActive('/settings') ? 'text-vault-black' : 'text-vault-gray'}`}>
            <Settings className="h-5 w-5" />
            <span className="text-xs mt-1">Settings</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};
