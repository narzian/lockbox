
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CategoryCardProps {
  category: string;
  count: number;
  onClick: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, count, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="w-full"
    >
      <Card className="vault-card h-24 flex flex-col justify-between">
        <div className="flex justify-between items-start w-full">
          <Badge variant="outline" className="bg-secondary">
            {category}
          </Badge>
        </div>
        <div className="flex justify-between items-end w-full">
          <span className="text-2xl font-bold">{count}</span>
          <span className="text-xs text-muted-foreground">Logins</span>
        </div>
      </Card>
    </button>
  );
};
