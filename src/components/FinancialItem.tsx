
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { CreditCard, Wallet, Landmark, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { PasswordProtection } from './PasswordProtection';

export interface FinancialItem {
  id: string;
  type: 'card' | 'upi' | 'account';
  name: string;
  cardNumber?: string;
  lastDigits?: string;
  expiryDate?: string;
  cvv?: string;
  upiId?: string;
  accountNumber?: string;
  bankName?: string;
  ifsc?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface FinancialItemProps {
  item: FinancialItem;
}

export const FinancialItem: React.FC<FinancialItemProps> = ({ item }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [pinVerificationOpen, setPinVerificationOpen] = useState(false);

  const handleViewDetails = () => {
    setPinVerificationOpen(true);
  };

  const handlePinSuccess = () => {
    setPinVerificationOpen(false);
    setShowDetails(true);
  };

  const maskString = (str?: string, visibleDigits = 4) => {
    if (!str) return '';
    const visible = str.slice(-visibleDigits);
    const masked = '•'.repeat(Math.max(0, str.length - visibleDigits));
    return masked + visible;
  };

  const renderDetails = () => {
    switch(item.type) {
      case 'card':
        return (
          <>
            <p className="text-sm text-muted-foreground">
              {item.cardNumber && showDetails 
                ? formatCardNumber(item.cardNumber)
                : `•••• •••• •••• ${item.lastDigits || '****'}`
              }
            </p>
            {item.expiryDate && (
              <p className="text-xs text-muted-foreground">Expires: {item.expiryDate}</p>
            )}
            {showDetails && item.cvv && (
              <p className="text-xs text-muted-foreground mt-1">CVV: {item.cvv}</p>
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
              {showDetails && item.accountNumber 
                ? item.accountNumber 
                : `•••• ${item.accountNumber?.slice(-4) || '****'}`
              }
            </p>
            {showDetails && item.ifsc && (
              <p className="text-xs text-muted-foreground mt-1">IFSC: {item.ifsc}</p>
            )}
          </>
        );
    }
  };

  // Format card number with spaces for better readability
  const formatCardNumber = (cardNumber: string) => {
    return cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const getIcon = () => {
    switch(item.type) {
      case 'card':
        return <CreditCard className="h-5 w-5 text-vault-black" />;
      case 'upi':
        return <Wallet className="h-5 w-5 text-vault-black" />;
      case 'account':
        return <Landmark className="h-5 w-5 text-vault-black" />;
      default:
        return <CreditCard className="h-5 w-5 text-vault-black" />;
    }
  };

  return (
    <>
      <Card className="vault-card animate-fade-in">
        <div className="flex items-center">
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-vault-neutral mr-3">
            {getIcon()}
          </div>
          
          <div className="flex-grow">
            <h3 className="font-medium">{item.name}</h3>
            {renderDetails()}
          </div>
          
          <div className="flex flex-col items-end">
            <p className="text-xs text-muted-foreground capitalize">{item.type}</p>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 mt-1" 
              onClick={showDetails ? () => setShowDetails(false) : handleViewDetails}
            >
              {showDetails ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>
          </div>
        </div>
      </Card>

      {pinVerificationOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <PasswordProtection 
              onSuccess={handlePinSuccess} 
              onCancel={() => setPinVerificationOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};
