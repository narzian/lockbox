
import { useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface UseAutoLockProps {
  onLock: () => void;
  timeout?: number; // in minutes
}

export const useAutoLock = ({ onLock, timeout = 15 }: UseAutoLockProps) => {
  const updateActivity = useCallback(() => {
    sessionStorage.setItem('lastActivity', Date.now().toString());
  }, []);

  const checkForInactivity = useCallback(() => {
    const lastActivity = sessionStorage.getItem('lastActivity');
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');
    
    if (!lastActivity || !isAuthenticated) return;
    
    const timeDiff = Date.now() - parseInt(lastActivity);
    const timeoutMs = timeout * 60 * 1000; // Convert to milliseconds
    
    if (timeDiff > timeoutMs) {
      sessionStorage.removeItem('isAuthenticated');
      sessionStorage.removeItem('lastActivity');
      toast.info('Session expired due to inactivity');
      onLock();
    }
  }, [onLock, timeout]);

  useEffect(() => {
    // Update activity on component mount
    updateActivity();

    // Set up activity listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    // Check for inactivity every minute
    const interval = setInterval(checkForInactivity, 60000);

    // Check when window gains focus (user switches back to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkForInactivity();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [updateActivity, checkForInactivity]);

  return { updateActivity };
};
