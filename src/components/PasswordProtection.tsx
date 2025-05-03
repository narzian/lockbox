
import React, { useState } from 'react';
import { EyeOff, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PasswordProtectionProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

export const PasswordProtection: React.FC<PasswordProtectionProps> = ({ 
  onSuccess,
  onCancel
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  
  // Get the PIN from localStorage or use the default PIN
  const getCorrectPassword = () => {
    return localStorage.getItem('financialPin') || '1234';
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === getCorrectPassword()) {
      setError(false);
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Protected Section</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-center text-muted-foreground mb-4">
              Enter your PIN to access financial information
            </p>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`pr-10 ${error ? 'border-destructive' : ''}`}
                placeholder="Enter PIN"
                autoFocus
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {error && (
              <p className="text-sm text-destructive mt-1">Incorrect PIN. Please try again.</p>
            )}
          </div>
          
          <div className="flex justify-between">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Back
              </Button>
            )}
            <Button type="submit" className={onCancel ? '' : 'w-full'}>
              Unlock
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
