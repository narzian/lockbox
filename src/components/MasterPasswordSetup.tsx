
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { analyzePasswordStrength } from '@/utils/passwordStrength';
import { hashPassword, generateSalt, setupTestEncryption, deriveKey } from '@/utils/encryption';
import { toast } from 'sonner';

interface MasterPasswordSetupProps {
  onSetup: () => void;
}

export const MasterPasswordSetup: React.FC<MasterPasswordSetupProps> = ({ onSetup }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const strength = analyzePasswordStrength(password);
  const strengthPercentage = (strength.score / 5) * 100;

  const handleSetup = () => {
    if (!password) {
      toast.error('Please enter a master password');
      return;
    }

    if (strength.score < 3) {
      toast.error('Password is too weak. Please choose a stronger password.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      // Generate salt and hash password
      const salt = generateSalt();
      const hashedPassword = hashPassword(password, salt);
      
      // Store master password hash and salt
      localStorage.setItem('masterPasswordHash', hashedPassword);
      localStorage.setItem('masterPasswordSalt', salt);
      
      // Derive encryption key and set up test encryption
      const encryptionKey = deriveKey(password, salt);
      setupTestEncryption(encryptionKey);
      
      // Set initial setup flag
      localStorage.setItem('appInitialized', 'true');
      
      toast.success('Master password set successfully!');
      onSetup();
    } catch (error) {
      toast.error('Failed to set up master password');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Set Up Master Password</CardTitle>
          <p className="text-sm text-muted-foreground">
            Your master password protects all your data. Choose a strong password you'll remember.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Master Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your master password"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {password && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Password Strength</span>
                <span style={{ color: strength.color }}>{strength.label}</span>
              </div>
              <Progress value={strengthPercentage} className="h-2" />
              {strength.suggestions.length > 0 && (
                <Alert>
                  <AlertDescription>
                    <strong>Suggestions:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {strength.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-xs">{suggestion}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your master password"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {confirmPassword && password !== confirmPassword && (
            <Alert variant="destructive">
              <AlertDescription>Passwords do not match</AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handleSetup} 
            className="w-full"
            disabled={!password || !confirmPassword || password !== confirmPassword || strength.score < 3}
          >
            Set Master Password
          </Button>

          <Alert>
            <AlertDescription className="text-xs">
              <strong>Important:</strong> Your master password cannot be recovered if forgotten. 
              Make sure to remember it or store it securely.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};
