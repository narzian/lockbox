
import React from 'react';
import { Card } from '@/components/ui/card';
import { getCategoryColor } from '@/lib/utils';
import { Facebook, Instagram, Amazon } from 'lucide-react';

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
  viewMode?: "grid" | "list";
}

export const PasswordItem: React.FC<PasswordItemProps> = ({ password, viewMode = "grid" }) => {
  const categoryColor = getCategoryColor(password.category);
  
  // Render different icons based on the service
  const renderIcon = (icon: string) => {
    switch(icon) {
      case 'facebook':
        return <Facebook className="h-5 w-5 text-vault-black" />;
      case 'instagram':
        return <Instagram className="h-5 w-5 text-vault-black" />;
      case 'amazon':
        return <Amazon className="h-5 w-5 text-vault-black" />;
      default:
        return <span className="text-lg">{icon}</span>;
    }
  };

  if (viewMode === "list") {
    return (
      <Card className="vault-card animate-fade-in">
        <div className="flex items-center">
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-vault-neutral mr-3">
            {renderIcon(password.icon)}
          </div>
          
          <div className="flex-grow flex justify-between items-center">
            <div>
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
        </div>
      </Card>
    );
  }

  return (
    <Card className="vault-card animate-fade-in">
      <div className="flex items-center">
        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-vault-neutral mr-3">
          {renderIcon(password.icon)}
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
