
import React from 'react';
import { Card } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';

export interface FinancialItem {
  id: string;
  type: 'card' | 'upi' | 'account';
  name: string;
  lastDigits?: string;
  expiryDate?: string;
  upiId?: string;
  accountNumber?: string;
  bankName?: string;
  notes?: string;
}

interface FinancialItemProps {
  item: FinancialItem;
}

export const FinancialItem: React.FC<FinancialItemProps> = ({ item }) => {
  const renderDetails = () => {
    switch(item.type) {
      case 'card':
        return (
          <>
            <p className="text-sm text-muted-foreground">
              •••• •••• •••• {item.lastDigits}
            </p>
            {item.expiryDate && (
              <p className="text-xs text-muted-foreground">Expires: {item.expiryDate}</p>
            )}
          </>
        );
      case 'upi':
        return (
          <p className="text-sm text-muted-foreground">
            {item.upiId}
          </p>
        );
      case 'account':
        return (
          <>
            <p className="text-sm text-muted-foreground">
              {item.bankName}
            </p>
            <p className="text-xs text-muted-foreground">
              •••• {item.accountNumber?.slice(-4)}
            </p>
          </>
        );
    }
  };

  return (
    <Card className="vault-card animate-fade-in">
      <div className="flex items-center">
        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-vault-neutral mr-3">
          <CreditCard className="h-5 w-5 text-vault-black" />
        </div>
        
        <div className="flex-grow">
          <h3 className="font-medium">{item.name}</h3>
          {renderDetails()}
        </div>
        
        <div className="flex flex-col items-end">
          <p className="text-xs text-muted-foreground capitalize">{item.type}</p>
        </div>
      </div>
    </Card>
  );
};
