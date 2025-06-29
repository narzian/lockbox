
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Lock, Key } from 'lucide-react';
import { toast } from 'sonner';

export const SecuritySection: React.FC = () => {
  const [showPinReset, setShowPinReset] = useState(false);
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  
  const getPinFromStorage = () => {
    return localStorage.getItem('financialPin') || '1234';
  };
  
  const handleResetPin = () => {
    const storedPin = getPinFromStorage();
    
    if (currentPin === '') {
      toast.error("Current PIN is required");
      return;
    }
    
    if (currentPin !== storedPin) {
      toast.error("Current PIN is incorrect");
      return;
    }
    
    if (newPin === '') {
      toast.error("New PIN is required");
      return;
    }
    
    if (newPin !== confirmPin) {
      toast.error("New PIN and confirmation do not match");
      return;
    }
    
    localStorage.setItem('financialPin', newPin);
    
    toast.success("PIN reset successfully");
    setShowPinReset(false);
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
  };

  return (
    <section>
      <h2 className="text-lg font-semibold flex items-center mb-4">
        <Lock className="h-5 w-5 mr-2 text-primary" />
        Security
      </h2>
      
      <Card className="p-4 space-y-4">
        <div>
          <Label className="font-medium">Financial Section PIN</Label>
          <p className="text-sm text-muted-foreground mb-2">
            Change the PIN used to access financial information
          </p>
          <Dialog open={showPinReset} onOpenChange={setShowPinReset}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center"
              >
                <Key className="h-4 w-4 mr-2" />
                Reset Financial PIN
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reset Financial PIN</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div>
                  <Label htmlFor="current-pin">Current PIN</Label>
                  <Input
                    id="current-pin"
                    type="password"
                    placeholder="Enter current PIN"
                    value={currentPin}
                    onChange={(e) => setCurrentPin(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="new-pin">New PIN</Label>
                  <Input
                    id="new-pin"
                    type="password"
                    placeholder="Enter new PIN"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="confirm-pin">Confirm New PIN</Label>
                  <Input
                    id="confirm-pin"
                    type="password"
                    placeholder="Confirm new PIN"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setShowPinReset(false)}>Cancel</Button>
                <Button onClick={handleResetPin}>Update PIN</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    </section>
  );
};
