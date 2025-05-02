
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Lock, Fingerprint, Shield, Trash, User, Key } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';

const Settings: React.FC = () => {
  const [showPinReset, setShowPinReset] = useState(false);
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  
  const handleBiometricToggle = (checked: boolean) => {
    toast.success(`Biometric authentication ${checked ? 'enabled' : 'disabled'}`);
  };
  
  const handleAutoLockToggle = (checked: boolean) => {
    toast.success(`Auto-lock ${checked ? 'enabled' : 'disabled'}`);
  };
  
  const handleExportData = () => {
    toast.info("Export functionality would be implemented here");
  };
  
  const handleDeleteAllData = () => {
    toast.info("Delete all data confirmation would show here");
  };
  
  const handleResetPin = () => {
    // In a real app, this would be securely stored
    const defaultPin = '1234';
    
    if (currentPin === '') {
      toast.error("Current PIN is required");
      return;
    }
    
    if (currentPin !== defaultPin) {
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
    
    // In a real app, this would update the PIN in secure storage
    toast.success("PIN reset successfully");
    setShowPinReset(false);
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
  };
  
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-semibold flex items-center mb-4">
            <Lock className="h-5 w-5 mr-2 text-vault-purple" />
            Security
          </h2>
          
          <Card className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="biometric" className="font-medium">Biometric Authentication</Label>
                <p className="text-sm text-muted-foreground">Use fingerprint or Face ID to unlock</p>
              </div>
              <Switch 
                id="biometric" 
                onCheckedChange={handleBiometricToggle} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-lock" className="font-medium">Auto-Lock</Label>
                <p className="text-sm text-muted-foreground">Lock app when not in use</p>
              </div>
              <Switch 
                id="auto-lock" 
                defaultChecked 
                onCheckedChange={handleAutoLockToggle} 
              />
            </div>
            
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
        
        <Separator />
        
        <section>
          <h2 className="text-lg font-semibold flex items-center mb-4">
            <Shield className="h-5 w-5 mr-2 text-vault-purple" />
            Data Management
          </h2>
          
          <Card className="p-4 space-y-4">
            <div>
              <Label className="font-medium">Export Data</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Export all your passwords as an encrypted file
              </p>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleExportData}
              >
                Export Encrypted Data
              </Button>
            </div>
            
            <div>
              <Label className="font-medium text-destructive">Delete All Data</Label>
              <p className="text-sm text-muted-foreground mb-2">
                This action cannot be undone
              </p>
              <Button 
                variant="destructive" 
                className="w-full" 
                onClick={handleDeleteAllData}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete All Data
              </Button>
            </div>
          </Card>
        </section>
        
        <Separator />
        
        <section>
          <h2 className="text-lg font-semibold flex items-center mb-2">
            <User className="h-5 w-5 mr-2 text-vault-purple" />
            About
          </h2>
          <p className="text-sm text-muted-foreground">
            Vault Keeper v1.0.0
          </p>
          <p className="text-sm text-muted-foreground">
            A secure password manager
          </p>
        </section>
      </div>
    </div>
  );
};

export default Settings;
