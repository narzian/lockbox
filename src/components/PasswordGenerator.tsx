
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, RefreshCw, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { analyzePasswordStrength } from '@/utils/passwordStrength';
import { Progress } from '@/components/ui/progress';

interface PasswordGeneratorProps {
  onPasswordGenerated?: (password: string) => void;
  showAsDialog?: boolean;
}

export const PasswordGenerator: React.FC<PasswordGeneratorProps> = ({ 
  onPasswordGenerated,
  showAsDialog = false 
}) => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState([16]);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(true);

  const generatePassword = useCallback(() => {
    let charset = '';
    
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (excludeAmbiguous) {
      charset = charset.replace(/[0O1lI]/g, '');
    }
    
    if (!charset) {
      toast.error('Please select at least one character type');
      return;
    }
    
    let result = '';
    for (let i = 0; i < length[0]; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    setPassword(result);
    if (onPasswordGenerated) {
      onPasswordGenerated(result);
    }
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeAmbiguous, onPasswordGenerated]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      toast.success('Password copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy password');
    }
  };

  const strength = password ? analyzePasswordStrength(password) : null;
  const strengthPercentage = strength ? (strength.score / 5) * 100 : 0;

  React.useEffect(() => {
    generatePassword();
  }, []);

  const content = (
    <>
      <div className="space-y-4">
        <div>
          <Label>Generated Password</Label>
          <div className="flex gap-2 mt-1">
            <Input
              value={password}
              readOnly
              className="font-mono text-sm"
              placeholder="Click generate to create password"
            />
            <Button size="icon" variant="outline" onClick={copyToClipboard} disabled={!password}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          {strength && (
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-sm">
                <span>Strength</span>
                <span style={{ color: strength.color }}>{strength.label}</span>
              </div>
              <Progress value={strengthPercentage} className="h-2" />
            </div>
          )}
        </div>

        <div>
          <Label>Length: {length[0]}</Label>
          <Slider
            value={length}
            onValueChange={setLength}
            max={50}
            min={4}
            step={1}
            className="mt-2"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="uppercase"
              checked={includeUppercase}
              onCheckedChange={(checked) => setIncludeUppercase(checked === true)}
            />
            <Label htmlFor="uppercase">Uppercase letters (A-Z)</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="lowercase"
              checked={includeLowercase}
              onCheckedChange={(checked) => setIncludeLowercase(checked === true)}
            />
            <Label htmlFor="lowercase">Lowercase letters (a-z)</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="numbers"
              checked={includeNumbers}
              onCheckedChange={(checked) => setIncludeNumbers(checked === true)}
            />
            <Label htmlFor="numbers">Numbers (0-9)</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="symbols"
              checked={includeSymbols}
              onCheckedChange={(checked) => setIncludeSymbols(checked === true)}
            />
            <Label htmlFor="symbols">Symbols (!@#$%^&*)</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="exclude-ambiguous"
              checked={excludeAmbiguous}
              onCheckedChange={(checked) => setExcludeAmbiguous(checked === true)}
            />
            <Label htmlFor="exclude-ambiguous">Exclude ambiguous characters (0, O, 1, l, I)</Label>
          </div>
        </div>

        <Button onClick={generatePassword} className="w-full">
          <RefreshCw className="h-4 w-4 mr-2" />
          Generate New Password
        </Button>
      </div>
    </>
  );

  if (showAsDialog) {
    return content;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Wand2 className="h-5 w-5 mr-2" />
          Password Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
};
