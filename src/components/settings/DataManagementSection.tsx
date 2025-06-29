
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Shield, Trash, FileUp, FileDown, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export const DataManagementSection: React.FC = () => {
  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const [pendingImportFile, setPendingImportFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const getPinFromStorage = () => {
    return localStorage.getItem('financialPin') || '1234';
  };
  
  const handleExportData = () => {
    const exportData = {
      passwords: JSON.parse(localStorage.getItem('passwords') || '[]'),
      financials: JSON.parse(localStorage.getItem('financials') || '[]'),
      categories: JSON.parse(localStorage.getItem('categories') || '[]'),
      exportDate: new Date().toISOString(),
      appVersion: "1.0.0",
      pin: getPinFromStorage()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = `lockbox-export-${new Date().toLocaleDateString().replace(/\//g, '-')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success("Data exported successfully", {
      description: "Your data has been exported to a file. Keep it safe!"
    });
    
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
        
        if (!importedData.passwords && !importedData.financials) {
          throw new Error("Invalid import format");
        }
        
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
      processImport(pendingImportFile);
      setPendingImportFile(null);
      setShowImportConfirm(false);
    } else {
      toast.error("No file selected");
    }
  };
  
  const handleDeleteAllData = () => {
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
    <>
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
      
      <Dialog open={showImportConfirm} onOpenChange={setShowImportConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Data Management</DialogTitle>
          </DialogHeader>
          <Alert variant="destructive" className="my-4">
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
      
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept=".json" 
        onChange={handleImportFileSelected} 
      />
    </>
  );
};
