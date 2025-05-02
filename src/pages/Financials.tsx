
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { FinancialItem } from '@/components/FinancialItem';
import { PasswordProtection } from '@/components/PasswordProtection';
import { EmptyState } from '@/components/EmptyState';
import { AddFinancialForm } from '@/components/AddFinancialForm';

// Empty initial state
const financialItems: { id: string; type: 'card' | 'upi' | 'account'; name: string; lastDigits?: string; expiryDate?: string; upiId?: string; accountNumber?: string; bankName?: string; }[] = [];

const Financials: React.FC = () => {
  const [unlocked, setUnlocked] = useState(false);
  const [items, setItems] = useState(financialItems);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleAddFinancial = () => {
    setIsAddDialogOpen(true);
  };

  const handleUnlock = () => {
    setUnlocked(true);
    toast.success("Financial section unlocked");
  };
  
  const handleAddSuccess = () => {
    // In a real app, this would fetch the updated list
    // For now, we'll just show a success message
    toast.success("Financial information saved");
  };

  if (!unlocked) {
    return <PasswordProtection onSuccess={handleUnlock} onCancel={() => navigate(-1)} />;
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Financial Information</h1>
      
      <div className="mb-4 flex justify-end">
        <Button onClick={handleAddFinancial}>
          <Plus className="h-4 w-4 mr-2" /> Add Financial Information
        </Button>
      </div>
      
      {items.length === 0 ? (
        <EmptyState 
          title="No financial information added yet"
          description="Add your credit cards, UPI IDs, or bank accounts for secure storage"
          actionLabel="Add Information"
          onAction={handleAddFinancial}
        />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <FinancialItem key={item.id} item={item} />
          ))}
        </div>
      )}
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Financial Information</DialogTitle>
          </DialogHeader>
          <AddFinancialForm 
            onClose={() => setIsAddDialogOpen(false)} 
            onSuccess={handleAddSuccess} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Financials;
