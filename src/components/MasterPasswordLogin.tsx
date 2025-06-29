
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Lock, AlertTriangle } from 'lucide-react';
import { hashPassword, deriveKey, validateKey } from '@/utils/encryption';
import { toast } from 'sonner';

interface MasterPasswordLoginProps {
  onSuccess: (encryptionKey: string) => void;
}

export const MasterPasswordLogin: React.FC<MasterPasswordLoginProps> = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeout, setLockTimeout] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLocked && lockTimeout > 0) {
      interval = setInterval(() => {
        setLockTimeout(prev => {
          if (prev <= 1) {
            setIsLocked(false);
            setAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLocked, lockTimeout]);

  const handleLogin = () => {
    if (!password) {
      toast.error('Please enter your master password');
      return;
    }

    if (isLocked) {
      toast.error(`Too many failed attempts. Try again in ${lockTimeout} seconds.`);
      return;
    }

    try {
      const storedHash = localStorage.getItem('masterPasswordHash');
      const storedSalt = localStorage.getItem('masterPasswordSalt');
      
      if (!storedHash || !storedSalt) {
        toast.error('Master password not found. Please set up the app again.');
        return;
      }

      const hashedInput = hashPassword(password, storedSalt);
      
      if (hashedInput !== storedHash) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= 5) {
          setIsLocked(true);
          setLockTimeout(300); // 5 minutes lockout
          toast.error('Too many failed attempts. Account locked for 5 minutes.');
        } else {
          toast.error(`Incorrect password. ${5 - newAttempts} attempts remaining.`);
        }
        return;
      }

      // Derive encryption key and validate
      const encryptionKey = deriveKey(password, storedSalt);
      
      if (!validateKey(encryptionKey)) {
        toast.error('Invalid encryption key. Data may be corrupted.');
        return;
      }

      // Store the session
      sessionStorage.setItem('isAuthenticated', 'true');
      sessionStorage.setItem('lastActivity', Date.now().toString());
      
      toast.success('Welcome back!');
      onSuccess(encryptionKey);
    } catch (error) {
      toast.error('Login failed. Please try again.');
      console.error(error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Lock className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your master password to access your vault
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {attempts > 0 && (
            <Alert variant={attempts >= 3 ? "destructive" : "default"}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {attempts >= 3 
                  ? `${5 - attempts} attempts remaining before lockout`
                  : `${attempts} failed attempt${attempts > 1 ? 's' : ''}`
                }
              </AlertDescription>
            </Alert>
          )}

          {isLocked && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Account locked. Try again in {Math.floor(lockTimeout / 60)}:
                {(lockTimeout % 60).toString().padStart(2, '0')}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="masterPassword">Master Password</Label>
            <div className="relative">
              <Input
                id="masterPassword"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your master password"
                className="pr-10"
                disabled={isLocked}
                autoFocus
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLocked}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button 
            onClick={handleLogin} 
            className="w-full"
            disabled={!password || isLocked}
          >
            Unlock Vault
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
