import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Building, Banknote, ShoppingCart, Facebook, Instagram } from 'lucide-react';
import { getCategoryIcon } from '@/utils/dashboard/storageUtils';

export interface Password {
  id: string;
  title: string;
  username: string;
  category: string;
  lastUsed: string;
  icon: string;
  createdAt?: string;
  updatedAt?: string;
  notes?: string;
}

interface PasswordItemProps {
  password: Password;
}

export const PasswordItem: React.FC<PasswordItemProps> = ({ password }) => {
  // Render different icons based on the category
  const renderCategoryIcon = () => {
    const iconName = getCategoryIcon(password.category);
    
    // First check if the password has a specific service icon
    if (password.icon === 'facebook') {
      return <Facebook className="h-5 w-5 text-vault-black" />;
    } else if (password.icon === 'instagram') {
      return <Instagram className="h-5 w-5 text-vault-black" />;
    } else if (password.icon === 'amazon') {
      return <ShoppingCart className="h-5 w-5 text-vault-black" />;
    }
    
    // Otherwise use the category icon
    switch(iconName) {
      case 'book':
        return <BookOpen className="h-5 w-5 text-vault-black" />;
      case 'banknote':
        return <Banknote className="h-5 w-5 text-vault-black" />;
      case 'building':
        return <Building className="h-5 w-5 text-vault-black" />;
      default:
        return <span className="text-lg">{iconName}</span>;
    }
  };

  return (
    <Card className="vault-card animate-fade-in">
      <div className="flex items-center">
        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-vault-neutral mr-3">
          {renderCategoryIcon()}
        </div>
        
        <div className="flex-grow">
          <h3 className="font-medium">{password.title}</h3>
          <p className="text-sm text-muted-foreground truncate">
            {password.username}
          </p>
        </div>
        
        <div className="flex flex-col items-end">
          <Badge variant="outline" className="bg-secondary mb-1">
            {password.category}
          </Badge>
          <p className="text-xs text-muted-foreground">{password.lastUsed}</p>
        </div>
      </div>
    </Card>
  );
};
