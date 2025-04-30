
import React from 'react';
import { Card } from '@/components/ui/card';
import { getCategoryColor } from '@/lib/utils';

interface Password {
  id: string;
  title: string;
  username: string;
  category: string;
  lastUsed: string;
  icon: string;
}

interface PasswordItemProps {
  password: Password;
}

export const PasswordItem: React.FC<PasswordItemProps> = ({ password }) => {
  const categoryColor = getCategoryColor(password.category);
  
  return (
    <Card className="vault-card animate-fade-in">
      <div className="flex items-center">
        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-vault-softPurple mr-3">
          <span className="text-lg">{password.icon}</span>
        </div>
        
        <div className="flex-grow">
          <h3 className="font-medium">{password.title}</h3>
          <p className="text-sm text-muted-foreground truncate">
            {password.username}
          </p>
        </div>
        
        <div className="flex flex-col items-end">
          <div 
            className="category-pill mb-1" 
            style={{backgroundColor: `${categoryColor}20`, color: categoryColor}}
          >
            {password.category}
          </div>
          <p className="text-xs text-muted-foreground">{password.lastUsed}</p>
        </div>
      </div>
    </Card>
  );
};
