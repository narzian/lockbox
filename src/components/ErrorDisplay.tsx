
import React from 'react';
import { AlertTriangle, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  variant?: 'destructive' | 'warning';
  className?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title = 'Error',
  message,
  onRetry,
  onDismiss,
  variant = 'destructive',
  className
}) => {
  return (
    <Alert variant={variant} className={className} role="alert">
      <AlertTriangle className="h-4 w-4" />
      <div className="flex-1">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription className="mt-1">
          {message}
        </AlertDescription>
      </div>
      
      <div className="flex gap-2 ml-4">
        {onRetry && (
          <Button 
            onClick={onRetry} 
            size="sm" 
            variant="outline"
            aria-label="Retry action"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        )}
        {onDismiss && (
          <Button 
            onClick={onDismiss} 
            size="sm" 
            variant="ghost"
            aria-label="Dismiss error"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </Alert>
  );
};

export const InlineError: React.FC<{ 
  message: string; 
  className?: string;
}> = ({ message, className }) => {
  return (
    <div className={`flex items-center gap-2 text-sm text-destructive ${className}`} role="alert">
      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};
