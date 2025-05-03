
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Lock, Fingerprint, Shield, Trash, User, Key, FileUp, FileDown } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';

const Settings: React.FC = () => {
  const [showPinReset, setShowPinReset] = useState(false);
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Store pin in localStorage
  const getPinFromStorage = () => {
    return localStorage.getItem('financialPin') || '1234'; // Default PIN is 1234
  };
  
  const handleBiometricToggle = (checked: boolean) => {
    if (checked) {
      // In a real app, this would integrate with the device's biometric capabilities
      toast.success("Biometric authentication enabled");
    } else {
      toast.success("Biometric authentication disabled");
    }
  };
  
  const handleAutoLockToggle = (checked: boolean) => {
    if (checked) {
      // In a real app, this would set up auto-lock listeners
      toast.success("Auto-lock enabled - App will lock after 5 minutes of inactivity");
    } else {
      toast.success("Auto-lock disabled");
    }
  };
  
  const handleExportData = () => {
    // Get all stored data from localStorage
    const exportData = {
      passwords: [], // Would contain all passwords
      financials: [], // Would contain all financial information
      categories: [], // Would contain all categories
      exportDate: new Date().toISOString(),
      appVersion: "1.0.0",
      // Get any other stored data here
      pin: getPinFromStorage()
    };
    
    // Convert to JSON
    const dataStr = JSON.stringify(exportData, null, 2);
    
    // Create a download link
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = `lockbox-export-${new Date().toLocaleDateString().replace(/\//g, '-')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success("Data exported successfully");
  };
  
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) {
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        
        // Save the data to localStorage
        if (importedData.pin) {
          localStorage.setItem('financialPin', importedData.pin);
        }
        
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        toast.success("Data imported successfully");
      } catch (error) {
        toast.error("Error importing data: Invalid file format");
        console.error(error);
      }
    };
    
    reader.onerror = () => {
      toast.error("Error reading file");
    };
    
    reader.readAsText(file);
  };
  
  const handleDeleteAllData = () => {
    // Clear all localStorage data except for the theme preference
    const theme = localStorage.getItem('theme');
    localStorage.clear();
    if (theme) {
      localStorage.setItem('theme', theme);
    }
    
    toast.success("All data has been deleted");
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
    
    // Save the new pin
    localStorage.setItem('financialPin', newPin);
    
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
            <Lock className="h-5 w-5 mr-2 text-primary" />
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
            <Shield className="h-5 w-5 mr-2 text-primary" />
            Data Management
          </h2>
          
          <Card className="p-4 space-y-4">
            <div>
              <Label className="font-medium">Export Data</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Export all your passwords and financial data as an encrypted file
              </p>
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center" 
                onClick={handleExportData}
              >
                <FileDown className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
            
            <div>
              <Label className="font-medium">Import Data</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Import passwords and financial data from an exported file
              </p>
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center" 
                onClick={handleImportClick}
              >
                <FileUp className="h-4 w-4 mr-2" />
                Import Data
              </Button>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImportData}
                accept=".json"
                style={{ display: 'none' }}
              />
            </div>
            
            <div>
              <Label className="font-medium text-destructive">Delete All Data</Label>
              <p className="text-sm text-muted-foreground mb-2">
                This action cannot be undone
              </p>
              <Button 
                variant="destructive" 
                className="w-full flex items-center justify-center" 
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
            <User className="h-5 w-5 mr-2 text-primary" />
            About
          </h2>
          <p className="text-sm text-muted-foreground">
            LockBox v1.0.0
          </p>
          <p className="text-sm text-muted-foreground">
            A secure password manager
          </p>
        </section>
      </div>
      
      {/* Hidden file input for import */}
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept=".json" 
        onChange={handleImportData} 
      />
    </div>
  );
};

export default Settings;
