
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Lock, Shield, Trash, User, Key, FileUp, FileDown, AlertTriangle } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const Settings: React.FC = () => {
  const [showPinReset, setShowPinReset] = useState(false);
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const [pendingImportFile, setPendingImportFile] = useState<File | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Store pin in localStorage
  const getPinFromStorage = () => {
    return localStorage.getItem('financialPin') || '1234'; // Default PIN is 1234
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
  
  const handleExportData = () => {
    // Get all stored data from localStorage
    const exportData = {
      passwords: JSON.parse(localStorage.getItem('passwords') || '[]'),
      financials: JSON.parse(localStorage.getItem('financials') || '[]'),
      categories: JSON.parse(localStorage.getItem('categories') || '[]'),
      exportDate: new Date().toISOString(),
      appVersion: "1.0.0",
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
    
    toast.success("Data exported successfully", {
      description: "Your data has been exported to a file. Keep it safe!"
    });
    
    // After successful export, prompt user if they want to clear current data
    setTimeout(() => {
      setShowImportConfirm(true);
    }, 500);
  };
  
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleImportFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) {
      return;
    }
    
    setPendingImportFile(file);
    setShowImportConfirm(true);
  };
  
  const processImport = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        
        // Validate the imported data structure
        if (!importedData.passwords && !importedData.financials) {
          throw new Error("Invalid import format");
        }
        
        // Save the data to localStorage
        if (importedData.passwords) {
          localStorage.setItem('passwords', JSON.stringify(importedData.passwords));
        }
        
        if (importedData.financials) {
          localStorage.setItem('financials', JSON.stringify(importedData.financials));
        }
        
        if (importedData.categories) {
          localStorage.setItem('categories', JSON.stringify(importedData.categories));
        }
        
        if (importedData.pin) {
          localStorage.setItem('financialPin', importedData.pin);
        }
        
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        toast.success("Data imported successfully", {
          description: "Your data has been imported and is ready to use."
        });
      } catch (error) {
        toast.error("Error importing data", {
          description: "The file format is invalid. Please try with a proper LockBox export file."
        });
        console.error(error);
      }
    };
    
    reader.onerror = () => {
      toast.error("Error reading file");
    };
    
    reader.readAsText(file);
  };
  
  const handleConfirmImport = () => {
    if (pendingImportFile) {
      // Process the import
      processImport(pendingImportFile);
      setPendingImportFile(null);
      setShowImportConfirm(false);
    } else {
      toast.error("No file selected");
    }
  };
  
  const handleDeleteAllData = () => {
    // Clear all localStorage data except for the theme preference
    const theme = localStorage.getItem('theme');
    localStorage.clear();
    if (theme) {
      localStorage.setItem('theme', theme);
    }
    
    toast.success("All data has been deleted", {
      description: "Your data has been removed from this device."
    });
    
    setShowImportConfirm(false);
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
                Export all your passwords and financial data as a file
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
                onChange={handleImportFileSelected}
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
      
      {/* Import confirmation dialog */}
      <Dialog open={showImportConfirm} onOpenChange={setShowImportConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Data Management</DialogTitle>
          </DialogHeader>
          <Alert variant="warning" className="my-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              {pendingImportFile ? (
                <>
                  Importing new data will overwrite your existing data. Make sure you have exported your current data if you want to keep it.
                </>
              ) : (
                <>
                  Would you like to clear your current data and import new data?
                </>
              )}
            </AlertDescription>
          </Alert>
          
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowImportConfirm(false)}>Cancel</Button>
            {pendingImportFile ? (
              <Button onClick={handleConfirmImport}>Import Data</Button>
            ) : (
              <>
                <Button variant="destructive" onClick={handleDeleteAllData}>Delete All Data</Button>
                <Button onClick={handleImportClick}>Import New Data</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Hidden file input for import */}
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept=".json" 
        onChange={handleImportFileSelected} 
      />
    </div>
  );
};

export default Settings;
