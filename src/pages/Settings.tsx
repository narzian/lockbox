
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Lock, Fingerprint, Shield, Trash, User } from 'lucide-react';
import { toast } from 'sonner';

const Settings: React.FC = () => {
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
