
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { FinancialItem } from '@/components/FinancialItem';
import { PasswordProtection } from '@/components/PasswordProtection';
import { EmptyState } from '@/components/EmptyState';

// This would be fetched from a secure storage in a real app
const financialItems: { id: string; type: 'card' | 'upi' | 'account'; name: string; lastDigits?: string; expiryDate?: string; upiId?: string; accountNumber?: string; bankName?: string; }[] = [
  // Empty initial state
];

const Financials: React.FC = () => {
  const [unlocked, setUnlocked] = useState(false);
  const [items] = useState(financialItems);
  const navigate = useNavigate();
  
  const handleAddFinancial = () => {
    toast.info("Add financial information functionality would open here");
    // In a real app, navigate to add form
    // navigate('/financials/add');
  };

  const handleUnlock = () => {
    setUnlocked(true);
    toast.success("Financial section unlocked");
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
    </div>
  );
};

export default Financials;
