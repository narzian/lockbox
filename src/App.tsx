
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MobileLayout } from "./layouts/MobileLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import PasswordDetail from "./pages/PasswordDetail";
import AddPassword from "./pages/AddPassword";
import Financials from "./pages/Financials";
import Search from "./pages/Search";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./components/ThemeProvider";
import { MasterPasswordSetup } from "./components/MasterPasswordSetup";
import { MasterPasswordLogin } from "./components/MasterPasswordLogin";
import { useAutoLock } from "./hooks/useAutoLock";
import { secureStorage } from "./utils/secureStorage";

// Create a more resilient query client with retry logic
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent = () => {
  const [isInitialized, setIsInitialized] = useState<boolean | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Auto-lock functionality
  useAutoLock({ 
    onLock: () => {
      setIsAuthenticated(false);
      sessionStorage.removeItem('isAuthenticated');
    },
    timeout: 15 // 15 minutes
  });

  useEffect(() => {
    // Check if app is initialized (master password set)
    const initialized = localStorage.getItem('appInitialized') === 'true';
    setIsInitialized(initialized);

    // Check if user is authenticated in current session
    const authenticated = sessionStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authenticated);

    setIsLoading(false);
  }, []);

  const handleSetupComplete = () => {
    setIsInitialized(true);
  };

  const handleLoginSuccess = (encryptionKey: string) => {
    secureStorage.setEncryptionKey(encryptionKey);
    secureStorage.migrateUnencryptedData(); // Migrate existing data
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show setup if not initialized
  if (isInitialized === false) {
    return <MasterPasswordSetup onSetup={handleSetupComplete} />;
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <MasterPasswordLogin onSuccess={handleLoginSuccess} />;
  }

  // Show main app
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route element={<MobileLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/password/:id" element={<PasswordDetail />} />
          <Route path="/add" element={<AddPassword />} />
          <Route path="/financials" element={<Financials />} />
          <Route path="/search" element={<Search />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
